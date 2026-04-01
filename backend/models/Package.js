'use strict';
const mongoose = require('mongoose');

/* ── helper ──────────────────────────────────── */
function computeStatus(totalSeats, bookedSeats) {
  const remaining = totalSeats - bookedSeats;
  if (remaining <= 3) return 'red';
  if (remaining / totalSeats <= 0.5) return 'orange';
  return 'green';
}

const tripDateSchema = new mongoose.Schema({
  date:             { type: Date, required: true },
  totalSeats:       { type: Number, required: true, min: 1, default: 20 },
  bookedSeats:      { type: Number, default: 0, min: 0 },
  status:           { type: String, enum: ['green','orange','red'], default: 'green' },
  isManualOverride: { type: Boolean, default: false }
}, { _id: true });

const packageSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true },
  slug:             { type: String, unique: true, lowercase: true },
  shortDescription: { type: String, trim: true, maxlength: 300 },
  description:      { type: String, required: true, trim: true },
  price:            { type: Number, required: true, min: 0 },
  discountedPrice:  { type: Number, min: 0, default: null },
  duration:         { type: String, required: true, trim: true },
  location:         { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['domestic','international','adventure','honeymoon','family','pilgrimage','luxury'],
    default: 'domestic'
  },
  images: [{
    url:       { type: String, required: true },
    alt:       { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  highlights:   [String],
  inclusions:   [String],
  exclusions:   [String],
  itinerary: [{
    day:           Number,
    title:         String,
    description:   String,
    meals:         String,
    accommodation: String
  }],
  tripDates:    [tripDateSchema],
  isFeatured:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  rating:       { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:  { type: Number, default: 0 },
  maxGroupSize: { type: Number, default: 15 },
  itineraryPdf: { type: String, default: null }
}, { timestamps: true });

packageSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

packageSchema.statics.computeTripDateStatus = computeStatus;

packageSchema.index({ title: 'text', description: 'text', location: 'text' });
packageSchema.index({ category: 1, isActive: 1 });
packageSchema.index({ isFeatured: 1, isActive: 1 });

module.exports = mongoose.model('Package', packageSchema);
