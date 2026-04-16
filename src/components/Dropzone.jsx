import { useState, useCallback } from 'react';
import useStorageUpload from '../hooks/useStorageUpload';

/**
 * Dropzone - Drag-and-drop file upload component
 * Accepts files via drag-and-drop or click to open file picker
 * Shows progress during upload and returns download URLs
 */
const Dropzone = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFiles, progress, urls, error, uploading, reset } = useStorageUpload();

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
    e.target.value = '';
  }, []);

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const result = await uploadFiles(files, '/volumes/uploads');
    
    if (onUploadComplete) {
      onUploadComplete(result);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    reset();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCompletedUrls = () => {
    const completedUrls = [];
    Object.values(urls).forEach(url => {
      if (url) completedUrls.push(url);
    });
    return completedUrls;
  };

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="pointer-events-none">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-gray-300">
            Drag and drop files here, or click to select
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Supports images and PDFs
          </p>
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-white">
              Selected Files ({files.length})
            </h4>
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700 rounded p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="overflow-hidden">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Progress indicator */}
                  {uploading && progress[index] !== undefined && (
                    <div className="w-20">
                      <div className="bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full transition-all"
                          style={{ width: `${progress[index]}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        {progress[index]}%
                      </p>
                    </div>
                  )}

                  {/* Download URL */}
                  {urls[index] && (
                    <button
                      onClick={() => navigator.clipboard.writeText(urls[index])}
                      className="text-xs text-[#D4AF37] hover:text-[#B8962E]"
                      title="Copy URL"
                    >
                      Copy URL
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-400 hover:text-red-400"
                    disabled={uploading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          {files.length > 0 && !uploading && (
            <button
              onClick={handleUpload}
              className="mt-4 w-full py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Upload Files
            </button>
          )}

          {uploading && (
            <button
              disabled
              className="mt-4 w-full py-3 bg-[#D4AF37]/50 text-gray-900 font-semibold rounded-lg cursor-not-allowed"
            >
              Uploading...
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Completed URLs */}
      {getCompletedUrls().length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-lg font-semibold text-[#D4AF37] mb-3">
            Upload Complete
          </h4>
          <div className="space-y-2">
            {getCompletedUrls().map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(url)}
                  className="px-3 py-2 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 text-sm rounded transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;