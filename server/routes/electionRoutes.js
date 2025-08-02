const express = require('express');
const electionController = require('../controllers/electionController.js');
const { authenticateToken, authenticateRole } = require('./authenticator.js');

const router = express.Router();


// Get all elections route
router.get('/', authenticateToken, authenticateRole('voter', 'admin'), electionController.getAll);


// New election route
router.post('/add', authenticateToken, authenticateRole('admin'), electionController.add);


// Update election schedule route
router.put('/set-schedule', authenticateToken, authenticateRole('admin'), electionController.setSchedule);


// Update election status route
router.put('/set-status', authenticateToken, authenticateRole('admin'), electionController.setStatus);


// Remove election route
router.delete('/remove', authenticateToken, authenticateRole('admin'), electionController.remove);


module.exports = router;