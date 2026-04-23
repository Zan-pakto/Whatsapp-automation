const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
  type: { type: String, enum: ['text', 'image', 'video', 'document', 'audio', 'template'], default: 'text' },
  content: { type: String },
  mediaUrl: { type: String },
  whatsappMessageId: { type: String, unique: true },
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' },
  metadata: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
