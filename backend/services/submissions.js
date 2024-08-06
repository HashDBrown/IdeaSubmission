mysql = require('mysql2/promise');
config = require('../config');

async function getConnection() {
    const connection = await mysql.createConnection(config.dbConfig);
    return connection;
}

async function createSubmission(submission) {
    const connection = await getConnection();
    const [result] = await connection.query(
        'INSERT INTO submission (email, text, file_path) VALUES (?, ?, ?)',
        [submission.email, submission.text, submission.file_path]
    );

    // Retrieve the newly inserted submission
    const [rows] = await connection.query('SELECT * FROM submission WHERE id = ?', [result.insertId]);
    await connection.end();
    return rows[0]; // Return the first row (newly created submission)
}

module.exports = {
    createSubmission
};