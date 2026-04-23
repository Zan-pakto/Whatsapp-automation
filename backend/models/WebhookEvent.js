const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  eventType: { type: String },
  payload: { type: Object },
  processed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
