import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import { ConfirmModal, Toggle, PageLoader } from '../../components/WhatsAppButton';
import { BookingDetailModal } from './Hotels';

const TYPES      = ['car','bike','bus','van','suv'];
const FUEL_TYPES = ['petrol','diesel','electric','cng','hybrid'];
const TRANS      = ['manual','automatic'];
const EMPTY = { name:'', type:'car', pricePerDay:'', discountedPrice:'', fuelType:'petrol', seatingCapacity:5, transmission:'manual', location:'', features:[''], images:[{url:'',alt:'',isPrimary:true}], available:true, isFeatured:false, isActive:true };

/* ─────────────── VEHICLES CRUD ─────────────── */
export function VehiclesAdmin() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm,setShowForm]= useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [del,     setDel]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/vehicles/admin/all'); setList(data.data); }
    catch { toast.error('Failed to load vehicles.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openEdit = v => {
    setEditing(v._id);
    setForm({ ...v, pricePerDay: String(v.pricePerDay||''), discountedPrice: String(v.discountedPrice||''),
      features: v.features?.length ? v.features : [''],
      images: v.images?.length ? v.images : [{url:'',alt:'',isPrimary:true}]
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name?.trim() || !form.pricePerDay) { toast.error('Name and price required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, pricePerDay: parseFloat(form.pricePerDay)||0,
        discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : undefined,
        seatingCapacity: parseInt(form.seatingCapacity)||5,
        features: form.features.filter(Boolean), images: form.images.filter(i=>i.url)
      };
      const { data } = editing ? await API.put(`/vehicles/${editing}`,payload) : await API.post('/vehicles',payload);
      if (data.success) { toast.success(editing?'Updated!':'Created!'); setShowForm(false); load(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.response?.data?.message||'Error.'); } finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`/vehicles/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); } finally { setDel(null); }
  };

  const arrChange = (f,i,v) => { const a=[...form[f]]; a[i]=v; setForm({...form,[f]:a}); };
  const addArr    = f => setForm({...form,[f]:[...form[f],'']});
  const rmArr     = (f,i) => { const a=form[f].filter((_,j)=>j!==i); setForm({...form,[f]:a.length?a:['']}); };

  const TYPE_ICON = { car:'🚗', bike:'🏍️', bus:'🚌', van:'🚐', suv:'🚙' };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-gray-900">Vehicles</h1><p className="text-sm text-gray-400">{list.length} total</p></div>
        <button onClick={()=>{setEditing(null);setForm(EMPTY);setShowForm(true);}} className="btn-primary btn-sm"><FiPlus/>Add Vehicle</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><PageLoader /></div>
        : list.length===0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🚗</p><p className="text-sm">No vehicles yet.</p></div>
        : <div className="overflow-x-auto"><table className="w-full">
            <thead><tr><th className="admin-th">Vehicle</th><th className="admin-th hidden sm:table-cell">Type</th><th className="admin-th">Price/Day</th><th className="admin-th hidden md:table-cell">Seats</th><th className="admin-th">Status</th><th className="admin-th text-center">Actions</th></tr></thead>
            <tbody>
              {list.map(v => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="admin-td">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {v.images?.[0]?.url ? <img src={v.images[0].url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-lg">{TYPE_ICON[v.type]||'🚗'}</div>}
                      </div>
                      <div><div className="font-semibold text-sm max-w-[160px] truncate">{v.name}</div><div className="text-xs text-gray-400 capitalize">{v.fuelType} · {v.transmission}</div></div>
                    </div>
                  </td>
                  <td className="admin-td hidden sm:table-cell text-gray-500 text-sm capitalize">{v.type}</td>
                  <td className="admin-td font-semibold text-primary text-sm">₹{(v.discountedPrice||v.pricePerDay)?.toLocaleString('en-IN')}</td>
                  <td className="admin-td hidden md:table-cell text-sm text-gray-500">{v.seatingCapacity}</td>
                  <td className="admin-td">
                    <span className={`badge text-xs ${v.isActive&&v.available?'bg-green-100 text-green-700':v.isActive&&!v.available?'bg-amber-100 text-amber-700':'bg-red-100 text-red-600'}`}>
                      {v.isActive ? (v.available?'Available':'Booked') : 'Inactive'}
                    </span>
                  </td>
                  <td className="admin-td"><div className="flex justify-center gap-1">
                    <button onClick={()=>openEdit(v)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={14}/></button>
                    <button onClick={()=>setDel(v)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14}/></button>
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
              <h2 className="text-lg font-heading font-bold">{editing?'Edit Vehicle':'Add Vehicle'}</h2>
              <button onClick={()=>setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="form-label">Vehicle Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label className="form-label">Type *</label><select className="form-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div><label className="form-label">Price/Day ₹ *</label><input type="number" className="form-input" value={form.pricePerDay} onChange={e=>setForm({...form,pricePerDay:e.target.value})} /></div>
                <div><label className="form-label">Discounted ₹</label><input type="number" className="form-input" value={form.discountedPrice} onChange={e=>setForm({...form,discountedPrice:e.target.value})} /></div>
                <div><label className="form-label">Seats</label><input type="number" className="form-input" value={form.seatingCapacity} onChange={e=>setForm({...form,seatingCapacity:e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div><label className="form-label">Fuel Type</label><select className="form-input" value={form.fuelType} onChange={e=>setForm({...form,fuelType:e.target.value})}>{FUEL_TYPES.map(f=><option key={f} value={f}>{f.charAt(0).toUpperCase()+f.slice(1)}</option>)}</select></div>
                <div><label className="form-label">Transmission</label><select className="form-input" value={form.transmission} onChange={e=>setForm({...form,transmission:e.target.value})}>{TRANS.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select></div>
                <div><label className="form-label">Location</label><input className="form-input text-sm" placeholder="e.g. Delhi" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
              </div>
              <div><label className="form-label">Primary Image URL</label><input type="url" className="form-input text-sm" placeholder="https://…" value={form.images?.[0]?.url||''} onChange={e=>{const imgs=[...form.images];imgs[0]={...imgs[0],url:e.target.value,isPrimary:true};setForm({...form,images:imgs})}} /></div>
              <div>
                <label className="form-label">Features</label>
                {form.features.map((f,i)=>(
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="form-input text-sm" value={f} placeholder="e.g. AC, GPS, Music System" onChange={e=>arrChange('features',i,e.target.value)} />
                    <button type="button" onClick={()=>rmArr('features',i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><FiX size={13}/></button>
                  </div>
                ))}
                <button type="button" onClick={()=>addArr('features')} className="text-sm text-primary hover:underline flex items-center gap-1"><FiPlus size={13}/>Add Feature</button>
              </div>
              <div className="flex gap-8 pt-2">
                <Toggle checked={form.available}  onChange={v=>setForm({...form,available:v})}  label="Available for Rent" colorOn="bg-green-500" />
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
      {del && <ConfirmModal title="Deactivate Vehicle?" message={`"${del.name}" will be hidden.`} confirmLabel="Deactivate" onConfirm={remove} onCancel={()=>setDel(null)} />}
    </div>
  );
}

/* ─────────────── VEHICLE BOOKINGS ─────────────── */
export function VehicleBookingsAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState(null);
  const [del, setDel] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = tab !== 'all' ? `?status=${tab}` : '';
      const { data } = await API.get(`/vehicles/admin/bookings${p}`);
      setList(data.data.bookings);
    } catch { toast.error('Failed.'); } finally { setLoading(false); }
  }, [tab]);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status, notes) => {
    try { await API.put(`/vehicles/admin/bookings/${id}`,{status, adminNotes:notes, isRead:true}); toast.success('Updated.'); load(); setSel(null); }
    catch { toast.error('Failed.'); }
  };
  const remove = async () => {
    try { await API.delete(`/vehicles/admin/bookings/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); } finally { setDel(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div><h1 className="text-2xl font-heading font-bold text-gray-900">Vehicle Bookings</h1><p className="text-sm text-gray-400">{list.length} shown</p></div>
      <div className="flex flex-wrap gap-2">
        {['all','new','confirmed','cancelled','active','returned'].map(s=>(
          <button key={s} onClick={()=>setTab(s)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab===s?'bg-primary text-white':'bg-white text-gray-600 border border-gray-200 hover:bg-primary/5'}`}>{s}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><PageLoader /></div>
        : list.length===0 ? <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">🚗</p><p className="text-sm">No vehicle bookings.</p></div>
        : <div className="overflow-x-auto"><table className="w-full">
            <thead><tr><th className="admin-th">Customer</th><th className="admin-th hidden sm:table-cell">Vehicle</th><th className="admin-th hidden md:table-cell">Start Date</th><th className="admin-th hidden md:table-cell">Days</th><th className="admin-th">Total</th><th className="admin-th">Status</th><th className="admin-th text-center">Actions</th></tr></thead>
            <tbody>
              {list.map(b => {
                const days = b.startDate && b.endDate ? Math.max(1,Math.ceil((new Date(b.endDate)-new Date(b.startDate))/(1000*60*60*24))) : '—';
                return (
                  <tr key={b._id} className={`hover:bg-gray-50 ${!b.isRead?'bg-blue-50/20':''}`}>
                    <td className="admin-td"><div className="font-semibold text-sm">{b.name}</div><div className="text-xs text-gray-400">{b.email}</div></td>
                    <td className="admin-td hidden sm:table-cell text-sm text-gray-600">{b.vehicleName||'—'}</td>
                    <td className="admin-td hidden md:table-cell text-sm text-gray-600">{b.startDate?format(new Date(b.startDate),'dd MMM yyyy'):'—'}</td>
                    <td className="admin-td hidden md:table-cell text-sm text-gray-600">{days}</td>
                    <td className="admin-td font-semibold text-primary text-sm">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="admin-td"><span className={`badge text-xs capitalize ${b.status==='confirmed'||b.status==='active'?'bg-green-100 text-green-700':b.status==='new'?'bg-blue-100 text-blue-700':b.status==='cancelled'?'bg-red-100 text-red-600':'bg-gray-100 text-gray-600'}`}>{b.status}</span></td>
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
      {sel && <BookingDetailModal booking={sel} type="vehicle" onClose={()=>setSel(null)} onSave={updateStatus} />}
      {del && <ConfirmModal title="Delete Booking?" message={`Delete booking from ${del.name}?`} confirmLabel="Delete" onConfirm={remove} onCancel={()=>setDel(null)} />}
    </div>
  );
}

export default VehiclesAdmin;
