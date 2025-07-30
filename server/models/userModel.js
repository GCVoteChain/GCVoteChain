const db = require('../data/db');
const { promisify } = require('util');

async function registerUser(voterId, studentId, hashedPassword, role, email) {
    const run = promisify(db.run.bind(db));
    return run(`INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)`, [voterId, studentId, hashedPassword, role, email, 0]);
}


async function getUser(name) {
    const get = promisify(db.get.bind(db));
    return get(`SELECT * FROM users WHERE student_id = ?`, [name]);
}


module.exports = { registerUser, getUser };