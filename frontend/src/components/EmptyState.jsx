const EmptyState = ({ title, message, icon }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl"
      style={{
        background: 'rgba(8, 16, 32, 0.3)',
        border: '1px dashed rgba(148, 163, 184, 0.12)',
      }}
    >
      {/* Icon */}
      <div
        className="mb-5 flex items-center justify-center w-16 h-16 rounded-2xl"
        style={{
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.12)',
        }}
      >
        {icon || (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 7C3 5.9 3.9 5 5 5h14c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7z"
              stroke="rgba(56,189,248,0.6)"
              strokeWidth="1.5"
              fill="none"
            />
            <path d="M8 10h8M8 14h5" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>

      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: 'rgba(56, 189, 248, 0.7)' }}
      >
        {title}
      </p>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">{message}</p>
    </div>
  );
};

export default EmptyState;
