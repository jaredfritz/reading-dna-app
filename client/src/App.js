import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import ReadingDNA from './components/ReadingDNA';
import BookConnections from './components/BookConnections';
import Recommendations from './components/Recommendations';
import BookEvaluator from './components/BookEvaluator';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function App() {
  const [userId, setUserId] = useState('default-user');
  const [activeTab, setActiveTab] = useState('dna');
  const [readingDNA, setReadingDNA] = useState(null);
  const [connections, setConnections] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load pre-generated data on app startup
  useEffect(() => {
    const loadPreloadedData = async () => {
      try {
        setLoading(true);

        // Load Reading DNA
        const dnaResponse = await axios.get(`${API_URL}/preloaded/reading-dna`);
        setReadingDNA(dnaResponse.data);

        // Load Book Connections
        const connectionsResponse = await axios.get(`${API_URL}/preloaded/book-connections`);
        setConnections(connectionsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error loading preloaded data:', error);
        setLoading(false);
      }
    };

    loadPreloadedData();
  }, []);

  const handleUploadSuccess = (newUserId) => {
    setUserId(newUserId);
    setActiveTab('dna');
  };

  const handleDNAGenerated = (dna) => {
    setReadingDNA(dna);
  };

  const handleConnectionsGenerated = (conns) => {
    setConnections(conns);
  };

  const handleRecommendationsGenerated = (recs) => {
    setRecommendations(recs);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Reading DNA</h1>
        <p>Discover your unique reading fingerprint</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload Books
        </button>
        <button
          className={activeTab === 'dna' ? 'active' : ''}
          onClick={() => setActiveTab('dna')}
          disabled={!userId}
        >
          Reading DNA
        </button>
        <button
          className={activeTab === 'connections' ? 'active' : ''}
          onClick={() => setActiveTab('connections')}
          disabled={!userId}
        >
          Book Connections
        </button>
        <button
          className={activeTab === 'recommendations' ? 'active' : ''}
          onClick={() => setActiveTab('recommendations')}
          disabled={!userId || !readingDNA}
        >
          Suggested Reads
        </button>
        <button
          className={activeTab === 'evaluate' ? 'active' : ''}
          onClick={() => setActiveTab('evaluate')}
          disabled={!userId || !readingDNA}
        >
          Evaluate a Book
        </button>
      </nav>

      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <h2>Loading your Reading DNA...</h2>
            <p>Just a moment while we prepare your personalized reading profile.</p>
          </div>
        ) : (
          <>
            {activeTab === 'upload' && (
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            )}
            {activeTab === 'dna' && userId && (
          <ReadingDNA
            userId={userId}
            onDNAGenerated={handleDNAGenerated}
            existingDNA={readingDNA}
          />
        )}
        {activeTab === 'connections' && userId && (
          <BookConnections
            userId={userId}
            onConnectionsGenerated={handleConnectionsGenerated}
            existingConnections={connections}
          />
        )}
        {activeTab === 'recommendations' && userId && readingDNA && (
          <Recommendations
            userId={userId}
            onRecommendationsGenerated={handleRecommendationsGenerated}
            existingRecommendations={recommendations}
          />
        )}
        {activeTab === 'evaluate' && userId && readingDNA && (
          <BookEvaluator userId={userId} />
        )}
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>Built with React, Node.js, and Anthropic Claude</p>
      </footer>
    </div>
  );
}

export default App;
