const mysql = require('mysql2/promise');
const config = require('../config');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

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
  await fs.unlink(file.path); // Delete the local file after upload
  return blockBlobClient.url;
}

async function createSubmission(submission) {
  const fileUrl = await uploadFileToAzure(submission.file);

  const connection = await getConnection();
  const [result] = await connection.query(
    'INSERT INTO submission (email, text, file_path) VALUES (?, ?, ?)',
    [submission.email, submission.text, fileUrl]
  );

  // Retrieve the newly inserted submission
  const [rows] = await connection.query('SELECT * FROM submission WHERE id = ?', [result.insertId]);
  await connection.end();
  return rows[0]; // Return the first row (newly created submission)
}

module.exports = {
  createSubmission
};
