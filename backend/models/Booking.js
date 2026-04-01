'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  travelDate:  { type: Date,   required: true },
  travelers:   { type: Number, required: true, min: 1, max: 50 },
  message:     { type: String, trim: true, maxlength: 2000 },
  packageId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
  packageName: { type: String, trim: true },
  status:      { type: String, enum: ['new','contacted','confirmed','cancelled'], default: 'new' },
  adminNotes:  { type: String, trim: true },
  isRead:      { type: Boolean, default: false },
  ipAddress:   String
}, { timestamps: true });

schema.index({ status: 1, createdAt: -1 });
schema.index({ isRead: 1 });
module.exports = mongoose.model('Booking', schema);
