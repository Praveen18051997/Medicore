import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Search, Bell, Sun, Moon, LogOut, User, Settings, Command } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { logout } from '../../features/auth/authSlice';
import Avatar from '../ui/Avatar';

export default function Header({ onMenuToggle, title }) {
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="glass-header sticky top-0 z-20 h-16 flex items-center justify-between px-4 lg:px-8 w-full max-w-full">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Menu className="w-5 h-5 text-surface-600 dark:text-surface-400" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search toggle — mobile */}
        <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors md:hidden">
          <Search className="w-5 h-5 text-surface-500" />
        </button>

        {/* Search bar — desktop */}
        <div className="hidden md:flex items-center bg-surface-100/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/60 rounded-xl px-3.5 py-2 w-72 focus-within:ring-2 focus-within:ring-primary-500/40 focus-within:border-primary-500 transition-all">
          <Search className="w-4 h-4 text-surface-400 mr-2 flex-shrink-0" />
          <input type="text" placeholder="Search patients, doctors, beds..." className="bg-transparent text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none w-full" />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-semibold text-surface-400 bg-surface-200 dark:bg-surface-700 px-1.5 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative group" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <Sun className="w-5 h-5 text-warning-400 group-hover:rotate-45 transition-transform" /> : <Moon className="w-5 h-5 text-surface-500 group-hover:-rotate-12 transition-transform" />}
        </button>

        {/* Notifications */}
        <button onClick={() => navigate('/notifications')} className="relative p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <Bell className="w-5 h-5 text-surface-500 dark:text-surface-400" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-surface-200 dark:bg-surface-800 mx-1 hidden sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 p-1.5 px-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
            <Avatar name={user?.name || 'Dr. Praveen R'} src={user?.avatar} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">{user?.name || 'Dr. Praveen R'}</p>
              <p className="text-[10px] font-medium text-surface-500">{user?.role || 'Doctor'} • <span className="text-primary-600 dark:text-primary-400 font-semibold">{user?.department || 'Neurology'}</span></p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-surface-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-800 py-2 animate-scale-in z-50">
              <div className="px-4 py-3.5 border-b border-surface-100 dark:border-surface-800 flex items-center gap-3 bg-surface-50/50 dark:bg-surface-800/30">
                <Avatar name={user?.name || 'Dr. Praveen R'} src={user?.avatar} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{user?.name || 'Dr. Praveen R'}</p>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 truncate">{user?.role || 'Doctor'} • {user?.department || 'Neurology'}</p>
                  <p className="text-[11px] text-surface-400 truncate mt-0.5">{user?.email || 'admin@medicore.com'}</p>
                </div>
              </div>
              <div className="py-1">
                <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-primary-500/10 hover:text-primary-600 transition-colors">
                  <User className="w-4 h-4 text-primary-500" /> My Profile
                </button>
                <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-primary-500/10 hover:text-primary-600 transition-colors">
                  <Settings className="w-4 h-4 text-surface-500" /> Account Settings
                </button>
              </div>
              <hr className="my-1 border-surface-100 dark:border-surface-800" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-danger-600 dark:text-danger-400 hover:bg-danger-500/10 transition-colors">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search overlay */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 p-4 glass-header md:hidden z-30">
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 border border-surface-300 dark:border-surface-700">
            <Search className="w-4 h-4 text-surface-400 mr-2" />
            <input type="text" placeholder="Search..." autoFocus className="bg-transparent text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none w-full" onBlur={() => setShowSearch(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
