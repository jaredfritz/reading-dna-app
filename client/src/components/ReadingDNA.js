import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './ReadingDNA.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

function ReadingDNA({ userId, onDNAGenerated, existingDNA }) {
  const [dna, setDna] = useState(existingDNA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingDNA) {
      setDna(existingDNA);
    } else if (!existingDNA) {
      checkExistingDNA();
    }
  }, [userId, existingDNA]);

  const checkExistingDNA = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/reading-dna/${userId}`);
      setDna(response.data.readingDNA);
      onDNAGenerated(response.data.readingDNA);
    } catch (err) {
      // DNA doesn't exist yet, that's ok
    }
  };

  const generateDNA = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/analysis/reading-dna`, { userId });
      setDna(response.data.readingDNA);
      onDNAGenerated(response.data.readingDNA);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate Reading DNA');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reading-dna-container loading">
        <div className="spinner"></div>
        <p>Analyzing your reading patterns... This may take a minute.</p>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="reading-dna-container">
        <h2>Generate Your Reading DNA</h2>
        <p>Discover your unique reading fingerprint based on your book history.</p>
        <button onClick={generateDNA} className="generate-button">
          Generate Reading DNA
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return (
    <div className="reading-dna-container">
      <h2>Your Reading DNA</h2>

      <section className="dna-section">
        <h3>Core Reading Identity</h3>
        <p className="core-identity">{dna.coreIdentity}</p>
      </section>

      <section className="dna-section">
        <h3>Genre Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dna.genreDistribution}
              dataKey="percentage"
              nameKey="genre"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ genre, percentage }) => `${genre}: ${percentage}%`}
            >
              {dna.genreDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="dna-section">
        <h3>Pacing Preference</h3>
        <p>{dna.pacingPreference}</p>
      </section>

      <section className="dna-section">
        <h3>Themes & Patterns</h3>
        <ul className="themes-list">
          {dna.themesAndPatterns.map((theme, index) => (
            <li key={index}>{theme}</li>
          ))}
        </ul>
      </section>

      {dna.readingEvolution && (
        <section className="dna-section">
          <h3>Reading Evolution</h3>
          <p>{dna.readingEvolution}</p>
        </section>
      )}

      <section className="dna-section highlight">
        <h3>Your Unique Fingerprint</h3>
        <p>{dna.uniqueFingerprint}</p>
      </section>

      <button onClick={generateDNA} className="regenerate-button">
        Regenerate DNA
      </button>
    </div>
  );
}

export default ReadingDNA;
