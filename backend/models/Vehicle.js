'use strict';
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  type:             { type: String, enum: ['car','bike','bus','van','suv'], required: true },
  pricePerDay:      { type: Number, required: true, min: 0 },
  discountedPrice:  { type: Number, min: 0, default: null },
  images:           [{ url: String, alt: { type: String, default: '' }, isPrimary: { type: Boolean, default: false } }],
  fuelType:         { type: String, enum: ['petrol','diesel','electric','cng','hybrid'], default: 'petrol' },
  seatingCapacity:  { type: Number, required: true, min: 1, default: 5 },
  transmission:     { type: String, enum: ['manual','automatic'], default: 'manual' },
  available:        { type: Boolean, default: true },
  isActive:         { type: Boolean, default: true },
  isFeatured:       { type: Boolean, default: false },
  features:         [{ type: String, trim: true }],
  location:         { type: String, trim: true }
}, { timestamps: true });

vehicleSchema.index({ type: 1, isActive: 1 });
vehicleSchema.index({ available: 1, isActive: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);
