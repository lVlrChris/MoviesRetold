const mongoose = require('mongoose');
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
    //TODO: Slices collection
});

const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;