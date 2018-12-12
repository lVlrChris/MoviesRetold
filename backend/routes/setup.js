const express = require('express');
const movieRouter = require('./movie_router');
const sliceRouter = require('./slice_router');
const userRouter = require('./user_router');
const path = require('path');

module.exports = function(app) {
    app.use(express.json());

    app.use('/api/v1/movies', movieRouter);
    app.use('/api/v1/movies/:movieId/slices', function(req, res, next) {
        //This will pass the threadId through the route
        req.movieId = req.params.movieId;
        next();
    }, sliceRouter);
    app.use('/api/v1/users', userRouter);

    
    const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg' ];

    // Routing root catch-all (this should respond with angular frontend)
    app.get('*', (req, res, next) => {
        // TODO: Route to angular
        // res.send('Its working!');
        // res.sendFile(path.resolve('dist/MoviesRetold/index.html'));

        if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
            res.sendFile(path.resolve(`dist/${req.url}`));
          } else {
            res.sendFile(path.resolve('dist/index.html'));
          }
    });

    

    // Catch-all error handler
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).json({ error: err.message });
    // });

    require('../helpers/error_handler')(app);
};
