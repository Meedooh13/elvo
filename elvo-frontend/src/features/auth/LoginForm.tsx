import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import api from '../../lib/axios';

export const LoginForm: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex noise-bg">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <Link to="/" className="font-display text-4xl text-white relative z-10">ELVO</Link>
        <div className="relative z-10">
          <p className="font-display text-7xl text-white leading-none mb-4">BACK ON<br />THE GRID.</p>
          <p className="text-white/70 text-lg">Sign in to continue your race.</p>
        </div>
        <p className="text-white/40 text-sm relative z-10">© 2025 Elvo Racing Apparel</p>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-[var(--bg-primary)]">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-display text-3xl lg:hidden block mb-8 text-[var(--text-primary)]">EL<span className="text-accent">VO</span></Link>
          <h1 className="font-display text-5xl text-[var(--text-primary)] mb-2">SIGN IN</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Welcome back to Elvo</p>

          {error && <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-2">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-5 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]
                           focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-2">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]
                           focus:outline-none focus:ring-2 focus:ring-accent text-sm transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 w-full py-4 bg-accent text-white font-semibold rounded-2xl
                         hover:bg-[var(--accent-hover)] hover:shadow-[0_0_30px_var(--accent-glow)]
                         transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[var(--text-secondary)]">
            No account?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
