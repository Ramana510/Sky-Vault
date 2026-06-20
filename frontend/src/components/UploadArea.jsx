import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const UploadArea = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const response = await api.post('/files/upload', formData, {
        onUploadProgress: (event) => setProgress(Math.round((event.loaded / event.total) * 100)),
      });
      onUpload(response.data);
      toast.success('Uploaded successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    } finally {
      setProgress(0);
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        className="relative rounded-2xl text-center cursor-pointer transition-all duration-300 overflow-hidden"
        style={{
          border: dragging
            ? '1.5px dashed rgba(56, 189, 248, 0.6)'
            : '1.5px dashed rgba(148, 163, 184, 0.15)',
          background: dragging
            ? 'rgba(14, 165, 233, 0.06)'
            : 'rgba(8, 16, 32, 0.4)',
          padding: '36px 24px',
        }}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Background glow when dragging */}
        {dragging && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.12) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Icon */}
        <div className="mx-auto mb-5 relative" style={{ width: '64px', height: '64px' }}>
          <div
            className="w-full h-full flex items-center justify-center rounded-2xl transition-all duration-300"
            style={{
              background: dragging
                ? 'rgba(14, 165, 233, 0.18)'
                : 'rgba(14, 165, 233, 0.08)',
              border: dragging
                ? '1px solid rgba(56, 189, 248, 0.4)'
                : '1px solid rgba(56, 189, 248, 0.15)',
              boxShadow: dragging
                ? '0 0 30px rgba(14,165,233,0.25)'
                : 'none',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={dragging ? '#38bdf8' : 'rgba(56,189,248,0.6)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-200 mb-1">
          {dragging ? 'Drop your file here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-slate-500 mb-5">
          Images and videos · Up to 50MB
        </p>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl text-white transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '9px 20px',
            boxShadow: '0 4px 20px rgba(14,165,233,0.3)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Browse files
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif,image/avif,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
          onChange={(e) => {
            handleFileUpload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {/* Progress bar */}
      {uploading && (
        <div
          className="rounded-2xl p-4 space-y-2.5"
          style={{
            background: 'rgba(8, 16, 32, 0.6)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Uploading...
            </span>
            <span
              className="font-bold"
              style={{
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(148, 163, 184, 0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
                boxShadow: '0 0 8px rgba(14, 165, 233, 0.5)',
              }}
            />
          </div>
        </div>
      )}

      {/* Supported formats */}
      <div className="flex flex-wrap gap-2 justify-center">
        {['JPG', 'PNG', 'GIF', 'WEBP', 'MP4', 'MOV'].map((fmt) => (
          <span
            key={fmt}
            className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(148, 163, 184, 0.05)',
              border: '1px solid rgba(148, 163, 184, 0.08)',
              color: 'rgba(148, 163, 184, 0.5)',
            }}
          >
            {fmt}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UploadArea;
