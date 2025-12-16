const mongoose = require('mongoose');

const TrainerGoalSchema = new mongoose.Schema({
  trainerEmail: { type: String, required: false, default: null },
  goal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainerGoal', TrainerGoalSchema);