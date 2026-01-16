import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './BookEvaluator.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function BookEvaluator({ userId }) {
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  // Search for book suggestions
  useEffect(() => {
    const searchBooks = async () => {
      if (bookTitle.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/preloaded/search?q=${encodeURIComponent(bookTitle)}`);
        setSuggestions(response.data);
        setShowSuggestions(response.data.length > 0);
      } catch (err) {
        console.error('Failed to search books:', err);
      }
    };

    const debounce = setTimeout(searchBooks, 300);
    return () => clearTimeout(debounce);
  }, [bookTitle]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleChange = (e) => {
    setBookTitle(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion) => {
    setBookTitle(suggestion.title);
    setBookAuthor(suggestion.author || '');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();

    if (!bookTitle.trim()) {
      setError('Please enter a book title');
      return;
    }

    setLoading(true);
    setError('');
    setEvaluation(null);
    setShowSuggestions(false);

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
        <div className="form-group autocomplete-wrapper">
          <label htmlFor="bookTitle">Book Title *</label>
          <input
            ref={inputRef}
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing a book title..."
            required
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-author">by {suggestion.author}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bookAuthor">Author (optional)</label>
          <input
            type="text"
            id="bookAuthor"
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
            placeholder="Author (auto-filled from selection)"
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
