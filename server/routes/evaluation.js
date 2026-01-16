const express = require('express');
const fs = require('fs');
const path = require('path');
const { evaluateBook } = require('../services/aiService');

const router = express.Router();

/**
 * POST /api/evaluation/evaluate
 * Evaluate a specific book for the user
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { userId, bookTitle, bookAuthor } = req.body;

    if (!userId || !bookTitle) {
      return res.status(400).json({ error: 'User ID and book title are required' });
    }

    // Try preloaded data first, then fall back to user-specific files
    let booksPath = path.join(__dirname, '../../data', 'preloaded-books.json');
    let dnaPath = path.join(__dirname, '../../data', 'preloaded-reading-dna.json');

    // If preloaded doesn't exist, try user-specific files
    if (!fs.existsSync(booksPath)) {
      booksPath = path.join(__dirname, '../../data', `${userId}_books.json`);
    }
    if (!fs.existsSync(dnaPath)) {
      dnaPath = path.join(__dirname, '../../data', `${userId}_dna.json`);
    }

    if (!fs.existsSync(booksPath)) {
      return res.status(404).json({ error: 'User data not found' });
    }

    if (!fs.existsSync(dnaPath)) {
      return res.status(404).json({ error: 'Reading DNA not found. Please generate it first.' });
    }

    const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    const readingDNA = JSON.parse(fs.readFileSync(dnaPath, 'utf8'));

    // Handle preloaded format (has userId and books array) vs old format (just array)
    const books = booksData.books || booksData;

    // Evaluate the book
    const evaluation = await evaluateBook(bookTitle, bookAuthor || 'Unknown Author', readingDNA, books);

    res.json({
      success: true,
      evaluation: {
        bookTitle,
        bookAuthor: bookAuthor || 'Unknown Author',
        ...evaluation
      }
    });
  } catch (error) {
    console.error('Error evaluating book:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
