import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import Navbar from '../components/Navbar.jsx';
import UploadArea from '../components/UploadArea.jsx';
import FileCard from '../components/FileCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/files', {
        params: { search, type: filter === 'all' ? undefined : filter, sort: 'latest' },
      });
      setFiles(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load files');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    try {
      const response = await api.get('/files/recent');
      setRecent(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchRecent();
  }, [filter, search]);

  const handleUpload = (newFile) => {
    setFiles((prev) => [newFile, ...prev]);
    setRecent((prev) => [newFile, ...prev].slice(0, 5));
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
      setRecent((prev) => prev.filter((file) => file._id !== id));
      toast.success('File deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const handleRename = async (file) => {
    const newName = window.prompt('Enter new file name', file.fileName);
    if (!newName || newName === file.fileName) return;
    try {
      const response = await api.put(`/files/${file._id}`, { fileName: newName });
      setFiles((prev) => prev.map((item) => (item._id === file._id ? response.data : item)));
      setRecent((prev) => prev.map((item) => (item._id === file._id ? response.data : item)));
      toast.success('Renamed successfully');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Rename failed');
    }
  };

  const handleDownload = (file) => {
    window.open(file.fileUrl, '_blank');
  };

  const handleCopy = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success('Copied link');
  };

  const stats = useMemo(() => ({
    total: files.length,
    images: files.filter((file) => file.fileType === 'image').length,
    videos: files.filter((file) => file.fileType === 'video').length
  }), [files]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050a14' }}>
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(14,165,233,0.08) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(99,102,241,0.06) 0px, transparent 50%)
          `
        }}
      />
      <Navbar />

      <main className="relative mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        
        {/* Top Section: Dashboard Summary & Recent Uploads */}
        <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          {/* Summary Box */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-ring" />
                <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Dashboard</p>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Your cloud <span className="gradient-text">Sky Vault</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400 max-w-md">
                Securely store, view, and share your images and video files. Upload instantly and manage access on the go.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid gap-4 grid-cols-3">
              <div className="stat-card">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Total</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</p>
                <div className="absolute -right-2 -bottom-2 opacity-5 text-sky-400">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Images</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">{stats.images}</p>
                <div className="absolute -right-2 -bottom-2 opacity-5 text-sky-400">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Videos</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
                <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">{stats.videos}</p>
                <div className="absolute -right-2 -bottom-2 opacity-5 text-indigo-400">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Recent Uploads
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-400">
                Activity Feed
              </span>
            </div>
            
            <div className="mt-6 space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
              {recent.length > 0 ? (
                recent.map((file) => (
                  <div
                    key={file._id}
                    className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200"
                    style={{
                      background: 'rgba(8, 16, 32, 0.4)',
                      border: '1px solid rgba(148, 163, 184, 0.06)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.15)';
                      e.currentTarget.style.background = 'rgba(14, 165, 233, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.06)';
                      e.currentTarget.style.background = 'rgba(8, 16, 32, 0.4)';
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: file.fileType === 'video' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(56, 189, 248, 0.1)' }}>
                        {file.fileType === 'video' ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5">
                            <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate pr-2" title={file.fileName}>{file.fileName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{new Date(file.createdAt).toLocaleDateString()} · {new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-400/8 transition-all"
                      title="Download"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No activity"
                  message="Uploaded files will appear here."
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                      <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/><circle cx="12" cy="12" r="10"/>
                    </svg>
                  }
                />
              )}
            </div>
          </div>
        </section>

        {/* Lower Section: Upload Area & File Explorer */}
        <section className="grid gap-6 lg:grid-cols-[1fr,2.2fr]">
          {/* Upload card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 self-start">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload media
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed mb-6">
              Drop files below or browse from device. Supports image and video formats.
            </p>
            <UploadArea onUpload={handleUpload} />
          </div>

          {/* Files grid card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-400">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                  </svg>
                  Library explorer
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Search, filter formats, copy links, or download media files.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 self-start sm:self-center">
                {['all', 'image', 'video'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all duration-200"
                    style={{
                      background: filter === type ? 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' : 'transparent',
                      color: filter === type ? '#ffffff' : '#94a3b8',
                      boxShadow: filter === type ? '0 2px 10px rgba(14,165,233,0.25)' : 'none',
                    }}
                  >
                    {type}s
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input bar */}
            <div className="mt-6 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search files by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm text-slate-100 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(8, 16, 32, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 16px 12px 42px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1), 0 0 20px rgba(14, 165, 233, 0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Grid display */}
            <div className="mt-6">
              {loading ? (
                <Loader message="Fetching repository library..." />
              ) : files.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-fade-in">
                  {files.map((file) => (
                    <FileCard
                      key={file._id}
                      file={file}
                      onDelete={handleDelete}
                      onRename={handleRename}
                      onDownload={handleDownload}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={search ? 'No search results' : 'Empty vault'}
                  message={search ? 'No files match your query. Try another keyword.' : 'Upload media to catalog your files in Sky Vault.'}
                />
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardPage;
