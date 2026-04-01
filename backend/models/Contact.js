'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, required: true, lowercase: true, trim: true },
  phone:   { type: String, trim: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  isRead:  { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Contact', schema);
