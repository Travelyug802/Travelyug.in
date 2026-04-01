import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout   from './components/layout/PublicLayout';
import HomePage       from './pages/HomePage';
import PackagesPage   from './pages/PackagesPage';
import PackageDetail  from './pages/PackageDetail';
import AboutPage      from './pages/AboutPage';
import GalleryPage    from './pages/GalleryPage';
import ReviewsPage    from './pages/ReviewsPage';
import ContactPage    from './pages/ContactPage';
import BookingPage    from './pages/BookingPage';
import HotelsPage     from './pages/HotelsPage';
import VehiclesPage   from './pages/VehiclesPage';
import NotFound       from './pages/NotFound';

import AdminLayout    from './admin/AdminLayout';
import Login          from './admin/pages/Login';
import { Dashboard }  from './admin/pages/LoginDashboard';
import { Packages }   from './admin/pages/AdminPages';
import { Bookings }   from './admin/pages/AdminPages';
import { Testimonials }from './admin/pages/AdminPages';
import { Gallery }    from './admin/pages/AdminPages';
import { Contacts }   from './admin/pages/AdminPages';
import HotelsAdmin,   { HotelBookingsAdmin }   from './admin/pages/Hotels';
import VehiclesAdmin, { VehicleBookingsAdmin } from './admin/pages/Vehicles';
import TripDatesAdmin from './admin/pages/TripDates';
import AdminManagement from './admin/pages/AdminManagement';
import ProtectedRoute from './components/ProtectedRoute';

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const TOAST_OPTS = {
  duration: 4000,
  style: { background: '#1a1a2e', color: '#fff', borderRadius: '10px', fontSize: '14px' },
  success: { iconTheme: { primary: '#00A8A8', secondary: '#fff' } },
  error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={TOAST_OPTS} />
        <Routes>
          {/* ── Public ── */}
          <Route element={<PublicLayout />}>
            <Route path="/"             element={<HomePage />} />
            <Route path="/packages"     element={<PackagesPage />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/hotels"       element={<HotelsPage />} />
            <Route path="/vehicles"     element={<VehiclesPage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/gallery"      element={<GalleryPage />} />
            <Route path="/reviews"      element={<ReviewsPage />} />
            <Route path="/contact"      element={<ContactPage />} />
            <Route path="/booking"      element={<BookingPage />} />
            <Route path="*"             element={<NotFound />} />
          </Route>

          {/* ── Admin Login ── */}
          <Route path="/admin/login" element={<Login />} />

          {/* ── Admin Protected ── */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index                    element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"         element={<Dashboard />} />
            <Route path="packages"          element={<Packages />} />
            <Route path="trip-dates"        element={<TripDatesAdmin />} />
            <Route path="bookings"          element={<Bookings />} />
            <Route path="hotels"            element={<HotelsAdmin />} />
            <Route path="hotel-bookings"    element={<HotelBookingsAdmin />} />
            <Route path="vehicles"          element={<VehiclesAdmin />} />
            <Route path="vehicle-bookings"  element={<VehicleBookingsAdmin />} />
            <Route path="testimonials"      element={<Testimonials />} />
            <Route path="gallery"           element={<Gallery />} />
            <Route path="contacts"          element={<Contacts />} />
            <Route path="admins"            element={<AdminManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
