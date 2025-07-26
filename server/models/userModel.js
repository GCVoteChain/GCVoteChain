const db = require('../data/db');

function registerUser(name, hashedPassword, callback) {
    db.run(`INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)`, [name, name, hashedPassword, 'voter', name, 0], callback);
}


function getUser(name, callback) {
    db.get(`SELECT * FROM users WHERE student_id = ?`, [name], callback);
}


module.exports = { registerUser, getUser };