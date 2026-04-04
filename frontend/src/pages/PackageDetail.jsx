import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FiClock, FiMapPin, FiUsers, FiCheck, FiX as FX,
  FiArrowLeft, FiDownload, FiCalendar
} from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { BookingForm } from '../components/Cards';
import { PageLoader } from '../components/WhatsAppButton';

/* ── Seat status pill ───────────────────────── */
const STATUS_CFG = {
  green:  { label: 'Available',      bg: 'bg-green-100  text-green-700  border-green-300',  dot: 'bg-green-500' },
  orange: { label: 'Filling Fast',   bg: 'bg-amber-100  text-amber-700  border-amber-300',  dot: 'bg-amber-400' },
  red:    { label: 'Almost Full',    bg: 'bg-red-100    text-red-700    border-red-300',    dot: 'bg-red-500' },
};

function SeatPill({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.green;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}

/* ── Trip Date Booking form ─────────────────── */
function TripDateBooking({ pkg, tripDates, onBooked }) {
  const [selected, setSelected] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const available = (tripDates || []).filter(td => {
    const remaining = td.totalSeats - td.bookedSeats;
    return remaining > 0 && new Date(td.date) >= new Date();
  });

  const onSubmit = async (data) => {
    if (!selected) return toast.error('Please select a trip date first.');
    try {
      const { data: res } = await API.post(`/packages/${pkg._id}/book-seat`, {
        ...data,
        tripDateId: selected._id,
        seats: parseInt(data.seats || 1)
      });
      if (res.success) {
        toast.success(res.message);
        onBooked();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  if (available.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-center text-red-600">
        <FiCalendar className="mx-auto mb-2 text-xl" />
        No upcoming trip dates available. Contact us for custom dates.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-gray-900">Select Trip Date</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {available.map(td => {
          const remaining = td.totalSeats - td.bookedSeats;
          const isSelected = selected?._id === td._id.toString();
          return (
            <button key={td._id} type="button" onClick={() => setSelected(td)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40 bg-white'}`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-sm text-gray-900">
                    {format(new Date(td.date), 'EEE, dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{remaining} of {td.totalSeats} seats left</div>
                </div>
                <SeatPill status={td.status} />
              </div>
              {/* Seat progress bar */}
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${td.status === 'red' ? 'bg-red-500' : td.status === 'orange' ? 'bg-amber-400' : 'bg-green-500'}`}
                  style={{ width: `${(td.bookedSeats / td.totalSeats) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="form-label text-xs">Your Name *</label>
              <input className={`form-input text-sm ${errors.name?'border-red-400':''}`} {...register('name',{required:'Required'})} />
            </div>
            <div>
              <label className="form-label text-xs">Phone *</label>
              <input type="tel" className={`form-input text-sm ${errors.phone?'border-red-400':''}`} {...register('phone',{required:'Required'})} />
            </div>
          </div>
          <div>
            <label className="form-label text-xs">Email *</label>
            <input type="email" className={`form-input text-sm ${errors.email?'border-red-400':''}`} {...register('email',{required:'Required'})} />
          </div>
          <div>
            <label className="form-label text-xs">Number of Seats *</label>
            <select className="form-input text-sm" {...register('seats',{required:true})}>
              {Array.from({ length: Math.min(10, selected.totalSeats - selected.bookedSeats) }, (_,i) => i+1).map(n => (
                <option key={n} value={n}>{n} {n===1?'Seat':'Seats'}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3">
            {isSubmitting ? 'Booking...' : `Book ${format(new Date(selected.date), 'dd MMM')} →`}
          </button>
        </form>
      )}
    </div>
  );
}

/* ── Main PackageDetail page ─────────────────── */
export default function PackageDetail() {
  const { id } = useParams();
  const [pkg,     setPkg]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx,  setImgIdx]  = useState(0);
  const [tab,     setTab]     = useState('inquiry'); // 'inquiry' | 'dates'

  const loadPkg = () => {
    API.get(`/packages/${id}`)
      .then(({ data }) => setPkg(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPkg(); }, [id]);

  if (loading) return <div className="pt-20"><PageLoader /></div>;
  if (!pkg) return (
    <div className="pt-32 text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-heading font-bold mb-4">Package not found</h2>
      <Link to="/packages" className="btn-primary">Back to Packages</Link>
    </div>
  );

  const imgs = pkg.images?.length
    ? pkg.images
    : [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: pkg.title }];

  const upcomingDates = (pkg.tripDates || []).filter(td => new Date(td.date) >= new Date());
  const hasDates = upcomingDates.length > 0;

  return (
    <>
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img src={imgs[imgIdx]?.url} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <span className="badge bg-yellow-400 text-gray-900 capitalize mb-2 inline-block">{pkg.category}</span>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white">{pkg.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80 text-sm">
            <span className="flex items-center gap-1"><FiMapPin size={12}/>{pkg.location}</span>
            <span className="flex items-center gap-1"><FiClock size={12}/>{pkg.duration}</span>
            {pkg.rating > 0 && <span>⭐ {pkg.rating} ({pkg.reviewCount} reviews)</span>}
          </div>
        </div>
        <Link to="/packages" className="absolute top-24 left-6 btn-white btn-sm py-2">
          <FiArrowLeft /> Back
        </Link>
      </div>

      {/* Thumbnail strip */}
      {imgs.length > 1 && (
        <div className="bg-gray-900 py-3 px-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {imgs.map((img, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${i===imgIdx?'border-yellow-400':'border-transparent opacity-70'}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Left: content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-heading font-bold mb-3">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
              {pkg.itineraryPdf && (
                <a href={pkg.itineraryPdf}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-primary font-semibold hover:underline">
                  <FiDownload /> Download PDF Itinerary
                </a>
              )}
            </div>

            {/* Highlights */}
            {pkg.highlights?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-heading font-bold mb-4">Trip Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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

            {/* Inclusions / Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {pkg.inclusions?.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-green-700 mb-3 flex items-center gap-2"><FiCheck/>Included</h3>
                      <ul className="space-y-2">
                        {pkg.inclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <FiCheck className="text-green-500 mt-0.5 flex-shrink-0"/>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions?.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-red-600 mb-3 flex items-center gap-2"><FX/>Not Included</h3>
                      <ul className="space-y-2">
                        {pkg.exclusions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <FX className="text-red-400 mt-0.5 flex-shrink-0"/>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Itinerary */}
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
                        {day.accommodation && <p className="text-xs text-primary mt-0.5">🏨 {day.accommodation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: booking sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              {/* Price */}
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
                <span className="flex items-center gap-1.5"><FiClock className="text-secondary"/>{pkg.duration}</span>
                <span className="flex items-center gap-1.5"><FiUsers className="text-secondary"/>Max {pkg.maxGroupSize}</span>
              </div>

              {/* Tab switcher */}
              {hasDates && (
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
                  <button onClick={() => setTab('inquiry')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all ${tab==='inquiry'?'bg-primary text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    Send Inquiry
                  </button>
                  <button onClick={() => setTab('dates')}
                    className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${tab==='dates'?'bg-primary text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
                    <FiCalendar size={13}/> Book by Date
                  </button>
                </div>
              )}

              {tab === 'inquiry' || !hasDates ? (
                <>
                  <h3 className="font-heading font-bold text-gray-900 mb-4">Send Inquiry</h3>
                  <BookingForm packageId={pkg._id} packageName={pkg.title} destination={pkg.location} />
                </>
              ) : (
                <TripDateBooking pkg={pkg} tripDates={upcomingDates} onBooked={loadPkg} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
