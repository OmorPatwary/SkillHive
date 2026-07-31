const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// ১. নতুন কাজ পোস্ট করা (Post a new job)
router.post('/', async (req, res) => {
  try {
    const { postedBy, posterName, title, category, description, skillsRequired, budget, deadline } = req.body;

    if (!postedBy || !title || !description || !deadline) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newJob = new Job({
      postedBy,
      posterName,
      title,
      category,
      description,
      skillsRequired,
      budget,
      deadline,
    });

    await newJob.save();
    res.status(201).json({ message: 'Work posted successfully!', job: newJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error while posting work' });
  }
});

// ২. সব কাজের তালিকা পাওয়া (Get all jobs)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// ৩. জুনিয়রদের কাজের জন্য আবেদন করা (Apply for a job)
router.post('/:id/apply', async (req, res) => {
  try {
    const { applicantId, applicantName, applicantEmail, portfolioLink, message } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Work post not found' });
    }

    job.applications.push({
      applicantId,
      applicantName,
      applicantEmail,
      portfolioLink,
      message,
    });

    await job.save();
    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

// ৪. ইউজারের নিজস্ব অ্যাক্টিভিটি পাওয়া (My Posted & Applied jobs)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const postedJobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
    const appliedJobs = await Job.find({ 'applications.applicantId': userId }).sort({ createdAt: -1 });

    res.status(200).json({ postedJobs, appliedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user activities' });
  }
});

module.exports = router;