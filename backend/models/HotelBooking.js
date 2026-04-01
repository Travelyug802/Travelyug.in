'use strict';
const mongoose = require('mongoose');

const hotelBookingSchema = new mongoose.Schema({
  // Customer
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, lowercase: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  // Hotel
  hotelId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  hotelName:  { type: String, trim: true },
  // Stay
  checkIn:    { type: Date, required: true },
  checkOut:   { type: Date, required: true },
  guests:     { type: Number, required: true, min: 1, max: 20, default: 1 },
  rooms:      { type: Number, required: true, min: 1, default: 1 },
  // Price
  totalPrice: { type: Number, required: true, min: 0 },
  // Admin
  status:     { type: String, enum: ['new','confirmed','cancelled','checked_in','checked_out'], default: 'new' },
  adminNotes: { type: String, trim: true },
  isRead:     { type: Boolean, default: false },
  message:    { type: String, trim: true, maxlength: 1000 },
  ipAddress:  String
}, { timestamps: true });

hotelBookingSchema.index({ status: 1, createdAt: -1 });
hotelBookingSchema.index({ hotelId: 1 });
hotelBookingSchema.index({ isRead: 1 });

module.exports = mongoose.model('HotelBooking', hotelBookingSchema);
