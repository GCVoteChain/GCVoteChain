const express = require('express');
const eccrypto = require('eccrypto');
const { authenticateToken, authenticateRole } = require('./authenticator');
const fs = require('fs');

const router = express.Router();


// Get public key encryption route
router.get('/public-key', authenticateToken, authenticateRole('voter'), (req, res) => {
    const privateKey = Buffer.from(process.env.CRYPTO_PRIVATE_KEY, 'hex');
    const publicKey = eccrypto.getPublic(privateKey).toString('hex');

    res.json(publicKey);
});


module.exports = router;