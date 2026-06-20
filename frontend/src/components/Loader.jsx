const Loader = ({ message = 'Loading...' }) => {
  return (
    <div
      className="flex min-h-[260px] items-center justify-center rounded-2xl p-8"
      style={{
        background: 'rgba(8, 16, 32, 0.4)',
        border: '1px solid rgba(148, 163, 184, 0.06)',
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Animated spinner */}
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(148, 163, 184, 0.08)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: '2px solid transparent',
              borderTopColor: '#38bdf8',
              borderRightColor: 'rgba(129, 140, 248, 0.5)',
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            }}
          />
        </div>
        <p className="text-sm font-medium text-slate-400">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
