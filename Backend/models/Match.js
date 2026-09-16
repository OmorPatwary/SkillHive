const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous User' },
  profilePic: { type: String, default: '' }, // প্রোফাইল ছবি ডাটাবেজে রাখার জন্য
  postType: { type: String, required: true }, // 'Wants to Learn' or 'Wants to Teach'
  teachSkill: { type: String, required: true },
  learnSkill: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);