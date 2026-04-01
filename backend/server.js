'use strict';
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

/* ── database ──────────────────────────────── */
connectDB();

const app = express();

/* ── security headers ──────────────────────── */
app.use(helmet());

/* ── global rate-limit ─────────────────────── */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests – try again later.' }
}));

/* ── cors ───────────────────────────────────── */
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

/* ── body parsing ───────────────────────────── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));

/* ── static files ───────────────────────────── */
app.use('/uploads', require('express').static(require('path').join(__dirname, 'uploads')));

/* ── request logging (dev only) ─────────────── */
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

/* ── health check ───────────────────────────── */
app.get('/api/health', (_req, res) => res.json({
  success: true,
  message: 'Travelyug API is running',
  timestamp: new Date().toISOString()
}));

/* ── routes ─────────────────────────────────── */
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/packages',     require('./routes/packages'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/gallery',      require('./routes/gallery'));
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/hotels',       require('./routes/hotels'));
app.use('/api/vehicles',     require('./routes/vehicles'));

/* ── 404 ────────────────────────────────────── */
app.use((req, res) => res.status(404).json({
  success: false, message: `Route ${req.method} ${req.originalUrl} not found`
}));

/* ── global error handler ───────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).reduce((a, e) => ({ ...a, [e.path]: e.message }), {});
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }
  if (err.name === 'CastError')
    return res.status(400).json({ success: false, message: `Invalid ${err.path}: ${err.value}` });
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ success: false, message: 'Session expired, please log in again.' });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ── start ──────────────────────────────────── */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀  Travelyug API →  http://localhost:${PORT}`);
  console.log(`📦  Mode         →  ${process.env.NODE_ENV}`);
  console.log(`🔗  Health       →  http://localhost:${PORT}/api/health\n`);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;

