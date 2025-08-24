const express = require("express");
const Mood = require("../models/Mood");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { mood, note, date } = req.body;
    const doc = await Mood.create({
      mood,
      note,
      date: date ?? Date.now(),
      user: req.user._id, 
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(200)
      .lean();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { mood, note, date } = req.body;
    const update = {};
    if (mood !== undefined) update.mood = mood;
    if (note !== undefined) update.note = note;
    if (date !== undefined) update.date = date;

    const doc = await Mood.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: "Mood not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!doc) return res.status(404).json({ error: "Mood not found" });
    res.json({ message: "Mood entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
