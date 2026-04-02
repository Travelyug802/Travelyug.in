import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiStar, FiUsers, FiGlobe, FiAward,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { FaPlane, FaHotel, FaShieldAlt } from 'react-icons/fa';
import { PackageCard } from '../components/Cards';
import { PageLoader } from '../components/WhatsAppButton';
import API from '../api/axios';

const STATS = [
  { icon: FiUsers, v: '12,532+', l: 'Happy Travellers' },
  { icon: FiGlobe, v: '35+',     l: 'Destinations Covered' },
  { icon: FiAward, v: '5+',      l: 'Years Experience' },
  { icon: FiStar,  v: '4.9/5',   l: 'Average Rating' }
];

const DEST = [
  { name: 'Spiti Valley',  img: '/images/spiti.jpg',     tag: 'Biker Paradise' },
  { name: 'Lahaul Valley', img: '/images/lahaul.jpg',    tag: 'Raw Himalayas' },
  { name: 'Leh Ladakh',    img: '/images/ladakh.jpg',    tag: 'Ultimate Ride' },
  { name: 'Tawang',        img: '/images/tawang.jpg',    tag: 'Northeast Beauty' },
  { name: 'Meghalaya',     img: '/images/meghalaya.jpg', tag: 'Cloud Kingdom' },
  { name: 'Uttarakhand',   img: '/images/uttarakhand.jpg', tag: 'Dev Bhoomi' }
];

const WHY = [
  { icon: FaPlane,     title: 'Biker-Focused Trips', desc: 'Specially designed road trips for adventure riders across the Himalayas.' },
  { icon: FaHotel,     title: 'Best Stays',           desc: 'Comfortable and reliable stays even in remote mountain regions.' },
  { icon: FaShieldAlt, title: 'Safe & Trusted',       desc: 'Experienced guides, backup vehicles, and full trip safety support.' },
  { icon: FiUsers,     title: '24/7 Support',          desc: 'Always there with you during your journey.' }
];

function TestimonialSlider({ items }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  const t = items[idx];
  return (
    <div className="max-w-xl mx-auto px-4 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <img src={t.avatar || `https://i.pravatar.cc/80?img=${idx + 1}`}
          alt={t.customerName} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
        <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed mb-4">"{t.review}"</p>
        <div className="flex justify-center mb-2">
          {[1,2,3,4,5].map(s => <span key={s} className={s <= t.rating ? 'text-amber-400' : 'text-gray-200'}>★</span>)}
        </div>
        <p className="font-bold text-gray-900">{t.customerName}</p>
        {t.location && <p className="text-xs text-gray-400 mt-0.5">{t.location}</p>}
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-primary scale-125' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [featured,     setFeatured]     = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/packages?featured=true&limit=6'),
      API.get('/testimonials?featured=true')
    ]).then(([p, t]) => {
      setFeatured(p.data.data.packages);
      setTestimonials(t.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src="/images/spiti-bike.jpg" className="absolute w-full h-full object-cover" alt="Spiti Bike" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Ride Through the Himalayas
            <br />
            <span className="text-yellow-400">Spiti • Ladakh • Northeast</span>
          </h1>
          <p className="text-base sm:text-lg text-white/85 mb-6 sm:mb-8 max-w-xl mx-auto">
            Bike expeditions, mountain roads, and unforgettable journeys with TravelYug.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/packages" className="btn-accent w-full sm:w-auto justify-center px-8 py-3 text-base">
              Explore Trips <FiArrowRight />
            </Link>
            <Link to="/booking" className="btn-white w-full sm:w-auto justify-center px-8 py-3 text-base">
              Book Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="bg-blue-900 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ icon: Icon, v, l }) => (
            <div key={l} className="flex flex-col items-center">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center mb-2">
                <Icon className="text-yellow-400 text-xl" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">{v}</h3>
              <p className="text-xs sm:text-sm text-white/75 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">Popular Bike Trips</h2>
          {loading ? <PageLoader /> : featured.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {featured.map(pkg => (
                  <div key={pkg._id} className="relative">
                    <PackageCard pkg={pkg} />
                    {pkg.pdf && (
                      <a href={pkg.pdf} target="_blank" rel="noopener noreferrer"
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">📄</a>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/packages" className="btn-outline">View All Packages <FiArrowRight /></Link>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400">No packages yet. Add from admin panel.</p>
          )}
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">Explore Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {DEST.map(d => (
              <Link key={d.name} to={`/packages?search=${d.name}`}
                className="relative group rounded-xl overflow-hidden block aspect-video">
                <img src={d.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={d.name} />
                <div className="absolute inset-0 bg-black/50 rounded-xl" />
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 text-white">
                  <h3 className="font-bold text-sm sm:text-base">{d.name}</h3>
                  <p className="text-xs text-white/80">{d.tag}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRAVELYUG ────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">Why TravelYug?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-5 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-primary text-xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8 sm:mb-10">Traveller Stories</h2>
            <TestimonialSlider items={testimonials} />
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-blue-800 text-white text-center py-14 sm:py-16 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Ride Spiti?</h2>
        <p className="text-white/80 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
          Join our next bike expedition and experience the Himalayas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 items-center">
          <Link to="/booking"
            className="btn-accent w-full sm:w-auto justify-center px-8 py-3 text-base">
            Plan My Trip <FiArrowRight />
          </Link>
          <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '919805706010'}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-white w-full sm:w-auto justify-center px-8 py-3 text-base">
            WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
}
