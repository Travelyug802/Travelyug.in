'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  imageUrl:    { type: String, required: true, trim: true },
  category:    { type: String, enum: ['beaches','mountains','heritage','wildlife','adventure','city','food','culture'], default: 'city' },
  destination: { type: String, trim: true },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', schema);
