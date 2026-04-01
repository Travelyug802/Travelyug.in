'use strict';
const router      = require('express').Router();
const ctrl        = require('../controllers/otherControllers');
const { protect } = require('../middleware/auth');

router.get('/',          ctrl.getGallery);
router.get('/admin/all', protect, ctrl.getAllGalleryAdmin);
router.post('/',         protect, ctrl.createGalleryImage);
router.put('/:id',       protect, ctrl.updateGalleryImage);
router.delete('/:id',    protect, ctrl.deleteGalleryImage);

module.exports = router;
