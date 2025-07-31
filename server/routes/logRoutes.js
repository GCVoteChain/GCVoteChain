const express = require('express');
const logController = require('../controllers/logController.js');

const router = express.Router();


// New log route
router.post('/', logController.add);


module.exports = router;