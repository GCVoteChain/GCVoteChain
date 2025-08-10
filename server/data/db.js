const path = require('path');
const fs = require('fs');
const { Database } = require('sqlite3')
const cron = require('node-cron');

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

  CREATE TABLE IF NOT EXISTS transactions (
    tx_hash TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    voter_id TEXT NOT NULL,
    FOREIGN KEY (voter_id) REFERENCES users(voter_id)
  );
  
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    timestamp DATETIME,
    tx_hash TEXT NOT NULL,
    FOREIGN KEY (tx_hash) REFERENCES transactions(tx_hash)
  );
`);


cron.schedule('* * * * *', () => {
  const now = Math.floor(new Date() / 1000);

  db.run(`
    UPDATE elections
    SET status = 'open'
    WHERE status = 'scheduled' AND start_time <= ? AND end_time > ?
  `, [now, now]);

  db.run(`
    UPDATE elections
    SET status = 'closed'
    WHERE status = 'open' AND end_time <= ?
  `, [now]);
});


module.exports = db;