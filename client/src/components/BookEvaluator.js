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

  // Title autocomplete state
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [titleSelectedIndex, setTitleSelectedIndex] = useState(-1);
  const titleSuggestionsRef = useRef(null);
  const titleInputRef = useRef(null);

  // Author autocomplete state
  const [authorSuggestions, setAuthorSuggestions] = useState([]);
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);
  const [authorSelectedIndex, setAuthorSelectedIndex] = useState(-1);
  const authorSuggestionsRef = useRef(null);
  const authorInputRef = useRef(null);

  // Load last evaluation from localStorage on mount
  useEffect(() => {
    const cachedEval = localStorage.getItem('readr_last_evaluation');
    if (cachedEval) {
      try {
        const { evaluation, title, author } = JSON.parse(cachedEval);
        setEvaluation(evaluation);
        setBookTitle(title);
        setBookAuthor(author);
      } catch (err) {
        console.error('Failed to parse cached evaluation:', err);
      }
    }
  }, []);

  // Search for book title suggestions
  useEffect(() => {
    const searchBooks = async () => {
      if (bookTitle.length < 2) {
        setTitleSuggestions([]);
        setShowTitleSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/preloaded/search?q=${encodeURIComponent(bookTitle)}`);
        setTitleSuggestions(response.data);
        setShowTitleSuggestions(response.data.length > 0);
      } catch (err) {
        console.error('Failed to search books:', err);
      }
    };

    const debounce = setTimeout(searchBooks, 300);
    return () => clearTimeout(debounce);
  }, [bookTitle]);

  // Search for author suggestions
  useEffect(() => {
    const searchAuthors = async () => {
      if (bookAuthor.length < 2) {
        setAuthorSuggestions([]);
        setShowAuthorSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/preloaded/search-author?q=${encodeURIComponent(bookAuthor)}`);
        setAuthorSuggestions(response.data);
        setShowAuthorSuggestions(response.data.length > 0);
      } catch (err) {
        console.error('Failed to search authors:', err);
      }
    };

    const debounce = setTimeout(searchAuthors, 300);
    return () => clearTimeout(debounce);
  }, [bookAuthor]);

  // Close title suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (titleSuggestionsRef.current && !titleSuggestionsRef.current.contains(event.target) &&
          titleInputRef.current && !titleInputRef.current.contains(event.target)) {
        setShowTitleSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close author suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (authorSuggestionsRef.current && !authorSuggestionsRef.current.contains(event.target) &&
          authorInputRef.current && !authorInputRef.current.contains(event.target)) {
        setShowAuthorSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleChange = (e) => {
    setBookTitle(e.target.value);
    setTitleSelectedIndex(-1);
  };

  const handleAuthorChange = (e) => {
    setBookAuthor(e.target.value);
    setAuthorSelectedIndex(-1);
  };

  const handleSelectTitleSuggestion = (suggestion) => {
    setBookTitle(suggestion.title);
    setBookAuthor(suggestion.author || '');
    setShowTitleSuggestions(false);
    setTitleSelectedIndex(-1);
  };

  const handleSelectAuthorSuggestion = (suggestion) => {
    setBookTitle(suggestion.title);
    setBookAuthor(suggestion.author || '');
    setShowAuthorSuggestions(false);
    setAuthorSelectedIndex(-1);
  };

  const handleTitleKeyDown = (e) => {
    if (!showTitleSuggestions || titleSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setTitleSelectedIndex(prev => (prev < titleSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setTitleSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && titleSelectedIndex >= 0) {
      e.preventDefault();
      handleSelectTitleSuggestion(titleSuggestions[titleSelectedIndex]);
    } else if (e.key === 'Escape') {
      setShowTitleSuggestions(false);
      setTitleSelectedIndex(-1);
    }
  };

  const handleAuthorKeyDown = (e) => {
    if (!showAuthorSuggestions || authorSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAuthorSelectedIndex(prev => (prev < authorSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAuthorSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && authorSelectedIndex >= 0) {
      e.preventDefault();
      handleSelectAuthorSuggestion(authorSuggestions[authorSelectedIndex]);
    } else if (e.key === 'Escape') {
      setShowAuthorSuggestions(false);
      setAuthorSelectedIndex(-1);
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
    setShowTitleSuggestions(false);
    setShowAuthorSuggestions(false);

    try {
      const response = await axios.post(`${API_URL}/evaluation/evaluate`, {
        userId,
        bookTitle,
        bookAuthor: bookAuthor || undefined,
      });

      setEvaluation(response.data.evaluation);

      // Cache the evaluation in localStorage
      localStorage.setItem('readr_last_evaluation', JSON.stringify({
        evaluation: response.data.evaluation,
        title: bookTitle,
        author: bookAuthor,
        timestamp: new Date().toISOString()
      }));
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
            ref={titleInputRef}
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Start typing a book title..."
            required
            autoComplete="off"
          />
          {showTitleSuggestions && titleSuggestions.length > 0 && (
            <div ref={titleSuggestionsRef} className="suggestions-dropdown">
              {titleSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${index === titleSelectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectTitleSuggestion(suggestion)}
                  onMouseEnter={() => setTitleSelectedIndex(index)}
                >
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-author">by {suggestion.author}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group autocomplete-wrapper">
          <label htmlFor="bookAuthor">Author (optional)</label>
          <input
            ref={authorInputRef}
            type="text"
            id="bookAuthor"
            value={bookAuthor}
            onChange={handleAuthorChange}
            onKeyDown={handleAuthorKeyDown}
            placeholder="Start typing an author name..."
            autoComplete="off"
          />
          {showAuthorSuggestions && authorSuggestions.length > 0 && (
            <div ref={authorSuggestionsRef} className="suggestions-dropdown">
              {authorSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${index === authorSelectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSelectAuthorSuggestion(suggestion)}
                  onMouseEnter={() => setAuthorSelectedIndex(index)}
                >
                  <div className="suggestion-title">{suggestion.title}</div>
                  <div className="suggestion-author">by {suggestion.author}</div>
                </div>
              ))}
            </div>
          )}
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
