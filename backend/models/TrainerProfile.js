const mongoose = require("mongoose");

const TrainerProfileSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    gender: String,
    dateOfBirth: { month: String, date: String, year: String },
    weight: Number,
    height: Number,
    expertise: { type: String, required: false },
    experience: { type: String, required: false },
    certifications: { type: String, required: false },
    profilePicture: { type: String, required: false } // Path to uploaded profile picture
});

module.exports = mongoose.model("TrainerProfile", TrainerProfileSchema);

