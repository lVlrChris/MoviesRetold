const mongoose = require('mongoose');
const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

// Mongoose user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('user', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.optional(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    };
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
