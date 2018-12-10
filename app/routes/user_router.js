const express = require('express');
const userController = require('../controllers/user_controller');

const router = express.Router();

router.post('/register', userController.register);
router.post('/authenticate', userController.authenticate);
router.get('/', userController.getAll);
router.get('/:userId', userController.getById);
router.put('/:userId', userController.update);
router.delete('/:userId', userController.delete);

module.exports = router;
