const express = require('express');
const movieRouter = require('./movie_router');

module.exports = function(app) {
    app.use(express.json());

    app.use('/api/v1/movies', movieRouter);

    // Routing root catch-all (this should respond with angular frontend)
    app.all('/', (req, res, next) => {
        res.send('Its working!');
    });

    // Catch-all error handler
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    });
};
