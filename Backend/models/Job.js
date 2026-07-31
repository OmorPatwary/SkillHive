const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    posterName: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    budget: { type: String, default: 'Mentorship / Free' },
    deadline: { type: Date, required: true },
    applications: [
      {
        applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        applicantName: String,
        applicantEmail: String,
        portfolioLink: String,
        message: String,
        appliedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);