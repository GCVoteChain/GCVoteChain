const db = require('../data/db');
const { promisify } = require('util');

const registerUserStmt = db.prepare(`
    INSERT INTO users (voter_id, student_id, password, role, email, has_voted)
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


async function registerUser(voterId, studentId, hashedPassword, role, email) {
    return registerUserAsync(voterId, studentId, hashedPassword, role, email, 0);
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