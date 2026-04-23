const Contact = require('../models/Contact');
const Message = require('../models/Message');
const { sendMessage } = require('../services/whatsappService');

exports.sendBroadcast = async (req, res) => {
  const { contactIds, content } = req.body;
  const business = req.user.businessId;

  try {
    const contacts = await Contact.find({ _id: { $in: contactIds }, businessId: business._id });
    
    const results = [];
    for (const contact of contacts) {
      try {
        const waResponse = await sendMessage(business, contact.waId, content);
        const message = await Message.create({
          businessId: business._id,
          contactId: contact._id,
          direction: 'outgoing',
          type: 'text',
          content,
          whatsappMessageId: waResponse.messages[0].id,
          status: 'sent',
          metadata: { isBroadcast: true }
        });
        results.push({ contactId: contact._id, status: 'success', messageId: message._id });
      } catch (err) {
        results.push({ contactId: contact._id, status: 'failed', error: err.message });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
