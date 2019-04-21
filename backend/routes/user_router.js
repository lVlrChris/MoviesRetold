const express = require('express');
const userController = require('../controllers/user_controller');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('/', userController.register);
router.post('/authenticate', userController.authenticate);
router.get('/', checkAuth, userController.getAll);
router.get('/:userId', checkAuth, userController.getById);
router.put('/:userId', checkAuth, userController.update);
router.delete('/:userId', checkAuth, userController.delete);

module.exports = router;
