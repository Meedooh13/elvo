import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
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
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md p-8 bg-surface rounded-2xl border border-[var(--border)]">
        <h1 className="text-3xl font-black mb-2">Welcome back.</h1>
        <p className="text-sm text-gray-500 mb-8">Sign in to your Elvo account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-[var(--border)] bg-primary
                         focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-[var(--border)] bg-primary
                         focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          No account?{' '}
          <Link to="/register" className="text-accent font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};
