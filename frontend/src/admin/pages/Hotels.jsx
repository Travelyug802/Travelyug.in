import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import { ConfirmModal, Toggle, PageLoader, StatusBadge } from '../../components/WhatsAppButton';

const CAT = ['budget','standard','deluxe','luxury'];
const EMPTY = { name:'', location:'', description:'', pricePerNight:'', discountedPrice:'', roomsAvailable:10, starRating:3, category:'standard', amenities:[''], images:[{url:'',alt:'',isPrimary:true}], isFeatured:false, isActive:true };

/* ─────────────── HOTELS CRUD ─────────────── */
export function HotelsAdmin() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm,setShowForm]= useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [del,     setDel]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/hotels/admin/all'); setList(data.data); }
    catch { toast.error('Failed to load hotels.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = h => {
    setEditing(h._id);
    setForm({ ...h, pricePerNight: String(h.pricePerNight||''), discountedPrice: String(h.discountedPrice||''),
      amenities: h.amenities?.length ? h.amenities : [''],
      images: h.images?.length ? h.images : [{url:'',alt:'',isPrimary:true}]
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name?.trim() || !form.location?.trim() || !form.pricePerNight) {
      toast.error('Name, location and price are required.'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, pricePerNight: parseFloat(form.pricePerNight)||0,
        discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : undefined,
        roomsAvailable: parseInt(form.roomsAvailable)||0, starRating: parseInt(form.starRating)||3,
        amenities: form.amenities.filter(Boolean), images: form.images.filter(i=>i.url)
      };
      const { data } = editing ? await API.put(`/hotels/${editing}`,payload) : await API.post('/hotels',payload);
      if (data.success) { toast.success(editing?'Updated!':'Created!'); setShowForm(false); load(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.response?.data?.message||'Error.'); } finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`/hotels/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); } finally { setDel(null); }
  };

  const arrChange = (f,i,v) => { const a=[...form[f]]; a[i]=v; setForm({...form,[f]:a}); };
  const addArr    = f => setForm({...form,[f]:[...form[f],'']});
  const rmArr     = (f,i) => { const a=form[f].filter((_,j)=>j!==i); setForm({...form,[f]:a.length?a:['']}); };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-gray-900">Hotels</h1><p className="text-sm text-gray-400">{list.length} total</p></div>
        <button onClick={()=>{setEditing(null);setForm(EMPTY);setShowForm(true);}} className="btn-primary btn-sm"><FiPlus/>Add Hotel</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><PageLoader /></div>
        : list.length===0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🏨</p><p className="text-sm">No hotels yet.</p></div>
        : <div className="overflow-x-auto"><table className="w-full">
            <thead><tr><th className="admin-th">Hotel</th><th className="admin-th hidden sm:table-cell">Location</th><th className="admin-th">Price/Night</th><th className="admin-th hidden md:table-cell">Rooms Left</th><th className="admin-th">Status</th><th className="admin-th text-center">Actions</th></tr></thead>
            <tbody>
              {list.map(h => (
                <tr key={h._id} className="hover:bg-gray-50">
                  <td className="admin-td">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {h.images?.[0]?.url ? <img src={h.images[0].url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-sm">🏨</div>}
                      </div>
                      <div><div className="font-semibold text-sm max-w-[160px] truncate">{h.name}</div>{'⭐'.repeat(h.starRating||3)}</div>
                    </div>
                  </td>
                  <td className="admin-td hidden sm:table-cell text-gray-500 text-sm">{h.location}</td>
                  <td className="admin-td font-semibold text-primary text-sm">₹{(h.discountedPrice||h.pricePerNight)?.toLocaleString('en-IN')}</td>
                  <td className="admin-td hidden md:table-cell text-sm text-gray-500">{h.roomsAvailable}</td>
                  <td className="admin-td"><span className={`badge text-xs ${h.isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>{h.isActive?'Active':'Inactive'}</span></td>
                  <td className="admin-td"><div className="flex justify-center gap-1">
                    <button onClick={()=>openEdit(h)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={14}/></button>
                    <button onClick={()=>setDel(h)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-heading font-bold">{editing?'Edit Hotel':'Add Hotel'}</h2>
              <button onClick={()=>setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="form-label">Hotel Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div><label className="form-label">Location *</label><input className="form-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
              <div><label className="form-label">Description</label><textarea rows={2} className="form-input resize-none text-sm" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div><label className="form-label">Price/Night ₹ *</label><input type="number" className="form-input" value={form.pricePerNight} onChange={e=>setForm({...form,pricePerNight:e.target.value})} /></div>
                <div><label className="form-label">Discounted ₹</label><input type="number" className="form-input" value={form.discountedPrice} onChange={e=>setForm({...form,discountedPrice:e.target.value})} /></div>
                <div><label className="form-label">Rooms</label><input type="number" className="form-input" value={form.roomsAvailable} onChange={e=>setForm({...form,roomsAvailable:e.target.value})} /></div>
                <div><label className="form-label">Stars</label><select className="form-input" value={form.starRating} onChange={e=>setForm({...form,starRating:e.target.value})}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}★</option>)}</select></div>
              </div>
              <div><label className="form-label">Category</label><select className="form-input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CAT.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}</select></div>
              <div><label className="form-label">Primary Image URL</label><input type="url" className="form-input text-sm" placeholder="https://…" value={form.images?.[0]?.url||''} onChange={e=>{const imgs=[...form.images];imgs[0]={...imgs[0],url:e.target.value,isPrimary:true};setForm({...form,images:imgs})}} /></div>
              <div>
                <label className="form-label">Amenities</label>
                {form.amenities.map((a,i)=>(
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="form-input text-sm" value={a} placeholder="e.g. WiFi, Pool, Parking" onChange={e=>arrChange('amenities',i,e.target.value)} />
                    <button type="button" onClick={()=>rmArr('amenities',i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><FiX size={13}/></button>
                  </div>
                ))}
                <button type="button" onClick={()=>addArr('amenities')} className="text-sm text-primary hover:underline flex items-center gap-1"><FiPlus size={13}/>Add Amenity</button>
              </div>
              <div className="flex gap-8 pt-2">
                <Toggle checked={form.isFeatured} onChange={v=>setForm({...form,isFeatured:v})} label="Featured" />
                <Toggle checked={form.isActive}   onChange={v=>setForm({...form,isActive:v})}   label="Active" colorOn="bg-green-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={()=>setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving?'Saving…':editing?'Update':'Create'}</button>
            </div>
          </div>
        </div>
      )}
      {del && <ConfirmModal title="Deactivate Hotel?" message={`"${del.name}" will be hidden from visitors.`} confirmLabel="Deactivate" onConfirm={remove} onCancel={()=>setDel(null)} />}
    </div>
  );
}

/* ─────────────── HOTEL BOOKINGS ─────────────── */
export function HotelBookingsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState(null);
  const [del, setDel] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = tab !== 'all' ? `?status=${tab}` : '';
      const { data } = await API.get(`/hotels/admin/bookings${p}`);
      setList(data.data.bookings);
    } catch { toast.error('Failed.'); } finally { setLoading(false); }
  }, [tab]);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status, notes) => {
    try { await API.put(`/hotels/admin/bookings/${id}`, { status, adminNotes: notes, isRead: true }); toast.success('Updated.'); load(); setSel(null); }
    catch { toast.error('Failed.'); }
  };
  const remove = async () => {
    try { await API.delete(`/hotels/admin/bookings/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); } finally { setDel(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div><h1 className="text-2xl font-heading font-bold text-gray-900">Hotel Bookings</h1><p className="text-sm text-gray-400">{list.length} shown</p></div>
      <div className="flex flex-wrap gap-2">
        {['all','new','confirmed','cancelled','checked_in','checked_out'].map(s=>(
          <button key={s} onClick={()=>setTab(s)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab===s?'bg-primary text-white':'bg-white text-gray-600 border border-gray-200 hover:bg-primary/5'}`}>{s.replace('_',' ')}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><PageLoader /></div>
        : list.length===0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📅</p><p className="text-sm">No hotel bookings.</p></div>
        : <div className="overflow-x-auto"><table className="w-full">
            <thead><tr><th className="admin-th">Guest</th><th className="admin-th hidden sm:table-cell">Hotel</th><th className="admin-th hidden md:table-cell">Check In</th><th className="admin-th hidden md:table-cell">Nights</th><th className="admin-th">Total</th><th className="admin-th">Status</th><th className="admin-th text-center">Actions</th></tr></thead>
            <tbody>
              {list.map(b => {
                const nights = b.checkIn && b.checkOut ? Math.max(1, Math.ceil((new Date(b.checkOut)-new Date(b.checkIn))/(1000*60*60*24))) : '—';
                return (
                  <tr key={b._id} className={`hover:bg-gray-50 ${!b.isRead?'bg-blue-50/20':''}`}>
                    <td className="admin-td"><div className="font-semibold text-sm">{b.name}</div><div className="text-xs text-gray-400">{b.email}</div>{!b.isRead&&<span className="badge bg-blue-100 text-blue-600 text-xs">New</span>}</td>
                    <td className="admin-td hidden sm:table-cell text-sm text-gray-600">{b.hotelName||'—'}</td>
                    <td className="admin-td hidden md:table-cell text-sm text-gray-600">{b.checkIn?format(new Date(b.checkIn),'dd MMM yyyy'):'—'}</td>
                    <td className="admin-td hidden md:table-cell text-sm text-gray-600">{nights}</td>
                    <td className="admin-td font-semibold text-primary text-sm">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="admin-td"><span className={`badge text-xs capitalize ${b.status==='confirmed'?'bg-green-100 text-green-700':b.status==='new'?'bg-blue-100 text-blue-700':b.status==='cancelled'?'bg-red-100 text-red-600':'bg-gray-100 text-gray-600'}`}>{b.status?.replace('_',' ')}</span></td>
                    <td className="admin-td"><div className="flex justify-center gap-1">
                      <button onClick={()=>setSel(b)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEye size={14}/></button>
                      <button onClick={()=>setDel(b)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14}/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>}
      </div>
      {sel && <BookingDetailModal booking={sel} type="hotel" onClose={()=>setSel(null)} onSave={updateStatus} />}
      {del && <ConfirmModal title="Delete Booking?" message={`Delete booking from ${del.name}?`} confirmLabel="Delete" onConfirm={remove} onCancel={()=>setDel(null)} />}
    </div>
  );
}

/* ─── Shared booking detail modal ─── */
function BookingDetailModal({ booking: b, type, onClose, onSave }) {
  const [status, setStatus] = useState(b.status);
  const [notes,  setNotes]  = useState(b.adminNotes||'');
  const [saving, setSaving] = useState(false);
  const hotelStatuses   = ['new','confirmed','cancelled','checked_in','checked_out'];
  const vehicleStatuses = ['new','confirmed','cancelled','active','returned'];
  const statuses = type === 'hotel' ? hotelStatuses : vehicleStatuses;

  const save = async () => { setSaving(true); await onSave(b._id, status, notes); setSaving(false); };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-heading font-bold capitalize">{type} Booking Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX/></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {[['Name',b.name],['Email',b.email],['Phone',b.phone],
              type==='hotel'
                ? ['Hotel',b.hotelName||b.hotelId?.name||'—']
                : ['Vehicle',b.vehicleName||b.vehicleId?.name||'—'],
              type==='hotel'
                ? ['Check In', b.checkIn?format(new Date(b.checkIn),'dd MMM yyyy'):'—']
                : ['Start Date', b.startDate?format(new Date(b.startDate),'dd MMM yyyy'):'—'],
              type==='hotel'
                ? ['Check Out', b.checkOut?format(new Date(b.checkOut),'dd MMM yyyy'):'—']
                : ['End Date', b.endDate?format(new Date(b.endDate),'dd MMM yyyy'):'—'],
              ['Total Price',`₹${b.totalPrice?.toLocaleString('en-IN')}`],
              type==='hotel'?['Guests/Rooms',`${b.guests} guests · ${b.rooms} room(s)`]:['Pickup',b.pickupLocation||'—'],
            ].map(([k,v])=>(
              <div key={k} className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400">{k}</div><div className="font-semibold text-sm text-gray-900 mt-0.5">{v}</div></div>
            ))}
          </div>
          {b.message && <div className="bg-gray-50 rounded-xl p-3"><div className="text-xs text-gray-400 mb-1">Message</div><p className="text-sm text-gray-700">{b.message}</p></div>}
          <div><label className="form-label">Update Status</label><select className="form-input text-sm" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>)}</select></div>
          <div><label className="form-label">Admin Notes</label><textarea rows={3} className="form-input resize-none text-sm" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Internal notes…"/></div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-outline btn-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving?'Saving…':'Save'}</button>
        </div>
      </div>
    </div>
  );
}

export { BookingDetailModal };
export default HotelsAdmin;
