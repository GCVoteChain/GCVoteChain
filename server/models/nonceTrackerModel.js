const db = require('../data/db');
const { Mutex } = require('async-mutex');


const nonceMutex = new Mutex();


const incrementNonceStmt = db.prepare(`
    UPDATE nonce_tracker
    SET current_nonce = current_nonce + 1
    WHERE id = 1
`);


const getNonceStmt = db.prepare(`
    SELECT current_nonce FROM nonce_tracker
    WHERE id = 1
`);


function getNonce() {
    return getNonceStmt.get();
}


function incrementNonce() {
    return incrementNonceStmt.run();
}


async function getAndIncrementNonce() {
    return await nonceMutex.runExclusive(() => {
        const { current_nonce } = getNonce();
        incrementNonce();
        return current_nonce;
    });
}


module.exports = { getAndIncrementNonce };