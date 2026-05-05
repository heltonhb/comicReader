import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStorageUpload from '../hooks/useStorageUpload';
import { useAdminStore } from '../store/adminStore';
import { CATEGORIES } from '../volumes';

/**
 * VolumeWizard - Complete volume creation flow
 * Step 1: Basic info -> Step 2: Upload pages -> Step 3: Confirm
 */
const VolumeWizard = ({ onComplete }) => {
  const navigate = useNavigate();
  const { createVolume } = useAdminStore();
  const { uploadFiles, progress, uploading } = useStorageUpload();
  
  const [step, setStep] = useState(1);
  const [volumeInfo, setVolumeInfo] = useState({
    id: '',
    title: '',
    author: '',
    description: '',
    category: 'manga'
  });
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingPages, setUploadingPages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setVolumeInfo(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && !prev.id) {
        updated.id = value.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      return updated;
    });
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles].sort((a, b) => 
        a.name.localeCompare(b.name, undefined, { numeric: true })
      ));
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files)
      .filter(f => f.type.startsWith('image/') || f.type === 'application/pdf');
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles].sort((a, b) => 
        a.name.localeCompare(b.name, undefined, { numeric: true })
      ));
    }
    e.target.value = '';
  }, []);

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (from, to) => {
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    const [removed] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, removed);
    setFiles(newFiles);
  };

  const validateStep1 = () => {
    if (!volumeInfo.id.trim()) return 'ID do volume é obrigatório';
    if (!volumeInfo.title.trim()) return 'Título é obrigatório';
    if (!volumeInfo.author.trim()) return 'Autor é obrigatório';
    return null;
  };

  const nextStep = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  };

  const createVolumeWithPages = async () => {
    setUploadingPages(true);
    setUploadProgress(0);

    try {
      // Upload images to Firebase Storage
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFiles([files[i]], `/volumes/${volumeInfo.id}`);
        if (result.urls && result.urls[0]) {
          uploadedUrls.push(result.urls[0]);
        }
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Create volume in Firestore
      const result = await createVolume({
        title: volumeInfo.title,
        author: volumeInfo.author,
        description: volumeInfo.description,
        category: volumeInfo.category,
        pageCount: files.length,
        pageUrls: uploadedUrls,
        folder: `/volumes/${volumeInfo.id}`,
        createdAt: new Date().toISOString()
      });

      if (result.success) {
        if (onComplete) onComplete(result.id);
        else navigate('/');
      } else {
        setError('Erro ao criar volume no banco de dados');
      }
    } catch (err) {
      setError('Erro ao fazer upload: ' + err.message);
    } finally {
      setUploadingPages(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= s ? 'bg-[#D4AF37] text-gray-900' : 'bg-gray-700 text-gray-400'
            }`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-1 mx-2 ${step > s ? 'bg-[#D4AF37]' : 'bg-gray-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-600 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Informações do Volume</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                ID do Volume (slug) *
              </label>
              <input
                type="text"
                name="id"
                value={volumeInfo.id}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="ex: naruto-vol1"
              />
              <p className="text-xs text-gray-500 mt-1">Identificador único (URL)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={volumeInfo.title}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="Naruto Vol. 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={volumeInfo.author}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="Masashi Kishimoto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tema / Categoria *
              </label>
              <select
                name="category"
                value={volumeInfo.category}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                value={volumeInfo.description}
                onChange={handleInfoChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                placeholder="Uma breve descrição do volume..."
              />
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Próximo: Adicionar Páginas
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Upload Pages */}
      {step === 2 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Adicionar Páginas</h2>
          
          {/* Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-gray-300">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm text-gray-500">Imagens (JPG, PNG, WebP) ou PDF</p>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold text-white">
                  {files.length} página{files.length !== 1 ? 's' : ''} selecionada{files.length !== 1 ? 's' : ''}
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-gray-400 hover:text-red-400"
                >
                  Limpar tudo
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                    <div className="w-8 h-8 bg-[#D4AF37]/20 rounded flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFile(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveFile(index, index + 1)}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-400 ml-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={files.length === 0}
              className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo: Confirmar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">Confirmar Criação</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Volume</h3>
              <p className="text-xl font-bold text-white">{volumeInfo.title}</p>
              <p className="text-gray-400">por {volumeInfo.author}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-2">Páginas</h3>
              <p className="text-white">{files.length} imagens</p>
              <p className="text-gray-400 text-sm mt-1">
                Serão enviadas para Firebase Storage em /volumes/{volumeInfo.id}/
              </p>
            </div>

            {volumeInfo.description && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm text-gray-400 mb-2">Descrição</h3>
                <p className="text-white">{volumeInfo.description}</p>
              </div>
            )}

            {uploadingPages && (
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white">Enviando páginas...</span>
                  <span className="text-[#D4AF37]">{uploadProgress}%</span>
                </div>
                <div className="bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(2)}
                disabled={uploadingPages}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={createVolumeWithPages}
                disabled={uploadingPages}
                className="flex-1 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {uploadingPages ? 'Enviando...' : 'Criar Volume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeWizard;