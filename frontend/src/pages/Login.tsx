import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Errors { email?: string; password?: string; }

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-96 bg-ink flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-amber-400 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="font-display font-semibold text-cream text-lg">Leadflow</span>
        </div>

        <div>
          <blockquote className="font-display text-2xl text-cream/80 leading-snug italic">
            "The leads you track today are the clients you close tomorrow."
          </blockquote>
          <div className="mt-6 flex gap-2">
            {['New', 'Contacted', 'Qualified'].map(s => (
              <span key={s} className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/60">{s}</span>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20">© 2025 Leadflow. Built with MERN + TypeScript.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
            <p className="text-neutral-500 mt-1.5 text-sm">Sign in to your workspace to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input type="email" className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder="you@company.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input type="password" className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />Signing in…</>
                : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-6">
            New to Leadflow?{' '}
            <Link to="/register" className="text-ink font-medium underline underline-offset-2 hover:text-neutral-600 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
