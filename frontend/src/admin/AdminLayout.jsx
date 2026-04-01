import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiCalendar, FiStar, FiImage, FiMail,
  FiLogOut, FiMenu, FiX, FiExternalLink,
  FiHome, FiTruck, FiClock, FiChevronDown, FiChevronRight, FiUsers, FiShield
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LINKS = [
  { to:'/admin/dashboard',      icon:FiGrid,     label:'Dashboard'         },
  { to:'/admin/packages',       icon:FiPackage,  label:'Packages'          },
  { to:'/admin/trip-dates',     icon:FiClock,    label:'Trip Dates'        },
  { to:'/admin/bookings',       icon:FiCalendar, label:'Package Bookings'  },
  {
    label:'Hotels', icon:FiHome,
    children:[
      { to:'/admin/hotels',         label:'Manage Hotels'  },
      { to:'/admin/hotel-bookings', label:'Hotel Bookings' },
    ]
  },
  {
    label:'Vehicles', icon:FiTruck,
    children:[
      { to:'/admin/vehicles',         label:'Manage Vehicles'  },
      { to:'/admin/vehicle-bookings', label:'Vehicle Bookings' },
    ]
  },
  { to:'/admin/testimonials',   icon:FiStar,     label:'Reviews'           },
  { to:'/admin/gallery',        icon:FiImage,    label:'Gallery'           },
  { to:'/admin/contacts',       icon:FiMail,     label:'Contacts'          },
  { to:'/admin/admins',         icon:FiShield,   label:'Admin Accounts'    },
];

function NavGroup({ item, onClose }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="sidebar-link w-full justify-between">
        <span className="flex items-center gap-3"><item.icon size={16} />{item.label}</span>
        {open ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-6 mt-1 space-y-0.5">
          {item.children.map(child => (
            <NavLink key={child.to} to={child.to} onClick={onClose}
              className={({ isActive }) => `sidebar-link text-xs ${isActive ? 'active' : ''}`}>
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Logged out.'); navigate('/admin/login'); };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <span className="font-heading font-bold text-sm text-gray-900">TY</span>
          </div>
          <div>
            <div className="font-heading font-bold text-gray-900 text-sm">Travelyug</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {LINKS.map((item, i) =>
          item.children ? (
            <NavGroup key={i} item={item} onClose={onClose} />
          ) : (
            <NavLink key={item.to} to={item.to} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon size={16} />{item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-link">
          <FiExternalLink size={16} /> View Site
        </a>
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-gray-700 truncate">{admin?.name}</p>
          <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <FiLogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 flex-shrink-0 flex-col">
        <SidebarContent onClose={() => {}} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-64 flex flex-col">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center gap-4">
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <h1 className="font-heading font-bold text-gray-900 flex-1">Admin Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
