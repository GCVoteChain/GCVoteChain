const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(routes);

const PORT = 8008;

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, `PORT=${PORT}\n`);
} else {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const alreadyExists = envFile.split('\n').some(l => l.trim().startsWith('PORT='));
  if (!alreadyExists) {
    fs.appendFileSync(path.join(__dirname, '.env'), `PORT=${PORT}\n`);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})