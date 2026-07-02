import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  HiMenu,
  HiX,
  HiHome,
  HiCalendar,
  HiPlusCircle,
  HiClipboardList,
  HiUser,
  HiLogout,
  HiTable,
  HiUsers,
  HiChartBar,
  HiTicket,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const customerLinks = [
    { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
    { to: '/reservations/new', icon: HiPlusCircle, label: 'New Reservation' },
    { to: '/reservations', icon: HiClipboardList, label: 'My Reservations' },
    { to: '/coupons', icon: HiTicket, label: 'My Coupons' },
    { to: '/profile', icon: HiUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: HiChartBar, label: 'Dashboard' },
    { to: '/admin/reservations', icon: HiCalendar, label: 'Reservations' },
    { to: '/admin/tables', icon: HiTable, label: 'Tables' },
    { to: '/admin/users', icon: HiUsers, label: 'Users' },
  ];

  const navLinks = isAdmin ? adminLinks : customerLinks;
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const isActive = (path) => {
    if (path === '/admin' || path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen relative z-0 flex bg-transparent">
      <AnimatedBackground />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#d6a87c] rounded-lg flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <span className="text-[#111827] font-extrabold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-wide">
                <span className="text-[#d6a87c]">Dine</span>Town
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-gray-600'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
            >
              <HiLogout className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64 flex-1 w-full flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HiMenu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Page title (spacer on desktop) */}
            <div className="hidden lg:block" />

            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{userInitial}</span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-white/95 border border-gray-100 rounded-xl shadow-lg py-1 animate-slide-down">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to={isAdmin ? '/admin' : '/profile'}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HiUser className="w-4 h-4 text-gray-400" />
                    {isAdmin ? 'Dashboard' : 'Profile'}
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <HiLogout className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
