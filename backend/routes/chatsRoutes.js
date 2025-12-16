const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// Get all trainers for trainees
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all trainees for trainers
router.get('/trainees', async (req, res) => {
  try {
    const trainees = await User.find({ role: 'trainee' }).select('-password');
    res.json(trainees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or get existing conversation between trainee and trainer
router.post('/conversation', async (req, res) => {
  const { traineeId, trainerId } = req.body;
  if (!traineeId || !trainerId) {
    return res.status(400).json({ message: 'traineeId and trainerId are required' });
  }

  try {
    let convo = await Conversation.findOne({
      participants: { $all: [traineeId, trainerId] },
    });

    if (!convo) {
      convo = new Conversation({ participants: [traineeId, trainerId] });
      await convo.save();
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get messages of a conversation
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ time: 1 })
      .populate('sender', 'firstName lastName role');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new message
router.post('/message', async (req, res) => {
  const { conversationId, sender, text } = req.body;

  if (!conversationId || !sender || !text) {
    return res.status(400).json({ message: 'conversationId, sender and text are required' });
  }

  try {
    const newMessage = new Message({
      conversationId,
      sender: sender._id,
      text,
      time: Date.now(),
    });

    await newMessage.save();

    // Populate sender details
    await newMessage.populate('sender', 'firstName lastName role');

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
