const mongoose = require("mongoose");

const TraineeProfileSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    dateOfBirth: {
        month: { type: String, required: true },
        date: { type: String, required: true },
        year: { type: String, required: true }
    },
    weight: { type: String, required: true },
    height: { type: String, required: true },
    fitnessGoal: { type: String, required: true },
    activityLevel: { type: String, required: true },
    medicalInfo: {
        medicalConditions: { type: String, required: false },
        medications: { type: String, required: false },
        heartCondition: { type: String, required: false },
        injuries: { type: String, required: false },
        emergencyContact: { type: String, required: false }
    }
});

module.exports = mongoose.model("TraineeProfile", TraineeProfileSchema);
