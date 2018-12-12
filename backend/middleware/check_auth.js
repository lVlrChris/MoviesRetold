const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    // Get token from header
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, config.secret);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed.' });
    }
};
