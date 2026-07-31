const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const myOffers = currentUser.skillsToOffer || [];
    const myWants = currentUser.skillsToLearn || [];

    // ১. ফ্রি স্কিল সোয়াপ ম্যাচ (অন্যজন শেখায় আমি যা শিখতে চাই + অন্যজন শিখতে চায় আমি যা শেখাতে পারি)
    const freeMatches = await User.find({
      _id: { $ne: userId },
      skillsToOffer: { $in: myWants },
      skillsToLearn: { $in: myOffers }
    }).select('-password');

    // ২. পেইড মেন্টর
    const paidMentors = await User.find({
      _id: { $ne: userId },
      isPaidMentor: true,
      skillsToOffer: { $in: myWants }
    }).select('-password');

    res.json({ freeMatches, paidMentors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;