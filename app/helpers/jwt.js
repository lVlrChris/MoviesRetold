const expressJwt = require('express-jwt');
const config = require('../config');
const { User } = require('../models/user');

function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            '/api/v1/users/authenticate',
            '/api/v1/users/register'
        ]
    });
}

// function isRevoked(req, payload, done) {
//     User.findById(payload.sub)
//         .then(() => {
//             done();
//         })
//         .catch(() => {
//             // revoke token if user no longer exists
//             return done(null, true);
//         });
// };

module.exports = jwt;
