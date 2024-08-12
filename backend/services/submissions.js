import mysql from 'mysql2/promise';
import config from '../config.js';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { sendEmail } from './emailService.js';

async function getConnection() {
  const connection = await mysql.createConnection(config.dbConfig);
  return connection;
}

async function uploadFileToAzure(file) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.storageConnectionString);
  const containerClient = blobServiceClient.getContainerClient(config.azure.containerName);
  const blobName = uuidv4() + '-' + path.basename(file.path);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadFile(file.path);
  return blockBlobClient.url;
}

export async function createSubmission(submission) {
  const fileUrl = await uploadFileToAzure(submission.file);

  const connection = await getConnection();
  const [result] = await connection.query(
    'INSERT INTO submission (email, text, file_path) VALUES (?, ?, ?)',
    [submission.email, submission.text, fileUrl]
  );

  const [rows] = await connection.query('SELECT * FROM submission WHERE id = ?', [result.insertId]);

  // Uncomment and modify this if you want to send an email with the attachment
  await sendEmail(submission.text, submission.email, submission.file.path);

  // Delete the local file after sending the email
  await fs.unlink(submission.file.path);

  await connection.end();
  return rows[0];
}

export async function getAllSubmissions() {
  const connection = await getConnection();
  const [rows] = await connection.query('SELECT * FROM submission');
  await connection.end();
  return rows;
}

export async function deleteSubmission(id) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SELECT file_path FROM submission WHERE id = ?', [id]);

    // Check if the submission exists
    if (rows.length === 0) {
      throw new Error('Submission not found');
    }

    const filePath = rows[0].file_path;
    // console.log('File path:', filePath);

    // Decode the blob name to handle special characters like spaces
    const blobName = decodeURIComponent(filePath.split('/').pop());
    // console.log('Blob name:', blobName);

    // Delete the file from Azure
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.azure.storageConnectionString);
    const containerClient = blobServiceClient.getContainerClient(config.azure.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    const deleteResponse = await blockBlobClient.deleteIfExists(); // Use deleteIfExists to avoid errors if the blob is already deleted
    // console.log(`Delete response:`, deleteResponse); // Log the delete response

    if (!deleteResponse.succeeded) {
      console.error('Failed to delete blob:', blobName);
      throw new Error('Blob deletion failed');
    }

    // Delete the submission record from the database
    await connection.query('DELETE FROM submission WHERE id = ?', [id]);
    console.log('Submission deleted from database');

  } catch (err) {
    console.error('Error during deletion:', err.message);
    throw err; // Re-throw the error for further handling
  } finally {
    await connection.end();
  }
}

