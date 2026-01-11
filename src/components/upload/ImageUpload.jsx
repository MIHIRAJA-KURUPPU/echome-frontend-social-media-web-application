import React, { useState, useRef } from 'react';
import './imageUpload.css';
import API from '../../api/axios';

export default function ImageUpload({ type = 'post', onUploadSuccess, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndPreview(file);
    }
  };

  const validateAndPreview = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPEG, PNG, and GIF images are allowed');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload automatically
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'profile' ? '/upload/profile' : '/upload/post';
      const res = await API.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Convert relative URL to absolute URL (without /api prefix)
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8800/api';
        const baseUrl = apiUrl.split('/api')[0];
        const imageUrl = `${baseUrl}${res.data.data.url}`;
        console.log('Image uploaded, URL:', imageUrl);
        setPreview(imageUrl);
        if (onUploadSuccess) {
          onUploadSuccess(imageUrl, res.data.data.filename);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndPreview(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onUploadSuccess) {
      onUploadSuccess(null, null);
    }
  };

  return (
    <div className="imageUploadContainer">
      {!preview ? (
        <div
          className="imageUploadDropzone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {uploading ? (
            <div className="imageUploadLoading">
              <div className="spinner"></div>
              <p>Uploading...</p>
            </div>
          ) : (
            <>
              <div className="imageUploadIcon">📷</div>
              <p>Click or drag image to upload</p>
              <span className="imageUploadHint">JPEG, PNG, GIF (max 5MB)</span>
            </>
          )}
        </div>
      ) : (
        <div className="imageUploadPreview">
          <img src={preview} alt="Preview" />
          {!uploading && (
            <button className="imageUploadRemove" onClick={removeImage}>
              ×
            </button>
          )}
          {uploading && (
            <div className="imageUploadOverlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      )}
      {error && <div className="imageUploadError">{error}</div>}
    </div>
  );
}
