const express = require('express');
const authRoutes = require('./authRoutes');
const candidateRoutes = require('./candidateRoutes');
const electionRoutes = require('./electionRoutes');
const cryptoRoutes = require('./cryptoRoutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/candidates', candidateRoutes);
router.use('/api/elections', electionRoutes);
router.use('/api/crypto', cryptoRoutes);

module.exports = router;