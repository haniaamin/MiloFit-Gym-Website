const express = require("express");
const TrainerProfile = require("../models/TrainerProfile");
const TrainerGoal = require("../models/TrainerGoal");
const AddTraineeModel = require("../models/AddTrainee");

const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    }
  },
});

const tempProfiles = new Map();

router.post("/complete-profile-trainer", async (req, res) => {
  try {
    const { email, gender, month, date, year, weight, height, expertise, experience, certifications } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    tempProfiles.set(email, {
      gender,
      dateOfBirth: { month, date, year },
      weight,
      height,
      expertise,
      experience,
      certifications,
      profilePicture: null,
    });

    res.status(201).json({ message: "Profile saved. Proceed to Profile Picture upload." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/profile-picture", upload.single("profilePicture"), async (req, res) => {
  try {
    const email = req.body.email;

    if (!tempProfiles.has(email)) {
      return res.status(400).json({ message: "Profile not found. Start from step 1." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    tempProfiles.get(email).profilePicture = `/uploads/${req.file.filename}`;

    res.status(201).json({ message: "Profile picture uploaded. Proceed to Final Submission." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/final-submit", async (req, res) => {
  try {
    const { email } = req.body;

    if (!tempProfiles.has(email)) {
      return res.status(400).json({ message: "Profile not found. Start from step 1." });
    }

    const profileData = tempProfiles.get(email);

    const profile = new TrainerProfile({
      email,
      gender: profileData.gender,
      dateOfBirth: profileData.dateOfBirth,
      weight: profileData.weight,
      height: profileData.height,
      expertise: profileData.expertise,
      experience: profileData.experience,
      certifications: profileData.certifications,
      profilePicture: profileData.profilePicture,
    });

    await profile.save();
    tempProfiles.delete(email);
    res.status(201).json({ message: "Trainer profile completed. Please log in now." });
  } catch (error) {
    console.error("Error saving trainer profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post('/save-goal', async (req, res) => {
  try {
    const { email, goal } = req.body;

    if (!goal) {
      return res.status(400).json({ message: 'Goal is required' });
    }

    const newGoal = new TrainerGoal({ trainerEmail: email || null, goal });
    await newGoal.save();

    res.status(201).json({ message: 'Goal saved successfully', goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: 'Error saving goal', error: error.message });
  }
});

router.get('/goals', async (req, res) => {
  try {
    const goals = await TrainerGoal.find().sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
});

router.post('/trainee/add', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      package,
      startDate,
      endDate,
      status,
      trainerEmail
    } = req.body;

    if (!trainerEmail) {
      return res.status(400).json({ message: 'Trainer email is required' });
    }

    const trainee = new AddTraineeModel({
      trainerEmail,
      name,
      email,
      phone,
      package,
      startDate,
      endDate,
      status
    });

    await trainee.save();
    res.status(201).json(trainee);
  } catch (error) {
    console.error('Error adding trainee:', error);
    res.status(500).json({ message: 'Error adding trainee', error: error.message });
  }
});

router.get('/trainee/list', async (req, res) => {
  const { trainerEmail } = req.query;
  if (!trainerEmail) return res.status(400).json({ message: "Missing trainerEmail" });

  try {
    const trainees = await AddTraineeModel.find({ trainerEmail });
    res.status(200).json(trainees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainees', error: error.message });
  }
});

router.put('/trainee/update/:id', async (req, res) => {
  const { trainerEmail } = req.body;
  if (!trainerEmail) return res.status(400).json({ message: "Missing trainerEmail" });

  try {
    const updated = await AddTraineeModel.findOneAndUpdate(
      { _id: req.params.id, trainerEmail },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(403).json({ message: "Unauthorized" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.delete('/trainee/remove/:id', async (req, res) => {
  const { trainerEmail } = req.body;
  if (!trainerEmail) return res.status(400).json({ message: "Missing trainerEmail" });

  try {
    const deleted = await AddTraineeModel.findOneAndDelete({
      _id: req.params.id,
      trainerEmail
    });

    if (!deleted) return res.status(403).json({ message: "Unauthorized" });
    res.json({ message: "Trainee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;