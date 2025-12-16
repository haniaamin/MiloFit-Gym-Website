const express = require('express');
const router = express.Router();
const ClassBooking = require('../models/ClassBooking');

// Create class booking (no userId)
router.post('/', async (req, res) => {
  try {
    const { className, time } = req.body;
    const newBooking = new ClassBooking({ className, time });
    const saved = await newBooking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to book class' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await ClassBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    await ClassBooking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Update booking time
router.put('/:id', async (req, res) => {
  try {
    const updated = await ClassBooking.findByIdAndUpdate(
      req.params.id,
      { time: req.body.time },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

module.exports = router;