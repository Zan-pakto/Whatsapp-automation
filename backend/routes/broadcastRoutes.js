const express = require('express');
const router = express.Router();
const { sendBroadcast } = require('../controllers/broadcastController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', sendBroadcast);

module.exports = router;
