const db = require('../data/db');
const { promisify } = require('util');

const insertCandidateStmt = db.prepare(`
    INSERT INTO candidates (id, student_id, election_id, name, position, voteCount)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const updateCandidateStmt = db.prepare(`
    UPDATE candidates
    SET name = ?, position = ?
    WHERE student_id = ? AND election_id = ?
`);

const removeCandidateStmt = db.prepare(`
    DELETE FROM candidates
    WHERE student_id = ? AND election_id = ?
`);

const getAllCandidatesStmt = db.prepare(`
    SELECT id, position, name FROM candidates
    WHERE election_id = ?
`)


const insertAsync = promisify(insertCandidateStmt.run.bind(insertCandidateStmt));
const updateAsync = promisify(updateCandidateStmt.run.bind(updateCandidateStmt));
const removeAsync = promisify(removeCandidateStmt.run.bind(removeCandidateStmt));
const getAllAsync = promisify(getAllCandidatesStmt.all.bind(getAllCandidatesStmt));


async function addCandidate(candidateId, studentId, electionId, name, position) {
    return insertAsync(candidateId, studentId, electionId, name, position, 0);
}


async function updateCandidate(electionId, studentId, name, position) {
    return updateAsync(name, position, studentId, electionId);
}


async function removeCandidate(electionId, studentId) {
    return removeAsync(studentId, electionId);
}


async function getAllCandidates(electionId) {
    return getAllAsync(electionId) || [];
}


module.exports = {
    insertCandidateStmt,
    updateCandidateStmt,
    removeCandidateStmt,
    getAllCandidatesStmt,
    
    addCandidate,
    updateCandidate,
    removeCandidate,
    getAllCandidates
};