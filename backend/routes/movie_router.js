const express = require('express');
const movieController = require('../controllers/movie_controller');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.get('/', movieController.getAll);
router.get('/:movieId', movieController.getById);
router.post('/', checkAuth, movieController.create);
router.put('/:movieId', checkAuth, movieController.update);
router.delete('/:movieId', checkAuth, movieController.delete);

module.exports = router;
