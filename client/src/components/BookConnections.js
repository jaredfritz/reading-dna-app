import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import './BookConnections.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function BookConnections({ userId, onConnectionsGenerated, existingConnections }) {
  const [connections, setConnections] = useState(existingConnections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!existingConnections) {
      checkExistingConnections();
    }
  }, [userId, existingConnections]);

  const checkExistingConnections = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/book-connections/${userId}`);
      setConnections(response.data.connections);
      onConnectionsGenerated(response.data.connections);
    } catch (err) {
      // Connections don't exist yet, that's ok
    }
  };

  const generateConnections = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/analysis/book-connections`, { userId });
      setConnections(response.data.connections);
      onConnectionsGenerated(response.data.connections);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate book connections');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="book-connections-container loading">
        <div className="spinner"></div>
        <p>Mapping your book connections... This may take a minute.</p>
      </div>
    );
  }

  if (!connections) {
    return (
      <div className="book-connections-container">
        <h2>Book Connection Graph</h2>
        <p>Visualize how your books connect through themes, genres, and patterns.</p>
        <button onClick={generateConnections} className="generate-button">
          Generate Connection Graph
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="book-connections-container">
      <h2>Book Connection Graph</h2>
      <p className="subtitle">Click on a book to see its connections</p>

      <div className="graph-wrapper">
        <ForceGraph2D
          graphData={connections}
          nodeLabel="id"
          nodeColor={(node) => {
            const colors = {
              'fiction': '#0088FE',
              'non-fiction': '#00C49F',
              'fantasy': '#FFBB28',
              'mystery': '#FF8042',
              'romance': '#8884D8',
              'sci-fi': '#82CA9D',
            };
            return colors[node.group?.toLowerCase()] || '#999';
          }}
          nodeRelSize={6}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          onNodeClick={handleNodeClick}
          width={800}
          height={600}
        />
      </div>

      {selectedNode && (
        <div className="node-details">
          <h3>{selectedNode.id}</h3>
          <p><strong>Author:</strong> {selectedNode.author}</p>
          <p><strong>Group:</strong> {selectedNode.group}</p>

          <h4>Connections:</h4>
          <ul>
            {connections.links
              .filter(link =>
                link.source === selectedNode.id ||
                link.source.id === selectedNode.id ||
                link.target === selectedNode.id ||
                link.target.id === selectedNode.id
              )
              .map((link, index) => {
                const otherBook =
                  (link.source === selectedNode.id || link.source.id === selectedNode.id)
                    ? (typeof link.target === 'string' ? link.target : link.target.id)
                    : (typeof link.source === 'string' ? link.source : link.source.id);
                return (
                  <li key={index}>
                    <strong>{otherBook}</strong>: {link.reason}
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      <button onClick={generateConnections} className="regenerate-button">
        Regenerate Graph
      </button>
    </div>
  );
}

export default BookConnections;
