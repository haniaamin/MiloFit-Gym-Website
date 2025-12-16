const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// GET subscription details by userId
router.get('/:userId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.params.userId });
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found.' });
    }
    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
