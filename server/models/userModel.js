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

const get2FAStateStmt = db.prepare(`
    SELECT enabled_2fa FROM users
    WHERE student_id = ?
`);

const toggle2FAStateStmt = db.prepare(`
    UPDATE users
    SET enabled_2fa = ?
    WHERE student_id = ?
`);


const registerUserAsync = promisify(registerUserStmt.run.bind(registerUserStmt));
const getUserAsync = promisify(getUserStmt.get.bind(getUserStmt));
const updatePasswordAsync = promisify(updatePasswordStmt.run.bind(updatePasswordStmt));
const get2FAStateAsync = promisify(get2FAStateStmt.get.bind(get2FAStateStmt));
const toggle2FAStateAsync = promisify(toggle2FAStateStmt.run.bind(toggle2FAStateStmt));


async function registerUser(voterId, studentId, hashedPassword, name, email, role) {
    return registerUserAsync(voterId, studentId, hashedPassword, name, email, role);
}


async function getUser(studentId) {
    return getUserAsync(studentId)
}


async function updatePassword(studentId, newPassword) {
    return updatePasswordAsync(newPassword, studentId);
}


async function get2FAState(studentId) {
    return get2FAStateAsync(studentId);
}


async function toggle2FA(studentId, newState) {
    return toggle2FAStateAsync(newState, studentId);
}


module.exports = {
    registerUserStmt,
    getUserStmt,
    updatePasswordStmt,
    get2FAStateStmt,
    toggle2FAStateStmt,

    registerUser,
    getUser,
    updatePassword,
    get2FAState,
    toggle2FA,
};