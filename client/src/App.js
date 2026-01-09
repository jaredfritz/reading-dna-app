import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import ReadingDNA from './components/ReadingDNA';
import BookConnections from './components/BookConnections';
import Recommendations from './components/Recommendations';
import BookEvaluator from './components/BookEvaluator';

function App() {
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [readingDNA, setReadingDNA] = useState(null);
  const [connections, setConnections] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

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
      </main>

      <footer className="App-footer">
        <p>Built with React, Node.js, and OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
