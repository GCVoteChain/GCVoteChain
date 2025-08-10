const path = require('path');
const fs = require('fs');
const { Database } = require('sqlite3')
const cron = require('node-cron');
const { loadContracts } = require('../services/contract');

const db = new Database(path.join(__dirname, './database.db'), { verbose: console.log });


db.exec(`
  PRAGMA foreign_keys = ON;
  
  CREATE TABLE IF NOT EXISTS users (
    voter_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('voter', 'admin'))
  );
  
  CREATE TABLE IF NOT EXISTS elections (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'open', 'closed', 'cancelled')),
    start_time INTEGER,
    end_time INTEGER
  );

  CREATE TABLE IF NOT EXISTS candidates (
    id TEXT NOT NULL UNIQUE,
    student_id NOT NULL UNIQUE,
    position TEXT NOT NULL,
    name TEXT NOT NULL,
    election_id TEXT NOT NULL,
    voteCount INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id, student_id, election_id),
    FOREIGN KEY (student_id) REFERENCES users(student_id),
    FOREIGN KEY (election_id) REFERENCES elections(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    uuid TEXT PRIMARY KEY,
    votes TEXT NOT NULL,
    timestamp DATETIME,
    election_id TEXT NOT NULL,
    FOREIGN KEY (election_id) REFERENCES elections(id)
  );
`);


cron.schedule('*/5 * * * * *', () => {
  const now = Math.floor(new Date() / 1000);

  db.all(`
    SELECT id FROM elections
    WHERE status = 'scheduled' AND start_time <= ? AND end_time > ?
  `, [now, now], async(err, rows) => {
    if (err) return console.error('Error fetching elections to open:', err);

    const contracts = await loadContracts();

    for (const { id } of rows) {
      try {
        const tx = await contracts.electionManager.startElection(id);
        await tx.wait();

        db.run(`UPDATE elections SET status = 'open' WHERE id = ?`, [id]);
      } catch (error) {
        console.error(`Failed to start election ${id}:`, error);
      }
    }
  });

  db.all(`
    SELECT id FROM elections
    WHERE status = 'open' AND end_time <= ?
  `, [now], async(err, rows) => {
    if (err) return console.error('Error fetching elections to close:', err);

    const contracts = await loadContracts();

    for (const { id } of rows) {
      try {
        const txStop = await contracts.electionManager.stopElection(id);
        await txStop.wait();

        db.run(`UPDATE elections SET status = 'closed' WHERE id = ?`, [id]);
      } catch (error) {
        console.error(`Failed to end election ${id}:`, error);
      }
    }
  });
});


module.exports = db;