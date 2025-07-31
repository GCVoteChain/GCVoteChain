const express = require('express');
const candidateController = require('../controllers/candidateController.js');

const router = express.Router();


// Get all candidates route
router.get('/', candidateController.get);


// New candidate route
router.post('/add', candidateController.add);


// Update candidate route
router.put('/update', candidateController.update);


// Remove candidate route
router.delete('/remove', candidateController.remove);


module.exports = router;