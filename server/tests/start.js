require('dotenv').config({ path: '../.env' });

const electionModel = require('../models/electionModel');
const { loadContracts } = require('../services/contract');


(async () => {
    const start = Math.floor(Date.now() / 1000);
    const end = start + 3600;
    
    const electionId = keccak256(solidityPacked(['string'], ['demo_election']));

    const contracts = await loadContracts();

    await contracts.electionManager.startElection(electionId);
    
    electionModel.setElectionSchedule(electionId, start, end);
})();