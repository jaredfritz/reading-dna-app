import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState('goodreads');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = source === 'goodreads' ? 'goodreads' : 'storygraph';
      const response = await axios.post(`${API_URL}/upload/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`✓ Successfully imported ${response.data.bookCount} books!`);
      onUploadSuccess(response.data.userId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Your Reading History</h2>

      <div className="instructions">
        <h3>How to export your data:</h3>
        <div className="export-instructions">
          <div className="source-section">
            <h4>From Goodreads:</h4>
            <ol>
              <li>Go to <a href="https://www.goodreads.com/review/import" target="_blank" rel="noopener noreferrer">goodreads.com/review/import</a></li>
              <li>Click "Export Library"</li>
              <li>Download the CSV file</li>
              <li>Upload it here</li>
            </ol>
          </div>
          <div className="source-section">
            <h4>From StoryGraph:</h4>
            <ol>
              <li>Go to your profile settings</li>
              <li>Click "Export" under Data Management</li>
              <li>Download the CSV file</li>
              <li>Upload it here</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="upload-form">
        <div className="source-selector">
          <label>
            <input
              type="radio"
              value="goodreads"
              checked={source === 'goodreads'}
              onChange={(e) => setSource(e.target.value)}
            />
            Goodreads
          </label>
          <label>
            <input
              type="radio"
              value="storygraph"
              checked={source === 'storygraph'}
              onChange={(e) => setSource(e.target.value)}
            />
            StoryGraph
          </label>
        </div>

        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            {file ? file.name : 'Choose CSV file'}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </button>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default FileUpload;
