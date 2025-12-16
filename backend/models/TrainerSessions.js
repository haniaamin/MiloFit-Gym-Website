const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  trainee: String,
  hour: String,
  timezone: String,
  day: String,
  month: String,
  year: Number
});

module.exports = mongoose.model('TrainerSessions', sessionSchema);