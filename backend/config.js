require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = {
  port: 3000,
  dbConfig: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, 'SSL', 'DigiCertGlobalRootCA.crt.pem')) // Adjust the path accordingly
    }
  }
};