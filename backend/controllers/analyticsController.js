const Message = require('../models/Message');

exports.getStats = async (req, res) => {
  const businessId = req.user.businessId._id;
  try {
    const totalMessages = await Message.countDocuments({ businessId });
    const deliveredCount = await Message.countDocuments({ businessId, status: { $in: ['delivered', 'read'] } });
    const readCount = await Message.countDocuments({ businessId, status: 'read' });
    const incomingCount = await Message.countDocuments({ businessId, direction: 'incoming' });
    const outgoingCount = await Message.countDocuments({ businessId, direction: 'outgoing' });

    res.json({
      totalMessages,
      deliveryRate: outgoingCount > 0 ? (deliveredCount / outgoingCount) * 100 : 0,
      readRate: outgoingCount > 0 ? (readCount / outgoingCount) * 100 : 0,
      incomingCount,
      outgoingCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
