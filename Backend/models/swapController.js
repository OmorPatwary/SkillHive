const Notification = require('../models/Notification');

const sendSwapRequest = async (req, res) => {
  try {
    const { senderId, recipientId, senderName } = req.body;

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: 'swap_request',
      title: 'New Skill Swap Request',
      message: `${senderName || 'Someone'} wants to swap skills with you!`,
      link: '/matches'
    });

    await notification.save();

    res.status(200).json({ success: true, message: 'Swap request sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendSwapRequest };