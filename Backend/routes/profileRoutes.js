const express = require('express');
const User = require('../models/User');

const router = express.Router();

// প্রোফাইল গেট করা
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// প্রোফাইল আপডেট করা
router.put('/profile/:userId', async (req, res) => {
  try {
    // 💡 profilePic কে req.body থেকে ধরা হয়েছে
    const { name, bio, profilePic, skillsToOffer, skillsToLearn, isPaidMentor } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name, bio, profilePic, skillsToOffer, skillsToLearn, isPaidMentor }, // 👈 profilePic আপডেট করা হলো
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;