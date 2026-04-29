import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import api from '../../lib/axios';

export const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const { user, logout, accessToken } = useAuthStore();
  const cartCount = useCartStore(s => s.items.reduce((n, i) => n + i.quantity, 0));
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${accessToken}` } });
    } catch {}
    logout();
  };

  const links = [
    { label: 'Shop', to: '/catalog' },
    { label: 'New Arrivals', to: '/catalog?sort=newest' },
  ];

  const isActive = (to: string) => (location.pathname + location.search) === to;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? 'bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm' : 'bg-transparent'}`}>
        <div className="h-[2px] bg-accent w-full" />

        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="font-display text-3xl hover:text-accent transition-colors">
            EL<span className="text-accent">VO</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'bg-accent text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'}`}>
                {link.label}
              </Link>
            ))}
            {user?.role === 'ADMIN' && (
              <Link to="/admin"
                className="ml-2 px-4 py-2 rounded-full text-sm font-semibold text-accent border border-accent/40
                           hover:bg-accent hover:text-white transition-all">
                Admin
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* Theme */}
            <button onClick={toggle}
              className="w-9 h-9 rounded-full hover:bg-[var(--surface)] flex items-center justify-center transition-colors"
              aria-label="Toggle theme">
              {theme === 'dark'
                ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
                : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              }
            </button>

            {/* Cart */}
            <Link to="/cart"
              className="relative w-9 h-9 rounded-full hover:bg-[var(--surface)] flex items-center justify-center transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            {user ? (
              <div className="hidden sm:flex items-center gap-1 ml-1">
                <Link to="/orders"
                  className="text-sm font-medium px-3 py-2 rounded-full hover:bg-[var(--surface)] transition-colors">
                  {user.firstName}
                </Link>
                <button onClick={handleLogout}
                  className="text-sm text-[var(--text-secondary)] hover:text-accent transition-colors px-2">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link to="/login"
                  className="text-sm font-medium px-4 py-2 rounded-full hover:bg-[var(--surface)] transition-colors">
                  Sign In
                </Link>
                <Link to="/register"
                  className="text-sm font-semibold px-4 py-2 bg-accent text-white rounded-full
                             hover:bg-[var(--accent-hover)] transition-all hover:shadow-[0_0_20px_var(--accent-glow)]">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-full hover:bg-[var(--surface)] flex items-center justify-center ml-1 transition-colors">
              <div className="flex flex-col gap-1.5 w-5">
                <span className={`h-0.5 bg-current transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 bg-current transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[calc(2px+4rem)]" />

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-[var(--bg-primary)] border-l border-[var(--border)]
                         transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
                         flex flex-col p-6 pt-20 gap-2`}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-medium hover:bg-[var(--surface)] hover:text-accent transition-all">
              {link.label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold text-accent hover:bg-[var(--surface)] transition-all">
              Admin Panel
            </Link>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium hover:bg-[var(--surface)] transition-all">
                  My Orders
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl text-left text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-medium hover:bg-[var(--surface)] transition-all">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl font-semibold bg-accent text-white text-center hover:bg-[var(--accent-hover)] transition-all">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
