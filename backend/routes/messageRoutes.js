const express = require('express');
const router = express.Router();
const { getMessages, sendNewMessage, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getMessages);
router.post('/', sendNewMessage);
router.get('/conversations', getConversations);

module.exports = router;
