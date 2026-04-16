/**
 * FileList - Display list of uploaded files with copy and delete actions
 */
const FileList = ({ files = [] }) => {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No files uploaded yet
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
        </svg>
      );
    }
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) {
      return (
        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
      </svg>
    );
  };

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-[#D4AF37]/30 transition-colors"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {getFileIcon(file.name)}
            <div className="overflow-hidden">
              <p className="text-sm text-white truncate">{file.name}</p>
              {file.size && (
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file.url && (
              <>
                <button
                  onClick={() => navigator.clipboard.writeText(file.url)}
                  className="px-3 py-1 text-sm bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 rounded transition-colors"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => window.open(file.url, '_blank')}
                  className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                >
                  Open
                </button>
              </>
            )}
            {file.onDelete && (
              <button
                onClick={() => file.onDelete(file)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;