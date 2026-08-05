import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, BedDouble,
  Pill, Receipt, Bell, User, LogOut, Activity, Shield
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: Stethoscope, label: 'Doctors' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/beds', icon: BedDouble, label: 'Beds' },
  { to: '/pharmacy', icon: Pill, label: 'Pharmacy' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    } else {
      onToggleCollapse();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Header (Acts as Collapse/Close toggle) */}
      <button
        onClick={handleLogoClick}
        className={`w-full flex items-center gap-3 px-4 h-16 border-b border-surface-200 dark:border-surface-800 text-left hover:bg-surface-100/70 dark:hover:bg-surface-800/50 transition-colors group cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Logo collapsed={collapsed} />
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) => `nav-link group ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-danger-500 text-white rounded-full shadow-sm">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer - Only Logout Button */}
      <div className="p-3 border-t border-surface-200 dark:border-surface-800">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-500/15 transition-colors ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={onClose} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] glass-sidebar transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 glass-sidebar transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
