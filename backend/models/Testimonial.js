'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  location:     { type: String, trim: true },
  avatar:       { type: String, trim: true },
  review:       { type: String, required: true, trim: true, maxlength: 2000 },
  rating:       { type: Number, required: true, min: 1, max: 5, default: 5 },
  packageName:  { type: String, trim: true },
  // ── NEW: source tracking ──────────────────
  source:       { type: String, enum: ['website', 'google', 'tripadvisor', 'facebook'], default: 'website' },
  reviewDate:   { type: String, trim: true },   // e.g. "March 2024"
  profileUrl:   { type: String, trim: true },   // optional link to Google profile
  // ─────────────────────────────────────────
  isFeatured:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  sortOrder:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', schema);
