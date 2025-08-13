const db = require('../data/db');

const addVoteStmt = db.prepare(`
    INSERT INTO votes (uuid, encrypted_vote, election_id)
    VALUES (?, ?, ?)
`);


const voteExistsStmt = db.prepare(`
    SELECT * FROM votes
    WHERE uuid = ?
`);


const getVoteStmt = db.prepare(`
    SELECT encrypted_vote FROM votes
    WHERE uuid = ? AND election_id = ?
`);


function addVote(uuid, encryptedVote, electionId) {
    return addVoteStmt.run(uuid, encryptedVote, electionId);
}


function voteExists(uuid) {
    return voteExistsStmt.get(uuid);
}


function getVote(uuid, electionId) {
    return getVoteStmt.get(uuid, electionId);
}


module.exports = {
    addVote,
    voteExists,
    getVote
};