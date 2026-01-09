const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateReadingDNA, generateBookConnections } = require('../services/openaiService');

const router = express.Router();

/**
 * POST /api/analysis/reading-dna
 * Generate Reading DNA profile for a user
 */
router.post('/reading-dna', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Load user's books
    const dataPath = path.join(__dirname, '../../data', `${userId}_books.json`);
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const books = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Generate Reading DNA
    const readingDNA = await generateReadingDNA(books);

    // Save Reading DNA
    const dnaPath = path.join(__dirname, '../../data', `${userId}_dna.json`);
    fs.writeFileSync(dnaPath, JSON.stringify(readingDNA, null, 2));

    res.json({
      success: true,
      readingDNA
    });
  } catch (error) {
    console.error('Error generating Reading DNA:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analysis/reading-dna/:userId
 * Get existing Reading DNA profile
 */
router.get('/reading-dna/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const dnaPath = path.join(__dirname, '../../data', `${userId}_dna.json`);

    if (!fs.existsSync(dnaPath)) {
      return res.status(404).json({ error: 'Reading DNA not found. Please generate it first.' });
    }

    const readingDNA = JSON.parse(fs.readFileSync(dnaPath, 'utf8'));
    res.json({ readingDNA });
  } catch (error) {
    console.error('Error retrieving Reading DNA:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/analysis/book-connections
 * Generate book connection graph
 */
router.post('/book-connections', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Load user's books
    const dataPath = path.join(__dirname, '../../data', `${userId}_books.json`);
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const books = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Generate connections
    const connections = await generateBookConnections(books);

    // Save connections
    const connectionsPath = path.join(__dirname, '../../data', `${userId}_connections.json`);
    fs.writeFileSync(connectionsPath, JSON.stringify(connections, null, 2));

    res.json({
      success: true,
      connections
    });
  } catch (error) {
    console.error('Error generating book connections:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analysis/book-connections/:userId
 * Get existing book connections
 */
router.get('/book-connections/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const connectionsPath = path.join(__dirname, '../../data', `${userId}_connections.json`);

    if (!fs.existsSync(connectionsPath)) {
      return res.status(404).json({ error: 'Book connections not found. Please generate them first.' });
    }

    const connections = JSON.parse(fs.readFileSync(connectionsPath, 'utf8'));
    res.json({ connections });
  } catch (error) {
    console.error('Error retrieving book connections:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
