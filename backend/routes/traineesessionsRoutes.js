const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed

// GET all approved trainers (only firstName, lastName)
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer', status: 'approved' }).select('firstName lastName');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers' });
  }
});

router.get('/trainees', async (req, res) => {
  try {
    const trainees = await User.find({ role: 'trainee', status: 'approved' }).select('firstName lastName');
    res.json(trainees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainees' });
  }
});
module.exports = router;
