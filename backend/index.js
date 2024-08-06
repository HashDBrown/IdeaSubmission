const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const config = require('./config'); // Adjust the path if necessary
const userRoutes = require('./routes/users');

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

const db = mysql.createConnection(config.dbConfig);

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  //print url
  console.log(`http://localhost:${port}`);
});
