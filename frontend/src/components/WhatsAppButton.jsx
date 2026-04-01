// WhatsAppButton.jsx
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); }, []);
  if (!show) return null;
  const num = import.meta.env.VITE_WHATSAPP || '919805706010';
  return (
    <a href={`https://wa.me/${num}?text=Hi! I'm interested in booking a tour with Travelyug.`}
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl wa-pulse hover:bg-green-600 transition-colors group"
      aria-label="Chat on WhatsApp">
      <FaWhatsapp size={28} />
      <span className="absolute right-16 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Chat with us!</span>
    </a>
  );
}

// ── Shared UI primitives ──────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-8 h-8 border-4', lg: 'w-12 h-12 border-4' }[size];
  return <div className={`${s} border-primary/20 border-t-primary rounded-full animate-spin`} />;
}

export function PageLoader() {
  return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;
}

export function SectionHeader({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      {eyebrow && <span className="text-secondary font-semibold text-sm uppercase tracking-widest">{eyebrow}</span>}
      <h2 className="section-title mt-2">{title}</h2>
      {subtitle && <p className={`section-subtitle ${center ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </div>
  );
}

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}  className="flex-1 btn-outline btn-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 btn btn-sm bg-red-500 text-white hover:bg-red-600 rounded-xl font-semibold">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label, colorOn = 'bg-primary' }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div className={`relative w-10 h-6 rounded-full transition-colors ${checked ? colorOn : 'bg-gray-300'}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
      {label && <span className="text-sm text-gray-700 font-medium">{label}</span>}
    </label>
  );
}

export function StatusBadge({ status }) {
  const map = { new:'bg-blue-100 text-blue-700', contacted:'bg-yellow-100 text-yellow-700', confirmed:'bg-green-100 text-green-700', cancelled:'bg-red-100 text-red-600' };
  return <span className={`badge capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
