const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, './database.db'));

db.run("PRAGMA foreign_keys = ON");

db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      voter_id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      has_voted INTEGER NOT NULL DEFAULT 0
    )
  `);


  // Elections table
  db.run(`
    CREATE TABLE IF NOT EXISTS elections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp DATETIME
    )
  `);
  
  
  // Candidates table
  db.run(`
    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT NOT NULL,
      position TEXT NOT NULL,
      name TEXT NOT NULL,
      election_id TEXT NOT NULL,
      voteCount INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (id, election_id),
      FOREIGN KEY (id) REFERENCES users(voter_id),
      FOREIGN KEY (election_id) REFERENCES elections(id)
    )
  `);
  
  
  // Votes table
  db.run(`
    CREATE TABLE IF NOT EXISTS votes (
      uuid TEXT PRIMARY KEY,
      votes TEXT NOT NULL,
      timestamp DATETIME,
      election_id TEXT NOT NULL,
      FOREIGN KEY (election_id) REFERENCES elections(id)
    )
  `);
  
  
  // Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      tx_hash TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      voter_id TEXT NOT NULL,
      FOREIGN KEY (voter_id) REFERENCES users(voter_id)
    )
  `);
  
  
  // Logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      timestamp DATETIME,
      tx_hash TEXT NOT NULL,
      FOREIGN KEY (tx_hash) REFERENCES transactions(tx_hash)
    )
  `);
});


module.exports = db;