const Message = require('../models/Message');
const Contact = require('../models/Contact');
const { sendMessage } = require('../services/whatsappService');

exports.getMessages = async (req, res) => {
  const { contactId } = req.query;
  try {
    const messages = await Message.find({ 
      businessId: req.user.businessId._id,
      contactId 
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendNewMessage = async (req, res) => {
  const { contactId, content } = req.body;
  const business = req.user.businessId;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    const waResponse = await sendMessage(business, contact.waId, content);
    const waMsgId = waResponse.messages[0].id;

    const message = await Message.create({
      businessId: business._id,
      contactId,
      direction: 'outgoing',
      type: 'text',
      content,
      whatsappMessageId: waMsgId,
      status: 'sent',
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const contacts = await Contact.find({ businessId: req.user.businessId._id })
      .sort({ updatedAt: -1 });
    
    // For each contact, get the last message
    const conversations = await Promise.all(contacts.map(async (contact) => {
      const lastMessage = await Message.findOne({ contactId: contact._id })
        .sort({ createdAt: -1 });
      return { contact, lastMessage };
    }));

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
