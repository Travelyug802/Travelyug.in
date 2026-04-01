'use strict';
const Booking = require('../models/Booking');
const Package = require('../models/Package');

/* POST /api/bookings  – public */
exports.create = async (req, res, next) => {
  try {
    const { name, email, phone, destination, travelDate, travelers, message, packageId, packageName } = req.body;
    if (!name || !email || !phone || !destination || !travelDate || !travelers)
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });

    await Booking.create({ name, email, phone, destination, travelDate, travelers, message, packageId: packageId || null, packageName, ipAddress: req.ip });
    res.status(201).json({ success: true, message: 'Thank you! Your inquiry has been received. We will contact you within 24 hours.' });
  } catch (err) { next(err); }
};

/* GET /api/bookings  – admin */
exports.getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const lim   = parseInt(limit) || 20;
    const skip  = (parseInt(page) - 1) * lim;
    const [bookings, total] = await Promise.all([
      Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(lim).lean(),
      Booking.countDocuments(query)
    ]);
    res.json({ success: true, data: { bookings, pagination: { total, page: parseInt(page), pages: Math.ceil(total / lim) } } });
  } catch (err) { next(err); }
};

/* GET /api/bookings/stats  – admin */
exports.stats = async (req, res, next) => {
  try {
    const [total, newCount, confirmed, unread, totalPkg, activePkg, recent] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'new' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ isRead: false }),
      Package.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);
    const sixAgo   = new Date(); sixAgo.setMonth(sixAgo.getMonth() - 6);
    const monthly  = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json({ success: true, data: {
      bookings: { total, new: newCount, confirmed, unread },
      packages: { total: totalPkg, active: activePkg },
      recentBookings: recent, monthlyBookings: monthly
    }});
  } catch (err) { next(err); }
};

/* GET /api/bookings/:id  – admin */
exports.getOne = async (req, res, next) => {
  try {
    const b = await Booking.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: b });
  } catch (err) { next(err); }
};

/* PUT /api/bookings/:id  – admin */
exports.update = async (req, res, next) => {
  try {
    const allowed = ['status','adminNotes','isRead'];
    const update  = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const b = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking updated.', data: b });
  } catch (err) { next(err); }
};

/* DELETE /api/bookings/:id  – admin */
exports.remove = async (req, res, next) => {
  try {
    const b = await Booking.findByIdAndDelete(req.params.id);
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) { next(err); }
};
