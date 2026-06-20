import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const CloudIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
    </defs>
    <path
      d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
      fill="url(#cloudGrad)"
      fillOpacity="0.9"
    />
  </svg>
);

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-white'
        : 'text-slate-400 hover:text-slate-200'
    }`}
    style={
      active
        ? {
            background: 'rgba(14, 165, 233, 0.12)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
          }
        : { border: '1px solid transparent' }
    }
  >
    {children}
    {active && (
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
        style={{ background: '#38bdf8', bottom: '6px' }}
      />
    )}
  </Link>
);

const Navbar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <CloudIcon />
          </div>
          <div>
            <span
              className="text-base font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sky Vault
            </span>
            <span className="block text-[10px] tracking-widest text-slate-500 uppercase font-medium" style={{ WebkitTextFillColor: 'initial' }}>Cloud Drive</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
          <NavLink to="/files" active={pathname === '/files'}>Files</NavLink>
          <NavLink to="/profile" active={pathname === '/profile'}>Profile</NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-rose-500/8"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '1px solid rgba(244, 63, 94, 0.2)';
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = '1px solid transparent';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden flex items-center gap-1 px-4 pb-2">
        <NavLink to="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
        <NavLink to="/files" active={pathname === '/files'}>Files</NavLink>
        <NavLink to="/profile" active={pathname === '/profile'}>Profile</NavLink>
      </div>
    </header>
  );
};

export default Navbar;
