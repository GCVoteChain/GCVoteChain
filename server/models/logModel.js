const db = require('../data/db');
const { promisify } = require('util');

const addLogStmt = db.prepare(`
    INSERT INTO logs (action, timestamp, tx_hash)
    VALUES (?, ?, ?)
`);


const addLogAsync = promisify(addLogStmt.run.bind(addLogStmt));


async function addLog(action, timestamp, txHash) {
    return addLogAsync(action, timestamp, txHash);
}


module.exports = {
    addLogStmt,

    addLog
};