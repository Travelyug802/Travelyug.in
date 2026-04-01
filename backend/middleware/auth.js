'use strict';
const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'Unauthorized: no token.' });

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const admin   = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive)
      return res.status(401).json({ success: false, message: 'Admin not found or inactive.' });

    req.admin = admin;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Session expired.' : 'Invalid token.';
    return res.status(401).json({ success: false, message: msg });
  }
};

module.exports = { protect };
