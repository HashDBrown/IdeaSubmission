const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'SSL', 'DigiCertGlobalRootCA.crt.pem')) // Adjust the path accordingly
    }
}).promise();

const result = pool.query('SELECT * FROM users');
console.log(result[0]);