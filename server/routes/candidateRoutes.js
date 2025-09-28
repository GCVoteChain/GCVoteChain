const express = require('express');
const candidateController = require('../controllers/candidateController.js');
const { authenticateToken, authenticateRole } = require('./authenticator.js');

const router = express.Router();


// New candidate route
router.post('/add', authenticateToken, authenticateRole('admin'), candidateController.add);


// Update candidate route
router.put('/update', authenticateToken, authenticateRole('admin'), candidateController.update);


// Remove candidate route
router.delete('/remove', authenticateToken, authenticateRole('admin'), candidateController.remove);


// Get candidates preview
router.get('/:electionId/preview', authenticateToken, authenticateRole('voter', 'admin'), candidateController.getPreview);


// Get candidates for certain election route
router.get('/:electionId/voting', authenticateToken, authenticateRole('voter'), candidateController.get);


module.exports = router;