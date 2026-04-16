import { useState } from 'react';
import { useAdminStore } from '../store/adminStore';

/**
 * VolumeForm - Cataloging form for volume creation
 * Validates required fields and submits to Firestore
 */
const VolumeForm = () => {
  const { createVolume, loading } = useAdminStore();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pageCount: '',
    coverUrl: '',
    pdfUrl: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return false;
    }
    if (formData.pageCount && parseInt(formData.pageCount) <= 0) {
      setError('Page count must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await createVolume({
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      pageCount: formData.pageCount ? parseInt(formData.pageCount) : 0,
      coverUrl: formData.coverUrl.trim(),
      pdfUrl: formData.pdfUrl.trim()
    });

    if (result.success) {
      setSuccess('Volume created successfully!');
      setFormData({
        title: '',
        author: '',
        description: '',
        pageCount: '',
        coverUrl: '',
        pdfUrl: ''
      });
    } else {
      setError(result.error || 'Failed to create volume');
    }
  };

  const inputClassName = "w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors";

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Create New Volume</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-900/50 border border-green-600 rounded-lg text-green-200">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Enter volume title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={inputClassName}
              placeholder="Enter author name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={inputClassName}
            placeholder="Enter volume description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Page Count
            </label>
            <input
              type="number"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              min="1"
              className={inputClassName}
              placeholder="Enter page count"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleChange}
              className={inputClassName}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            PDF URL
          </label>
          <input
            type="text"
            name="pdfUrl"
            value={formData.pdfUrl}
            onChange={handleChange}
            className={inputClassName}
            placeholder="https://... or Firebase Storage URL"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Volume'}
        </button>
      </form>
    </div>
  );
};

export default VolumeForm;