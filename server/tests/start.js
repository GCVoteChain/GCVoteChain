require('dotenv').config({ path: '../.env' });

const electionModel = require('../models/electionModel');
const { keccak256, solidityPacked } = require('ethers');


(async () => {
    const start = Math.floor(Date.now() / 1000) + 10;
    const end = start + 3600;
    
    const electionId = keccak256(solidityPacked(['string'], ['demo_election']));
    
    electionModel.setElectionSchedule(electionId, start, end);
})();