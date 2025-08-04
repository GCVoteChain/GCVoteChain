const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(403).json({ message: "Access Denied: You're not authorized to access this page." });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or missing token.' });
    }
}

function authenticateRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: You're not authorized to access this page." });
        }
        next();
    }
}

module.exports = {
    authenticateToken,
    authenticateRole,
};