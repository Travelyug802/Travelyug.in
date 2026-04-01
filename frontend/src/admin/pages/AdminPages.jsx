'use strict';
import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiPackage,
         FiEye, FiCalendar, FiStar, FiImage, FiMail, FiUpload } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import { ConfirmModal, Toggle, PageLoader, StatusBadge } from '../../components/WhatsAppButton';

const CATS  = ['domestic','international','adventure','honeymoon','family','pilgrimage','luxury'];
const GCATS = ['beaches','mountains','heritage','wildlife','adventure','city','food','culture'];

/* ─── Cloudinary Upload Helper ──────────────────────────────────── */
async function uploadToCloudinary(file) {
  const CLOUD_NAME  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'travelyug';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', 'travelyug');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.secure_url;
}

/* ─── Cloudinary Image Upload Button ───────────────────────────── */
function CloudinaryUpload({ onUploaded, label = 'Upload Image', multiple = false }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      if (multiple) {
        const urls = await Promise.all(files.map(uploadToCloudinary));
        onUploaded(urls);
        toast.success(`${urls.length} image(s) uploaded!`);
      } else {
        const url = await uploadToCloudinary(files[0]);
        onUploaded(url);
        toast.success('Image uploaded!');
      }
    } catch {
      toast.error('Upload failed. Check Cloudinary settings.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-semibold cursor-pointer hover:bg-primary/5 transition-colors ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
      {uploading ? (
        <><span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />Uploading...</>
      ) : (
        <><FiUpload size={16} />{label}</>
      )}
      <input type="file" className="hidden" accept="image/*" multiple={multiple} onChange={handleFile} disabled={uploading} />
    </label>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PACKAGES
// ═══════════════════════════════════════════════════════════════════
const EPKG = {
  title:'', shortDescription:'', description:'', price:'', discountedPrice:'',
  duration:'', location:'', category:'domestic', isFeatured:false, isActive:true,
  images:[{url:'',alt:'',isPrimary:true}], highlights:[''], inclusions:[''], exclusions:['']
};

export function Packages() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(EPKG);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState('');
  const [del,      setDel]      = useState(null);
  const [pdfFile,  setPdfFile]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/packages/admin/all'); setList(data.data); }
    catch { toast.error('Failed to load packages.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing(null); setForm(EPKG); setPdfFile(null); setShowForm(true); };
  const openEdit = p => {
    setEditing(p._id);
    setForm({
      ...p,
      price:            String(p.price || ''),
      discountedPrice:  String(p.discountedPrice || ''),
      highlights:       p.highlights?.length  ? p.highlights  : [''],
      inclusions:       p.inclusions?.length  ? p.inclusions  : [''],
      exclusions:       p.exclusions?.length  ? p.exclusions  : [''],
      images:           p.images?.length      ? p.images      : [{ url:'', alt:'', isPrimary:true }]
    });
    setPdfFile(null);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title?.trim() || !form.price || !form.duration?.trim() || !form.location?.trim()) {
      toast.error('Fill all required fields: Title, Price, Duration, Location.'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price:          parseFloat(form.price) || 0,
        inclusions:     form.inclusions.filter(Boolean),
        exclusions:     form.exclusions.filter(Boolean),
        highlights:     form.highlights.filter(Boolean),
        images:         form.images.filter(i => i.url),
      };
      if (form.discountedPrice) payload.discountedPrice = parseFloat(form.discountedPrice);
      else delete payload.discountedPrice;
      delete payload.itineraryPdf;

      let resData;
      if (pdfFile) {
        const fd = new FormData();
        fd.append('itineraryPdf', pdfFile);
        fd.append('packageData', JSON.stringify(payload));
        const res = editing ? await API.put(`/packages/${editing}`, fd) : await API.post('/packages', fd);
        resData = res.data;
      } else {
        const res = editing ? await API.put(`/packages/${editing}`, payload) : await API.post('/packages', payload);
        resData = res.data;
      }

      if (resData.success) {
        toast.success(editing ? 'Package updated!' : 'Package created!');
        setShowForm(false); setPdfFile(null); load();
      } else toast.error(resData.message);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`/packages/${del._id}`); toast.success('Package deactivated.'); load(); }
    catch { toast.error('Delete failed.'); }
    finally { setDel(null); }
  };

  const arr    = (f, i, v) => { const a = [...form[f]]; a[i] = v; setForm({ ...form, [f]: a }); };
  const addArr = f => setForm({ ...form, [f]: [...form[f], ''] });
  const rmArr  = (f, i) => { const a = form[f].filter((_, j) => j !== i); setForm({ ...form, [f]: a.length ? a : [''] }); };
  const filtered = list.filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Packages</h1>
          <p className="text-sm text-gray-400">{list.length} total</p>
        </div>
        <button onClick={openNew} className="btn-primary btn-sm"><FiPlus />Add Package</button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="form-input pl-9 text-sm" placeholder="Search packages…" value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><FiX size={14} /></button>}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading
          ? <div className="flex justify-center py-16"><PageLoader /></div>
          : filtered.length === 0
            ? <div className="text-center py-16 text-gray-400"><FiPackage className="text-4xl mx-auto mb-3 text-gray-200" /><p className="text-sm">No packages found.</p></div>
            : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="admin-th">Package</th>
                      <th className="admin-th hidden sm:table-cell">Location</th>
                      <th className="admin-th">Price</th>
                      <th className="admin-th hidden md:table-cell">Duration</th>
                      <th className="admin-th">Status</th>
                      <th className="admin-th text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="admin-td">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {p.images?.[0]?.url
                                ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-sm">🏝</div>}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-gray-900 max-w-[160px] truncate">{p.title}</div>
                              {p.isFeatured && <span className="text-xs text-amber-500">⭐ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="admin-td hidden sm:table-cell text-gray-500 text-sm">{p.location}</td>
                        <td className="admin-td font-semibold text-primary text-sm">₹{(p.discountedPrice || p.price)?.toLocaleString('en-IN')}</td>
                        <td className="admin-td hidden md:table-cell text-sm text-gray-500">{p.duration}</td>
                        <td className="admin-td">
                          <span className={`badge text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="admin-td">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => openEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={14} /></button>
                            <button onClick={() => setDel(p)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        }
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-lg font-heading font-bold">{editing ? 'Edit Package' : 'Add Package'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Short Description</label>
                <textarea rows={2} className="form-input resize-none text-sm" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Full Description *</label>
                <textarea rows={3} className="form-input resize-none" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Discounted Price</label>
                  <input type="number" className="form-input" value={form.discountedPrice} onChange={e => setForm({ ...form, discountedPrice: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Duration *</label>
                  <input className="form-input" placeholder="e.g. 5 Days / 4 Nights" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Location *</label>
                  <input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>

              {/* ── Image upload ── */}
              <div>
                <label className="form-label">Package Image</label>
                <div className="flex flex-col gap-3">
                  {form.images?.[0]?.url && (
                    <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
                      <img src={form.images[0].url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, images: [{ url: '', alt: '', isPrimary: true }] })}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white"
                      ><FiX size={12} /></button>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <CloudinaryUpload
                      label="Upload from Device"
                      onUploaded={url => {
                        const imgs = [...form.images];
                        imgs[0] = { url, alt: form.title, isPrimary: true };
                        setForm({ ...form, images: imgs });
                      }}
                    />
                    <span className="text-xs text-gray-400">or</span>
                    <input
                      type="url"
                      className="form-input text-sm flex-1 min-w-0"
                      placeholder="Paste image URL…"
                      value={form.images?.[0]?.url || ''}
                      onChange={e => {
                        const imgs = [...form.images];
                        imgs[0] = { ...imgs[0], url: e.target.value, isPrimary: true };
                        setForm({ ...form, images: imgs });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Dynamic arrays ── */}
              {['highlights', 'inclusions', 'exclusions'].map(field => (
                <div key={field}>
                  <label className="form-label capitalize">{field}</label>
                  {form[field].map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="form-input text-sm" value={item} placeholder={`${field.slice(0, -1)} ${i + 1}`} onChange={e => arr(field, i, e.target.value)} />
                      <button type="button" onClick={() => rmArr(field, i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><FiX size={13} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addArr(field)} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <FiPlus size={13} />Add {field.slice(0, -1)}
                  </button>
                </div>
              ))}

              {/* ── PDF ── */}
              <div>
                <label className="form-label">Itinerary PDF</label>
                {form.itineraryPdf && !pdfFile && (
                  <div className="mb-2 flex items-center gap-2">
                    <a href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${form.itineraryPdf}`} target="_blank" rel="noreferrer" className="text-xs text-primary underline">View current PDF</a>
                    <span className="text-xs text-gray-400">(upload new to replace)</span>
                  </div>
                )}
                <input type="file" accept="application/pdf" className="form-input text-sm py-2" onChange={e => setPdfFile(e.target.files[0] || null)} />
                {pdfFile && <p className="text-xs text-green-600 mt-1">✓ {pdfFile.name}</p>}
              </div>

              <div className="flex gap-8 pt-2">
                <Toggle checked={form.isFeatured} onChange={v => setForm({ ...form, isFeatured: v })} label="Featured" />
                <Toggle checked={form.isActive}   onChange={v => setForm({ ...form, isActive: v })}   label="Active" colorOn="bg-green-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {del && <ConfirmModal title="Delete Package?" message={`"${del.title}" will be deactivated.`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  BOOKINGS
// ═══════════════════════════════════════════════════════════════════
const STATUS_TABS = ['all','new','contacted','confirmed','cancelled'];

function BookingDetail({ b, onClose, onSaved }) {
  const [status, setStatus] = useState(b.status);
  const [notes,  setNotes]  = useState(b.adminNotes || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await API.put(`/bookings/${b._id}`, { status, adminNotes: notes, isRead: true });
      if (data.success) { toast.success('Updated.'); onSaved(); onClose(); }
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-lg font-heading font-bold">Booking Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {[['Name', b.name], ['Email', b.email], ['Phone', b.phone], ['Destination', b.destination],
              ['Travel Date', format(new Date(b.travelDate), 'dd MMM yyyy')], ['Travelers', b.travelers]
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400">{k}</div>
                <div className="font-semibold text-sm text-gray-900 mt-0.5">{v}</div>
              </div>
            ))}
          </div>
          {b.message && (
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">Message</div>
              <p className="text-sm text-gray-700">{b.message}</p>
            </div>
          )}
          <div>
            <label className="form-label">Status</label>
            <select className="form-input text-sm" value={status} onChange={e => setStatus(e.target.value)}>
              {['new','contacted','confirmed','cancelled'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Admin Notes</label>
            <textarea rows={3} className="form-input resize-none text-sm" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…" />
          </div>
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">{format(new Date(b.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline btn-sm">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Bookings() {
  const [list,       setList]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState('all');
  const [sel,        setSel]        = useState(null);
  const [del,        setDel]        = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: '20' });
      if (tab !== 'all') p.set('status', tab);
      const { data } = await API.get(`/bookings?${p}`);
      if (data.success) { setList(data.data.bookings); setPagination(data.data.pagination); }
    } finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { load(1); }, [load]);

  const remove = async () => {
    try { await API.delete(`/bookings/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); }
    finally { setDel(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Package Bookings</h1>
        <p className="text-sm text-gray-400">{pagination.total} total</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(s => (
          <button key={s} onClick={() => setTab(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${tab === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/5'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading
          ? <div className="flex justify-center py-16"><PageLoader /></div>
          : list.length === 0
            ? <div className="text-center py-16 text-gray-400"><FiCalendar className="text-4xl mx-auto mb-3 text-gray-200" /><p className="text-sm">No bookings.</p></div>
            : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="admin-th">Customer</th>
                      <th className="admin-th hidden sm:table-cell">Destination</th>
                      <th className="admin-th hidden md:table-cell">Date</th>
                      <th className="admin-th">Status</th>
                      <th className="admin-th text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(b => (
                      <tr key={b._id} className={`hover:bg-gray-50 ${!b.isRead ? 'bg-blue-50/20' : ''}`}>
                        <td className="admin-td">
                          <div className="font-semibold text-sm">{b.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[140px]">{b.email}</div>
                          {!b.isRead && <span className="badge bg-blue-100 text-blue-600 text-xs">New</span>}
                        </td>
                        <td className="admin-td hidden sm:table-cell text-sm text-gray-700 max-w-[140px] truncate">{b.destination}</td>
                        <td className="admin-td hidden md:table-cell text-sm text-gray-600">{format(new Date(b.travelDate), 'dd MMM yyyy')}</td>
                        <td className="admin-td"><StatusBadge status={b.status} /></td>
                        <td className="admin-td">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => setSel(b)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEye size={14} /></button>
                            <button onClick={() => setDel(b)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        }
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pg => (
            <button key={pg} onClick={() => load(pg)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${pg === pagination.page ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/10'}`}>
              {pg}
            </button>
          ))}
        </div>
      )}

      {sel && <BookingDetail b={sel} onClose={() => setSel(null)} onSaved={() => load()} />}
      {del && <ConfirmModal title="Delete Booking?" message={`Delete inquiry from ${del.name}?`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  TESTIMONIALS — Fixed JSX, + Cloudinary avatar upload
// ═══════════════════════════════════════════════════════════════════
const ET = {
  customerName: '', location: '', avatar: '', review: '', rating: 5,
  packageName: '', source: 'website', reviewDate: '', profileUrl: '',
  isFeatured: false, isActive: true
};

export function Testimonials() {
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(ET);
  const [saving,   setSaving]   = useState(false);
  const [del,      setDel]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/testimonials/admin/all'); setList(data.data); }
    catch { toast.error('Failed to load reviews.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew  = () => { setEditing(null); setForm(ET); setShowForm(true); };
  const openEdit = t => { setEditing(t._id); setForm({ ...t }); setShowForm(true); };

  const save = async () => {
    if (!form.customerName?.trim() || !form.review?.trim()) {
      toast.error('Name and review text are required.'); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, rating: parseInt(form.rating) };
      const { data } = editing
        ? await API.put(`/testimonials/${editing}`, payload)
        : await API.post('/testimonials', payload);
      if (data.success) {
        toast.success(editing ? 'Review updated!' : 'Review added!');
        setShowForm(false); load();
      } else toast.error(data.message);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`/testimonials/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Delete failed.'); }
    finally { setDel(null); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Reviews & Testimonials</h1>
          <p className="text-sm text-gray-400">{list.length} reviews</p>
        </div>
        <button onClick={openNew} className="btn-primary btn-sm"><FiPlus />Add Review</button>
      </div>

      {/* List */}
      {loading
        ? <div className="flex justify-center py-16"><PageLoader /></div>
        : list.length === 0
          ? <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400"><FiStar className="text-4xl mx-auto mb-3 text-gray-200" /><p className="text-sm">No reviews yet.</p></div>
          : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map(t => (
                <div key={t._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar || `https://i.pravatar.cc/60?u=${t._id}`} alt={t.customerName} className="w-10 h-10 rounded-full object-cover border-2 border-primary/10" />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{t.customerName}</div>
                        <div className="text-xs text-gray-400">{t.location}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 size={13} /></button>
                      <button onClick={() => setDel(t)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map(s => <span key={s} className={s <= t.rating ? 'text-amber-400 text-xs' : 'text-gray-200 text-xs'}>★</span>)}
                  </div>
                  <p className="text-xs text-gray-600 italic line-clamp-3 flex-1 mb-3">"{t.review}"</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {t.source && t.source !== 'website' && (
                      <span className="badge bg-blue-50 text-blue-600 text-xs capitalize">{t.source}</span>
                    )}
                    {t.packageName && <span className="badge bg-secondary/10 text-secondary text-xs">{t.packageName}</span>}
                    {t.isFeatured  && <span className="badge bg-amber-100 text-amber-700 text-xs">⭐ Featured</span>}
                    <span className={`badge text-xs ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              ))}
            </div>
      }

      {/* Form Modal — FIXED JSX */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg font-heading font-bold">{editing ? 'Edit Review' : 'Add Review'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Customer Name *</label>
                  <input className="form-input" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input className="form-input" placeholder="City, Country" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="form-label">Profile Photo</label>
                {form.avatar && (
                  <div className="mb-2 flex items-center gap-3">
                    <img src={form.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, avatar: '' })} className="text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  <CloudinaryUpload label="Upload Photo" onUploaded={url => setForm({ ...form, avatar: url })} />
                  <span className="text-xs text-gray-400">or paste URL</span>
                  <input type="url" className="form-input text-sm flex-1 min-w-0" placeholder="https://…" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="form-label">Review Text *</label>
                <textarea rows={4} className="form-input resize-none" value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Rating</label>
                  <select className="form-input" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Package Name</label>
                  <input type="text" className="form-input text-sm" value={form.packageName} onChange={e => setForm({ ...form, packageName: e.target.value })} />
                </div>
              </div>

              {/* Source + date + URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Source</label>
                  <select className="form-input" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                    <option value="website">🌐 Website</option>
                    <option value="google">🔍 Google</option>
                    <option value="tripadvisor">🦉 TripAdvisor</option>
                    <option value="facebook">📘 Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Review Date</label>
                  <input type="text" className="form-input text-sm" placeholder="e.g. March 2024" value={form.reviewDate} onChange={e => setForm({ ...form, reviewDate: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Profile URL</label>
                  <input type="url" className="form-input text-sm" placeholder="https://…" value={form.profileUrl} onChange={e => setForm({ ...form, profileUrl: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-6 pt-1">
                <Toggle checked={form.isFeatured} onChange={v => setForm({ ...form, isFeatured: v })} label="Featured" />
                <Toggle checked={form.isActive}   onChange={v => setForm({ ...form, isActive: v })}   label="Active" colorOn="bg-green-500" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving ? 'Saving…' : editing ? 'Update' : 'Add Review'}</button>
            </div>
          </div>
        </div>
      )}

      {del && <ConfirmModal title="Delete Review?" message={`Remove review from "${del.customerName}"?`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  GALLERY — Cloudinary multi-upload
// ═══════════════════════════════════════════════════════════════════
const EG = { title: '', imageUrl: '', category: 'city', destination: '', isActive: true };

export function Gallery() {
  const [list,      setList]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EG);
  const [saving,    setSaving]    = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [del,       setDel]       = useState(null);
  const [prevErr,   setPrevErr]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/gallery/admin/all'); setList(data.data); }
    catch { toast.error('Failed to load gallery.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.title?.trim() || !form.imageUrl?.trim()) { toast.error('Title and image URL required.'); return; }
    setSaving(true);
    try {
      const { data } = await API.post('/gallery', form);
      if (data.success) { toast.success('Image added!'); setShowForm(false); setForm(EG); setPrevErr(false); load(); }
      else toast.error(data.message);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    try { await API.delete(`/gallery/${del._id}`); toast.success('Removed.'); load(); }
    catch { toast.error('Failed.'); }
    finally { setDel(null); }
  };

  const filtered = catFilter === 'all' ? list : list.filter(i => i.category === catFilter);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Gallery</h1>
          <p className="text-sm text-gray-400">{list.length} images</p>
        </div>
        <div className="flex gap-2">
          {/* Bulk Cloudinary upload */}
          <CloudinaryUpload
            label="Upload Multiple"
            multiple
            onUploaded={async (urls) => {
              try {
                await Promise.all(urls.map((url, i) =>
                  API.post('/gallery', { title: `Image ${list.length + i + 1}`, imageUrl: url, category: 'city', destination: '' })
                ));
                toast.success(`${urls.length} image(s) added to gallery!`);
                load();
              } catch { toast.error('Failed to save some images.'); }
            }}
          />
          <button onClick={() => { setForm(EG); setPrevErr(false); setShowForm(true); }} className="btn-primary btn-sm"><FiPlus />Add by URL</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...GCATS].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${catFilter === c ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary/5'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading
        ? <div className="flex justify-center py-16"><PageLoader /></div>
        : filtered.length === 0
          ? <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400"><FiImage className="text-4xl mx-auto mb-3 text-gray-200" /><p className="text-sm">No images yet.</p></div>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(img => (
                <div key={img._id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer" onClick={() => setDel(img)}>
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all flex flex-col items-center justify-center gap-2">
                    <FiTrash2 className="text-white opacity-0 group-hover:opacity-100 text-xl transition-opacity" />
                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 text-center px-2 line-clamp-2 transition-opacity">{img.title}</p>
                  </div>
                  <span className="absolute top-2 left-2 badge bg-white/90 text-gray-700 text-xs capitalize">{img.category}</span>
                </div>
              ))}
            </div>
      }

      {/* Add by URL modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-heading font-bold">Add Gallery Image</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Image URL *</label>
                <input type="url" className="form-input text-sm" placeholder="https://…" value={form.imageUrl} onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setPrevErr(false); }} />
              </div>
              {form.imageUrl && !prevErr && (
                <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={() => setPrevErr(true)} />
                </div>
              )}
              {prevErr && <p className="text-xs text-red-500">⚠️ Could not load image — check URL.</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {GCATS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Destination</label>
                  <input className="form-input text-sm" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-primary btn-sm">{saving ? 'Adding…' : 'Add Image'}</button>
            </div>
          </div>
        </div>
      )}

      {del && <ConfirmModal title="Remove Image?" message={`Remove "${del.title}" from gallery?`} confirmLabel="Remove" onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CONTACTS
// ═══════════════════════════════════════════════════════════════════
export function Contacts() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [sel,     setSel]     = useState(null);
  const [del,     setDel]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/contact'); setList(data.data); }
    catch { toast.error('Failed to load contacts.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async id => { try { await API.patch(`/contact/${id}/read`); load(); } catch {} };
  const remove   = async () => {
    try { await API.delete(`/contact/${del._id}`); toast.success('Deleted.'); load(); }
    catch { toast.error('Failed.'); }
    finally { setDel(null); }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-400">{list.length} messages · {list.filter(m => !m.isRead).length} unread</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading
          ? <div className="flex justify-center py-16"><PageLoader /></div>
          : list.length === 0
            ? <div className="text-center py-16 text-gray-400"><FiMail className="text-4xl mx-auto mb-3 text-gray-200" /><p className="text-sm">No messages yet.</p></div>
            : <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="admin-th">From</th>
                      <th className="admin-th hidden sm:table-cell">Subject</th>
                      <th className="admin-th hidden md:table-cell">Message</th>
                      <th className="admin-th">Status</th>
                      <th className="admin-th hidden sm:table-cell">Date</th>
                      <th className="admin-th text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(m => (
                      <tr key={m._id} className={`hover:bg-gray-50 ${!m.isRead ? 'bg-blue-50/20' : ''}`}>
                        <td className="admin-td">
                          <div className="font-semibold text-sm">{m.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[140px]">{m.email}</div>
                        </td>
                        <td className="admin-td hidden sm:table-cell text-sm text-gray-700 max-w-[160px] truncate">{m.subject || '—'}</td>
                        <td className="admin-td hidden md:table-cell text-sm text-gray-500 max-w-[200px] truncate">{m.message}</td>
                        <td className="admin-td">
                          <span className={`badge text-xs ${m.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>
                            {m.isRead ? 'Read' : 'New'}
                          </span>
                        </td>
                        <td className="admin-td hidden sm:table-cell text-xs text-gray-400">{format(new Date(m.createdAt), 'dd MMM yy')}</td>
                        <td className="admin-td">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => { setSel(m); if (!m.isRead) markRead(m._id); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEye size={14} /></button>
                            <button onClick={() => setDel(m)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
        }
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-heading font-bold">Message</h2>
              <button onClick={() => setSel(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {[['From', sel.name], ['Email', sel.email], ['Phone', sel.phone || '—'], ['Subject', sel.subject || '—']].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400">{k}</div>
                    <div className="font-semibold text-sm text-gray-900 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Message</div>
                <p className="text-sm text-gray-700 leading-relaxed">{sel.message}</p>
              </div>
            </div>
            <div className="flex justify-between px-6 py-4 border-t border-gray-100">
              <a href={`mailto:${sel.email}`} className="btn-primary btn-sm">Reply via Email</a>
              <button onClick={() => setSel(null)} className="btn-outline btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {del && <ConfirmModal title="Delete Message?" message={`Delete message from ${del.name}?`} confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}

export default Packages;
