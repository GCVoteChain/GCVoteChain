const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

// Register route
app.post('/register', (req, res) => {
  const { name, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send("Hash error");
    db.run(`INSERT INTO users (name, password) VALUES (?, ?)`, [name, hashedPassword], function (err) {
      if (err) return res.status(500).send("User already exists, Try another user.");
      res.send("Registered successfully!");
    });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  db.get(`SELECT * FROM users WHERE name = ?`, [name], (err, user) => {
    if (err || !user) return res.status(401).send("User not found");

    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        res.send("Login successfully!");
      } else {
        res.status(401).send("Incorrect password");
      }
    });
  });
});
