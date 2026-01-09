import React, { useState } from 'react';
import axios from 'axios';
import './BookEvaluator.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function BookEvaluator({ userId }) {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async (e) => {
    e.preventDefault();

    if (!bookTitle.trim()) {
      setError('Please enter a book title');
      return;
    }

    setLoading(true);
    setError('');
    setEvaluation(null);

    try {
      const response = await axios.post(`${API_URL}/evaluation/evaluate`, {
        userId,
        bookTitle,
        bookAuthor: bookAuthor || undefined,
      });

      setEvaluation(response.data.evaluation);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to evaluate book');
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 8) return '#00C49F';
    if (score >= 6) return '#FFBB28';
    return '#FF8042';
  };

  return (
    <div className="book-evaluator-container">
      <h2>Evaluate a Book</h2>
      <p className="subtitle">Considering a new book? See if it matches your Reading DNA</p>

      <form onSubmit={handleEvaluate} className="evaluation-form">
        <div className="form-group">
          <label htmlFor="bookTitle">Book Title *</label>
          <input
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Enter the book title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookAuthor">Author (optional)</label>
          <input
            type="text"
            id="bookAuthor"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            placeholder="Enter the author's name"
          />
        </div>

        <button type="submit" disabled={loading} className="evaluate-button">
          {loading ? 'Evaluating...' : 'Evaluate Book'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing this book for you...</p>
        </div>
      )}

      {evaluation && (
        <div className="evaluation-results">
          <div className="book-info">
            <h3>{evaluation.bookTitle}</h3>
            {evaluation.bookAuthor && <p className="author">by {evaluation.bookAuthor}</p>}
          </div>

          <div className="match-score" style={{ borderColor: getMatchScoreColor(evaluation.matchScore) }}>
            <div className="score-value" style={{ color: getMatchScoreColor(evaluation.matchScore) }}>
              {evaluation.matchScore}/10
            </div>
            <div className="score-label">Match Score</div>
          </div>

          <section className="evaluation-section">
            <h4>Why It Fits</h4>
            <p>{evaluation.whyItFits}</p>
          </section>

          {evaluation.potentialConcerns && (
            <section className="evaluation-section concerns">
              <h4>Potential Concerns</h4>
              <p>{evaluation.potentialConcerns}</p>
            </section>
          )}

          {evaluation.contentWarnings && evaluation.contentWarnings.length > 0 && (
            <section className="evaluation-section warnings">
              <h4>Content Warnings</h4>
              <ul className="warnings-list">
                {evaluation.contentWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
              <p className="warnings-note">
                These warnings are intentionally vague to avoid spoilers
              </p>
            </section>
          )}

          {evaluation.alternatives && evaluation.alternatives.length > 0 && (
            <section className="evaluation-section alternatives">
              <h4>You Might Also Consider</h4>
              <div className="alternatives-list">
                {evaluation.alternatives.map((alt, index) => (
                  <div key={index} className="alternative-book">
                    <strong>{alt.title}</strong> by {alt.author}
                    <p>{alt.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default BookEvaluator;
