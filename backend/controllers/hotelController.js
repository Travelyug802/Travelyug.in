'use strict';
const Hotel        = require('../models/Hotel');
const HotelBooking = require('../models/HotelBooking');
const rateLimit    = require('express-rate-limit');

/* ─── PUBLIC ────────────────────────────────── */

// GET /api/hotels
exports.getHotels = async (req, res, next) => {
  try {
    const { location, category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (category && category !== 'all') query.category = category;
    const lim  = Math.min(parseInt(limit) || 12, 50);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * lim;
    const [hotels, total] = await Promise.all([
      Hotel.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(lim).lean(),
      Hotel.countDocuments(query)
    ]);
    res.json({ success: true, data: { hotels, pagination: { total, page: parseInt(page)||1, limit: lim, pages: Math.ceil(total/lim) } } });
  } catch (err) { next(err); }
};

// GET /api/hotels/:id
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, isActive: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
    res.json({ success: true, data: hotel });
  } catch (err) { next(err); }
};

/* ─── PUBLIC BOOKING ─────────────────────────── */

exports.bookingLimiter = rateLimit({ windowMs: 60*60*1000, max: 5, message: { success: false, message: 'Too many booking requests.' } });

// POST /api/hotels/book
exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, hotelId, checkIn, checkOut, guests = 1, rooms = 1, message } = req.body;
    if (!name || !email || !phone || !hotelId || !checkIn || !checkOut)
      return res.status(400).json({ success: false, message: 'Fill all required fields.' });

    const hotel = await Hotel.findOne({ _id: hotelId, isActive: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
    if (hotel.roomsAvailable < rooms)
      return res.status(400).json({ success: false, message: `Only ${hotel.roomsAvailable} rooms available.` });

    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24)));
    const pricePerNight = hotel.discountedPrice || hotel.pricePerNight;
    const totalPrice    = pricePerNight * nights * rooms;

    const booking = await HotelBooking.create({
      name, email, phone, hotelId,
      hotelName: hotel.name,
      checkIn, checkOut, guests, rooms,
      totalPrice, message,
      ipAddress: req.ip
    });

    // Decrement rooms available
    hotel.roomsAvailable = Math.max(0, hotel.roomsAvailable - rooms);
    await hotel.save();

    res.status(201).json({ success: true, message: 'Hotel booking submitted! We will confirm within 24 hours.', data: { id: booking._id, totalPrice } });
  } catch (err) { next(err); }
};

/* ─── ADMIN ──────────────────────────────────── */

exports.getAllAdmin = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: hotels });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    ['images','amenities'].forEach(f => {
      if (data[f] && typeof data[f] === 'string') { try { data[f] = JSON.parse(data[f]); } catch {} }
    });
    const hotel = await Hotel.create(data);
    res.status(201).json({ success: true, message: 'Hotel created.', data: hotel });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    ['images','amenities'].forEach(f => {
      if (data[f] && typeof data[f] === 'string') { try { data[f] = JSON.parse(data[f]); } catch {} }
    });
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
    res.json({ success: true, message: 'Hotel updated.', data: hotel });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found.' });
    res.json({ success: true, message: 'Hotel deactivated.' });
  } catch (err) { next(err); }
};

/* ─── ADMIN BOOKINGS ─────────────────────────── */

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const lim   = parseInt(limit) || 20;
    const skip  = (parseInt(page)-1)*lim;
    const [bookings, total] = await Promise.all([
      HotelBooking.find(query).populate('hotelId','name location').sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      HotelBooking.countDocuments(query)
    ]);
    res.json({ success: true, data: { bookings, pagination: { total, page: parseInt(page), pages: Math.ceil(total/lim) } } });
  } catch (err) { next(err); }
};

exports.getBooking = async (req, res, next) => {
  try {
    const b = await HotelBooking.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }).populate('hotelId','name location');
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: b });
  } catch (err) { next(err); }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const allowed = ['status','adminNotes','isRead'];
    const update  = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const b = await HotelBooking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking updated.', data: b });
  } catch (err) { next(err); }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    await HotelBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) { next(err); }
};
