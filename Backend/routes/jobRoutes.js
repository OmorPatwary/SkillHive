const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// ১. নতুন কাজ পোস্ট করা
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

    res.status(201).json({ 
      message: 'Work posted successfully!', 
      job: newJob 
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ message: 'Server error while posting work' });
  }
});

// ২. সব কাজের তালিকা পাওয়া
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// ৩. কাজের জন্য আবেদন করা (এবং পোস্টদাতাকে নোটিফিকেশন পাঠানো)
router.post('/:id/apply', async (req, res) => {
  try {
    const { applicantId, applicantName, applicantEmail, portfolioLink, message } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Work post not found' });
    }

    // ১. নিজের পোস্টে নিজেকে আবেদন করতে না দেওয়া
    if (job.postedBy.toString() === applicantId) {
      return res.status(400).json({ message: 'You cannot apply to your own job post!' });
    }

    // ২. একই ইউজার দ্বিতীয়বার আবেদন করেছে কিনা যাচাই
    const alreadyApplied = job.applications.some(
      (app) => app.applicantId && app.applicantId.toString() === applicantId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this work!' });
    }

    // নতুন অ্যাপ্লিকেশন যুক্ত করা
    job.applications.push({
      applicantId,
      applicantName,
      applicantEmail,
      portfolioLink,
      message,
    });

    await job.save();

    // পোস্টদাতাকে নোটিফিকেশন পাঠানো
    const notification = new Notification({
      recipient: job.postedBy,
      sender: applicantId,
      type: 'application',
      title: 'New Job Application',
      message: `${applicantName} applied for your job: ${job.title}`,
      link: '/my-activity'
    });
    await notification.save();

    res.status(200).json({ message: 'Application submitted successfully!', notification });
  } catch (error) {
    console.error('Error in job application:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

// ৪. ইউজারের নিজস্ব অ্যাক্টিভিটি পাওয়া
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