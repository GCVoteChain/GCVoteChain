const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, authenticateRole } = require('./authenticator');


const router = express.Router();


router.post('/', authenticateToken, (req, res) => {
    res.send({ message: 'Token authorized!' });
});


// Register route
router.post('/register', authenticateToken, authenticateRole('admin'), authController.register);


// Update password route
router.put('/update-password', authenticateToken, authenticateRole('voter', 'admin'), authController.updatePassword);


// Login route
router.post('/login', authController.login);


module.exports = router;