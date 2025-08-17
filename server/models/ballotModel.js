const db = require('../data/db');

const addBallotStmt = db.prepare(`
    INSERT INTO ballots (election_id, votes)
    VALUES (?, ?)
`);

const getAllBallotsStmt = db.prepare(`
    SELECT votes FROM ballots
    WHERE election_id = ?
`);


function addBallot(electionId, votes) {
    return addBallotStmt.run(electionId, votes);
}


function getAll(electionId) {
    return getAllBallotsStmt.all(electionId) || [];
}


module.exports = { addBallot, getAll };