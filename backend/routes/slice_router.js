const express = require('express');
const sliceController = require('../controllers/slice_controller');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('/:sliceId/claim', checkAuth, sliceController.claim);
router.delete('/:sliceId/claim', checkAuth, sliceController.unclaim);

module.exports = router;
