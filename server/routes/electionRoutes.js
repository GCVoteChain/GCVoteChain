const express = require('express');
const electionController = require('../controllers/electionController.js');
const { authenticateToken, authenticateRole } = require('./authenticator.js');

const router = express.Router();


// Get all elections route
router.get('/', authenticateToken, authenticateRole('voter', 'admin'), electionController.getAll);


// Get election route
router.get('/:electionId', authenticateToken, authenticateRole('voter', 'admin'), electionController.get);


// New election route
router.post('/add', authenticateToken, authenticateRole('admin'), electionController.add);


// Update election schedule route
router.put('/set-schedule', authenticateToken, authenticateRole('admin'), electionController.setSchedule);


// Update election status route
router.put('/set-status', authenticateToken, authenticateRole('admin'), electionController.setStatus);


// Remove election route
router.delete('/remove', authenticateToken, authenticateRole('admin'), electionController.remove);


// Get election results route
router.get('/:electionId/results', authenticateToken, authenticateRole('voter', 'admin'), electionController.results);


// Vote route
router.post('/:electionId/vote', authenticateToken, authenticateRole('voter'), electionController.vote);


module.exports = router;