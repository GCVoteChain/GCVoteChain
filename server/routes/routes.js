const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/api', authRoutes);

module.exports = router;