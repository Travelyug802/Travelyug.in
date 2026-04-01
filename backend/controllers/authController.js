'use strict';
const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const sign = admin => jwt.sign(
  { id: admin._id, role: admin.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

/* POST /api/auth/login */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    if (!admin.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact super admin.' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: sign(admin),
        admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
      }
    });
  } catch (err) { next(err); }
};

/* GET /api/auth/me */
exports.getMe = (req, res) => res.json({
  success: true,
  data: { id: req.admin._id, name: req.admin.name, email: req.admin.email, role: req.admin.role }
});

/* POST /api/auth/register  ─ protected, superadmin only, max 5 admins */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are all required.' });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });

    // ── MAX 5 ADMINS enforcement ──────────────────────────────────
    const count = await Admin.countDocuments({});
    if (count >= 5)
      return res.status(400).json({ success: false, message: 'Maximum of 5 admin accounts allowed. Delete one first.' });

    // ── Duplicate email check ────────────────────────────────────
    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(409).json({ success: false, message: 'An admin with this email already exists.' });

    const admin = await Admin.create({ name: name.trim(), email: email.toLowerCase(), password });

    res.status(201).json({
      success: true,
      message: `Admin "${name}" created successfully.`,
      data: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) { next(err); }
};

/* GET /api/auth/admins  ─ list all admins (protected) */
exports.listAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({}).select('-password').sort({ createdAt: 1 });
    res.json({ success: true, data: admins });
  } catch (err) { next(err); }
};

/* DELETE /api/auth/admins/:id  ─ delete admin (protected) */
exports.deleteAdmin = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString())
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted.' });
  } catch (err) { next(err); }
};

/* PATCH /api/auth/admins/:id/toggle  ─ activate/deactivate (protected) */
exports.toggleAdmin = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot deactivate yourself.' });
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });
    admin.isActive = !admin.isActive;
    await admin.save({ validateBeforeSave: false });
    res.json({ success: true, message: `Admin ${admin.isActive ? 'activated' : 'deactivated'}.`, data: { isActive: admin.isActive } });
  } catch (err) { next(err); }
};
