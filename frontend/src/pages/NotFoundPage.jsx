import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div
      className="grid min-h-screen place-items-center px-4 py-20 text-center relative overflow-hidden"
      style={{ background: '#050a14' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at center center, rgba(99,102,241,0.08) 0px, transparent 60%),
            radial-gradient(at 0% 0%, rgba(14,165,233,0.05) 0px, transparent 40%)
          `,
        }}
      />

      <div className="max-w-md w-full relative animate-fade-in" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <div
          className="rounded-[32px] p-8 sm:p-10"
          style={{
            background: 'rgba(10, 16, 30, 0.85)',
            border: '1px solid rgba(148, 163, 184, 0.08)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.35em] text-rose-400 mb-2">Error 404</p>
          
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Page not <span className="gradient-text">found</span>
          </h1>
          
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            The destination link you are trying to view does not exist or has been relocated to another path.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm rounded-xl text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 24px',
              boxShadow: '0 4px 20px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(14,165,233,0.45), inset 0 1px 0 rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
