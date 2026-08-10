import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, ShieldCheck, LogOut, Menu, X, LayoutDashboard, Search } from 'lucide-react';
import { isAdminLoggedIn, removeAuthToken } from '../../services/api';

export const Header = ({ onSearchChange, searchTerm }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn());
  }, [location.pathname]);

  const handleLogout = () => {
    removeAuthToken();
    setLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/admin/login');
  };

  const handleScrollToTopOrHome = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="bg-[#E3F2FD]/90 border-b border-[#90CAF9] sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Square Box + Serif Finlenss. */}
          <a
            href="/"
            onClick={handleScrollToTopOrHome}
            className="flex items-center gap-2.5 group cursor-pointer"
            title="Finlenss — Back to top"
          >
            <div className="w-8 h-8 rounded border-2 border-[#0D47A1] bg-[#E3F2FD] flex items-center justify-center text-[#0D47A1] font-bold group-hover:bg-[#0D47A1] group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold text-[#0D47A1] font-serif tracking-tight">
              Finlenss.
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#0D47A1]">
            <a
              href="/"
              onClick={handleScrollToTopOrHome}
              className="hover:text-[#2196F3] transition-colors cursor-pointer"
            >
              Insights
            </a>
            <a href="#markets" className="hover:text-[#2196F3] transition-colors">
              Markets
            </a>
            <a
              href="#portfolio"
              className="cursor-pointer hover:text-blue-400 transition-colors"
            >
              Portfolio
            </a>
          </nav>

          {/* Search Bar & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {location.pathname === '/' && onSearchChange && (
              <div className="relative w-40 lg:w-52">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#0D47A1]/50" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-[#90CAF9] bg-white/80 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#0D47A1] transition-colors"
                />
              </div>
            )}

            {loggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/admin/dashboard">
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-[#0D47A1] text-white rounded hover:bg-[#2196F3] transition-colors flex items-center gap-1.5 shadow-sm">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-widest border border-[#0D47A1]/40 text-[#0D47A1] rounded hover:bg-[#0D47A1]/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/admin/login">
                  <button className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#0D47A1] text-white rounded hover:bg-[#2196F3] shadow-sm transition-all">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Drawer Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#0D47A1]"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#E3F2FD] border-b border-[#90CAF9] px-4 pt-3 pb-6 space-y-3 text-xs font-bold uppercase tracking-widest text-[#0D47A1]">
          <a
            href="/"
            onClick={handleScrollToTopOrHome}
            className="block py-2 cursor-pointer"
          >
            Insights
          </a>
          <a
            href="#portfolio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 cursor-pointer hover:text-blue-400 transition-colors"
          >
            Portfolio
          </a>

          {loggedIn ? (
            <div className="pt-2 border-t border-[#90CAF9] space-y-2">
              <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block py-1">
                Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="block py-1 text-rose-700">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#90CAF9]">
              <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-2.5 bg-[#0D47A1] text-white rounded text-center">
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
