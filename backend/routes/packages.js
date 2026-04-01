'use strict';
const router  = require('express').Router();
const ctrl    = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.get('/',           ctrl.getPackages);
router.get('/admin/all',  protect, ctrl.getAll);
router.get('/:id',        ctrl.getPackage);
router.post('/',          protect, upload.single('itineraryPdf'), ctrl.create);
router.put('/:id',        protect, upload.single('itineraryPdf'), ctrl.update);
router.delete('/:id',     protect, ctrl.remove);

module.exports = router;
/* ── trip date seat management ── */
router.post('/:id/book-seat',    ctrl.bookSeat);                  // public
router.put('/:id/trip-dates',    protect, ctrl.updateTripDates);  // admin
