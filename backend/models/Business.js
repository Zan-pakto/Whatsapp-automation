const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  whatsappPhoneNumberId: { type: String },
  whatsappWabaId: { type: String },
  whatsappAccessToken: { type: String },
  webhookVerifyToken: { type: String },
  apiKey: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
