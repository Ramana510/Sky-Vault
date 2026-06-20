import { useState } from 'react';
import { FaFileImage, FaFileVideo } from 'react-icons/fa';

const ActionButton = ({ onClick, label, children, danger }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150"
    style={{
      background: danger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(148, 163, 184, 0.08)',
      border: danger ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(148, 163, 184, 0.1)',
      color: danger ? '#f43f5e' : '#94a3b8',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger ? 'rgba(244, 63, 94, 0.18)' : 'rgba(148, 163, 184, 0.14)';
      e.currentTarget.style.color = danger ? '#fb7185' : '#e2e8f0';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = danger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(148, 163, 184, 0.08)';
      e.currentTarget.style.color = danger ? '#f43f5e' : '#94a3b8';
    }}
    title={label}
  >
    {children}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const FileCard = ({ file, onDelete, onRename, onDownload, onCopy }) => {
  const isVideo = file.fileType === 'video';
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy(file.fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: hovered
          ? 'rgba(14, 22, 40, 0.85)'
          : 'rgba(10, 16, 30, 0.7)',
        border: hovered
          ? '1px solid rgba(56, 189, 248, 0.2)'
          : '1px solid rgba(148, 163, 184, 0.07)',
        boxShadow: hovered
          ? '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(56,189,248,0.05)'
          : '0 4px 20px rgba(0,0,0,0.25)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media Preview */}
      <div className="relative overflow-hidden" style={{ height: '180px', background: '#050a14' }}>
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            src={file.fileUrl}
            controls
            muted
          />
        ) : (
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={file.fileUrl}
            alt={file.fileName}
          />
        )}

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(5,10,20,0.7) 0%, transparent 60%)',
          }}
        />

        {/* Type badge */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{
            background: 'rgba(5, 10, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span style={{ color: isVideo ? '#a78bfa' : '#38bdf8', fontSize: '11px' }}>
            {isVideo ? <FaFileVideo /> : <FaFileImage />}
          </span>
          <span className="text-[11px] font-medium text-slate-300">
            {isVideo ? 'Video' : 'Image'}
          </span>
        </div>

        {/* Size badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-300"
          style={{
            background: 'rgba(5, 10, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {formatSize(file.fileSize)}
        </div>
      </div>

      {/* File info */}
      <div className="p-4 space-y-3">
        <div>
          <h3
            className="text-sm font-semibold text-slate-100 truncate"
            title={file.fileName}
          >
            {file.fileName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(file.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <ActionButton onClick={() => onDownload(file)} label="Download">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </ActionButton>
          <ActionButton onClick={handleCopy} label={copied ? 'Copied!' : 'Copy Link'}>
            {copied ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </ActionButton>
          <ActionButton onClick={() => onRename(file)} label="Rename">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </ActionButton>
          <ActionButton onClick={() => onDelete(file._id)} label="Delete" danger>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
