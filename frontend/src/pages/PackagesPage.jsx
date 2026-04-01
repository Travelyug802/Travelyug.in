// PackagesPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { PackageCard } from '../components/Cards';
import { PageLoader } from '../components/WhatsAppButton';
import API from '../api/axios';

const CATS = ['all','domestic','international','adventure','honeymoon','family','pilgrimage','luxury'];

export function PackagesPage() {
  const [sp, setSP] = useSearchParams();
  const [packages,   setPackages]   = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading,    setLoading]    = useState(true);
  const [input,      setInput]      = useState(sp.get('search') || '');

  const category = sp.get('category') || 'all';
  const search   = sp.get('search')   || '';
  const page     = parseInt(sp.get('page') || '1');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 9 });
      if (category !== 'all') p.set('category', category);
      if (search) p.set('search', search);
      const { data } = await API.get(`/packages?${p}`);
      setPackages(data.data.packages);
      setPagination(data.data.pagination);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, category, search]);

  useEffect(() => { load(); }, [load]);

  const set = (k, v) => {
    const p = new URLSearchParams(sp);
    v ? p.set(k, v) : p.delete(k);
    p.delete('page');
    setSP(p);
  };

  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Tour Packages</h1>
        <p className="text-white/80">{pagination.total}+ curated tours across India &amp; the world</p>
      </div>
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col gap-4">
            <form className="flex-1 flex gap-2" onSubmit={e => { e.preventDefault(); set('search', input.trim()); }}>
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="form-input pl-9" placeholder="Search destinations, tours..." value={input} onChange={e => setInput(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary btn-sm">Search</button>
              {search && <button type="button" onClick={() => { setInput(''); set('search', ''); }} className="p-2.5 text-gray-400 hover:text-gray-700 rounded-xl border border-gray-200"><FiX /></button>}
            </form>
            <div className="flex gap-2 flex-wrap overflow-x-auto pb-1 scrollbar-hide">
              {CATS.map(c => (
                <button key={c} onClick={() => set('category', c === 'all' ? '' : c)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${category === c ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-primary/10'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {loading ? <PageLoader /> : packages.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-heading font-bold text-gray-700 mb-2">No packages found</h3>
              <p className="text-sm">Try a different search or category.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{pagination.total} packages found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
              </div>
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => set('page', String(pg))}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${pg === pagination.page ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-primary/10'}`}>
                      {pg}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

// PackageDetail.jsx
import { useParams } from 'react-router-dom';
import { FiClock, FiMapPin, FiUsers, FiCheck, FiX as FX, FiArrowLeft } from 'react-icons/fi';
import { BookingForm } from '../components/Cards';

export function PackageDetail() {
  const { id } = useParams();
  const [pkg,     setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx,  setImgIdx]  = useState(0);

  useEffect(() => {
    API.get(`/packages/${id}`)
      .then(({ data }) => setPkg(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><PageLoader /></div>;
  if (!pkg) return (
    <div className="pt-32 text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-heading font-bold mb-4">Package not found</h2>
      <Link to="/packages" className="btn-primary">Back to Packages</Link>
    </div>
  );

  const imgs = pkg.images?.length ? pkg.images : [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: pkg.title }];

  return (
    <>
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={imgs[imgIdx]?.url} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge bg-yellow-400 text-gray-900 capitalize mb-2 inline-block">{pkg.category}</span>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80 text-sm">
            <span className="flex items-center gap-1"><FiMapPin size={12} />{pkg.location}</span>
            <span className="flex items-center gap-1"><FiClock size={12} />{pkg.duration}</span>
            {pkg.rating > 0 && <span className="flex items-center gap-1">⭐ {pkg.rating} ({pkg.reviewCount} reviews)</span>}
          </div>
        </div>
        <Link to="/packages" className="absolute top-24 left-6 btn-white btn-sm py-2"><FiArrowLeft /> Back</Link>
      </div>

      {imgs.length > 1 && (
        <div className="bg-gray-900 py-3 px-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i === imgIdx ? 'border-yellow-400' : 'border-transparent opacity-70'}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-heading font-bold mb-3">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {pkg.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-heading font-bold mb-4">Trip Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <div className="w-6 h-6 bg-secondary/15 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="text-secondary text-xs" />
                      </div>{h}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {pkg.inclusions?.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-green-700 mb-3 flex items-center gap-2"><FiCheck />Included</h3>
                      <ul className="space-y-2">
                        {pkg.inclusions.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions?.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-red-600 mb-3 flex items-center gap-2"><FX />Not Included</h3>
                      <ul className="space-y-2">
                        {pkg.exclusions.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><FX className="text-red-400 mt-0.5 flex-shrink-0" />{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {pkg.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-heading font-bold mb-5">Day-by-Day Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itinerary.map(day => (
                    <div key={day.day} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{day.day}</div>
                      <div>
                        <h4 className="font-heading font-bold text-gray-900 mb-1">{day.title}</h4>
                        {day.description && <p className="text-sm text-gray-600">{day.description}</p>}
                        {day.meals && <p className="text-xs text-secondary mt-1">🍽 {day.meals}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="mb-5">
                {pkg.discountedPrice ? (
                  <>
                    <div className="text-sm text-gray-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</div>
                    <div className="text-3xl font-bold text-primary font-heading">₹{pkg.discountedPrice.toLocaleString('en-IN')}</div>
                  </>
                ) : <div className="text-3xl font-bold text-primary font-heading">₹{pkg.price.toLocaleString('en-IN')}</div>}
                <div className="text-sm text-gray-400">per person</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 pb-5 border-b border-gray-100">
                <span className="flex items-center gap-1.5"><FiClock className="text-secondary" />{pkg.duration}</span>
                <span className="flex items-center gap-1.5"><FiUsers className="text-secondary" />Max {pkg.maxGroupSize}</span>
              </div>
              {pkg.itineraryPdf && (
                <a href={`http://localhost:5000${pkg.itineraryPdf}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full mb-5 py-2.5 px-4 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">
                  📄 Download Itinerary (PDF)
                </a>
              )}
              <h3 className="font-heading font-bold text-gray-900 mb-4">Send Inquiry</h3>
              <BookingForm packageId={pkg._id} packageName={pkg.title} destination={pkg.location} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PackagesPage;