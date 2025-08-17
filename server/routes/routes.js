const express = require('express');
const authRoutes = require('./authRoutes');
const candidateRoutes = require('./candidateRoutes');
const electionRoutes = require('./electionRoutes');
const cryptoRoutes = require('./cryptoRoutes');
const ballotRoutes = require('./ballotRoutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/candidates', candidateRoutes);
router.use('/api/elections', electionRoutes);
router.use('/api/crypto', cryptoRoutes);
router.use('/api/ballots', ballotRoutes);

module.exports = router;