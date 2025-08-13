require('dotenv').config();
require('./services/electionCron');

const path = require('path');
const fs = require('fs');

const crypto = require('crypto');


const PORT = 8008;

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `PORT=${PORT}\nJWT_TOKEN=${crypto.randomBytes(64).toString('hex')}\n`);
} else {
  const envFile = fs.readFileSync(envPath, 'utf8');

  const portExists = envFile.split('\n').some(l => l.trim().startsWith('PORT='));
  if (!portExists) {
    fs.appendFileSync(envPath, `PORT=${PORT}\n`);
  }

  const tokenExists = envFile.split('\n').some(l => l.trim().startsWith('JWT_TOKEN='));
  if (!tokenExists) {
    fs.appendFileSync(envPath, `JWT_TOKEN=${crypto.randomBytes(64).toString('hex')}\n`);
  }
}


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const routes = require('./routes/routes');

const userModel = require('./models/userModel');

const db = require('./data/db');

const { keccak256, solidityPacked } = require('ethers');

const { loadContracts } = require('./services/contract');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());

app.use(routes);


(async function initializeUsers() {
  const defaultUsers = [
    {
      username: 'admin1',
      password: 'admin123',
      role: 'admin',
      name: 'admin1'
    },
    {
      username: 'admin2',
      password: 'admin123',
      role: 'admin',
      name: 'admin2'
    }
  ];

  for (const user of defaultUsers) {
    try {
      const userExists = userModel.getUser(user.username);
      if (userExists) continue;
      
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const voterId = keccak256(solidityPacked(['string', 'string'], [user.username, user.role]));

      userModel.registerUser(voterId, user.username, hashedPassword, user.name, '', user.role);

      console.log(`Initialized user: ${user.username}`);
    } catch (err) {
      console.error('Failed to initialize users:', err);
    }
  }
})();


(async function initializeContracts() {
  try {
    await loadContracts();
    console.log('Smart contracts loaded');
  } catch (err) {
    console.error('Error loading contracts:', err);
  }
})();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});