const db = require('../data/db');

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


function addCode(studentId, code, expiresAt) {
    return addCodeStmt.run(studentId, code, expiresAt);
}


function isCodeSent(studentId, currentTime) {
    return isCodeSentStmt.get(studentId, currentTime);
}


function isCodeValid(studentId, code, currentTime) {
    return isCodeValidStmt.get(studentId, code, currentTime);
}


module.exports = {
    addCode,
    isCodeSent,
    isCodeValid
};