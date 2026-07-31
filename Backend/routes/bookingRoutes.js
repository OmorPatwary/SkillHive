const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

// সেশন বুক রিকোয়েস্ট
router.post('/book-session', async (req, res) => {
  try {
    const { requesterId, providerId, bookingType, scheduledAt } = req.body;

    const booking = await Booking.create({
      requester: requesterId,
      provider: providerId,
      bookingType,
      scheduledAt
    });

    res.status(201).json({ message: 'Session booking requested successfully!', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ইউজারের সব বুকিং লোড করা
router.get('/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      $or: [{ requester: userId }, { provider: userId }]
    })
      .populate('requester', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// বুকিং একসেপ্ট করে মিট লিংক পাঠানো
router.put('/accept-booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { meetLink } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'ACCEPTED', meetLink },
      { new: true }
    );

    res.json({ message: 'Booking accepted!', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// বুকিং রিজেক্ট করা
router.put('/reject-booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'REJECTED' },
      { new: true }
    );

    res.json({ message: 'Booking rejected!', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;