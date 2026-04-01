'use strict';
const router      = require('express').Router();
const ctrl        = require('../controllers/hotelController');
const { protect } = require('../middleware/auth');

/* ── public ── */
router.get('/',          ctrl.getHotels);
router.get('/:id',       ctrl.getHotel);
router.post('/book',     ctrl.bookingLimiter, ctrl.createBooking);

/* ── admin: hotels ── */
router.get('/admin/all', protect, ctrl.getAllAdmin);
router.post('/',         protect, ctrl.create);
router.put('/:id',       protect, ctrl.update);
router.delete('/:id',    protect, ctrl.remove);

/* ── admin: bookings ── */
router.get('/admin/bookings',        protect, ctrl.getAllBookings);
router.get('/admin/bookings/:id',    protect, ctrl.getBooking);
router.put('/admin/bookings/:id',    protect, ctrl.updateBooking);
router.delete('/admin/bookings/:id', protect, ctrl.deleteBooking);

module.exports = router;
