const express = require('express');
const movieController = require('../controllers/movie_controller');

const router = express.Router();

router.get('/', movieController.getAll);
router.get('/:movieId', movieController.getById);
router.post('/', movieController.create);
router.put('/:movieId', movieController.update);
router.delete('/:movieId', movieController.delete);

module.exports = router;
