// backend/routes/swapRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.post('/swap-request', async (req, res) => {
  try {
    const { senderId, recipientId, senderName } = req.body;

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: 'swap_request',
      title: 'New Skill Swap Request',
      message: `${senderName || 'Someone'} sent you a skill swap request!`,
      link: '/matches'
    });

    await notification.save();
    res.status(200).json({ success: true, message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;