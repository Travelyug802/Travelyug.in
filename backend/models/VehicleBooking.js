'use strict';
const mongoose = require('mongoose');

const vehicleBookingSchema = new mongoose.Schema({
  // Customer
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, required: true, trim: true },
  // Vehicle
  vehicleId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleName: { type: String, trim: true },
  // Rental period
  startDate:   { type: Date, required: true },
  endDate:     { type: Date, required: true },
  // Price
  totalPrice:  { type: Number, required: true, min: 0 },
  // Admin
  status:      { type: String, enum: ['new','confirmed','cancelled','active','returned'], default: 'new' },
  adminNotes:  { type: String, trim: true },
  isRead:      { type: Boolean, default: false },
  message:     { type: String, trim: true, maxlength: 1000 },
  pickupLocation:  { type: String, trim: true },
  dropoffLocation: { type: String, trim: true },
  ipAddress:   String
}, { timestamps: true });

vehicleBookingSchema.index({ status: 1, createdAt: -1 });
vehicleBookingSchema.index({ vehicleId: 1 });
vehicleBookingSchema.index({ isRead: 1 });

module.exports = mongoose.model('VehicleBooking', vehicleBookingSchema);
