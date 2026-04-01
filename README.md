# 🌍 Travelyug — Full-Stack Travel Platform

A production-ready travel agency built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📁 Project Structure

```
travelyug/
├── backend/
│   ├── config/db.js                ← MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                 ← JWT verification
│   │   └── upload.js               ← Multer PDF upload
│   ├── models/
│   │   ├── Admin.js                ← Admin user + bcrypt
│   │   ├── Package.js              ← Packages + tripDates schema
│   │   ├── Booking.js              ← Package inquiries
│   │   ├── Hotel.js                ← Hotel listings
│   │   ├── HotelBooking.js         ← Hotel reservations
│   │   ├── Vehicle.js              ← Vehicles
│   │   ├── VehicleBooking.js       ← Vehicle rentals
│   │   ├── Testimonial.js          ← Reviews
│   │   ├── Gallery.js              ← Gallery
│   │   └── Contact.js              ← Contact messages
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── packageController.js    ← CRUD + bookSeat + updateTripDates
│   │   ├── bookingController.js    ← CRUD + stats
│   │   ├── hotelController.js      ← Hotel + HotelBooking CRUD
│   │   ├── vehicleController.js    ← Vehicle + VehicleBooking CRUD
│   │   └── otherControllers.js     ← Testimonials, Gallery, Contact
│   ├── routes/
│   │   ├── auth.js, packages.js, bookings.js
│   │   ├── hotels.js, vehicles.js
│   │   ├── testimonials.js, gallery.js, contact.js, admin.js
│   ├── scripts/seed.js             ← Demo data seeder
│   ├── uploads/itineraries/        ← PDF storage (static served)
│   ├── server.js                   ← Entry point (port 5000)
│   └── .env                        ← Pre-configured for local use
│
└── frontend/
    └── src/
        ├── api/axios.js            ← Auto-JWT Axios instance
        ├── context/AuthContext.jsx ← Login/logout state
        ├── components/
        │   ├── layout/PublicLayout.jsx  ← Navbar + Footer + WhatsApp
        │   ├── Cards.jsx               ← PackageCard, BookingForm
        │   └── WhatsAppButton.jsx      ← Shared UI primitives
        ├── pages/
        │   ├── HomePage.jsx, PackagesPage.jsx
        │   ├── PackageDetail.jsx        ← Trip date seat booking UI
        │   ├── HotelsPage.jsx           ← Hotel listing + booking modal
        │   ├── VehiclesPage.jsx         ← Vehicle listing + rental modal
        │   ├── GalleryPage.jsx, ReviewsPage.jsx
        │   ├── AboutPage.jsx, ContactPage.jsx
        │   └── BookingPage.jsx, NotFound.jsx
        ├── admin/
        │   ├── AdminLayout.jsx          ← Sidebar with collapsible groups
        │   └── pages/
        │       ├── Dashboard.jsx, Login.jsx
        │       ├── Packages.jsx, TripDates.jsx
        │       ├── Bookings.jsx
        │       ├── Hotels.jsx           ← Hotel CRUD + HotelBookings admin
        │       ├── Vehicles.jsx         ← Vehicle CRUD + VehicleBookings admin
        │       ├── Testimonials.jsx, Gallery.jsx, Contacts.jsx
        ├── App.jsx                 ← All routes
        └── index.css               ← Tailwind + component classes
```

---

## ⚡ Prerequisites

1. **Node.js 18+** → https://nodejs.org
2. **MongoDB** → https://mongodb.com/try/download/community  
   Start it with: `mongod`

---

## 🚀 Quick Start

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run seed      # Create admin + demo data (run once)
npm run dev       # → http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev       # → http://localhost:5173
```

---

## 🔐 Admin Login

**URL:** `http://localhost:5173/admin/login`

| Email | Password |
|-------|----------|
| admin@travelyug.com | Admin@123456 |

---

## 🌐 Public Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/packages` | Tour Packages (search + filter) |
| `/packages/:id` | Package Detail + Trip Date Booking |
| `/hotels` | Hotel Listings + Booking Modal |
| `/vehicles` | Vehicle Rentals + Booking Modal |
| `/gallery` | Photo Gallery |
| `/reviews` | Customer Reviews |
| `/about` | About Us |
| `/contact` | Contact Form |
| `/booking` | Package Inquiry Form |

---

## 🛠️ Admin Panel

| Route | Section |
|-------|---------|
| `/admin/dashboard` | Stats + Monthly Chart |
| `/admin/packages` | Package CRUD |
| `/admin/trip-dates` | Trip Dates & Seat Manager |
| `/admin/bookings` | Package Inquiries |
| `/admin/hotels` | Hotel CRUD |
| `/admin/hotel-bookings` | Hotel Reservations |
| `/admin/vehicles` | Vehicle CRUD |
| `/admin/vehicle-bookings` | Vehicle Rentals |
| `/admin/testimonials` | Reviews |
| `/admin/gallery` | Gallery |
| `/admin/contacts` | Contact Messages |

---

## 📡 API Reference

### Auth
```
POST /api/auth/login              → JWT token
GET  /api/auth/me                 → Current admin (protected)
```

### Packages
```
GET    /api/packages              → Public list (search, category, featured, page)
GET    /api/packages/admin/all    → All packages (protected)
GET    /api/packages/:id          → Single package
POST   /api/packages              → Create (protected, multipart with PDF)
PUT    /api/packages/:id          → Update (protected, multipart with PDF)
DELETE /api/packages/:id          → Soft delete (protected)
POST   /api/packages/:id/book-seat       → Book seats for a trip date (public)
PUT    /api/packages/:id/trip-dates      → Update all trip dates (protected)
```

### Package Bookings
```
POST   /api/bookings              → Submit inquiry (public, rate limited)
GET    /api/bookings              → List with filters (protected)
GET    /api/bookings/stats        → Dashboard stats (protected)
GET    /api/bookings/:id          → Single booking (protected)
PUT    /api/bookings/:id          → Update status/notes (protected)
DELETE /api/bookings/:id          → Delete (protected)
```

### Hotels
```
GET    /api/hotels                → Public list
GET    /api/hotels/:id            → Single hotel
POST   /api/hotels/book           → Create booking (public, rate limited)
GET    /api/hotels/admin/all      → All hotels (protected)
POST   /api/hotels                → Create (protected)
PUT    /api/hotels/:id            → Update (protected)
DELETE /api/hotels/:id            → Deactivate (protected)
GET    /api/hotels/admin/bookings → List hotel bookings (protected)
GET    /api/hotels/admin/bookings/:id → Single (protected)
PUT    /api/hotels/admin/bookings/:id → Update status (protected)
DELETE /api/hotels/admin/bookings/:id → Delete (protected)
```

### Vehicles
```
GET    /api/vehicles              → Public list (available only)
GET    /api/vehicles/:id          → Single vehicle
POST   /api/vehicles/book         → Create rental (public, rate limited)
GET    /api/vehicles/admin/all    → All vehicles (protected)
POST   /api/vehicles              → Create (protected)
PUT    /api/vehicles/:id          → Update (protected)
DELETE /api/vehicles/:id          → Deactivate (protected)
GET    /api/vehicles/admin/bookings → List rentals (protected)
PUT    /api/vehicles/admin/bookings/:id → Update status (protected)
DELETE /api/vehicles/admin/bookings/:id → Delete (protected)
```

### Others
```
GET/POST /api/testimonials        ← Public GET, protected POST
GET/POST /api/gallery             ← Public GET, protected POST
POST     /api/contact             ← Public (rate limited)
GET      /api/contact             ← Protected
POST     /api/admin/seed          ← Seed demo data (protected)
```

---

## 🧩 Feature Details

### Trip Date & Seat Management
- Admin sets departure dates with `totalSeats` per date
- Users pick a date and book seats directly from the package detail page
- Overbooking is prevented server-side
- Status auto-updates: **green** (>50% free) → **orange** (≤50%) → **red** (≤3 remaining)
- Admin can manually override status color with `isManualOverride`

### Hotel Booking Flow
1. User browses hotels → clicks "Book Now"
2. Modal shows check-in/out picker, guests, rooms + live total price
3. Backend validates room availability, calculates price, creates booking
4. Decrements `roomsAvailable` on the hotel document

### Vehicle Rental Flow
1. User browses vehicles → clicks "Rent Now"
2. Modal shows start/end date + live total (days × daily rate)
3. Backend creates VehicleBooking record

### PDF Itinerary
- Upload PDFs via admin Package form
- Stored in `backend/uploads/itineraries/`
- Served statically: `GET /uploads/itineraries/filename.pdf`
- Download button shown on public package detail page

---

## ⚙️ Environment Variables

### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/travelyug
JWT_SECRET=travelyug_super_secret_jwt_key_CHANGE_IN_PRODUCTION_xK9mP2qR7
JWT_EXPIRES_IN=7d
ADMIN_NAME=Travelyug Admin
ADMIN_EMAIL=admin@travelyug.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_WHATSAPP=919876543210
```

---

## 🚢 Production Deployment

### Backend (Render / Railway)
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelyug
JWT_SECRET=<change-to-long-random-string>
FRONTEND_URL=https://your-app.vercel.app
```
Start: `npm start`

### Frontend (Vercel / Netlify)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```
Build: `npm run build` → deploy `dist/`

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| MongoDB not connecting | Run `mongod` in a terminal |
| Port 5000 busy | Set `PORT=5001` in `.env`, update frontend `.env` |
| CORS errors | Ensure `FRONTEND_URL` in backend `.env` matches Vite port |
| Login fails | Run `npm run seed` in backend first |
| PDF not loading | Check `uploads/` folder exists in backend directory |
| `npm install` fails | Upgrade to Node.js 18+: check with `node --version` |
