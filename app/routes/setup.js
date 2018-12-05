const express = require('express');
const movieRouter = require('./movie_router');

module.exports = function(app) {
    app.use(express.json());

    app.use('/api/movies', movieRouter);

    // Routing root catchall (this should respond with angular frontend)
    app.all('/', (req, res) => {
        res.send('Its working!');
    });
};
