const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../data/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

/**
 * POST /api/upload/goodreads
 * Upload and parse Goodreads export CSV
 */
router.post('/goodreads', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const books = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        books.push(row);
      })
      .on('end', () => {
        // Save parsed data
        const userId = `user_${Date.now()}`;
        const dataPath = path.join(__dirname, '../../data', `${userId}_books.json`);

        fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
          success: true,
          userId,
          bookCount: books.length,
          message: 'Books imported successfully'
        });
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/upload/storygraph
 * Upload and parse StoryGraph export CSV
 */
router.post('/storygraph', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const books = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Normalize StoryGraph data to match Goodreads format
        const normalizedRow = {
          'Title': row['Title'] || row['title'],
          'Author': row['Author'] || row['author'],
          'My Rating': row['Star Rating'] || row['rating'],
          'Date Read': row['Read Date'] || row['date_read'],
          'Exclusive Shelf': row['Read Status'] || row['shelf'],
          ...row
        };
        books.push(normalizedRow);
      })
      .on('end', () => {
        // Save parsed data
        const userId = `user_${Date.now()}`;
        const dataPath = path.join(__dirname, '../../data', `${userId}_books.json`);

        fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
          success: true,
          userId,
          bookCount: books.length,
          message: 'Books imported successfully from StoryGraph'
        });
      })
      .on('error', (error) => {
        console.error('Error parsing CSV:', error);
        res.status(500).json({ error: 'Failed to parse CSV file' });
      });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/upload/user/:userId
 * Get user's book data
 */
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const dataPath = path.join(__dirname, '../../data', `${userId}_books.json`);

    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const books = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    res.json({ books });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
