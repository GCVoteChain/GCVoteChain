require('dotenv').config({ path: '../.env' });

const { loadContracts } = require('../services/contract');

(async () => {
    const electionId = keccak256(solidityPacked(['string'], ['demo_election']));

    const contracts = await loadContracts();

    await contracts.electionManager.startElection(electionId);
    db.prepare(`
        UPDATE elections
        SET end_time = ?
        WHERE id = ?
    `).run(Math.floor(Date.now() / 1000), electionId);
})();