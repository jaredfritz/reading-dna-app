import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recommendations.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Recommendations({ userId, onRecommendationsGenerated, existingRecommendations }) {
  const [recommendations, setRecommendations] = useState(existingRecommendations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!existingRecommendations) {
      checkExistingRecommendations();
    }
  }, [userId, existingRecommendations]);

  const checkExistingRecommendations = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/${userId}`);
      const recs = Array.isArray(response.data.recommendations)
        ? response.data.recommendations
        : response.data.recommendations.recommendations || [];
      setRecommendations(recs);
      onRecommendationsGenerated(recs);
    } catch (err) {
      // Recommendations don't exist yet, that's ok
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/recommendations/generate`, { userId });
      const recs = Array.isArray(response.data.recommendations)
        ? response.data.recommendations
        : response.data.recommendations.recommendations || [];
      setRecommendations(recs);
      onRecommendationsGenerated(recs);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-container loading">
        <div className="spinner"></div>
        <p>Finding your perfect next reads... This may take a minute.</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <h2>Suggested Reads</h2>
        <p>Get personalized book recommendations based on your Reading DNA.</p>
        <p className="diversity-note">
          We'll recommend 10 books across different genres to help you explore beyond your usual preferences!
        </p>
        <button onClick={generateRecommendations} className="generate-button">
          Get Recommendations
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h2>Suggested Reads for You</h2>
      <p className="subtitle">Based on your Reading DNA, with intentional variety</p>

      <div className="recommendations-grid">
        {recommendations.map((book, index) => (
          <div key={index} className="recommendation-card">
            <div className="card-header">
              <h3>{book.title}</h3>
              <span className="genre-badge">{book.genre}</span>
            </div>
            <p className="author">by {book.author}</p>
            <p className="hook">{book.hook}</p>
            <div className="reason">
              <strong>Why this fits:</strong>
              <p>{book.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={generateRecommendations} className="regenerate-button">
        Get New Recommendations
      </button>
    </div>
  );
}

export default Recommendations;
