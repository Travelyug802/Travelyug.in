'use strict';
const Testimonial = require('../models/Testimonial');
const Gallery     = require('../models/Gallery');
const Contact     = require('../models/Contact');
const rateLimit   = require('express-rate-limit');

/* ═══════════════════ TESTIMONIALS ═══════════════════ */
exports.getTestimonials = async (req, res, next) => {
  try {
    const q = { isActive: true };
    if (req.query.featured === 'true') q.isFeatured = true;
    const data = await Testimonial.find(q).sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
exports.getAllTestimonialsAdmin = async (req, res, next) => {
  try { res.json({ success: true, data: await Testimonial.find().sort({ createdAt: -1 }).lean() }); }
  catch (err) { next(err); }
};
exports.createTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ success: true, message: 'Review added.', data: t });
  } catch (err) { next(err); }
};
exports.updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Updated.', data: t });
  } catch (err) { next(err); }
};
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) { next(err); }
};

/* ═══════════════════ GALLERY ═══════════════════ */
exports.getGallery = async (req, res, next) => {
  try {
    const q = { isActive: true };
    if (req.query.category && req.query.category !== 'all') q.category = req.query.category;
    res.json({ success: true, data: await Gallery.find(q).sort({ sortOrder: 1, createdAt: -1 }).limit(100).lean() });
  } catch (err) { next(err); }
};
exports.getAllGalleryAdmin = async (req, res, next) => {
  try { res.json({ success: true, data: await Gallery.find().sort({ createdAt: -1 }).lean() }); }
  catch (err) { next(err); }
};
exports.createGalleryImage = async (req, res, next) => {
  try {
    const img = await Gallery.create(req.body);
    res.status(201).json({ success: true, message: 'Image added.', data: img });
  } catch (err) { next(err); }
};
exports.updateGalleryImage = async (req, res, next) => {
  try {
    const img = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!img) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Updated.', data: img });
  } catch (err) { next(err); }
};
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const img = await Gallery.findByIdAndDelete(req.params.id);
    if (!img) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) { next(err); }
};

/* ═══════════════════ CONTACT ═══════════════════ */
exports.contactLimiter = rateLimit({ windowMs: 60*60*1000, max: 5, message: { success: false, message: 'Too many messages, try later.' } });

exports.sendMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Message received! We will get back to you soon.' });
  } catch (err) { next(err); }
};
exports.getMessages = async (req, res, next) => {
  try { res.json({ success: true, data: await Contact.find().sort({ createdAt: -1 }).lean() }); }
  catch (err) { next(err); }
};
exports.markRead = async (req, res, next) => {
  try { await Contact.findByIdAndUpdate(req.params.id, { isRead: true }); res.json({ success: true }); }
  catch (err) { next(err); }
};
exports.deleteMessage = async (req, res, next) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Deleted.' }); }
  catch (err) { next(err); }
};
