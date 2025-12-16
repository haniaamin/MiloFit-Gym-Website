const express = require('express');
const router = express.Router();
const AddPackage = require('../models/AddPackages');

// GET: all packages
router.get('/', async (req, res) => {
  try {
    const packages = await AddPackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

// POST: add new package
router.post('/add', async (req, res) => {
  try {
    const pkg = new AddPackage(req.body);
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add package' });
  }
});

// DELETE: delete package
router.delete('/delete/:id', async (req, res) => {
  try {
    await AddPackage.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete package' });
  }
});

// PUT: update package
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await AddPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update package' });
  }
});

module.exports = router;