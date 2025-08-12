const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, authenticateRole } = require('./authenticator');


const router = express.Router();


router.post('/voter', authenticateToken, authenticateRole('voter'), (req, res) => {
    res.send({ message: 'Voter token authorized!' });
});


router.post('/admin', authenticateToken, authenticateRole('admin'), (req, res) => {
    res.send({ message: 'Admin token authorized!' });
});


// Register route
router.post('/register', authenticateToken, authenticateRole('admin'), authController.register);


// Update password route
router.put('/update-password', authenticateToken, authenticateRole('voter', 'admin'), authController.updatePassword);


// Login route
router.post('/login', authController.login);


// 2FA toggle route
router.put('/2fa', authenticateToken, authenticateRole('voter', 'admin'), authController.toggle2FA);


// Get 2FA state route
router.get('/2fa/:studentId', authenticateToken, authenticateRole('voter', 'admin'), authController.get2FAState);


module.exports = router;