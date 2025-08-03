const db = require('../data/db');
const { promisify } = require('util');

const registerUserStmt = db.prepare(`
    INSERT INTO users (voter_id, student_id, password, name, email, role)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const getUserStmt = db.prepare(`
    SELECT * FROM users
    WHERE student_id = ?
`);

const updatePasswordStmt = db.prepare(`
    UPDATE users
    SET password = ?
    WHERE student_id = ?
`);


const registerUserAsync = promisify(registerUserStmt.run.bind(registerUserStmt));
const getUserAsync = promisify(getUserStmt.get.bind(getUserStmt));
const updatePasswordAsync = promisify(updatePasswordStmt.run.bind(updatePasswordStmt));


async function registerUser(voterId, studentId, hashedPassword, name, email, role) {
    return registerUserAsync(voterId, studentId, hashedPassword, name, email, role);
}


async function getUser(studentId) {
    return getUserAsync(studentId)
}


async function updatePassword(studentId, newPassword) {
    return updatePasswordAsync(newPassword, studentId);
}


module.exports = {
    registerUserStmt,
    getUserStmt,
    updatePasswordStmt,

    registerUser,
    getUser,
    updatePassword
};