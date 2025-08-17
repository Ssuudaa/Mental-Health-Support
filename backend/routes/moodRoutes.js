const express = require("express");
const Mood = require("../models/Mood");
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const mood = await Mood.create({
      ...req.body,
      userId: req.user._id 
    });
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const mood = await Mood.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!mood) return res.status(404).json({ error: "Mood not found" });
    res.json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!mood) return res.status(404).json({ error: "Mood not found" });
    res.json({ message: "Mood entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
