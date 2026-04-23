const Business = require('../models/Business');
const Contact = require('../models/Contact');
const Message = require('../models/Message');
const WebhookEvent = require('../models/WebhookEvent');

exports.verifyWebhook = async (req, res) => {
  const { businessId } = req.params;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  try {
    const business = await Business.findById(businessId);
    if (!business) return res.sendStatus(404);

    if (mode && token) {
      if (mode === 'subscribe' && token === (business.webhookVerifyToken || process.env.VERIFY_TOKEN)) {
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.handleWebhook = async (req, res) => {
  const { body } = req;
  const businessId = req.params.businessId;

  try {
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        for (const msg of value.messages) {
          const from = msg.from; // Sender's phone number
          const userName = value.contacts?.[0]?.profile?.name || 'WhatsApp User';
          
          // 1. Auto-create or find contact
          let contact = await Contact.findOne({ businessId, waId: from });
          if (!contact) {
            contact = await Contact.create({
              businessId,
              waId: from,
              name: userName
            });
            // Notify frontend about new contact
            req.io.to(businessId).emit('new_contact', contact);
          }

          // 2. Determine message content based on type
          let content = '';
          if (msg.type === 'text') {
            content = msg.text.body;
          } else if (msg.type === 'image') {
            content = '[Image Received]';
          } else if (msg.type === 'video') {
            content = '[Video Received]';
          } else if (msg.type === 'document') {
            content = '[Document Received]';
          } else if (msg.type === 'audio') {
            content = '[Audio Received]';
          } else if (msg.type === 'location') {
            content = '[Location Shared]';
          } else if (msg.type === 'button') {
            content = msg.button.text;
          } else {
            content = `[${msg.type.toUpperCase()} Received]`;
          }

          // 3. Store the message
          const newMessage = await Message.create({
            businessId,
            contactId: contact._id,
            direction: 'incoming',
            content,
            status: 'received',
            waMessageId: msg.id,
            metadata: msg
          });

          // 4. Update last message time for contact
          contact.lastMessageAt = Date.now();
          await contact.save();

          // 5. Emit real-time update
          req.io.to(businessId).emit('new_message', newMessage);
        }
      }

      if (value?.statuses) {
        for (const status of value.statuses) {
          const { id, status: msgStatus, recipient_id } = status;
          
          const updatedMsg = await Message.findOneAndUpdate(
            { waMessageId: id },
            { status: msgStatus },
            { new: true }
          );

          if (updatedMsg) {
            req.io.to(businessId).emit('message_status', {
              messageId: updatedMsg._id,
              status: msgStatus,
              contactId: updatedMsg.contactId
            });
          }
        }
      }
    }
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send('ERROR');
  }
};
