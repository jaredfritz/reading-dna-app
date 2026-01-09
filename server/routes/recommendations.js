const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateRecommendations } = require('../services/openaiService');

const router = express.Router();

/**
 * POST /api/recommendations/generate
 * Generate book recommendations for a user
 */
router.post('/generate', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Load user's books
    const booksPath = path.join(__dirname, '../../data', `${userId}_books.json`);
    if (!fs.existsSync(booksPath)) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Load Reading DNA
    const dnaPath = path.join(__dirname, '../../data', `${userId}_dna.json`);
    if (!fs.existsSync(dnaPath)) {
      return res.status(404).json({ error: 'Reading DNA not found. Please generate it first.' });
    }

    const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
    const readingDNA = JSON.parse(fs.readFileSync(dnaPath, 'utf8'));

    // Generate recommendations
    const recommendations = await generateRecommendations(books, readingDNA);

    // Save recommendations
    const recsPath = path.join(__dirname, '../../data', `${userId}_recommendations.json`);
    fs.writeFileSync(recsPath, JSON.stringify(recommendations, null, 2));

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/recommendations/:userId
 * Get existing recommendations
 */
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const recsPath = path.join(__dirname, '../../data', `${userId}_recommendations.json`);

    if (!fs.existsSync(recsPath)) {
      return res.status(404).json({ error: 'Recommendations not found. Please generate them first.' });
    }

    const recommendations = JSON.parse(fs.readFileSync(recsPath, 'utf8'));
    res.json({ recommendations });
  } catch (error) {
    console.error('Error retrieving recommendations:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
