const db = require('../data/db')
const { promisify } = require('util');

const addVoteStmt = db.prepare(`
    INSERT INTO votes (uuid, votes, timestamp, election_id)
    VALUES (?, ?, ?, ?)
`);

const getVoteStmt = db.prepare(`
    SELECT * FROM votes
    WHERE uuid = ?
`);


const addVoteAsync = promisify(addVoteStmt.run.bind(addVoteStmt));
const getVoteAsync = promisify(getVoteStmt.get.bind(getVoteStmt));


async function addVote(uuid, votes, timestamp, election_id) {
    return addVoteAsync(uuid, votes, timestamp, election_id);
}


async function getVote(uuid) {
    return getVoteAsync(uuid);
}



module.exports = {
    addVoteStmt,
    getVoteStmt,

    addVote,
    getVote
};