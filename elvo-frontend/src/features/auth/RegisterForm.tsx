import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import api from '../../lib/axios';

export const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/auth/register', form);
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      setAuth(data.user, data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex noise-bg">
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--surface)] border-r border-[var(--border)] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <Link to="/" className="font-display text-4xl relative z-10">EL<span className="text-accent">VO</span></Link>
        <div className="relative z-10">
          <p className="font-display text-7xl leading-none mb-4">JOIN<br />THE<br /><span className="text-accent">GRID.</span></p>
          <p className="text-[var(--text-secondary)] text-lg">Create your account and get race-day access.</p>
        </div>
        <p className="text-[var(--text-secondary)] text-sm relative z-10">© 2025 Elvo Racing Apparel</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16 bg-[var(--bg-primary)]">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-display text-3xl lg:hidden block mb-8">EL<span className="text-accent">VO</span></Link>
          <h1 className="font-display text-5xl mb-2">CREATE ACCOUNT</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Be part of the Elvo community</p>

          {error && <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {[['firstName','First Name'],['lastName','Last Name']].map(([key,label]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-2">{label}</label>
                  <input required value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
                </div>
              ))}
            </div>
            {[['email','Email','email','you@example.com'],['password','Password','password','••••••••'],['phone','Phone (optional)','tel','+20 1xx xxx xxxx']].map(([key,label,type,ph]) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[var(--text-secondary)] mb-2">{label}</label>
                <input type={type} required={key !== 'phone'} value={(form as any)[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
                  className="w-full px-5 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="mt-2 w-full py-4 bg-accent text-white font-semibold rounded-2xl
                         hover:bg-[var(--accent-hover)] hover:shadow-[0_0_30px_var(--accent-glow)]
                         transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
