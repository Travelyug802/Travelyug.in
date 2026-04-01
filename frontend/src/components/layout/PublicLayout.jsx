// ── Navbar ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';

const NAV = [
  ['/', 'Home'], ['/packages', 'Packages'], ['/hotels', 'Hotels'],
  ['/vehicles', 'Vehicles'], ['/gallery', 'Gallery'],
  ['/reviews', 'Reviews'], ['/about', 'About'], ['/contact', 'Contact']
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" className="w-10 h-10 object-contain" alt="Travelyug Logo" />
            <span className={`font-heading font-bold text-xl ${transparent ? 'text-white' : 'text-primary'}`}>
              Travelyug
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? (transparent ? 'text-accent' : 'text-primary')
                      : (transparent
                        ? 'text-white/90 hover:text-white'
                        : 'text-gray-600 hover:text-primary')
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Phone + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919805706010"
              className={`flex items-center gap-1.5 text-sm font-semibold ${transparent ? 'text-white' : 'text-gray-700'}`}
            >
              <FiPhone size={14} /> +91 98057 06010 / +91 82197 73247
            </a>

            <Link to="/booking" className="btn-accent btn-sm">
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-700'}`}
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-xl">
          <div className="container-custom py-4 space-y-1">
            {NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <Link
              to="/booking"
              className="btn-accent w-full justify-center mt-3"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Footer ────────────────────────────────────────────────────────
import {
  FiMapPin,
  FiPhone as FPhone,
  FiMail,
  FiFacebook,
  FiInstagram,
  FiYoutube
} from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" className="w-10 h-10 object-contain" alt="Travelyug Logo" />
              <span className="font-heading font-bold text-xl text-white">
                Travelyug
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-5">Discover Himachal, Spiti, Manali and more with Travelyug. Your trusted travel partner.</p>

            <div className="flex gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/travelyug"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiInstagram size={15} />
              </a>

              {/* Facebook (add later) */}
              <span className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center opacity-40">
                <FiFacebook size={15} />
              </span>

              {/* YouTube (add later) */}
              <span className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center opacity-40">
                <FiYoutube size={15} />
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2.5">
              {[
                ['/', 'Home'],
                ['/packages', 'Tour Packages'],
                ['/gallery', 'Gallery'],
                ['/reviews', 'Reviews'],
                ['/about', 'About Us'],
                ['/contact', 'Contact']
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">
              Popular Tours
            </h3>

            <ul className="space-y-2.5">
              {[
                'Shimla Tour',
                'Manali Adventure',
                'Spiti Valley Expedition',
                'Kullu Manali Trip',
                'Himachal Explorer',
                'Kedarnath Yatra'
              ].map(name => (
                <li key={name}>
                  <Link
                    to="/packages"
                    className="text-sm text-gray-400 hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-white mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3">

              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="text-accent mt-0.5 flex-shrink-0" />
                <span>
                  Travelyug Building, Near Shimla Airport,<br />
                  Himachal Pradesh, India
                </span>
              </li>

              <li>
                <a
                  href="tel:+919805706010"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent transition-colors"
                >
                  <FPhone className="text-accent flex-shrink-0" />
                  +91 98057 06010 / +91 82197 73247
                </a>
              </li>

              <li>
                <a
                  href="mailto:infotravelyug@gmail.com"
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-accent transition-colors"
                >
                  <FiMail className="text-accent flex-shrink-0" />
                  infotravelyug@gmail.com
                </a>
              </li>

            </ul>

            <div className="mt-4 bg-white/5 rounded-xl p-3 text-xs text-gray-500">
              <p className="font-semibold text-gray-400 mb-1">
                Office Hours
              </p>
              <p>Mon–Sat: 9:00 AM – 7:00 PM</p>
              <p>Sun: 10:00 AM – 4:00 PM</p>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Travelyug. All rights reserved.</p>
          <p>Made with ❤️ for travel lovers</p>
        </div>
      </div>
    </footer>
  );
}

// ── PublicLayout ──────────────────────────────────────────────────
import { Outlet } from 'react-router-dom';
import { WhatsAppButton } from '../WhatsAppButton';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}