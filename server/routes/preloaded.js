const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * Get pre-loaded books data
 */
router.get('/books', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../data/preloaded-books.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Preloaded books data not found' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (error) {
    console.error('Error loading preloaded books:', error);
    res.status(500).json({ error: 'Failed to load preloaded books' });
  }
});

/**
 * Get pre-loaded Reading DNA profile
 */
router.get('/reading-dna', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../data/preloaded-reading-dna.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Preloaded Reading DNA not found' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (error) {
    console.error('Error loading preloaded Reading DNA:', error);
    res.status(500).json({ error: 'Failed to load preloaded Reading DNA' });
  }
});

/**
 * Get pre-loaded book connections
 */
router.get('/book-connections', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../data/preloaded-book-connections.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Preloaded book connections not found' });
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (error) {
    console.error('Error loading preloaded book connections:', error);
    res.status(500).json({ error: 'Failed to load preloaded book connections' });
  }
});

/**
 * Search books by title using Google Books API (for autocomplete)
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query || query.length < 2) {
      return res.json([]);
    }

    // Use Google Books API for comprehensive book search
    const fetch = (await import('node-fetch')).default;
    const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`;

    const response = await fetch(googleBooksUrl);
    const data = await response.json();

    if (!data.items) {
      return res.json([]);
    }

    // Format results to match our interface
    const matches = data.items.map(item => {
      const volumeInfo = item.volumeInfo;
      return {
        title: volumeInfo.title || 'Unknown Title',
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'
      };
    });

    res.json(matches);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

module.exports = router;
