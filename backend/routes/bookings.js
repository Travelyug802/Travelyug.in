'use strict';
const router  = require('express').Router();
const ctrl    = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const rateLimit   = require('express-rate-limit');

const bookingLimiter = rateLimit({ windowMs: 60*60*1000, max: 5, message: { success: false, message: 'Too many booking requests.' } });

router.post('/',        bookingLimiter, ctrl.create);
router.get('/stats',    protect, ctrl.stats);
router.get('/',         protect, ctrl.getAll);
router.get('/:id',      protect, ctrl.getOne);
router.put('/:id',      protect, ctrl.update);
router.delete('/:id',   protect, ctrl.remove);

module.exports = router;
