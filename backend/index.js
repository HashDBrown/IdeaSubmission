require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Path module

const app = express();
const port = 3000; // Change this to an available port if 3306 is occupied

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
// console.log(process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'SSL', 'DigiCertGlobalRootCA.crt.pem')) // Adjust the path accordingly
  }
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
