import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';
import Navbar from '../components/Navbar.jsx';
import FileCard from '../components/FileCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/files', { params: { search: query, sort: 'latest' } });
      setFiles(response.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [query]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/files/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
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

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050a14' }}>
      {/* Background mesh decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 100% 0%, rgba(14,165,233,0.06) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(99,102,241,0.06) 0px, transparent 50%)
          `,
        }}
      />
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Title & Search Bar Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-ring" />
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Library</p>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                File <span className="gradient-text">Vault Explorer</span>
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Browse your media uploads, execute quick search lookups, rename files, or share download links.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="w-full lg:max-w-md relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files by name..."
                className="w-full text-sm text-slate-100 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(8, 16, 32, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '12px',
                  padding: '12.5px 16px 12.5px 44px',
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
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Files Grid View */}
        <div className="mt-8">
          {loading ? (
            <Loader message="Fetching files from cloud index..." />
          ) : files.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
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
              title={query ? "No query hits" : "No files cataloged"}
              message={query ? "No files matched your search. Try another name." : "Upload photos or video media on the dashboard to populate your library."}
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default FilesPage;
