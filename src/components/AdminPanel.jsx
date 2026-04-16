import { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import VolumeForm from './VolumeForm';
import Dropzone from './Dropzone';

/**
 * AdminPanel - Main admin dashboard with sidebar navigation
 * Shows VolumeForm and Dropzone placeholder
 */
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('volumes');
  const { volumes, fetchVolumes, deleteVolume, loading } = useAdminStore();

  useEffect(() => {
    fetchVolumes();
  }, [fetchVolumes]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volume?')) {
      await deleteVolume(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-[#D4AF37]">Admin Panel</h1>
        <p className="text-gray-400 text-sm">Manage your volumes and uploads</p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('volumes')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'volumes'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Volumes
              </span>
            </button>

            <button
              onClick={() => setActiveTab('uploads')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'uploads'
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Uploads
              </span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'volumes' && (
            <div className="space-y-6">
              {/* Volume Form */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <VolumeForm />
              </div>

              {/* Volume List */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Existing Volumes</h3>
                
                {loading && volumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Loading volumes...
                  </div>
                ) : volumes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No volumes found. Create your first volume above.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {volumes.map(volume => (
                      <div
                        key={volume.id}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-[#D4AF37]/50 transition-colors"
                      >
                        {volume.coverUrl && (
                          <img
                            src={volume.coverUrl}
                            alt={volume.title}
                            className="w-full h-40 object-cover rounded-lg mb-3"
                          />
                        )}
                        <h4 className="font-semibold text-white">{volume.title}</h4>
                        <p className="text-gray-400 text-sm">{volume.author}</p>
                        {volume.pageCount && (
                          <p className="text-gray-500 text-xs mt-1">{volume.pageCount} pages</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleDelete(volume.id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-[#D4AF37] mb-4">File Upload</h3>
              <Dropzone />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;