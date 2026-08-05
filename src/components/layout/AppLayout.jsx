import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  '/': 'Dashboard',
  '/patients': 'Patient Management',
  '/doctors': 'Doctor Management',
  '/appointments': 'Appointments',
  '/beds': 'Bed Management',
  '/pharmacy': 'Pharmacy',
  '/billing': 'Billing',
  '/notifications': 'Notifications',
  '/profile': 'My Profile',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'MediCore';

  return (
    <div className="min-h-screen overflow-x-hidden w-full relative">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`transition-all duration-300 min-h-screen flex flex-col w-full ${sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        <Header onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="p-4 lg:p-6 max-w-[1600px] w-full mx-auto flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
