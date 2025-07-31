const db = require('../data/db');
const { promisify } = require('util');

const addTransactionStmt = db.prepare(`
    INSERT INTO transactions (tx_hash, status, voter_id)
    VALUES (?, ?, ?)
`);

const setTransactionStatusStmt = db.prepare(`
    UPDATE transactions
    SET status = ?
    WHERE tx_hash = ?
`);

const getTransactionStmt = db.prepare(`
    SELECT * transactions
    WHERE tx_hash = ?
`);


const addTransactionAsync = promisify(addTransactionStmt.run.bind(addTransactionStmt));
const setTransactionStatusAsync = promisify(setTransactionStatusStmt.run.bind(setTransactionStatusStmt));
const getTransactionAsync = promisify(getTransactionStmt.get.bind(getTransactionStmt));


async function addTransaction(txHash, status, voterId) {
    return addTransactionAsync(txHash, status, voterId);
}


async function setTransactionStatus(txHash, status) {
    return setTransactionStatusAsync(status, txHash);
}


async function getTransaction(txHash) {
    return getTransactionAsync(txHash);
}


module.exports = {
    addTransactionStmt,
    setTransactionStatusStmt,
    getTransactionStmt,

    addTransaction,
    setTransactionStatus,
    getTransaction
};