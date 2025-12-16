// routes/notifications.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');

// Add new notification
router.post('/', async (req, res) => {
  try {
    const { recipients, type, message } = req.body;
    const newNotification = new Notification({ recipients, type, message });
    await newNotification.save();
    res.status(201).json({ message: 'Notification saved' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get notifications for current user role
router.get('/', async (req, res) => {
  try {
    const userRole = req.query.role; // "Trainer" or "Trainee"
    let filter;

    if (userRole === 'Trainer') {
      filter = { recipients: { $in: ['Trainers', 'All Users'] } };
    } else if (userRole === 'Trainee') {
      filter = { recipients: { $in: ['Trainees', 'All Users'] } };
    } else {
      filter = {}; // or empty
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(10);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notifications

router.delete('/deletenotifications', authMiddleware, async (req, res) => {
  try {
const role = req.user.role?.toLowerCase(); // normalize to lowercase
    console.log("User role:", role); // Debug
let filter;
if (role === 'trainer') {
  filter = { recipients: { $in: ['Trainers', 'All Users'] } };
} else if (role === 'trainee') {
  filter = { recipients: { $in: ['Trainees', 'All Users'] } };
} else {
  return res.status(400).json({ message: "Invalid user role" });
}


    const result = await Notification.deleteMany(filter);
    console.log("Deleted notifications:", result.deletedCount); // Debug

    res.status(200).json({ message: "Notifications deleted" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Server error deleting notifications" });
  }
});



module.exports = router;
