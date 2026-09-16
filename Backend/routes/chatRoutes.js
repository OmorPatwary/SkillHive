const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

router.post('/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        message: 'senderId and receiverId are required',
      });
    }

    let conversation = await Conversation.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    });

    let isNewConversation = false;

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
      });

      await conversation.save();
      isNewConversation = true;
    }

    await conversation.populate(
      'members',
      'name profilePic email'
    );

    const io = req.app.get('io');

    if (io && isNewConversation) {
      io.to(senderId.toString()).emit(
        'conversation_created',
        conversation
      );

      io.to(receiverId.toString()).emit(
        'conversation_created',
        conversation
      );
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get('/conversations/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.userId],
      },
    })
      .populate('members', 'name profilePic email')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post('/message', async (req, res) => {
  try {
    const {
      conversationId,
      sender,
      receiverId,
      text,
    } = req.body;

    if (
      !conversationId ||
      !sender ||
      !text?.trim()
    ) {
      return res.status(400).json({
        message:
          'conversationId, sender and text are required',
      });
    }

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found',
      });
    }

    const isMember =
      conversation.members.some(
        (member) =>
          member.toString() ===
          sender.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        message:
          'You are not a member of this conversation',
      });
    }

    const newMessage = new Message({
      conversationId,
      sender,
      text: text.trim(),
    });

    const savedMessage =
      await newMessage.save();

    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          updatedAt: new Date(),
        },
      }
    );

    const populatedMessage =
      await Message.findById(
        savedMessage._id
      ).populate(
        'sender',
        '_id name profilePic'
      );

    const io = req.app.get('io');

    if (io) {
      io.to(conversationId.toString()).emit(
        'receive_message',
        populatedMessage
      );

      if (receiverId) {
        io.to(receiverId.toString()).emit(
          'receive_message',
          populatedMessage
        );

        io.to(receiverId.toString()).emit(
          'get_notification',
          {
            type: 'message',
            title: 'New Message',
            message: text.trim(),
            sender,
            conversationId,
            createdAt:
              populatedMessage.createdAt,
          }
        );
      }
    }

    if (receiverId) {
      const notification =
        new Notification({
          recipient: receiverId,
          sender,
          type: 'message',
          title: 'New Message',
          message: text.trim(),
          link: '/chat',
        });

      await notification.save();
    }

    res.status(200).json(
      populatedMessage
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get(
  '/messages/:conversationId',
  async (req, res) => {
    try {
      const messages =
        await Message.find({
          conversationId:
            req.params.conversationId,
        })
          .populate(
            'sender',
            '_id name profilePic'
          )
          .sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

module.exports = router;