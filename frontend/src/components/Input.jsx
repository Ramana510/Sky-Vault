const Input = ({ label, error, className = '', icon, ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full text-sm text-slate-100 outline-none transition-all duration-200 ${icon ? 'pl-10' : ''} ${className}`}
          style={{
            background: 'rgba(8, 16, 32, 0.8)',
            border: error ? '1px solid rgba(244, 63, 94, 0.5)' : '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            paddingLeft: icon ? '42px' : '16px',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = error
              ? '1px solid rgba(244, 63, 94, 0.7)'
              : '1px solid rgba(14, 165, 233, 0.5)';
            e.currentTarget.style.boxShadow = error
              ? '0 0 0 3px rgba(244, 63, 94, 0.1)'
              : '0 0 0 3px rgba(14, 165, 233, 0.1), 0 0 20px rgba(14, 165, 233, 0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = error
              ? '1px solid rgba(244, 63, 94, 0.5)'
              : '1px solid rgba(148, 163, 184, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
