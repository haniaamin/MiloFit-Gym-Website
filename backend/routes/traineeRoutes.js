const express = require("express");
const router = express.Router();
const TraineeProfile = require("../models/TraineeProfile");
const AddTrainee = require("../models/AddTrainee");

// 🔹 GET: Fetch trainees by trainer email
router.get("/list", async (req, res) => {
  try {
    const { trainerEmail } = req.query;
    if (!trainerEmail) return res.status(400).json({ message: "trainerEmail is required" });

    const trainees = await AddTrainee.find({ trainerEmail });
    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trainees", error: error.message });
  }
});

// 🔹 POST: Add a new trainee
router.post("/add", async (req, res) => {
  try {
    const trainee = new AddTrainee(req.body);
    await trainee.save();
    res.status(201).json(trainee);
  } catch (error) {
    res.status(400).json({ message: "Failed to add trainee", error: error.message });
  }
});

// 🔹 DELETE: Remove a trainee by ID
router.delete("/remove/:id", async (req, res) => {
  try {
    await AddTrainee.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete trainee", error: error.message });
  }
});

// 🔹 PUT: Update a trainee by ID
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await AddTrainee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Trainee not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update trainee", error: error.message });
  }
});

// 🔁 Original 4-step profile creation flow:
const tempProfiles = new Map();

router.post("/complete-profile", async (req, res) => {
  try {
    const { gender, month, date, year, weight, height, email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    tempProfiles.set(email, {
      gender,
      dateOfBirth: { month, date, year },
      weight,
      height,
    });

    res.status(201).json({ message: "Profile saved. Proceed to Fitness Goals." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/fitness-goals", async (req, res) => {
  try {
    const { email, fitnessGoal } = req.body;
    if (!tempProfiles.has(email)) return res.status(400).json({ message: "Start from step 1." });

    tempProfiles.get(email).fitnessGoal = fitnessGoal;
    res.status(201).json({ message: "Fitness goal saved. Proceed to Activity Level." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/activity-level", async (req, res) => {
  try {
    const { email, activityLevel } = req.body;
    if (!tempProfiles.has(email)) return res.status(400).json({ message: "Start from step 1." });

    tempProfiles.get(email).activityLevel = activityLevel;
    res.status(201).json({ message: "Activity level saved. Proceed to Medical Info." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/medical-info", async (req, res) => {
  try {
    const { email, medicalConditions, medications, heartCondition, injuries, emergencyContact } = req.body;
    if (!tempProfiles.has(email)) return res.status(400).json({ message: "Start from step 1." });

    const profileData = tempProfiles.get(email);

    const profile = new TraineeProfile({
      email,
      gender: profileData.gender,
      dateOfBirth: profileData.dateOfBirth,
      weight: profileData.weight,
      height: profileData.height,
      fitnessGoal: profileData.fitnessGoal,
      activityLevel: profileData.activityLevel,
      medicalInfo: {
        medicalConditions,
        medications,
        heartCondition,
        injuries,
        emergencyContact,
      },
    });

    await profile.save();
    tempProfiles.delete(email);

    res.status(201).json({ message: "Profile completed. Please log in now." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;