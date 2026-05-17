import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Errors { name?: string; email?: string; password?: string; }

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!form.name || form.name.length < 2) e.name = 'At least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left */}
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
          <p className="text-xs text-white/30 uppercase tracking-widest mb-4 font-medium">Everything you get</p>
          {['Full lead CRUD', 'Role-based access', 'Advanced filtering', 'CSV export', 'Debounced search', 'Pagination'].map(f => (
            <div key={f} className="flex items-center gap-2.5 mb-3">
              <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{f}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20">© 2025 Leadflow</p>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-ink">Create account</h1>
            <p className="text-neutral-500 mt-1.5 text-sm">Start managing your leads in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
              <input className={`input-field ${errors.name ? 'input-error' : ''}`} placeholder="Rahul Sharma"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
              <input type="email" className={`input-field ${errors.email ? 'input-error' : ''}`} placeholder="you@company.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input type="password" className={`input-field ${errors.password ? 'input-error' : ''}`} placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {['sales', 'admin'].map(r => (
                  <button key={r} type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-lg border text-sm font-medium capitalize transition-all ${
                      form.role === r ? 'border-ink bg-ink text-cream' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 bg-white'
                    }`}>
                    {r === 'admin' ? '👑 Admin' : '👤 Sales'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-1">
              {loading
                ? <><div className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />Creating…</>
                : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ink font-medium underline underline-offset-2 hover:text-neutral-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
