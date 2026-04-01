'use strict';
const router      = require('express').Router();
const ctrl        = require('../controllers/otherControllers');
const { protect } = require('../middleware/auth');

router.get('/',          ctrl.getTestimonials);
router.get('/admin/all', protect, ctrl.getAllTestimonialsAdmin);
router.post('/',         protect, ctrl.createTestimonial);
router.put('/:id',       protect, ctrl.updateTestimonial);
router.delete('/:id',    protect, ctrl.deleteTestimonial);

module.exports = router;
