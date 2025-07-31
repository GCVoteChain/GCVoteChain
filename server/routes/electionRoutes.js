const express = require('express');
const electionController = require('../controllers/electionController.js');

const router = express.Router();


// Get all elections route
router.get('/', electionController.getAll);


// New election route
router.post('/add', electionController.add);


// Update election schedule route
router.put('/set-schedule', electionController.setSchedule);


// Update election status route
router.put('/set-status', electionController.setStatus);


// Remove election route
router.delete('/remove', electionController.remove);


module.exports = router;