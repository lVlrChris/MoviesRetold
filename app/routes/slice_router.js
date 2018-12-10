const express = require('express');
const sliceController = require('../controllers/slice_controller');

const router = express.Router();

router.post('/:sliceId/claim', sliceController.claim);
router.delete('/:sliceId/claim', sliceController.unclaim);

module.exports = router;
