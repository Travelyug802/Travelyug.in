'use strict';
const express   = require('express');
const rateLimit = require('express-rate-limit');
const ctrl      = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router    = express.Router();

const loginLimiter    = rateLimit({ windowMs: 15*60*1000, max: 10, message: { success: false, message: 'Too many login attempts.' } });
const registerLimiter = rateLimit({ windowMs: 60*60*1000, max: 5,  message: { success: false, message: 'Too many registration attempts.' } });

router.post('/login',               loginLimiter,    ctrl.login);
router.get('/me',         protect,                   ctrl.getMe);
router.post('/register',  protect,  registerLimiter, ctrl.register);
router.get('/admins',     protect,                   ctrl.listAdmins);
router.delete('/admins/:id', protect,                ctrl.deleteAdmin);
router.patch('/admins/:id/toggle', protect,          ctrl.toggleAdmin);

module.exports = router;
