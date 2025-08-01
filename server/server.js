const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const routes = require('./routes/routes');

const models = require('./models/models');

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

const PORT = 8008;

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `PORT=${PORT}\nJWT_TOKEN=${crypto.randomBytes(64).toString('hex')}`);
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


(async function initializeUsers() {
  const defaultUsers = [
    {
      username: 'admin1',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'admin2',
      password: 'admin123',
      role: 'admin'
    }
  ];

  for (const user of defaultUsers) {
    try {
      const userExists = await models.user.getUser(user.username);
  
      if (!userExists) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const voterId = keccak256(solidityPacked(['string', 'string'], [user.username, user.role]));

        await models.user.registerUser(voterId, user.username, hashedPassword, user.role, '');
  
        console.log(`Initialized user: ${user.username}`);
      }
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



['SIGINT', 'SIGTERM', 'SIGQUIT']
.forEach(signal => process.on(signal, () => {
  const checkForError = (err) => {
    if (err) console.error('Error:', err.message);
  };

  models.finalize();

  db.close(checkForError);
  process.exit();
}));