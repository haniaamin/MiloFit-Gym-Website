const mongoose = require('mongoose');

const AddTraineeSchema = new mongoose.Schema({
  trainerEmail: { type: String, required: true }, // identify the trainer
  name: String,
  email: String,
  phone: String,
  package: String,
  startDate: String,
  endDate: String,
  status: String
});

module.exports = mongoose.model('AddTrainee', AddTraineeSchema);