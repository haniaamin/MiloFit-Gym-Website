const mongoose = require('mongoose');

const classBookingSchema = new mongoose.Schema({
  className: { type: String, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ClassBooking', classBookingSchema);