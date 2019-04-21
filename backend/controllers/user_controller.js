const { User, validate } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    authenticate(req, res, next) {
        User.findOne({ email: req.body.email })
            .then((result) => {
                if (!req.body.password) return res.status(403).json({ error: 'No email given.'});
                if (bcrypt.compareSync(req.body.password, result.hash)) {
                    // Valid password
                    try {
                        const token = jwt.sign({ email: result.email, userId: result._id }, config.secret, { expiresIn: '1h' });
                        result.hash = undefined;

                        return res.status(200).json({ message: 'Authorized', token: token, expiresIn: 3600, user: result });
                    } catch (error) {
                        next(error);
                    }
                } else {
                    // Invalid password
                    return res.status(401).json({ error: 'Invalid login credentials.' });
                }
            })
            .catch(() => {
                return res.status(404).json({ error: `User with email '${req.body.email}' not found` });
            });
    },

    register(req, res, next) {
        // Validate input
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check for existing user
        User.findOne({ email: req.body.email }).then((result) => {
            if (!result) {
                // User doesn't exist
                const user = new User({
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                });

                // Hash given password
                if (req.body.password) {
                    user.hash = bcrypt.hashSync(req.body.password, 10);
                } else {
                    return res.status(400).json({ error: 'No password provided' });
                }

                user.save().then((savedUser) => {
                    // Omit hash from result
                    savedUser.hash = undefined;
                    res.status(201).json({ message: 'User created.', result: savedUser });
                }).catch(next);
            } else {
                res.status(400).json({ error: `The email '${req.body.email}' is already taken.` });
            }
        });
    },

    getAll(req, res, next) {
        // TODO: Sorting
        User.find().select('-hash').then((result) => {
            res.send(result);
        }).catch(next);
    },

    getById(req, res, next) {
        if (!req.params.userId) return res.status(403).json({ error: 'No userId given'});
        User.findById(req.params.userId).select('-hash').then((result) => {
            res.status(200).json({ message: 'User fetched successfully', user: result });
        }).catch((err) => {
            res.status(404).json({ error: `No user with id: ${req.params.userId} found.`});
        });
    },

    update(req, res, next) {
        // Validate input
        const { error } = validate(req.body);
        if (error) return res.status(403).send(error.details[0].message);

        // Check for old user
        User.findById(req.params.userId).then((oldUser) => {
            if (oldUser == null) return res.status(404).json({ error: `User with id: ${req.params.userId} not found` });

            // Check for new user
            User.findOne({ email: req.body.email }).then((newUser) => {
                if (newUser == null || newUser.email === req.body.email) {
                    // Check if a new password is given
                    if (req.body.password) {
                        oldUser.password = bcrypt.hashSync(req.body.password, 10);
                    } else {
                        return res.status(403).json({ error: 'No password provided.' });
                    }

                    // Set new values to user
                    oldUser.email = req.body.email;
                    oldUser.firstName = req.body.firstName;
                    oldUser.lastName = req.body.lastName;

                    // Save and respond
                    oldUser.save().then(() => {
                        // TODO: Omit hash
                        res.send(oldUser);
                    }).catch(next);
                } else {
                    // New user already exists
                    res.status(400).json({ error: `Email ${req.body.email} is already taken.` });
                }
            }).catch(next);    
        }).catch((err) => {
            res.status(404).json({ error: `User with id: ${req.params.userId} was not found.`});
        });
    },

    delete(req, res, next) {
        User.findByIdAndDelete(req.params.userId)
            .then(() => {
                res.json({ message: 'User deleted.' });
            })
            .catch((error) => {
                res.status(404).json({ error: `User with id: ${req.params.userId} was not found.`});
            });
    }
};
