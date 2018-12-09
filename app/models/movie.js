const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

// Mongoose movie schema
const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
    // TODO: Slices collection
});

const Movie = mongoose.model('movie', movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required(),
        description: Joi.string()
    };
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
