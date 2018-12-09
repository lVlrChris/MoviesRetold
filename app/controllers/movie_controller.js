const { Movie, validate } = require('../models/movie');

module.exports = {
    getAll(req, res, next) {
        // TODO: Sorting
        Movie.find().then((result) => {
            res.send(result);
        }).catch(next);
    },

    getById(req, res, next) {
        Movie.findById(req.params.movieId).then((result) => {
            res.send(result);
        }).catch(next);
    },

    create(req, res, next) {
        // Validate input
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const movie = new Movie({
            title: req.body.title,
            description: req.body.description
        });

        // Save and respond
        movie.save().then(() => {
            res.send(movie);
        }).catch(next);
    },

    update(req, res, next) {
        // Validate input
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if movie exists
        Movie.findById(req.params.movieId)
            .then((result) => {
                // Movie found
                result.title = req.body.title;
                result.description = req.body.description;

                // Save updated movie
                result.save().then((updated) => {
                    res.send(result);
                }).catch(next);
            }).catch(() => {
                res.status(404).send(`Movie with id: ${req.params.movieId} not found`);
            });
    },

    delete(req, res, next) {
        //Find movie
        Movie.findById(req.params.movieId)
            .then((result) => {
                //Delete found movie
                result.delete()
                    .then(() => {
                        res.send('Movie deleted');
                    }).catch(next);
            }).catch(() => {
                res.status(404).send(`Movie with id: ${req.params.movieId} not found`);
            });
    }
};
