const bcrypt = require('bcryptjs');
const { keccak256, toUtf8Bytes } = require('ethers');
const userModel = require('../models/userModel.js');


async function register(req, res) {
    try {
        const { studentId, password, email, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const voterId = keccak256(toUtf8Bytes(studentId + email + role));
        
        await userModel.registerUser(voterId, studentId, hashedPassword, role, email);
        res.send({ message: 'Registered successfully'});
    } catch (err) {
        console.error('Error registering:', err);
        res.status(500).send({ message: 'Failed to register user' });
    }
}


async function login(req, res) {
    try {
        const { studentId, password } = req.body;
        
        const user = await userModel.getUser(studentId);
        if (!user) return res.status(401).send({ message: 'Incorrect username/password' });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.send({ message: 'Login successfully!' });
        } else {
            res.status(401).send({ message: 'Incorrect username/password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
}


module.exports = { register, login };