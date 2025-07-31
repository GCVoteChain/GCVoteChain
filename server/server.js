const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const routes = require('./routes/routes');

const userModel = require('./models/userModel');
const candidateModel = require('./models/candidateModel');
const electionModel = require('./models/electionModel');
const voteModel = require('./models/voteModel');
const transactionModel = require('./models/transactionModel');
const logModel = require('./models/logModel');
const db = require('./data/db');

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
    fs.appendFileSync(envPath, `PORT=${PORT}\n`);
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



['SIGINT', 'SIGTERM', 'SIGQUIT']
.forEach(signal => process.on(signal => {
  const checkForError = (err) => {
    if (err) console.error('Error:', err.message);
  };

  userModel.getUserStmt.finalize();
  userModel.registerUserStmt.finalize();

  candidateModel.getAllCandidatesStmt.finalize();
  candidateModel.insertCandidateStmt.finalize();
  candidateModel.removeCandidateStmt.finalize();
  candidateModel.updateCandidateStmt.finalize();
  
  electionModel.addElectionStmt.finalize();
  electionModel.getElectionsStmt.finalize();
  electionModel.removeElectionStmt.finalize();
  electionModel.setElectionScheduleStmt.finalize();
  electionModel.setElectionStatusStmt.finalize();

  voteModel.addVoteStmt.finalize();
  voteModel.getVoteStmt.finalize();

  transactionModel.addTransactionStmt.finalize();
  transactionModel.setTransactionStatusStmt.finalize();
  transactionModel.getTransactionStmt.finalize();

  logModel.addLogStmt.finalize();

  db.close(checkForError);
  process.exit();
}));