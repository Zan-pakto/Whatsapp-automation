const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getStats);

module.exports = router;
