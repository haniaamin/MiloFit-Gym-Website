const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// ➤ Save a new opinion
router.post("/add-feedback", async (req, res) => {
  try {
    const { name, opinion, rating } = req.body;
    const feedback = new Feedback({ name, opinion, rating });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ➤ Get all feedback
router.get("/get-feedback", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ date: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
