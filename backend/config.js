import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export default {
  port: 3000,
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      // Adjusted to ensure the correct path
      ca: fs.readFileSync(path.join(path.resolve(), 'SSL', 'DigiCertGlobalRootCA.crt.pem'))
    }
  },
  azure: {
    storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: process.env.AZURE_CONTAINER_NAME
  }
};
