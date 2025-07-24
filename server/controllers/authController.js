const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel.js');

function register(req, res) {
    const { name, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Hashing error:', err);
            return res.status(500).send("Hash error");
        }
        
        userModel.registerUser(name, hashedPassword, (err) => {
            if (err) {
                console.error('Registering error:', err);
                return res.status(500).send("User already exists, Try another user.");
            }
            res.send({ message: 'Registered successfully'});
        });
    });
}


function login(req, res) { 
    const { name, password } = req.body;
    
    userModel.getUser(name, (err, user) => {
        if (err || !user) return res.status(401).send({ message: 'Incorrect username/password' });

        bcrypt.compare(password, user.password, (err, match) => {
            if (match) {
                res.send({ message: 'Login successfully!' });
            } else {
                res.status(401).send({ message: 'Incorrect username/password' });
            }
        });
    });
}


module.exports = { register, login };