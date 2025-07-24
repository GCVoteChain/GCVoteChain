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

fs.appendFileSync(path.join(__dirname, '.env'), `PORT=${PORT}`);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})