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
 * Search books by title (for autocomplete)
 */
router.get('/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';

    if (!query || query.length < 2) {
      return res.json([]);
    }

    const filePath = path.join(__dirname, '../../data/preloaded-books.json');

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Preloaded books data not found' });
    }

    const books = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Search for matching titles
    const matches = books
      .filter(book => {
        const title = (book.Title || book.title || '').toLowerCase();
        return title.includes(query);
      })
      .slice(0, 10) // Limit to 10 results
      .map(book => ({
        title: book.Title || book.title,
        author: book.Author || book.author
      }));

    res.json(matches);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

module.exports = router;
