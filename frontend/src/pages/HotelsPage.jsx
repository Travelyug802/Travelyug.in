import { useState, useEffect } from 'react';
import { FiMapPin, FiStar, FiUsers, FiSearch, FiX, FiCheckCircle, FiWifi } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { PageLoader } from '../components/WhatsAppButton';

const CAT_CLR = {
  budget:   'bg-green-50 text-green-700',
  standard: 'bg-blue-50 text-blue-700',
  deluxe:   'bg-purple-50 text-purple-700',
  luxury:   'bg-amber-50 text-amber-700',
};

const WA_NUMBER = import.meta.env.VITE_WHATSAPP || '919805706010';

/* ─── Hotel Detail Modal ─────────────────────────── */
function HotelDetailModal({ hotel, onClose, onBook }) {
  const img = hotel.images?.find(i => i.isPrimary) || hotel.images?.[0];
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Hero image */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          {img?.url
            ? <img src={img.url} alt={hotel.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl">🏨</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge capitalize ${CAT_CLR[hotel.category] || 'bg-gray-100 text-gray-700'}`}>{hotel.category}</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
            {Array.from({ length: hotel.starRating || 3 }, (_, i) => (
              <FiStar key={i} className="text-amber-400 text-xs fill-current" />
            ))}
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-14 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <FiX size={16} className="text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-heading font-bold text-white">{hotel.name}</h2>
            <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
              <FiMapPin size={12} />{hotel.location}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Description */}
          {hotel.description && (
            <p className="text-gray-600 leading-relaxed mb-5">{hotel.description}</p>
          )}

          {/* Price + rooms */}
          <div className="flex items-center justify-between bg-primary/5 rounded-xl p-4 mb-5">
            <div>
              {hotel.discountedPrice ? (
                <>
                  <div className="text-sm text-gray-400 line-through">₹{hotel.pricePerNight.toLocaleString('en-IN')}/night</div>
                  <div className="text-2xl font-bold text-primary font-heading">
                    ₹{hotel.discountedPrice.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/night</span>
                  </div>
                </>
              ) : (
                <div className="text-2xl font-bold text-primary font-heading">
                  ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-400">/night</span>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-0.5">{hotel.roomsAvailable} rooms available</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1">Category</div>
              <span className={`badge capitalize ${CAT_CLR[hotel.category] || 'bg-gray-100 text-gray-700'}`}>{hotel.category}</span>
            </div>
          </div>

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-heading font-bold text-gray-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a, i) => (
                  <span key={i} className="flex items-center gap-1.5 badge bg-secondary/10 text-secondary text-xs px-3 py-1.5">
                    <FiCheckCircle size={11} />{a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => { onClose(); onBook(hotel); }}
              className="flex-1 btn-primary justify-center py-3">
              Book Now
            </button>
            <a href={`https://wa.me/${WA_NUMBER}?text=Hi! I'm interested in ${hotel.name} at ${hotel.location}. Price: ₹${(hotel.discountedPrice || hotel.pricePerNight).toLocaleString('en-IN')}/night.`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 btn flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold">
              <FaWhatsapp size={18} /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hotel Card ─────────────────────────────────── */
function HotelCard({ hotel, onBook, onView }) {
  const img = hotel.images?.find(i => i.isPrimary) || hotel.images?.[0];
  return (
    <div className="card group h-full flex flex-col">
      <div className="relative h-52 overflow-hidden cursor-pointer" onClick={() => onView(hotel)}>
        {img?.url
          ? <img src={img.url} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">🏨</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`badge capitalize ${CAT_CLR[hotel.category] || 'bg-gray-100 text-gray-700'}`}>{hotel.category}</span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
          {Array.from({ length: hotel.starRating || 3 }, (_, i) => (
            <FiStar key={i} className="text-amber-400 text-xs fill-current" />
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <FiMapPin className="text-secondary flex-shrink-0" />
          <span className="truncate">{hotel.location}</span>
        </div>
        <h3
          className="font-heading font-bold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => onView(hotel)}>
          {hotel.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{hotel.description}</p>

        {hotel.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hotel.amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="badge bg-gray-100 text-gray-600 text-xs">{a}</span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="badge bg-gray-100 text-gray-500 text-xs">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              {hotel.discountedPrice ? (
                <>
                  <div className="text-xs text-gray-400 line-through">₹{hotel.pricePerNight.toLocaleString('en-IN')}/night</div>
                  <div className="text-xl font-bold text-primary font-heading">
                    ₹{hotel.discountedPrice.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/night</span>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-primary font-heading">
                  ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-400">/night</span>
                </div>
              )}
              <div className="text-xs text-gray-400">{hotel.roomsAvailable} rooms left</div>
            </div>
          </div>
          {/* Two buttons side by side */}
          <div className="flex gap-2">
            <button onClick={() => onView(hotel)}
              className="flex-1 btn-outline btn-sm justify-center py-2.5 text-xs">
              View Details
            </button>
            <button onClick={() => onBook(hotel)}
              className="flex-1 btn-primary btn-sm justify-center py-2.5 text-xs">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Booking Modal ──────────────────────────────── */
function BookingModal({ hotel, onClose }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const checkIn  = watch('checkIn');
  const checkOut = watch('checkOut');
  const nights   = checkIn && checkOut ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24))) : 1;
  const rooms    = parseInt(watch('rooms') || 1);
  const price    = hotel.discountedPrice || hotel.pricePerNight;
  const total    = price * nights * rooms;

  const onSubmit = async (data) => {
    try {
      const { data: res } = await API.post('/hotels/book', { ...data, hotelId: hotel._id });
      if (res.success) { toast.success(res.message); onClose(); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-5 rounded-t-2xl">
          <h2 className="font-heading font-bold text-lg">{hotel.name}</h2>
          <p className="text-white/80 text-sm flex items-center gap-1 mt-1"><FiMapPin size={12} />{hotel.location}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Your Name *</label>
              <input className={`form-input ${errors.name ? 'border-red-400' : ''}`} {...register('name', { required: 'Required' })} />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Phone *</label>
              <input type="tel" className={`form-input ${errors.phone ? 'border-red-400' : ''}`} {...register('phone', { required: 'Required' })} />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <label className="form-label">Email *</label>
            <input type="email" className={`form-input ${errors.email ? 'border-red-400' : ''}`} {...register('email', { required: 'Required' })} />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Check In *</label>
              <input type="date" min={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.checkIn ? 'border-red-400' : ''}`}
                {...register('checkIn', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">Check Out *</label>
              <input type="date" min={checkIn || new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.checkOut ? 'border-red-400' : ''}`}
                {...register('checkOut', { required: 'Required' })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Guests</label>
              <select className="form-input" {...register('guests')}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Rooms</label>
              <select className="form-input" {...register('rooms')}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n===1?'Room':'Rooms'}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="form-label">Special Requests</label>
            <textarea rows={2} className="form-input resize-none text-sm" placeholder="Any special requirements..." {...register('message')} />
          </div>
          {checkIn && checkOut && (
            <div className="bg-primary/5 rounded-xl p-4 text-sm">
              <div className="flex justify-between mb-1 text-gray-600">
                <span>₹{price.toLocaleString('en-IN')} × {nights} night{nights>1?'s':''} × {rooms} room{rooms>1?'s':''}</span>
              </div>
              <div className="flex justify-between font-bold text-primary text-base">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-outline btn-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary btn-sm">
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function HotelsPage() {
  const [hotels,  setHotels]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [detail,  setDetail]  = useState(null);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    API.get('/hotels').then(r => setHotels(r.data.data.hotels)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = hotels.filter(h =>
    !search ||
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Hotels & Stays</h1>
        <p className="text-white/80">Handpicked accommodations across India's finest destinations</p>
      </div>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Search bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="form-input pl-9"
                placeholder="Search hotels or destinations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <button onClick={() => setSearch('')}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">
                Clear
              </button>
            )}
          </div>

          {loading ? <PageLoader /> : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🏨</div>
              <p className="font-semibold text-gray-600 mb-1">No hotels found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{filtered.length} hotel{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map(h => (
                  <HotelCard
                    key={h._id}
                    hotel={h}
                    onBook={setBooking}
                    onView={setDetail}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {detail && (
        <HotelDetailModal
          hotel={detail}
          onClose={() => setDetail(null)}
          onBook={(h) => { setDetail(null); setBooking(h); }}
        />
      )}

      {/* Booking modal */}
      {booking && (
        <BookingModal
          hotel={booking}
          onClose={() => setBooking(null)}
        />
      )}
    </>
  );
}
