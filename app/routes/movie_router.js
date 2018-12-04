const express = require('express');
const movieController = require('../controllers/movie_controller');

const router = express.Router()

router.get('/', movieController.getAll)

module.exports = router;
