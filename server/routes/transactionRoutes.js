const express = require('express');
const transactionController = require('../controllers/transactionController.js');

const router = express.Router();


// New transaction route
router.post('/add', transactionController.add);


// Update status route
router.put('/set-status', transactionController.setStatus);


// Retrieve transaction route
router.get('/get', transactionController.get);


module.exports = router;