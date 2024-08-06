const mysql = require('mysql2/promise');
const config = require('../config');

async function getConnection() {
    const connection = await mysql.createConnection(config.dbConfig);
    return connection;
}

async function getAllUsers() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM users');
    await connection.end();
    return rows;
}

//delete user by id
async function deleteUser(id){
    const connection = await getConnection();
    const [rows] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
    return rows;
}

module.exports = {
    getAllUsers,
    deleteUser
};