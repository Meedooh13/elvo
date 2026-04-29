import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuthStore();
  const cartItems = useCartStore(s => s.items.length);

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-[var(--border)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">
          EL<span className="text-accent">VO</span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link to="/catalog" className="hover:text-accent transition-colors">Shop</Link>
          <Link to="/catalog?category=helmets" className="hover:text-accent transition-colors">Helmets</Link>
          <Link to="/catalog?category=apparel" className="hover:text-accent transition-colors">Apparel</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-surface transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link to="/cart" className="relative p-2">
            <span>🛒</span>
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm hidden sm:block">Hi, {user.firstName}</span>
              <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <Link to="/login"><Button size="sm">Sign In</Button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};
