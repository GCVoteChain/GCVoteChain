const db = require('../data/db');

const insertCandidateStmt = db.prepare(`
    INSERT INTO candidates (id, student_id, election_id, name, position, vote_count)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const updateCandidateStmt = db.prepare(`
    UPDATE candidates
    SET name = ?, position = ?
    WHERE student_id = ? AND election_id = ?
`);

const removeCandidateStmt = db.prepare(`
    DELETE FROM candidates
    WHERE election_id = ? AND student_id = ?
`);

const getAllCandidatesStmt = db.prepare(`
    SELECT student_id, position, name, vote_count FROM candidates
    WHERE election_id = ?
`);

const incrementVoteStmt = db.prepare(`
    UPDATE candidates
    set vote_count = vote_count + 1
    WHERE election_id = ? AND student_id = ? AND position = ?
`);

const getVotesStmt = db.prepare(`
    SELECT student_id, position, name, vote_count FROM candidates
    WHERE election_id = ?
    ORDER BY vote_count DESC
`);


function addCandidate(candidateId, studentId, electionId, name, position) {
    return insertCandidateStmt.run(candidateId, studentId, electionId, name, position, 0);
}


function updateCandidate(electionId, studentId, name, position) {
    return updateCandidateStmt.run(name, position, studentId, electionId);
}


function removeCandidate(electionId, studentId) {
    return removeCandidateStmt.run(electionId, studentId);
}


function getAllCandidates(electionId) {
    return getAllCandidatesStmt.all(electionId) || [];
}


function incrementVote(electionId, studentId, position) {
    return incrementVoteStmt.run(electionId, studentId, position);
}


function getVotes(electionId) {
    return getVotesStmt.all(electionId) || [];
}


module.exports = {
    addCandidate,
    updateCandidate,
    removeCandidate,
    getAllCandidates,
    incrementVote,
    getVotes
};