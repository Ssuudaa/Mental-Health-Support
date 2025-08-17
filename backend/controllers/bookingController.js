const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { doctor, location, date, timeSlot, notes } = req.body;

    const booking = await Booking.create({
      doctor,
      location,
      date,
      timeSlot,
      notes,
      user: req.user.id
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};


exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email');
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};


exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error.message);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};
