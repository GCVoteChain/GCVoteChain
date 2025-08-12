const db = require('../data/db');

const addTransactionStmt = db.prepare(`
    INSERT INTO vote_transactions (uuid, tx_hash, timestamp)
    VALUES (?, ?, ?)
`);

const getTransactionStmt = db.prepare(`
    SELECT * FROM vote_transactions
    WHERE uuid = ?
`);


function addTransaction(uuid, txHash, timestamp) {
    return addTransactionStmt.run(uuid, txHash, timestamp);
}


function getTransaction(uuid) {
    return getTransactionStmt.get(uuid);
}


module.exports = {
    addTransaction,
    getTransaction
};