import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiTrash2, FiX, FiUsers, FiShield, FiToggleLeft, FiToggleRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import API from '../../api/axios';
import { ConfirmModal, PageLoader } from '../../components/WhatsAppButton';

export default function AdminManagement() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm,setShowForm]= useState(false);
  const [del,     setDel]     = useState(null);
  const [showPw,  setShowPw]  = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await API.get('/auth/admins'); setAdmins(data.data); }
    catch { toast.error('Failed to load admins.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSubmit = async (formData) => {
    try {
      const { data } = await API.post('/auth/register', formData);
      if (data.success) {
        toast.success(data.message);
        reset();
        setShowForm(false);
        load();
      } else toast.error(data.message);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create admin.');
    }
  };

  const toggle = async (admin) => {
    try {
      const { data } = await API.patch(`/auth/admins/${admin._id}/toggle`);
      if (data.success) { toast.success(data.message); load(); }
    } catch (e) { toast.error(e.response?.data?.message || 'Failed.'); }
  };

  const remove = async () => {
    try {
      await API.delete(`/auth/admins/${del._id}`);
      toast.success('Admin deleted.');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Failed.'); }
    finally { setDel(null); }
  };

  const canAdd = admins.length < 5;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Admin Accounts</h1>
          <p className="text-sm text-gray-400">{admins.length} / 5 accounts used</p>
        </div>
        <button
          onClick={() => { reset(); setShowForm(true); }}
          disabled={!canAdd}
          className={`btn-primary btn-sm ${!canAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!canAdd ? 'Maximum 5 admins allowed' : ''}
        >
          <FiPlus />Add Admin
        </button>
      </div>

      {/* Quota bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Admin Slots Used</span>
          <span className="text-sm text-gray-500">{admins.length} of 5</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${admins.length >= 5 ? 'bg-red-500' : admins.length >= 3 ? 'bg-amber-400' : 'bg-green-500'}`}
            style={{ width: `${(admins.length / 5) * 100}%` }}
          />
        </div>
        {!canAdd && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <FiShield size={11} /> Maximum limit reached. Delete an admin to add a new one.
          </p>
        )}
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><PageLoader /></div>
        : admins.length === 0
          ? <div className="text-center py-16 text-gray-400"><FiUsers className="text-4xl mx-auto mb-3 text-gray-200" /><p>No admins found.</p></div>
          : <table className="w-full">
              <thead>
                <tr>
                  <th className="admin-th">Admin</th>
                  <th className="admin-th hidden sm:table-cell">Role</th>
                  <th className="admin-th hidden md:table-cell">Last Login</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="admin-td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">{a.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{a.name}</div>
                          <div className="text-xs text-gray-400">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="admin-td hidden sm:table-cell">
                      <span className={`badge text-xs capitalize ${a.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {a.role}
                      </span>
                    </td>
                    <td className="admin-td hidden md:table-cell text-xs text-gray-400">
                      {a.lastLogin ? format(new Date(a.lastLogin), 'dd MMM yyyy, hh:mm a') : 'Never'}
                    </td>
                    <td className="admin-td">
                      <span className={`badge text-xs ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {a.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => toggle(a)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title={a.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {a.isActive
                            ? <FiToggleRight className="text-green-500" size={18} />
                            : <FiToggleLeft className="text-gray-400" size={18} />}
                        </button>
                        <button onClick={() => setDel(a)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-800">
        <h3 className="font-bold mb-2 flex items-center gap-2"><FiShield />Admin Account Rules</h3>
        <ul className="space-y-1 text-blue-700 text-xs">
          <li>• Maximum <strong>5 admin accounts</strong> allowed at any time</li>
          <li>• Each admin has their <strong>own email and password</strong></li>
          <li>• Passwords are <strong>securely hashed</strong> — not visible to anyone</li>
          <li>• Deactivated admins cannot log in until re-activated</li>
          <li>• You cannot delete or deactivate your own account</li>
        </ul>
      </div>

      {/* Add Admin Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-heading font-bold">Add New Admin</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><FiX /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                  placeholder="e.g. Rahul Sharma"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="admin@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email format' }
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="form-label">Password *</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className={`form-input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Min. 8 characters"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' }
                    })}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password.message}</p>}
                <p className="text-xs text-gray-400 mt-1">Share this password securely with the new admin. It cannot be recovered later.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline btn-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary btn-sm">
                  {isSubmitting ? 'Creating…' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {del && (
        <ConfirmModal
          title="Delete Admin Account?"
          message={`"${del.name}" (${del.email}) will be permanently removed and can no longer login.`}
          confirmLabel="Delete"
          onConfirm={remove}
          onCancel={() => setDel(null)}
        />
      )}
    </div>
  );
}
