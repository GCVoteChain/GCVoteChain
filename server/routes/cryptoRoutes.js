const express = require('express');
const eccrypto = require('eccrypto');
const { authenticateToken, authenticateRole } = require('./authenticator');
const path = require('path');
const fs = require('fs');

const router = express.Router();


const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    const privateKey = eccrypto.generatePrivate().toString('hex');

    fs.writeFileSync(envPath, `CRYPTO_PRIVATE_KEY=${privateKey}\n`);
} else {
    const envFile = fs.readFileSync(envPath, 'utf8');

    const privateKey = eccrypto.generatePrivate();

    const priv = privateKey.toString('hex');

    const privKeyExists = envFile.split('\n').some(l => l.trim().startsWith('CRYPTO_PRIVATE_KEY='));
    if (!privKeyExists) {
        fs.appendFileSync(envPath, `CRYPTO_PRIVATE_KEY=${priv}\n`);
    }
}


// Get public key encryption route
router.get('/public-key', authenticateToken, authenticateRole('voter'), (req, res) => {
    const privateKey = Buffer.from(process.env.CRYPTO_PRIVATE_KEY, 'hex');
    const publicKey = eccrypto.getPublic(privateKey).toString('hex');

    res.json(publicKey);
});


module.exports = router;