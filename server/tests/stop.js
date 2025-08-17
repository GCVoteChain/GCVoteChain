require('dotenv').config({ path: '../.env' });

const db = require('../data/db');

const { keccak256, solidityPacked } = require('ethers');

(async () => {
    const electionId = keccak256(solidityPacked(['string'], ['demo_election']));

    db.prepare(`
        UPDATE elections
        SET end_time = ?
        WHERE id = ?
    `).run(Math.floor(Date.now() / 1000) + 5, electionId);
})();