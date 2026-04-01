// PackageCard.jsx
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiStar } from 'react-icons/fi';

const CAT_CLR = { domestic:'bg-blue-50 text-blue-700', international:'bg-purple-50 text-purple-700', adventure:'bg-orange-50 text-orange-700', honeymoon:'bg-pink-50 text-pink-700', family:'bg-green-50 text-green-700', pilgrimage:'bg-yellow-50 text-yellow-700', luxury:'bg-gray-100 text-gray-700' };

export function PackageCard({ pkg }) {
  const img      = pkg.images?.find(i => i.isPrimary) || pkg.images?.[0];
  const discount = pkg.discountedPrice ? Math.round(((pkg.price - pkg.discountedPrice) / pkg.price) * 100) : null;
  return (
    <div className="card group h-full flex flex-col">
      <div className="relative h-52 overflow-hidden">
        {img?.url
          ? <img src={img.url} alt={img.alt || pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">🏖️</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className={`badge ${CAT_CLR[pkg.category] || 'bg-gray-100 text-gray-700'} capitalize`}>{pkg.category}</span>
          {pkg.isFeatured && <span className="badge bg-accent text-gray-900">⭐ Featured</span>}
          {discount       && <span className="badge bg-red-500 text-white">{discount}% OFF</span>}
        </div>
        {pkg.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5">
            <FiStar className="text-amber-400 text-xs" />
            <span className="text-xs font-bold">{pkg.rating}</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1 bg-white/90 rounded-full px-2.5 py-1 text-xs font-semibold text-gray-800">
            <FiClock className="text-secondary" />{pkg.duration}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <FiMapPin className="text-secondary flex-shrink-0" /><span className="truncate">{pkg.location}</span>
        </div>
        <h3 className="font-heading font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">{pkg.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{pkg.shortDescription || pkg.description}</p>
        {pkg.highlights?.length > 0 && (
          <ul className="mb-4 space-y-1">
            {pkg.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />{h}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div>
            {pkg.discountedPrice ? (
              <>
                <div className="text-xs text-gray-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</div>
                <div className="text-xl font-bold text-primary font-heading">₹{pkg.discountedPrice.toLocaleString('en-IN')}</div>
              </>
            ) : (
              <div className="text-xl font-bold text-primary font-heading">₹{pkg.price.toLocaleString('en-IN')}</div>
            )}
            <div className="text-xs text-gray-400">per person</div>
          </div>
          <Link to={`/packages/${pkg._id}`} className="btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
}

// BookingForm.jsx
import { useState }        from 'react';
import { useForm }         from 'react-hook-form';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import toast                from 'react-hot-toast';
import API                  from '../api/axios';

export function BookingForm({ packageId = null, packageName = '', destination = '' }) {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { destination, travelers: 2 }
  });

  const onSubmit = async data => {
    try {
      const { data: res } = await API.post('/bookings', { ...data, packageId, packageName, travelers: parseInt(data.travelers) });
      if (res.success) { toast.success(res.message); setDone(true); reset(); }
    } catch (err) { toast.error(err.response?.data?.message || 'Something went wrong.'); }
  };

  if (done) return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiCheckCircle className="text-green-500 text-3xl" /></div>
      <h3 className="text-xl font-heading font-bold mb-2">Inquiry Received!</h3>
      <p className="text-gray-500 text-sm mb-5">Our expert will contact you within 24 hours.</p>
      <button onClick={() => setDone(false)} className="btn-outline btn-sm">Submit Another</button>
    </div>
  );

  const F = ({ name, label, type = 'text', placeholder, rules, className = '' }) => (
    <div className={className}>
      <label className="form-label">{label}</label>
      <input type={type} placeholder={placeholder} className={`form-input ${errors[name] ? 'border-red-400' : ''}`} {...register(name, rules)} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <F name="name"  label="Full Name *"     placeholder="Your name"            rules={{ required: 'Required', minLength: { value: 2, message: 'Too short' } }} />
        <F name="phone" label="Phone *"          placeholder="10-digit mobile"      rules={{ required: 'Required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian mobile' } }} />
      </div>
      <F name="email"       label="Email *"          placeholder="you@email.com"        rules={{ required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }} />
      <F name="destination" label="Destination *"    placeholder="e.g. Kerala, Bali"    rules={{ required: 'Required' }} />
      <div className="grid sm:grid-cols-2 gap-4">
        <F name="travelDate" label="Travel Date *" type="date" rules={{ required: 'Required' }} />
        <div>
          <label className="form-label">Travelers *</label>
          <select className="form-input" {...register('travelers', { required: true })}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="form-label">Message</label>
        <textarea rows={3} placeholder="Special requirements..." className="form-input resize-none" {...register('message')} />
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">
        {isSubmitting ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sending...</> : <><FiSend />Send Inquiry</>}
      </button>
      <p className="text-center text-xs text-gray-400">🔒 Your data is safe. No spam ever.</p>
    </form>
  );
}
