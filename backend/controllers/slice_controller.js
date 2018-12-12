const { Movie } = require('../models/movie');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
    claim(req, res, next) {
        // Get userId from token
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwt.verify(token, config.secret).userId;

        // Find the movie and user
        const moviePromise = Movie.findById(req.movieId).exec();
        const userPromise = User.findById(userId).exec();

        // Set slice claimant
        Promise.all([moviePromise, userPromise]).then((result) => {
            const movie = result[0];
            const user = result[1];
            const slice = movie.slices.id(req.params.sliceId);
            if (slice == null) return res.status(404).json({ message: `Slice with id: ${req.params.sliceId} not found.` });

            // Check if slice is claimed
            if (slice.claimant != null) return res.status(400).json({ message: `Slice is already claimed by ${slice.claimant} .` });

            slice.claimant = user._id;

            // Save and respond
            movie.save().then(() => {
                res.send(movie);
            });
        }).catch(next);
    },

    unclaim(req, res, next) {
        // Get userId from token
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwt.verify(token, config.secret).userId;

        // Find the movie and user
        const moviePromise = Movie.findById(req.movieId).exec();
        const userPromise = User.findById(userId).exec();

        // Find slice
        Promise.all([moviePromise, userPromise]).then((result) => {
            const movie = result[0];
            const user = result[1];
            const slice = movie.slices.id(req.params.sliceId);
            if (slice == null) return res.status(404).json({ message: `Slice with id: ${req.params.sliceId} not found.` });

            // Check for slice owner
            if (!slice.claimant.equals(user._id)) return res.status(401).json({ error: `You are not the slice onwer.` });

            slice.claimant = undefined;

            // Save and respond
            movie.save().then(() => {
                res.send(movie);
            }).catch(next);
        }).catch(next);
    }
};
