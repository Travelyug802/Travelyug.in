// ═══ Admin Login ══════════════════════════════════════════════════
import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm }           from 'react-hook-form';
import { FiEye, FiEyeOff, FiShield, FiPackage, FiCalendar, FiMail,
         FiStar, FiHome, FiTruck, FiUsers, FiDatabase } from 'react-icons/fi';
import toast                 from 'react-hot-toast';
import { useAuth }           from '../../context/AuthContext';
import API                   from '../../api/axios';

/* ─────────────────────────────────────────────────────────────────
   LOGIN
───────────────────────────────────────────────────────────────── */
export function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  if (isLoggedIn) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-gray-900 text-2xl" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-1">Travelyug Management Panel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`form-input ${errors.email ? 'border-red-400' : ''}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`form-input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full justify-center py-3.5 text-base"
          >
            {isSubmitting
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block mr-2" />Logging in...</>
              : 'Login to Dashboard'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300 mt-6">
          Travelyug Admin Portal · Authorized access only
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, to }) {
  return (
    <Link to={to} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group block">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="text-white text-lg" />
        </div>
        <span className="text-xs text-gray-400 group-hover:text-primary transition-colors">View →</span>
      </div>
      {/* Ensure value is always a primitive before rendering */}
      <div className="text-2xl font-heading font-bold text-gray-900 mb-0.5">
        {value !== undefined && value !== null ? String(value) : '—'}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SEED BUTTON
───────────────────────────────────────────────────────────────── */
function SeedButton() {
  const [seeding, setSeeding] = useState(false);
  const seed = async () => {
    if (!window.confirm('This will REPLACE existing packages, testimonials and gallery. Continue?')) return;
    setSeeding(true);
    try {
      const { data } = await API.post('/admin/seed');
      if (data.success) {
        toast.success(`Seeded: ${data.data.packages} packages · ${data.data.testimonials} reviews · ${data.data.gallery} gallery images`);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Seed failed.');
    } finally { setSeeding(false); }
  };
  return (
    <button onClick={seed} disabled={seeding}
      className="btn bg-amber-600 text-white hover:bg-amber-700 btn-sm rounded-xl font-semibold">
      {seeding ? 'Loading demo data…' : 'Load Demo Data'}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DASHBOARD
   
   The /bookings/stats endpoint returns:
   {
     data: {
       bookings: { total, new, confirmed, unread },
       packages: { total, active },
       recentBookings: [...],
       monthlyBookings: [...]
     }
   }
   
   We destructure correctly below so no object is ever
   passed as a React child.
───────────────────────────────────────────────────────────────── */
export function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/bookings/stats')
      .then(r => setStats(r.data.data))
      .catch(err => {
        console.error('Stats load failed:', err);
        setStats({});
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Safely extract all scalar values from nested API response ── */
  const bookings        = stats?.bookings        ?? {};
  const packages        = stats?.packages        ?? {};
  const totalBookings   = bookings.total         ?? 0;
  const newBookings     = bookings.new           ?? 0;
  const confirmed       = bookings.confirmed     ?? 0;
  const unreadContacts  = bookings.unread        ?? 0;
  const totalPackages   = packages.total         ?? 0;
  const activePackages  = packages.active        ?? 0;

  const cards = [
    { label: 'Total Bookings',     value: totalBookings,  icon: FiCalendar, color: 'bg-primary',    to: '/admin/bookings'        },
    { label: 'New Bookings',       value: newBookings,    icon: FiPackage,  color: 'bg-secondary',  to: '/admin/bookings'        },
    { label: 'Confirmed',          value: confirmed,      icon: FiDatabase, color: 'bg-green-500',  to: '/admin/bookings'        },
    { label: 'Unread Messages',    value: unreadContacts, icon: FiMail,     color: 'bg-amber-500',  to: '/admin/contacts'        },
    { label: 'Total Packages',     value: totalPackages,  icon: FiStar,     color: 'bg-purple-500', to: '/admin/packages'        },
    { label: 'Active Packages',    value: activePackages, icon: FiPackage,  color: 'bg-blue-500',   to: '/admin/packages'        },
    { label: 'Manage Hotels',      value: '→',            icon: FiHome,     color: 'bg-indigo-500', to: '/admin/hotels'          },
    { label: 'Manage Vehicles',    value: '→',            icon: FiTruck,    color: 'bg-rose-500',   to: '/admin/vehicles'        },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
          {cards.map(c => <StatCard key={c.label} {...c} />)}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-heading font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/packages"    className="btn-primary btn-sm">+ Add Package</Link>
          <Link to="/admin/hotels"      className="btn-outline btn-sm">+ Add Hotel</Link>
          <Link to="/admin/vehicles"    className="btn-outline btn-sm">+ Add Vehicle</Link>
          <Link to="/admin/testimonials"className="btn-outline btn-sm">+ Add Review</Link>
          <Link to="/admin/trip-dates"  className="btn-outline btn-sm">Manage Trip Dates</Link>
          <Link to="/admin/admins"      className="btn-outline btn-sm flex items-center gap-1.5"><FiUsers size={13} />Admin Accounts</Link>
        </div>
      </div>

      {/* Load demo data */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="font-semibold text-amber-800 mb-1">Load Demo Data</h3>
        <p className="text-sm text-amber-700 mb-3">
          Populate the database with sample packages, testimonials and gallery images for testing.
          <strong className="text-amber-800"> Warning: this replaces existing records.</strong>
        </p>
        <SeedButton />
      </div>
    </div>
  );
}

export { Login as default };
