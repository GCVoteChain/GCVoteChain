const express = require('express');
const voteController = require('../controllers/voteController');

const router = express.Router();

// Add vote route
router.post('/add', voteController.add);


// Get vote route
router.post('/get', voteController.get);


module.exports = router;