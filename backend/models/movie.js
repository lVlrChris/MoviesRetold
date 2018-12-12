const mongoose = require('mongoose');
const Joi = require('joi');
const uniqueValidator = require('mongoose-unique-validator');
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
    slices: [sliceSchema],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

movieSchema.plugin(uniqueValidator);

// Generate slices when creating a new movie
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
        description: Joi.string().optional(),
        duration: Joi.number().required(),
        sliceDuration: Joi.number().required()
    };
    return Joi.validate(movie, schema);
}

function validateMovieUpdate(movie) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string().optional()
    };
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.validateUpdate = validateMovieUpdate;
