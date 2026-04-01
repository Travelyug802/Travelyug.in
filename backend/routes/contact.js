'use strict';
const router      = require('express').Router();
const ctrl        = require('../controllers/otherControllers');
const { protect } = require('../middleware/auth');

router.post('/',          ctrl.contactLimiter, ctrl.sendMessage);
router.get('/',           protect, ctrl.getMessages);
router.patch('/:id/read', protect, ctrl.markRead);
router.delete('/:id',     protect, ctrl.deleteMessage);

module.exports = router;
