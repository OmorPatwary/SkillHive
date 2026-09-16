const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match'); 

const router = express.Router();

// ১. অ্যালগরিদম ভিত্তিক ম্যাচ
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const myOffers = currentUser.skillsToOffer || [];
    const myWants = currentUser.skillsToLearn || [];

    const freeMatches = await User.find({
      _id: { $ne: userId },
      skillsToOffer: { $in: myWants },
      skillsToLearn: { $in: myOffers }
    }).select('-password');

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

// ২. নতুন Skill Post তৈরি (UserId দিয়ে অটো ইউজার প্রোফাইল পিক ও নাম নেওয়ার লজিক যোগ করা হয়েছে)
router.post('/', async (req, res) => {
  try {
    const { userId, name, profilePic, postType, teachSkill, learnSkill, description } = req.body;

    let finalName = name;
    let finalProfilePic = profilePic;

    // যদি ফ্রন্টএন্ড থেকে userId পাঠানো হয়, সরাসরি User collection থেকে নাম ও ছবি ফেচ করবে
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        finalName = user.name || name;
        finalProfilePic = user.profilePic || user.avatar || profilePic;
      }
    }

    const newMatch = new Match({
      name: finalName || 'Anonymous User',
      profilePic: finalProfilePic || '',
      postType,
      teachSkill,
      learnSkill,
      description
    });

    const savedMatch = await newMatch.save();
    res.status(201).json({ message: 'Skill post created successfully!', match: savedMatch });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// ৩. সকল Skill Posts ফেচ করা (খালি profilePic থাকলে User টেবিল থেকে অটো ব্যাকআপ নেওয়ার লজিক যোগ করা হয়েছে)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });

    // যেসব পুরনো পোস্টে profilePic খালি আছে, সেগুলোর জন্য User টেবিল থেকে ছবি অটো ফেচ করা হবে
    const updatedMatches = await Promise.all(
      matches.map(async (match) => {
        const matchObj = match.toObject();
        if (!matchObj.profilePic && matchObj.name) {
          const user = await User.findOne({ name: matchObj.name });
          if (user && (user.profilePic || user.avatar)) {
            matchObj.profilePic = user.profilePic || user.avatar;
          }
        }
        return matchObj;
      })
    );

    res.status(200).json(updatedMatches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
  }
});

module.exports = router;