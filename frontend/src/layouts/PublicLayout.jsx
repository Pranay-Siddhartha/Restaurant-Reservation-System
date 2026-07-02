import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiArrowRight } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
  ];

  if (!isAuthenticated) {
    navLinks.push({ to: '/login', label: 'Login' });
    navLinks.push({ to: '/register', label: 'Register' });
  } else {
    navLinks.push({
      to: isAdmin ? '/admin' : '/dashboard',
      label: 'Dashboard',
    });
  }

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <AnimatedBackground />
      {/* Navbar */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-[#121212]/80 backdrop-blur-xl border border-[#d6a87c]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl px-6 py-3 flex items-center justify-between w-full max-w-5xl transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#d6a87c] rounded-xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">
              <span className="text-[#121212] font-extrabold text-base">D</span>
            </div>
            <span className="text-xl font-bold text-[#ffffff] tracking-wide">
              <span className="text-[#d6a87c]">Dine</span>Town
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#d6a87c] bg-[#d6a87c]/10'
                      : 'text-gray-300 hover:text-[#d6a87c] hover:bg-[#d6a87c]/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-[#d6a87c] rounded-full shadow-[0_0_8px_#d6a87c]" />
                  )}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <Link
                to="/register"
                className="ml-4 px-5 py-2.5 rounded-xl bg-[#d6a87c] hover:bg-[#c69a71] text-[#121212] font-bold text-sm transition-all hover:shadow-[0_0_15px_rgba(214,168,124,0.4)] hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                Get Started <HiArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-[#ffffff] transition-colors"
          >
            {mobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed top-24 inset-x-4 z-40 md:hidden bg-[#121212]/95 backdrop-blur-2xl border border-[#d6a87c]/20 rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#d6a87c]/10 text-[#d6a87c]'
                      : 'text-gray-300 hover:bg-[#d6a87c]/5 hover:text-[#d6a87c]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-gray-100/10">
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[#d6a87c] hover:bg-[#c69a71] text-[#121212] font-bold text-sm transition-all hover:shadow-[0_0_15px_rgba(214,168,124,0.4)]"
                >
                  Get Started <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  <span className="text-indigo-600">Dine</span>Town
                </span>
              </Link>
              <p className="text-sm text-gray-500">
                Effortless restaurant reservation management for modern dining.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-sm text-gray-500">support@DineTown.com</li>
                <li className="text-sm text-gray-500">1-800-RESERVE</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} DineTown. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

