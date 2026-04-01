// ── AboutPage ─────────────────────────────────────────────────────
import { FiUsers, FiGlobe, FiAward, FiStar } from 'react-icons/fi';

const TEAM = [
  { name:'Gaurav Sharma',  role:'Founder & CEO',       img:'https://res.cloudinary.com/dcdxpdxi9/image/upload/v1775047078/Gaurav_pq8dqv.jpg' },
  { name:'Ankur Thakur',   role:'Head of Operations',  img:'https://res.cloudinary.com/dcdxpdxi9/image/upload/v1775047078/Ankur_cwxl9p.jpg'  },
  { name:'Sandeep Thakur', role:'Customer Relations',  img:'https://res.cloudinary.com/dcdxpdxi9/image/upload/v1775047079/Sandeep_stpmsl.jpg'},
];

export function AboutPage() {
  const stats = [
    { icon: FiUsers, v:'12,532+', l:'Happy Travellers' },
    { icon: FiGlobe, v:'35+',    l:'Destinations' },
    { icon: FiAward, v:'10+',     l:'Years Experience' },
    { icon: FiStar,  v:'4.9/5',   l:'Average Rating' }
  ];
  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-4xl font-heading font-bold mb-2">About Travelyug</h1>
        <p className="text-white/80">Crafting unforgettable journeys since 2017</p>
      </div>
      <section className="section-padding bg-white">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="section-title mt-2 mb-4">Born from a Love of Travel</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Travelyug was founded in 2017 with a simple vision — to take travellers beyond ordinary trips and into the raw, untouched beauty of the Himalayas. What started as a passion for riding through Spiti and Leh has grown into a trusted name for adventure travel.</p>
            <p className="text-gray-600 leading-relaxed mb-4">Based in Solan, Himachal Pradesh, we specialize in curated bike expeditions and road trips across Spiti Valley and Leh-Ladakh. Our journeys are designed for those who seek real experiences — high-altitude roads, breathtaking landscapes, and the thrill of exploring places few truly understand.</p>
            <p className="text-gray-600 leading-relaxed">Every trip we create is backed by on-ground experience, deep route knowledge, and a strong focus on safety and comfort. We understand the mountains, the challenges, and what it takes to make every ride smooth and memorable.</p>
            <p className="text-gray-600 leading-relaxed">At Travelyug, we don’t just organize trips — we build experiences that stay with you long after the journey ends. Whether you're riding for the first time or chasing your next adventure, we make sure your journey is worth every mile.</p>
          </div>
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400','https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400','https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400'].map((src, i) => (
              <img key={src} src={src} alt="travel" className={`rounded-2xl h-48 w-full object-cover ${i % 2 !== 0 ? 'mt-8' : ''}`} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary py-12 sm:py-16 px-4">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
          {stats.map(({ icon: Icon, v, l }) => (
            <div key={l}>
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-3"><Icon className="text-yellow-400 text-2xl" /></div>
              <div className="text-3xl font-heading font-bold mb-1">{v}</div>
              <div className="text-white/70 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="section-title mb-2">Meet Our Team</h2>
          <p className="section-subtitle">The passionate people behind your perfect holiday</p>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {TEAM.map(m => (
              <div key={m.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-primary/10" />
                <h3 className="font-heading font-bold text-gray-900 text-sm">{m.name}</h3>
                <p className="text-xs text-secondary mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ── GalleryPage ────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { PageLoader } from '../components/WhatsAppButton';
import API from '../api/axios';

const GCATS = ['all','beaches','mountains','heritage','wildlife','adventure','city','food','culture'];

export function GalleryPage() {
  const [images,   setImages]   = useState([]);
  const [cat,      setCat]      = useState('all');
  const [loading,  setLoading]  = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    const q = cat !== 'all' ? `?category=${cat}` : '';
    API.get(`/gallery${q}`).then(r => setImages(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [cat]);

  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-4xl font-heading font-bold mb-2">Travel Gallery</h1>
        <p className="text-white/80">A visual journey through our destinations</p>
      </div>
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {GCATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${cat === c ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/10'}`}>
                {c}
              </button>
            ))}
          </div>
          {loading ? <PageLoader /> : images.length === 0
            ? <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-4">🖼️</div><p>No images in this category.</p></div>
            : (
              <div className="columns-1 xs:columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {images.map(img => (
                  <div key={img._id} className="break-inside-avoid cursor-pointer group rounded-xl overflow-hidden" onClick={() => setLightbox(img)}>
                    <img src={img.imageUrl} alt={img.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.imageUrl} alt={lightbox.title} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            <div className="text-center mt-3">
              <p className="text-white font-semibold">{lightbox.title}</p>
              {lightbox.destination && <p className="text-white/60 text-sm">{lightbox.destination}</p>}
            </div>
          </div>
          <button className="absolute top-6 right-6 text-white text-3xl hover:text-yellow-400 transition-colors" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </>
  );
}

// ── Source badge helper ──────────────────────────────────────────────
function SourceBadge({ source }) {
  if (source === 'google') return (
    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span className="text-xs font-semibold text-gray-500">Google</span>
    </div>
  );
  if (source === 'tripadvisor') return (
    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
      <span className="text-sm">🦉</span>
      <span className="text-xs font-semibold text-green-600">TripAdvisor</span>
    </div>
  );
  if (source === 'facebook') return (
    <div className="flex items-center gap-1 ml-auto flex-shrink-0">
      <span className="text-sm">📘</span>
      <span className="text-xs font-semibold text-blue-600">Facebook</span>
    </div>
  );
  return null;
}

// ── ReviewCard ───────────────────────────────────────────────────────
function ReviewCard({ r }) {
  return (
    <div className="break-inside-avoid bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={r.avatar || `https://i.pravatar.cc/60?u=${r._id}`}
          alt={r.customerName}
          className="w-11 h-11 rounded-full object-cover border-2 border-primary/10 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-gray-900 truncate">{r.customerName}</div>
            <SourceBadge source={r.source} />
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
            {r.location && <span>{r.location}</span>}
            {r.location && r.reviewDate && <span>·</span>}
            {r.reviewDate && <span>{r.reviewDate}</span>}
          </div>
        </div>
      </div>
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[1,2,3,4,5].map(s => (
          <span key={s} className={`text-base ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
        ))}
      </div>
      {/* Review text */}
      <p className="text-sm text-gray-700 leading-relaxed">"{r.review}"</p>
      {/* Package tag */}
      {r.packageName && (
        <span className="mt-3 badge bg-secondary/10 text-secondary text-xs inline-block">{r.packageName}</span>
      )}
      {/* Google link */}
      {r.source === 'google' && r.profileUrl && (
        <a href={r.profileUrl} target="_blank" rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-500 hover:underline flex items-center gap-1">
          View on Google ↗
        </a>
      )}
    </div>
  );
}

// ── ReviewsPage ────────────────────────────────────────────────────
export function ReviewsPage() {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter,  setFilter]    = useState('all'); // all | google | website

  useEffect(() => {
    API.get('/testimonials')
      .then(r => setReviews(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? reviews : reviews.filter(r => (r.source || 'website') === filter);
  const avg      = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const googleCount  = reviews.filter(r => r.source === 'google').length;
  const websiteCount = reviews.filter(r => !r.source || r.source === 'website').length;

  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Traveller Reviews</h1>
        <p className="text-white/80">Real stories from real travellers — verified &amp; genuine</p>
      </div>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">

          {/* ── Overall stats bar ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10 text-center">
              {/* Average */}
              <div>
                <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-1">{avg}</div>
                <div className="flex justify-center mb-1">
                  {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(avg) ? 'text-amber-400 text-xl' : 'text-gray-200 text-xl'}>★</span>)}
                </div>
                <div className="text-xs text-gray-400">Overall Rating</div>
              </div>
              <div className="hidden sm:block w-px h-14 bg-gray-200" />
              {/* Counts */}
              <div>
                <div className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-1">{reviews.length}</div>
                <div className="text-xs text-gray-400 mt-1">Total Reviews</div>
              </div>
              {googleCount > 0 && (
                <>
                  <div className="hidden sm:block w-px h-14 bg-gray-200" />
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-4xl sm:text-5xl font-heading font-bold text-primary">{googleCount}</span>
                    </div>
                    <div className="text-xs text-gray-400">Google Reviews</div>
                  </div>
                </>
              )}
              <div className="hidden sm:block w-px h-14 bg-gray-200" />
              <div>
                <div className="text-4xl sm:text-5xl font-heading font-bold text-green-600 mb-1">98%</div>
                <div className="text-xs text-gray-400 mt-1">Would Recommend</div>
              </div>
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { key: 'all',     label: `All Reviews (${reviews.length})` },
              { key: 'google',  label: `Google (${googleCount})` },
              { key: 'website', label: `Website (${websiteCount})` },
            ].filter(t => t.key === 'all' || (t.key === 'google' && googleCount > 0) || (t.key === 'website' && websiteCount > 0))
             .map(t => (
              <button key={t.key} onClick={() => setFilter(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  filter === t.key ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/10'
                }`}>
                {t.key === 'google' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline mr-1 mb-0.5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Review cards ── */}
          {loading ? <PageLoader /> : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">⭐</div>
              <p>No reviews in this category yet.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
              {filtered.map(r => <ReviewCard key={r._id} r={r} />)}
            </div>
          )}

          {/* ── Write a Google Review CTA ── */}
          <div className="mt-10 sm:mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Travelled with us? Share your experience!</h3>
            <p className="text-sm text-gray-500 mb-5 max-w-md mx-auto">Your honest review helps other travellers and motivates our team.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
                target="_blank" rel="noopener noreferrer"
                className="btn flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-primary hover:text-primary font-semibold transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Review us on Google
              </a>
            </div>
            
          </div>

        </div>
      </section>
    </>
  );
}

// ── ContactPage ────────────────────────────────────────────────────
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async data => {
    try {
      const { data: r } = await API.post('/contact', data);
      if (r.success) { toast.success(r.message); reset(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send.'); }
  };
  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-4xl font-heading font-bold mb-2">Contact Us</h1>
        <p className="text-white/80">We'd love to hear from you and plan your dream trip!</p>
      </div>
      <section className="section-padding bg-gray-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-5 mb-8">
              {[
                { icon: FiMapPin, title:'Visit Us',    val:'Travelyug Building, Near Shimla Airport, Himachal Pradesh, India' },
                { icon: FiPhone,  title:'Call Us',     val:'+91 98057 06010 / +91 82197 73247', href:'tel:+919805706010' },
                { icon: FiMail,   title:'Email Us',    val:'infotravelyug@gmail.com', href:'mailto:infotravelyug@gmail.com' },
                { icon: FiClock,  title:'Office Hours',val:'Mon–Sat: 9:00 AM – 7:00 PM | Sun: 10:00 AM – 4:00 PM' }
              ].map(({ icon: Icon, title, val, href }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="text-primary text-xl" /></div>
                  <div><div className="font-semibold text-gray-900 mb-0.5">{title}</div>
                    {href ? <a href={href} className="text-sm text-primary hover:underline">{val}</a> : <p className="text-sm text-gray-600">{val}</p>}
                  </div>
                </div>
              ))}
            </div>
            <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP||'919805706010'}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 hover:bg-green-100 transition-colors">
              <FaWhatsapp className="text-green-500 text-3xl" />
              <div><div className="font-semibold text-gray-900">Chat on WhatsApp</div><div className="text-sm text-gray-500">+91 98057 06010 · Usually replies within minutes</div></div>
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Name *</label><input className={`form-input ${errors.name?'border-red-400':''}`} {...register('name',{required:'Required'})} />{errors.name&&<p className="form-error">{errors.name.message}</p>}</div>
                <div><label className="form-label">Email *</label><input type="email" className={`form-input ${errors.email?'border-red-400':''}`} {...register('email',{required:'Required'})} />{errors.email&&<p className="form-error">{errors.email.message}</p>}</div>
              </div>
              <div><label className="form-label">Phone</label><input type="tel" className="form-input" {...register('phone')} /></div>
              <div><label className="form-label">Subject</label><input className="form-input" {...register('subject')} /></div>
              <div><label className="form-label">Message *</label><textarea rows={4} className={`form-input resize-none ${errors.message?'border-red-400':''}`} {...register('message',{required:'Required'})} />{errors.message&&<p className="form-error">{errors.message.message}</p>}</div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">{isSubmitting?'Sending...':<><FiSend />Send Message</>}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

// ── BookingPage ────────────────────────────────────────────────────
import { FiCheckCircle } from 'react-icons/fi';
import { BookingForm } from '../components/Cards';

export function BookingPage() {
  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-4xl font-heading font-bold mb-2">Book Your Trip</h1>
        <p className="text-white/80">No payment required — just tell us your dream destination</p>
      </div>
      <section className="section-padding bg-gray-50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="space-y-5 mb-8">
              {[
                ['1','Submit Inquiry',   'Fill in your details and preferred destination.'],
                ['2','Expert Calls You', 'Our travel expert contacts you within 24 hours.'],
                ['3','Plan Together',    'We craft a custom itinerary just for you.'],
                ['4','Travel & Enjoy',   "Pack your bags — your dream trip begins!"]
              ].map(([n, title, desc]) => (
                <div key={n} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">{n}</div>
                  <div><h3 className="font-heading font-bold text-gray-900">{title}</h3><p className="text-sm text-gray-500 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-primary mb-3">Why Book with Travelyug?</h3>
              {['No booking fee or hidden charges','Personalised itinerary crafted for you','24/7 support during your trip','Best price guarantee','Flexible cancellation policies'].map(p => (
                <div key={p} className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <FiCheckCircle className="text-secondary flex-shrink-0" />{p}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Send Your Inquiry</h2>
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}

// ── NotFound ──────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="text-center">
        <div className="text-8xl mb-6 animate-float">✈️</div>
        <h1 className="text-7xl font-heading font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like this page went on a trip without us! Let's get you back on track.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/packages" className="btn-outline">Browse Packages</Link>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
