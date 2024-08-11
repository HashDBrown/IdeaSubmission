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
