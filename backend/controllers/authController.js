const User = require('../models/User');
const Business = require('../models/Business');
const { generateToken } = require('../utils/auth');

exports.register = async (req, res) => {
  const { name, email, password, businessName } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const business = await Business.create({
      name: businessName || `${name}'s Business`,
      webhookVerifyToken: Math.random().toString(36).substring(7),
    });

    const user = await User.create({
      name,
      email,
      password,
      businessId: business._id,
      role: 'admin',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        businessId: user.businessId,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        businessId: user.businessId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
