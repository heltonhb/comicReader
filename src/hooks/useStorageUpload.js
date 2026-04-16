import { useState, useCallback, useMemo } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * useStorageUpload - Hook for Firebase Storage upload with progress
 * Uploads multiple files and tracks progress per file
 */
export const useStorageUpload = () => {
  const [progress, setProgress] = useState({});
  const [urls, setUrls] = useState({});
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = useCallback(async (files, path = '/volumes/uploads') => {
    if (!files || files.length === 0) {
      setError('No files to upload');
      return { progress: {}, urls: {}, error: 'No files to upload' };
    }

    setUploading(true);
    setError(null);
    setProgress({});
    setUrls({});

    const newProgress = {};
    const newUrls = {};
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileRef = ref(storage, `${path}/${file.name}`);
      
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prev => ({ ...prev, [i]: percent }));
            newProgress[i] = percent;
          },
          (err) => {
            console.error(`Error uploading ${file.name}:`, err);
            setError(err.message);
            reject(err);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              newUrls[i] = downloadURL;
              setUrls(prev => ({ ...prev, [i]: downloadURL }));
              resolve(downloadURL);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
      
      uploadPromises.push(uploadPromise);
    }

    try {
      await Promise.all(uploadPromises);
      setUploading(false);
      return { progress: newProgress, urls: newUrls, error: null };
    } catch (err) {
      setUploading(false);
      setError(err.message);
      return { progress: newProgress, urls: newUrls, error: err.message };
    }
  }, []);

  const reset = useCallback(() => {
    setProgress({});
    setUrls({});
    setError(null);
    setUploading(false);
  }, []);

  return { uploadFiles, progress, urls, error, uploading, reset };
};

export default useStorageUpload;