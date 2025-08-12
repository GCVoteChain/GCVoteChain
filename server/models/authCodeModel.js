const db = require('../data/db');
const { promisify } = require('util');

const addCodeStmt = db.prepare(`
    INSERT INTO auth_codes (student_id, code, expires_at)
    VALUES (?, ?, ?)
`);

const isCodeSentStmt = db.prepare(`
    SELECT id FROM auth_codes
    WHERE student_id = ? AND expires_at > ? AND used = FALSE
`)

const isCodeValidStmt = db.prepare(`
    SELECT used FROM auth_codes
    WHERE student_id = ? AND code = ? AND expires_at > ?
`);


const addCodeAsync = promisify(addCodeStmt.run.bind(addCodeStmt));
const isCodeSentAsync = promisify(isCodeSentStmt.get.bind(isCodeSentStmt));
const isCodeValidAsync = promisify(isCodeValidStmt.get.bind(isCodeValidStmt));


async function addCode(studentId, code, expiresAt) {
    return addCodeAsync(studentId, code, expiresAt);
}


async function isCodeSent(studentId, currentTime) {
    return isCodeSentAsync(studentId, currentTime);
}


async function isCodeValid(studentId, code, currentTime) {
    return (isCodeValidAsync(studentId, code, currentTime) || false);
}


module.exports = {
    addCodeStmt,
    isCodeSentStmt,
    isCodeValidStmt,

    addCode,
    isCodeSent,
    isCodeValid
};