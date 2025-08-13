const db = require('../data/db');

const electionModel = require('../models/electionModel');


db.prepare(`
    UPDATE users
    SET voted = FALSE
`).run();


db.prepare(`
    UPDATE elections
    SET status = 'draft', start_time = NULL, end_time = NULL
    WHERE id = 'demo_election'
`).run();


db.prepare(`
    UPDATE candidates
    SET vote_count = 0
`).run();


db.prepare(`
    DELETE FROM votes
`).run();