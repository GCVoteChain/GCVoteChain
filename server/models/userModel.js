const db = require('../data/db');

function registerUser(name, hashedPassword, callback) {
    db.run(`INSERT INTO users (name, password) VALUES (?, ?)`, [name, hashedPassword], callback);
}


function getUser(name, callback) {
    db.get(`SELECT * FROM users WHERE name = ?`, [name], callback);
}


module.exports = { registerUser, getUser };