'use strict';
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  location:        { type: String, required: true, trim: true },
  description:     { type: String, trim: true },
  pricePerNight:   { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, min: 0, default: null },
  images:          [{ url: String, alt: { type: String, default: '' }, isPrimary: { type: Boolean, default: false } }],
  amenities:       [{ type: String, trim: true }],
  roomsAvailable:  { type: Number, required: true, min: 0, default: 10 },
  starRating:      { type: Number, min: 1, max: 5, default: 3 },
  category:        { type: String, enum: ['budget','standard','deluxe','luxury'], default: 'standard' },
  isActive:        { type: Boolean, default: true },
  isFeatured:      { type: Boolean, default: false }
}, { timestamps: true });

hotelSchema.index({ location: 1, isActive: 1 });
hotelSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
