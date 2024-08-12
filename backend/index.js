import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import config from './config.js';
import userRoutes from './routes/users.js';
import submissionRoutes from './routes/submissions.js';

const app = express();
const port = config.port;

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/users', userRoutes);
app.use('/submissions', submissionRoutes);

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config.dbConfig);
    console.log('Connected to MySQL');
    return connection;
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Exit the process if the connection fails
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
