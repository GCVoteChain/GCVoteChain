const electionModel = require('../models/electionModel');

const start = Math.floor(Date.now() / 1000);
const end = start + 3600;
electionModel.setElectionSchedule('demo_election', start, end);