const { Movie, validate, validateUpdate } = require('../models/movie');

module.exports = {
    getAll(req, res, next) {
        // TODO: Sorting
        // Gather pagination vars
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const sorting = +req.query.sort || 1;
        const movieQuery = Movie.find();
        let fetchedMovies;

        // Skip & Limit fetch if pagination is requested
        if (pageSize && currentPage) {
            movieQuery
                .skip(pageSize * (currentPage - 1))
                .limit(pageSize)
                .sort({ title: sorting });
        }

        movieQuery.then((result) => {
            fetchedMovies = result;
            return Movie.countDocuments();
        }).then((count) => {
            res.status(200).json({
                message: 'Movies fetched successfully',
                movies: fetchedMovies,
                maxMovies: count
            });
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
        if (error) return res.status(403).send(error.details[0].message);

        const movie = new Movie({
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            sliceDuration: req.body.sliceDuration,
            creator: req.userData.userId
        });

        // Save and respond
        movie.save().then((savedMovie) => {
            res.status(201).json({
                message: 'Movie created successfully',
                movie: savedMovie
            });
        }).catch((error) => {
            res.status(403).json({ error: `Movie with title: ${req.body.title} already exists.`});
        });
    },

    update(req, res, next) {
        // Validate input
        const { error } = validateUpdate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if movie exists
        Movie.findOne({ _id: req.params.movieId, creator: req.userData.userId })
            .then((result) => {
                // Movie found
                result.title = req.body.title;
                result.description = req.body.description;

                // Save updated movie
                result.save().then((updated) => {
                    res.status(200).json({
                        message: 'Movie updated successfully.',
                        movie: updated
                    });
                }).catch(next);
            }).catch(() => {
                res.status(404).json({ error: `Movie with id: ${req.params.movieId} or creator: ${req.userData.userId} not found/authorized` });
            });
    },

    delete(req, res, next) {
        // Find movie
        Movie.findOne({ _id: req.params.movieId, creator: req.userData.userId })
            .then((result) => {
                // Delete found movie
                result.delete()
                    .then(() => {
                        res.send({ message: `Movie with id: ${req.params.movieId} deleted` });
                    }).catch(next);
            }).catch(() => {
                res.status(404).json({ error: `Movie with id: ${req.params.movieId} or creator: ${req.userData.userId} not found/authorized` });
            });
    }
};
