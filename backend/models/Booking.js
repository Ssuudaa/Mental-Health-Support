const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: String, required: true },     
  location: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String },
  status: { type: String, default: "confirmed" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
