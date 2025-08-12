const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const crypto = require('crypto');
// const { loadContracts } = require('../services/contract');

const db = require('better-sqlite3-multiple-ciphers')('./data/database.db');


const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `DB_KEY=${crypto.randomBytes(64).toString('hex')}`);
} else {
  const envFile = fs.readFileSync(envPath, 'utf8');

  const exists = envFile.split('\n').some(l => l.trim().startsWith('DB_KEY='));
  if (!exists) {
    fs.appendFileSync(envPath, `DB_KEY=${crypto.randomBytes(64).toString('hex')}\n`);
  }
}

db.pragma(`cipher='aes256cbc'`);
db.pragma(`key='${process.env.DB_KEY}'`);

db.exec(`
  PRAGMA foreign_keys = ON;
  
  CREATE TABLE IF NOT EXISTS users (
    voter_id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('voter', 'admin')),
    enabled_2fa BOOLEAN DEFAULT FALSE
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
    student_id NOT NULL,
    position TEXT NOT NULL,
    name TEXT NOT NULL,
    election_id TEXT NOT NULL,
    vote_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE (student_id, election_id),
    FOREIGN KEY (student_id) REFERENCES users(student_id),
    FOREIGN KEY (election_id) REFERENCES elections(id)
  );

  CREATE TABLE IF NOT EXISTS auth_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (student_id) REFERENCES users(student_id)
  );
`);


cron.schedule('*/5 * * * * *', () => {
  const now = Math.floor(new Date() / 1000);

  db.exec(`
    SELECT id FROM elections
    WHERE status = 'scheduled' AND start_time <= ? AND end_time > ?
  `, [now, now], async(err, rows) => {
    if (err) return console.error('Error fetching elections to open:', err);

    // const contracts = await loadContracts();

    for (const { id } of rows) {
      try {
        // const tx = await contracts.electionManager.startElection(id);
        // await tx.wait();

        db.run(`UPDATE elections SET status = 'open' WHERE id = ?`, [id]);
      } catch (error) {
        console.error(`Failed to start election ${id}:`, error);
      }
    }
  });

  db.exec(`
    SELECT id FROM elections
    WHERE status = 'open' AND end_time <= ?
  `, [now], async(err, rows) => {
    if (err) return console.error('Error fetching elections to close:', err);

    // const contracts = await loadContracts();

    for (const { id } of rows) {
      try {
        // const txStop = await contracts.electionManager.stopElection(id);
        // await txStop.wait();

        db.run(`UPDATE elections SET status = 'closed' WHERE id = ?`, [id]);
      } catch (error) {
        console.error(`Failed to end election ${id}:`, error);
      }
    }
  });
});


module.exports = db;