const express = require('express');
const router = express.Router();
const { getContacts, createContact, bulkCreateContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getContacts);
router.post('/', createContact);
router.post('/bulk', bulkCreateContacts);

module.exports = router;
