'use strict';
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travelyug/itineraries',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: (req, file) => `itinerary-${Date.now()}`
  }
});

module.exports = multer({ storage });