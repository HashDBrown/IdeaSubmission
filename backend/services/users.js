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
async function deleteUser(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
    return rows;
}

async function createUser(user) {
    const connection = await getConnection();
    const [rows] = await connection.query('INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)',
        [user.username, user.password, user.email, user.type]);
    await connection.end();
    return rows;
}

async function login(user) {
    const connection = await getConnection();
    //login in with username or email
    const [rows] = await connection.query(
        'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?',
        [user.username || user.email, user.username || user.email, user.password]
    );
    await connection.end();
    // Check if user exists
    if (rows.length > 0) {
        // Return user details excluding password
        const { password, ...userData } = rows[0];
        return { success: true, user: userData };
    } else {
        return { success: false, message: 'Invalid username/email or password' };
    }
}

module.exports = {
    getAllUsers,
    deleteUser,
    createUser,
    login
};