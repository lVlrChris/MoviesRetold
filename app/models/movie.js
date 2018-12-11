const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const sliceSchema = require('./slice');

// Mongoose movie schema
const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    sliceDuration: {
        type: Number,
        required: true
    },
    slices: [sliceSchema]
});

movieSchema.pre('save', function(next) {
    if (this.isNew) {
        for (let i = 0; i < this.duration; i += this.sliceDuration) {
            if (i + this.sliceDuration > this.duration) {
                this.slices.push({ startTime: i, duration: this.duration - i });
            } else {
                this.slices.push({ startTime: i, duration: this.sliceDuration });
            }
        }
    }
    next();
});

const Movie = mongoose.model('movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string(),
        duration: Joi.number().required(),
        sliceDuration: Joi.number().required()
    };
    return Joi.validate(movie, schema);
}

function validateMovieUpdate(movie) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string()
    };
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.validateUpdate = validateMovieUpdate;
