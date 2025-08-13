const db = require('../data/db');

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

const voteStmt = db.prepare(`
    UPDATE users
    SET voted = TRUE
    WHERE student_id = ?
`);

const hasVotedStmt = db.prepare(`
    SELECT * FROM users
    WHERE student_id = ? AND voted = TRUE
`);


function registerUser(voterId, studentId, hashedPassword, name, email, role) {
    return registerUserStmt.run(voterId, studentId, hashedPassword, name, email, role);
}


function getUser(studentId) {
    return getUserStmt.get(studentId);
}


function updatePassword(studentId, newPassword) {
    return updatePasswordStmt.run(newPassword, studentId);
}


function get2FAState(studentId) {
    return get2FAStateStmt.get(studentId);
}


function toggle2FA(studentId, newState) {
    return toggle2FAStateStmt.run(Number(newState), studentId);
}


function vote(studentId) {
    return voteStmt.run(studentId);
}


function hasVoted(studentId) {
    return hasVotedStmt.get(studentId);
}


module.exports = {
    registerUser,
    getUser,
    updatePassword,
    get2FAState,
    toggle2FA,
    vote,
    hasVoted
};