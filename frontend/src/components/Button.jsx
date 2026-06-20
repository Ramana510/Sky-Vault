const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: `rounded-xl text-white focus:ring-2 focus:ring-sky-500/40`,
    ghost: `rounded-xl text-slate-300 hover:text-white focus:ring-2 focus:ring-slate-500/30`,
    danger: `rounded-xl text-white focus:ring-2 focus:ring-rose-500/40`,
  };

  const primaryStyle = {
    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 4px 20px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
    padding: '10px 22px',
  };

  const ghostStyle = {
    background: 'rgba(148,163,184,0.08)',
    border: '1px solid rgba(148,163,184,0.12)',
    padding: '10px 22px',
  };

  const dangerStyle = {
    background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 4px 20px rgba(244,63,94,0.25)',
    padding: '10px 22px',
  };

  const styleMap = { primary: primaryStyle, ghost: ghostStyle, danger: dangerStyle };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      style={styleMap[variant] || styleMap.primary}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(14,165,233,0.45), inset 0 1px 0 rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(148,163,184,0.14)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(148,163,184,0.08)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
