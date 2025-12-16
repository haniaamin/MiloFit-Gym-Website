const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Update profile
router.put('/api/profile', async (req, res) => {
  const { email, fullName, phoneNumber, emergencyContact, nationalId, password } = req.body;

  // Validate required fields
  if (!email || !fullName || !phoneNumber || !emergencyContact || !nationalId || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find the user by email and update their profile
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { fullName, phoneNumber, emergencyContact, nationalId, password },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;