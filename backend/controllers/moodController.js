const Mood = require("../models/Mood");

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMood = async (req, res) => {
  try {
    const { mood, notes } = req.body;
    const newMood = new Mood({ mood, notes });
    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMood = async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: "Mood deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
