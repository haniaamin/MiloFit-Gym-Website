const express = require('express');
const router = express.Router();
const TrainerSession = require('../models/TrainerSessions');

// GET all sessions
router.get('/', async (req, res) => {
  const sessions = await TrainerSession.find();
  res.json(sessions);
});

// POST new session
router.post('/', async (req, res) => {
  try {
    const session = new TrainerSession(req.body);
    await session.save();
    res.status(201).json({ message: 'Session saved successfully!' });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ message: 'Failed to save session.' });
  }
});

// PUT update session
router.put('/:id', async (req, res) => {
  try {
    await TrainerSession.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Session updated successfully!' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ message: 'Failed to update session.' });
  }
});

// DELETE session
router.delete('/:id', async (req, res) => {
  try {
    await TrainerSession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session cancelled successfully!' });
  } catch (err) {
    console.error('❌ Cancel error:', err);
    res.status(500).json({ message: 'Failed to cancel session.' });
  }
});


module.exports = router;