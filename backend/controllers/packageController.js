'use strict';
const path    = require('path');
const fs      = require('fs');
const Package = require('../models/Package');

exports.getPackages = async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category;
    if (featured === 'true')            query.isFeatured = true;
    if (search)                         query.$text = { $search: search.slice(0, 100) };
    const lim  = Math.min(parseInt(limit) || 12, 50);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * lim;
    const [packages, total] = await Promise.all([
      Package.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(lim).select('-itinerary').lean(),
      Package.countDocuments(query)
    ]);
    res.json({ success: true, data: { packages, pagination: { total, page: parseInt(page)||1, limit: lim, pages: Math.ceil(total / lim) } } });
  } catch (err) { next(err); }
};

exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findOne({ _id: req.params.id, isActive: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
    res.json({ success: true, data: pkg });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const packages = await Package.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: packages });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = req.file && req.body.packageData ? JSON.parse(req.body.packageData) : { ...req.body };
    if (req.file) {
      data.itineraryPdf = `/uploads/itineraries/${req.file.filename}`;
    }
    const pkg = await Package.create(data);
    res.status(201).json({ success: true, message: 'Package created.', data: pkg });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("IMAGES TYPE BEFORE:", typeof req.body.images);

    // Step 1: Prepare data
    let data;

    if (req.file && req.body.packageData) {
      data = JSON.parse(req.body.packageData);
    } else {
      data = { ...req.body };
    }

    // 🔥 Step 2: FIX all JSON string fields (FormData issue)
const fieldsToParse = ["images", "itinerary", "highlights", "inclusions"];

fieldsToParse.forEach((field) => {
  if (data[field] && typeof data[field] === "string") {
    try {
      data[field] = JSON.parse(data[field]);
    } catch (err) {
      console.log(`${field} parse error:`, err);
    }
  }
});

// Debug logs (optional but useful)
console.log("IMAGES TYPE AFTER:", typeof data.images);
console.log("ITINERARY TYPE AFTER:", typeof data.itinerary);

    // Step 3: Handle PDF
    if (req.file) {
      const existing = await Package.findById(req.params.id)
        .select('itineraryPdf')
        .lean();

      if (existing?.itineraryPdf) {
        const oldPath = path.join(__dirname, '..', existing.itineraryPdf);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      data.itineraryPdf = `/uploads/itineraries/${req.file.filename}`;
    }

    // Step 4: Update
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: false }
    );

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found.'
      });
    }

    res.json({
      success: true,
      message: 'Package updated.',
      data: pkg
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
    res.json({ success: true, message: 'Package deactivated.' });
  } catch (err) { next(err); }
};

/* ─── TRIP DATE SEAT BOOKING ────────────────── */

/**
 * POST /api/packages/:id/book-seat
 * Body: { tripDateId, seats, name, email, phone }
 * Increments bookedSeats, recalculates status, prevents overbooking
 */
exports.bookSeat = async (req, res, next) => {
  try {
    const { tripDateId, seats = 1, name, email, phone } = req.body;
    if (!tripDateId || !name || !email || !phone)
      return res.status(400).json({ success: false, message: 'tripDateId, name, email, phone are required.' });

    const pkg = await Package.findOne({ _id: req.params.id, isActive: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

    const tripDate = pkg.tripDates.id(tripDateId);
    if (!tripDate) return res.status(404).json({ success: false, message: 'Trip date not found.' });

    const requested = parseInt(seats) || 1;
    const remaining = tripDate.totalSeats - tripDate.bookedSeats;
    if (requested > remaining)
      return res.status(400).json({ success: false, message: `Only ${remaining} seat(s) remaining for this date.` });

    tripDate.bookedSeats += requested;

    // Recompute status unless manual override
    if (!tripDate.isManualOverride) {
      tripDate.status = Package.computeTripDateStatus(tripDate.totalSeats, tripDate.bookedSeats);
    }

    await pkg.save();

    // Create a linked booking record
    const Booking = require('../models/Booking');
    await Booking.create({
      name, email,
      phone: phone || '',
      destination: pkg.location,
      travelDate: tripDate.date,
      travelers: requested,
      packageId: pkg._id,
      packageName: pkg.title,
      message: `Trip date booking – ${requested} seat(s)`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `${requested} seat(s) booked successfully!`,
      data: {
        tripDate: {
          date: tripDate.date,
          bookedSeats: tripDate.bookedSeats,
          totalSeats: tripDate.totalSeats,
          remaining: tripDate.totalSeats - tripDate.bookedSeats,
          status: tripDate.status
        }
      }
    });
  } catch (err) { next(err); }
};

/**
 * PUT /api/packages/:id/trip-dates  (admin)
 * Replace all trip dates for a package
 */
exports.updateTripDates = async (req, res, next) => {
  try {
    let { tripDates } = req.body;
    if (typeof tripDates === 'string') { try { tripDates = JSON.parse(tripDates); } catch {} }

    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

    // Auto-compute status for non-manual dates
    pkg.tripDates = (tripDates || []).map(td => {
      if (!td.isManualOverride) {
        td.status = Package.computeTripDateStatus(td.totalSeats || 20, td.bookedSeats || 0);
      }
      return td;
    });

    await pkg.save();
    res.json({ success: true, message: 'Trip dates updated.', data: pkg.tripDates });
  } catch (err) { next(err); }
};
