const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['FREE_SWAP', 'PAID'], required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  meetLink: { type: String, default: '' },
  scheduledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);