const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  res.json(req.user.businessId);
});

router.put('/', protect, async (req, res) => {
  const { name, whatsappPhoneNumberId, whatsappAccessToken, whatsappWabaId } = req.body;
  try {
    const business = await Business.findByIdAndUpdate(
      req.user.businessId._id,
      { name, whatsappPhoneNumberId, whatsappAccessToken, whatsappWabaId },
      { new: true }
    );
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
