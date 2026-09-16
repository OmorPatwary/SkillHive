const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: 'default-avatar.png' },
  skillsToOffer: [{ type: String }],
  skillsToLearn: [{ type: String }],
  isPaidMentor: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);