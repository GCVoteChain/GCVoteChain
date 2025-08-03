const bcrypt = require('bcryptjs');
const { keccak256, solidityPacked } = require('ethers');
const userModel = require('../models/userModel.js');

const jwt = require('jsonwebtoken');


async function register(req, res) {
    try {
        const { studentId, password, email, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const voterId = keccak256(solidityPacked(['string', 'string', 'string'], [studentId, email, role]));
        
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
            const token = jwt.sign(
                { voter_id: user.voter_id, name: user.name, role: user.role },
                process.env.JWT_TOKEN,
                { expiresIn: '1h' }
            );

            res.send({ token, message: 'Login successfully!' });
        } else {
            res.status(401).send({ message: 'Incorrect username/password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ message: 'Internal server error' });
    }
}


async function updatePassword(req, res) {
    try {
        const { studentId, password } = req.body;

        await userModel.updatePassword(studentId, password);

        res.send({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error updating paswword:', err);
        res.status(500).send({ message: 'Failed to update password' });
    }
}


module.exports = {
    register,
    login,
    updatePassword
};