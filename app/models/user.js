const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

// Mongoose user schema
const user = new Schema({
    email: {
        type: string,
        
    }
})