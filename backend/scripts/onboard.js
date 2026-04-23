require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../models/Business');
const User = require('../models/User');

const onboard = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp_platform');
    console.log('Connected to MongoDB...');

    // 1. Create the Business with your credentials
    const business = await Business.findOneAndUpdate(
      { name: 'My Test Business' },
      {
        name: 'My Test Business',
        whatsappPhoneNumberId: '490596950812804',
        whatsappAccessToken: 'EAAIiBy9y6qYBO4DUoZAous4yMqgSkujK0L8DFZCCf7Lww1hL7aALA9vsU3j4Cg7iohsMMzZCHqsr2D8N25LgmIPd9PU55HSYJ4jHLEekybrxcqKYLJgn6T3C9tphUREaQuFquxEI3KvoambH85cZAEVW1dGh6PFrZBVTgxnrXW8e0HGjJGZCSHshZBesYQFAVjOAgZDZD',
        whatsappWabaId: '', // You can add this if you have it
        webhookVerifyToken: process.env.VERIFY_TOKEN || 'mywhatsappverifytoken',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Business Created/Updated:', business.name);
    console.log('📍 Business ID (Use this for Webhook URL):', business._id);

    // 2. Create an Admin User
    const user = await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123', // Will be hashed by model pre-save
        businessId: business._id,
        role: 'admin',
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin User Created:', user.email);
    console.log('🔑 Login Credentials:');
    console.log('   Email: admin@test.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during onboarding:', err);
    process.exit(1);
  }
};

onboard();
