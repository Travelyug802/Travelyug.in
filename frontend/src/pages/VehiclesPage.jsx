import { useState, useEffect } from 'react';
import { FiMapPin, FiUsers, FiZap, FiX, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { PageLoader } from '../components/WhatsAppButton';

const TYPE_ICON = { car:'🚗', bike:'🏍️', bus:'🚌', van:'🚐', suv:'🚙' };
const TYPE_CLR  = {
  car:  'bg-blue-50 text-blue-700',
  bike: 'bg-orange-50 text-orange-700',
  bus:  'bg-green-50 text-green-700',
  van:  'bg-purple-50 text-purple-700',
  suv:  'bg-indigo-50 text-indigo-700',
};
const TYPES = ['all','car','bike','bus','van','suv'];
const WA_NUMBER = import.meta.env.VITE_WHATSAPP || '919805706010';

/* ─── Vehicle Detail Modal ───────────────────────── */
function VehicleDetailModal({ vehicle: v, onClose, onBook }) {
  const img = v.images?.find(i => i.isPrimary) || v.images?.[0];
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Hero image */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          {img?.url
            ? <img src={img.url} alt={v.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-6xl">{TYPE_ICON[v.type] || '🚗'}</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`badge capitalize ${TYPE_CLR[v.type] || 'bg-gray-100 text-gray-700'}`}>{v.type}</span>
            <span className="badge bg-secondary/90 text-white text-xs">{v.fuelType}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <FiX size={16} className="text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-5">
            <h2 className="text-2xl font-heading font-bold text-white">{v.name}</h2>
            <p className="text-white/80 text-sm mt-0.5 capitalize">{v.type} · {v.fuelType} · {v.transmission}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              ['Seats', `${v.seatingCapacity} persons`],
              ['Transmission', v.transmission],
              ['Fuel', v.fuelType],
              ['Type', v.type],
              ...(v.location ? [['Pickup', v.location]] : []),
            ].map(([k, val]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400">{k}</div>
                <div className="font-semibold text-sm text-gray-900 capitalize mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between bg-secondary/5 rounded-xl p-4 mb-5">
            <div>
              {v.discountedPrice ? (
                <>
                  <div className="text-sm text-gray-400 line-through">₹{v.pricePerDay.toLocaleString('en-IN')}/day</div>
                  <div className="text-2xl font-bold text-primary font-heading">
                    ₹{v.discountedPrice.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/day</span>
                  </div>
                </>
              ) : (
                <div className="text-2xl font-bold text-primary font-heading">
                  ₹{v.pricePerDay.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-400">/day</span>
                </div>
              )}
            </div>
            <span className={`badge text-sm px-4 py-2 ${v.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {v.available ? '✓ Available' : 'Booked'}
            </span>
          </div>

          {/* Features */}
          {v.features?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-heading font-bold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {v.features.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 badge bg-primary/10 text-primary text-xs px-3 py-1.5">
                    <FiCheck size={11} />{f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => { onClose(); onBook(v); }}
              className="flex-1 btn-primary justify-center py-3"
              disabled={!v.available}>
              {v.available ? 'Rent Now' : 'Currently Unavailable'}
            </button>
            <a href={`https://wa.me/${WA_NUMBER}?text=Hi! I'm interested in renting ${v.name} (${v.type}, ${v.fuelType}) at ₹${(v.discountedPrice || v.pricePerDay).toLocaleString('en-IN')}/day.`}
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

/* ─── Vehicle Card ───────────────────────────────── */
function VehicleCard({ v, onBook, onView }) {
  const img = v.images?.find(i => i.isPrimary) || v.images?.[0];
  return (
    <div className="card group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onView(v)}>
        {img?.url
          ? <img src={img.url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-5xl">{TYPE_ICON[v.type] || '🚗'}</div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-3 left-3 badge capitalize ${TYPE_CLR[v.type] || 'bg-gray-100 text-gray-700'}`}>{v.type}</span>
        <span className="absolute top-3 right-3 badge bg-secondary/90 text-white text-xs">{v.fuelType}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-heading font-bold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => onView(v)}>
          {v.name}
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><FiUsers size={12} />{v.seatingCapacity} seats</span>
          <span className="flex items-center gap-1"><FiZap size={12} />{v.transmission}</span>
          {v.location && <span className="flex items-center gap-1"><FiMapPin size={12} />{v.location}</span>}
        </div>
        {v.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {v.features.slice(0, 3).map((f, i) => <span key={i} className="badge bg-gray-100 text-gray-600 text-xs">{f}</span>)}
            {v.features.length > 3 && <span className="badge bg-gray-100 text-gray-500 text-xs">+{v.features.length - 3}</span>}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-end justify-between mb-3">
            <div>
              {v.discountedPrice ? (
                <>
                  <div className="text-xs text-gray-400 line-through">₹{v.pricePerDay.toLocaleString('en-IN')}/day</div>
                  <div className="text-xl font-bold text-primary font-heading">
                    ₹{v.discountedPrice.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/day</span>
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-primary font-heading">
                  ₹{v.pricePerDay.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-gray-400">/day</span>
                </div>
              )}
            </div>
          </div>
          {/* Two buttons */}
          <div className="flex gap-2">
            <button onClick={() => onView(v)}
              className="flex-1 btn-outline btn-sm justify-center py-2.5 text-xs">
              View Details
            </button>
            <button onClick={() => onBook(v)}
              disabled={!v.available}
              className="flex-1 btn-primary btn-sm justify-center py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
              {v.available ? 'Rent Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Booking Modal ──────────────────────────────── */
function BookingModal({ vehicle, onClose }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const startDate = watch('startDate');
  const endDate   = watch('endDate');
  const days  = startDate && endDate ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000*60*60*24))) : 1;
  const price = vehicle.discountedPrice || vehicle.pricePerDay;
  const total = price * days;

  const onSubmit = async (data) => {
    try {
      const { data: res } = await API.post('/vehicles/book', { ...data, vehicleId: vehicle._id });
      if (res.success) { toast.success(res.message); onClose(); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="bg-gradient-to-r from-secondary to-primary text-white p-5 rounded-t-2xl">
          <h2 className="font-heading font-bold text-lg">{vehicle.name}</h2>
          <p className="text-white/80 text-sm mt-1 capitalize">{vehicle.type} · {vehicle.fuelType} · {vehicle.seatingCapacity} seats</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Start Date *</label>
              <input type="date" min={new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.startDate ? 'border-red-400' : ''}`}
                {...register('startDate', { required: 'Required' })} />
            </div>
            <div>
              <label className="form-label">End Date *</label>
              <input type="date" min={startDate || new Date().toISOString().split('T')[0]}
                className={`form-input ${errors.endDate ? 'border-red-400' : ''}`}
                {...register('endDate', { required: 'Required' })} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Pickup Location</label>
              <input className="form-input text-sm" placeholder="e.g. Shimla Airport" {...register('pickupLocation')} />
            </div>
            <div>
              <label className="form-label">Drop Location</label>
              <input className="form-input text-sm" placeholder="e.g. Manali / Same" {...register('dropoffLocation')} />
            </div>
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea rows={2} className="form-input resize-none text-sm" placeholder="Special requirements..." {...register('message')} />
          </div>
          {startDate && endDate && (
            <div className="bg-secondary/5 rounded-xl p-4 text-sm">
              <div className="flex justify-between mb-1 text-gray-600">
                <span>₹{price.toLocaleString('en-IN')} × {days} day{days > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between font-bold text-primary text-base">
                <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn-outline btn-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary btn-sm">
              {isSubmitting ? 'Booking...' : 'Confirm Rental'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────── */
export default function VehiclesPage() {
  const [vehicles,   setVehicles]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [booking,    setBooking]    = useState(null);
  const [detail,     setDetail]     = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    API.get('/vehicles').then(r => setVehicles(r.data.data.vehicles)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = typeFilter === 'all' ? vehicles : vehicles.filter(v => v.type === typeFilter);

  return (
    <>
      <div className="page-header pt-32">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Vehicle Rentals</h1>
        <p className="text-white/80">Cars, bikes, buses and more — explore at your own pace</p>
      </div>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Type filter tabs */}
          <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide flex-nowrap sm:flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all flex items-center gap-1.5 ${typeFilter === t ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/10'}`}>
                {TYPE_ICON[t] || ''} {t}
              </button>
            ))}
          </div>

          {loading ? <PageLoader /> : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🚗</div>
              <p className="font-semibold text-gray-600 mb-1">No vehicles found</p>
              <p className="text-sm">Try a different category</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''} available</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map(v => (
                  <VehicleCard
                    key={v._id}
                    v={v}
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
        <VehicleDetailModal
          vehicle={detail}
          onClose={() => setDetail(null)}
          onBook={(v) => { setDetail(null); setBooking(v); }}
        />
      )}

      {/* Booking modal */}
      {booking && (
        <BookingModal
          vehicle={booking}
          onClose={() => setBooking(null)}
        />
      )}
    </>
  );
}
