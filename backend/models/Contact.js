const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String },
  waId: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  notes: { type: String },
  tags: [{ type: String }],
  lastMessageAt: { type: Date },
}, { timestamps: true });

contactSchema.index({ businessId: 1, waId: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
