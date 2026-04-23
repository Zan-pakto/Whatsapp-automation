const axios = require('axios');

const sendMessage = async (business, to, text) => {
  const version = process.env.META_API_VERSION || 'v19.0';
  const url = `https://graph.facebook.com/${version}/${business.whatsappPhoneNumberId}/messages`;
  
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "text",
    text: { body: text }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${business.whatsappAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendMessage };
