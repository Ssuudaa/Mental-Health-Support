const express = require("express");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      req.body,
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Booking.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
