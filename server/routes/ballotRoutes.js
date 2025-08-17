const express = require('express');
const ballotController = require('../controllers/ballotController');
const { authenticateToken, authenticateRole } = require('./authenticator');

const router = express.Router();


// Retrieve decrypted ballots route
router.get('/:electionId', authenticateToken, authenticateRole('admin'), ballotController.get);


module.exports = router;