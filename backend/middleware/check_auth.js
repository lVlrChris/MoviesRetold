const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    // Get token from header
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, config.secret);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed.' });
    }
};
