import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import { Toggle, PageLoader } from '../../components/WhatsAppButton';

const STATUS_CFG = {
  green:  { label:'Available',   bg:'bg-green-100 text-green-700' },
  orange: { label:'Filling Fast',bg:'bg-amber-100 text-amber-700' },
  red:    { label:'Almost Full', bg:'bg-red-100 text-red-700' },
};

const EMPTY_DATE = { date:'', totalSeats:20, bookedSeats:0, status:'green', isManualOverride:false };

export default function TripDatesAdmin() {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null); // selected package
  const [tripDates,setTripDates]= useState([]);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState('');

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/packages/admin/all'); setPackages(data.data); }
    catch { toast.error('Failed to load packages.'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const selectPackage = (pkg) => {
    setSelected(pkg);
    setTripDates((pkg.tripDates || []).map(td => ({
      ...td,
      date: td.date ? format(new Date(td.date), 'yyyy-MM-dd') : ''
    })));
  };

  const addDate = () => setTripDates(prev => [...prev, { ...EMPTY_DATE }]);

  const removeDate = (i) => setTripDates(prev => prev.filter((_, j) => j !== i));

  const updateDate = (i, field, value) => {
    setTripDates(prev => prev.map((td, j) => {
      if (j !== i) return td;
      const updated = { ...td, [field]: value };
      // Auto-recompute status label if not manual
      if (!updated.isManualOverride && (field === 'totalSeats' || field === 'bookedSeats')) {
        const rem = (updated.totalSeats||0) - (updated.bookedSeats||0);
        if (rem <= 3) updated.status = 'red';
        else if (rem / (updated.totalSeats||1) <= 0.5) updated.status = 'orange';
        else updated.status = 'green';
      }
      return updated;
    }));
  };

  const saveDates = async () => {
    if (!selected) return;
    // Validate
    const hasError = tripDates.some(td => !td.date || td.totalSeats < 1);
    if (hasError) { toast.error('All dates must have a valid date and total seats ≥ 1.'); return; }

    setSaving(true);
    try {
      const { data } = await API.put(`/packages/${selected._id}/trip-dates`, { tripDates });
      if (data.success) {
        toast.success('Trip dates saved!');
        // Refresh packages list
        await loadPackages();
        // Update selected with fresh data
        const fresh = await API.get(`/packages/${selected._id}`);
        selectPackage(fresh.data.data);
      } else toast.error(data.message);
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed.'); }
    finally { setSaving(false); }
  };

  const filtered = packages.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Trip Date & Seat Management</h1>
        <p className="text-sm text-gray-400">Manage departure dates and seat availability for each package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Package list */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-h-80 lg:max-h-none overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input className="form-input pl-9 text-sm" placeholder="Search packages…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? <div className="flex justify-center py-10"><PageLoader /></div>
          : <div className="overflow-y-auto max-h-[60vh]">
              {filtered.map(pkg => (
                <button key={pkg._id} onClick={() => selectPackage(pkg)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected?._id === pkg._id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                  <div className="font-semibold text-sm text-gray-900 truncate">{pkg.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                    <FiCalendar size={10} />
                    {(pkg.tripDates || []).length} date{pkg.tripDates?.length !== 1 ? 's' : ''} configured
                  </div>
                </button>
              ))}
              {filtered.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No packages found</div>}
            </div>}
        </div>

        {/* Date editor */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              <FiCalendar className="text-5xl mx-auto mb-3 text-gray-200" />
              <p className="font-semibold text-gray-600 mb-1">Select a package</p>
              <p className="text-sm">Choose a package from the list to manage its trip dates</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-heading font-bold text-gray-900 truncate max-w-xs">{selected.title}</h2>
                  <p className="text-xs text-gray-400">{tripDates.length} departure date{tripDates.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={addDate} className="btn-primary btn-sm"><FiPlus/>Add Date</button>
              </div>

              <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">
                {tripDates.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-sm mb-3">No trip dates yet.</p>
                    <button onClick={addDate} className="btn-outline btn-sm"><FiPlus/>Add First Date</button>
                  </div>
                ) : tripDates.map((td, i) => {
                  const remaining = (td.totalSeats||0) - (td.bookedSeats||0);
                  const fillPct   = td.totalSeats ? (td.bookedSeats/td.totalSeats)*100 : 0;
                  const statusCfg = STATUS_CFG[td.status] || STATUS_CFG.green;
                  return (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`badge text-xs ${statusCfg.bg}`}>{statusCfg.label}</span>
                        <button onClick={() => removeDate(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={13}/>
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="form-label text-xs">Date *</label>
                          <input type="date" className="form-input text-sm" value={td.date}
                            onChange={e => updateDate(i,'date',e.target.value)}
                            min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div>
                          <label className="form-label text-xs">Total Seats *</label>
                          <input type="number" min="1" className="form-input text-sm" value={td.totalSeats}
                            onChange={e => updateDate(i,'totalSeats',parseInt(e.target.value)||1)} />
                        </div>
                        <div>
                          <label className="form-label text-xs">Booked Seats</label>
                          <input type="number" min="0" max={td.totalSeats} className="form-input text-sm bg-gray-50" value={td.bookedSeats}
                            onChange={e => updateDate(i,'bookedSeats',parseInt(e.target.value)||0)} />
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{remaining} seats remaining</span>
                          <span>{Math.round(fillPct)}% filled</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${td.status==='red'?'bg-red-500':td.status==='orange'?'bg-amber-400':'bg-green-500'}`}
                            style={{ width: `${fillPct}%` }} />
                        </div>
                      </div>

                      {/* Manual override */}
                      <div className="flex items-center justify-between pt-1">
                        <Toggle
                          checked={td.isManualOverride}
                          onChange={v => updateDate(i,'isManualOverride',v)}
                          label="Manual status override"
                        />
                        {td.isManualOverride && (
                          <select className="form-input text-xs w-36 py-1.5"
                            value={td.status} onChange={e => updateDate(i,'status',e.target.value)}>
                            <option value="green">🟢 Available</option>
                            <option value="orange">🟡 Filling Fast</option>
                            <option value="red">🔴 Almost Full</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {tripDates.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                  <button onClick={saveDates} disabled={saving} className="btn-primary">
                    {saving ? 'Saving…' : `Save ${tripDates.length} Date${tripDates.length!==1?'s':''}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
