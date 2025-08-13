const db = require('../data/db');

const electionModel = require('../models/electionModel');

db.prepare(`
    UPDATE elections
    SET end_time = ?
    WHERE id = 'demo_election'
`).run(Math.floor(Date.now() / 1000));