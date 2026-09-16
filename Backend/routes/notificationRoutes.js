const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.post('/swap-request', async (req, res) => {
  try {
    const { senderId, recipientId, senderName } = req.body;

    if (!recipientId || !senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sender or Recipient ID is missing' 
      });
    }

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type: 'swap_request',
      status: 'pending',
      title: 'New Skill Swap Request',
      message: `${senderName || 'Someone'} sent you a skill swap request!`,
      link: '/notifications'
    });

    await notification.save();

    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'name profilePic');

    const io = req.app.get('io');
    if (io) {
      io.to(recipientId.toString()).emit('get_notification', populatedNotification);
    }

    return res.status(200).json({ success: true, notification: populatedNotification });
  } catch (error) {
    console.error('Swap Request Notification Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.params.userId })
      .populate('sender', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read-all/:userId', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/respond/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const notification = await Notification.findById(req.params.id).populate('recipient', 'name');

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.status = status;
    notification.isRead = true;
    await notification.save();

    if (notification.sender) {
      const responseNotification = new Notification({
        recipient: notification.sender,
        sender: notification.recipient._id,
        type: 'swap_response',
        status: status,
        title: `Swap Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
        message: `${notification.recipient?.name || 'User'} ${status} your skill swap request!`,
        link: status === 'accepted' ? '/chat' : '/notifications'
      });

      await responseNotification.save();

      const populatedResponse = await Notification.findById(responseNotification._id)
        .populate('sender', 'name profilePic');

      const io = req.app.get('io');
      if (io) {
        io.to(notification.sender.toString()).emit('get_notification', populatedResponse);
      }
    }

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;