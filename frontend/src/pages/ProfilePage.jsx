import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/Button.jsx';
import api from '../utils/api.js';

const ProfilePage = () => {
  const { user } = useAuth();
  const [email] = useState(user?.email || '');
  const [name] = useState(user?.name || '');
  const [totalSize, setTotalSize] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorageUsage = async () => {
      try {
        const response = await api.get('/files');
        const files = response.data;
        const total = files.reduce((acc, file) => acc + (file.fileSize || 0), 0);
        setTotalSize(total);
      } catch (error) {
        console.error('Error fetching files for storage calculation:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStorageUsage();
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const limitBytes = 5 * 1024 * 1024 * 1024; // 5 GB
  const percentage = Math.min((totalSize / limitBytes) * 100, 100);

  // User initials for avatar
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050a14' }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(99,102,241,0.08) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(14,165,233,0.06) 0px, transparent 50%)
          `,
        }}
      />
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Main card */}
        <div className="glass-card rounded-[32px] p-6 sm:p-10 space-y-10">
          
          {/* Header & Avatar Info */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar block */}
            <div
              className="flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold text-white relative"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                boxShadow: '0 8px 30px rgba(14,165,233,0.35), inset 0 2px 4px rgba(255,255,255,0.2)',
              }}
            >
              {initials}
              {/* Pulse status indicator */}
              <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>

            {/* Title / Description */}
            <div className="text-center sm:text-left space-y-1.5 pt-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Profile <span className="gradient-text">Account</span>
              </h1>
              <p className="text-sm text-slate-400">
                Manage your profile details, monitor data footprint, and storage allocations.
              </p>
            </div>
          </div>

          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.08), transparent)' }} />

          {/* User Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(8, 16, 32, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</p>
              <p className="mt-3 text-lg font-bold text-white tracking-tight">{name || 'N/A'}</p>
            </div>
            
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(8, 16, 32, 0.4)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</p>
              <p className="mt-3 text-lg font-bold text-white tracking-tight">{email || 'N/A'}</p>
            </div>
          </div>

          {/* Storage Box */}
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-6"
            style={{
              background: 'rgba(8, 16, 32, 0.6)',
              border: '1px solid rgba(14, 165, 233, 0.12)',
            }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Storage Usage</p>
                <p className="mt-2 text-2xl font-extrabold text-white tracking-tight">Dynamic Cloud Allocations</p>
              </div>
              <Button disabled className="self-start sm:self-center">
                Upgrade Storage
              </Button>
            </div>

            <div
              className="rounded-2xl p-5 space-y-3.5"
              style={{
                background: 'rgba(5, 10, 20, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.05)',
              }}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-slate-400">Used volume</span>
                <span className="text-white">
                  {loading ? 'Calculating...' : `${formatSize(totalSize)} / 5 GB`}
                </span>
              </div>

              {/* Progress bar wrapper */}
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(148, 163, 184, 0.1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
                    boxShadow: '0 0 10px rgba(14, 165, 233, 0.3)',
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Free account tier</span>
                <span>{percentage.toFixed(2)}% consumed</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
