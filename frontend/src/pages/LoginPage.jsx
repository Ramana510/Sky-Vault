import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

const CloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="loginCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="url(#loginCloudGrad)" />
  </svg>
);

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const validation = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) validation.email = 'Valid email required';
    if (form.password.length < 6) validation.password = 'Password must be at least 6 characters';
    setErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await api.post('/auth/login', form);
      login(response.data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen grid place-items-center px-4 py-12 relative overflow-hidden"
      style={{ background: '#050a14' }}
    >
      {/* Background mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 30% 20%, rgba(14,165,233,0.12) 0px, transparent 50%),
            radial-gradient(at 80% 80%, rgba(99,102,241,0.1) 0px, transparent 50%),
            radial-gradient(at 60% 50%, rgba(192,132,252,0.05) 0px, transparent 50%)
          `,
        }}
      />

      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-[0.04] blur-3xl" style={{ background: '#38bdf8' }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-[0.04] blur-3xl" style={{ background: '#818cf8' }} />

      <div
        className="relative w-full max-w-md animate-fade-in"
        style={{ animation: 'slideUp 0.5s ease-out' }}
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: 'rgba(10, 16, 30, 0.85)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                boxShadow: '0 0 30px rgba(14,165,233,0.15)',
              }}
            >
              <CloudIcon />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: '#f1f5f9' }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.7)' }}>
              Sign in to your Sky Vault
            </p>
          </div>

          {/* Divider */}
          <div
            className="mb-7 h-px w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.08), transparent)' }}
          />

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              icon={<EmailIcon />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              icon={<LockIcon />}
            />

            <div className="pt-1">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity="0.3" />
                      <path d="M21 12a9 9 0 0 1-9 9" strokeLinecap="round" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in to Sky Vault'}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>
            New here?{' '}
            <Link
              to="/register"
              className="font-semibold transition-colors duration-150"
              style={{ color: '#38bdf8' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#7dd3fc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            >
              Create an account →
            </Link>
          </p>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(148,163,184,0.3)' }}>
          Your files are encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
