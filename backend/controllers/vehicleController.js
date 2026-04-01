'use strict';
const Vehicle        = require('../models/Vehicle');
const VehicleBooking = require('../models/VehicleBooking');
const rateLimit      = require('express-rate-limit');

/* ─── PUBLIC ────────────────────────────────── */

exports.getVehicles = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 12 } = req.query;
    const query = { isActive: true, available: true };
    if (type && type !== 'all') query.type = type;
    const lim  = Math.min(parseInt(limit)||12, 50);
    const skip = (Math.max(parseInt(page)||1,1)-1)*lim;
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(lim).lean(),
      Vehicle.countDocuments(query)
    ]);
    res.json({ success: true, data: { vehicles, pagination: { total, page: parseInt(page)||1, limit: lim, pages: Math.ceil(total/lim) } } });
  } catch (err) { next(err); }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findOne({ _id: req.params.id, isActive: true });
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    res.json({ success: true, data: v });
  } catch (err) { next(err); }
};

/* ─── PUBLIC BOOKING ─────────────────────────── */

exports.bookingLimiter = rateLimit({ windowMs: 60*60*1000, max: 5, message: { success: false, message: 'Too many booking requests.' } });

exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, vehicleId, startDate, endDate, pickupLocation, dropoffLocation, message } = req.body;
    if (!name || !email || !phone || !vehicleId || !startDate || !endDate)
      return res.status(400).json({ success: false, message: 'Fill all required fields.' });

    const vehicle = await Vehicle.findOne({ _id: vehicleId, isActive: true, available: true });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not available.' });

    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000*60*60*24)));
    const pricePerDay  = vehicle.discountedPrice || vehicle.pricePerDay;
    const totalPrice   = pricePerDay * days;

    const booking = await VehicleBooking.create({
      name, email, phone, vehicleId,
      vehicleName: vehicle.name,
      startDate, endDate, totalPrice,
      pickupLocation, dropoffLocation, message,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, message: 'Vehicle booking submitted! We will confirm within 24 hours.', data: { id: booking._id, totalPrice, days } });
  } catch (err) { next(err); }
};

/* ─── ADMIN ──────────────────────────────────── */

exports.getAllAdmin = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: vehicles });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    ['images','features'].forEach(f => {
      if (data[f] && typeof data[f] === 'string') { try { data[f] = JSON.parse(data[f]); } catch {} }
    });
    const v = await Vehicle.create(data);
    res.status(201).json({ success: true, message: 'Vehicle created.', data: v });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    ['images','features'].forEach(f => {
      if (data[f] && typeof data[f] === 'string') { try { data[f] = JSON.parse(data[f]); } catch {} }
    });
    const v = await Vehicle.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    res.json({ success: true, message: 'Vehicle updated.', data: v });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    res.json({ success: true, message: 'Vehicle deactivated.' });
  } catch (err) { next(err); }
};

/* ─── ADMIN BOOKINGS ─────────────────────────── */

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const lim   = parseInt(limit)||20;
    const skip  = (parseInt(page)-1)*lim;
    const [bookings, total] = await Promise.all([
      VehicleBooking.find(query).populate('vehicleId','name type').sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      VehicleBooking.countDocuments(query)
    ]);
    res.json({ success: true, data: { bookings, pagination: { total, page: parseInt(page), pages: Math.ceil(total/lim) } } });
  } catch (err) { next(err); }
};

exports.getBooking = async (req, res, next) => {
  try {
    const b = await VehicleBooking.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }).populate('vehicleId','name type');
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: b });
  } catch (err) { next(err); }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const allowed = ['status','adminNotes','isRead'];
    const update  = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const b = await VehicleBooking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking updated.', data: b });
  } catch (err) { next(err); }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    await VehicleBooking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) { next(err); }
};
