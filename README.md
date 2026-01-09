# Reading DNA

A personalized book tracking web app that analyzes your reading history to create a unique "Reading DNA" profile, visualizes connections between books you've read, and provides intelligent recommendations.

## Features

### 1. Import Your Reading History
- Upload your reading data from **Goodreads** or **StoryGraph**
- Supports CSV exports from both platforms
- Automatically parses and normalizes your book data

### 2. Reading DNA Profile
Discover your unique reading fingerprint with AI-powered analysis:
- **Core Reading Identity**: What defines you as a reader
- **Genre Distribution**: Visual breakdown of your genre preferences
- **Pacing Preference**: Your taste in narrative pacing
- **Themes & Patterns**: Recurring themes you gravitate toward
- **Reading Evolution**: How your taste has changed over time
- **Unique Fingerprint**: What makes your reading taste special

### 3. Book Connection Graph
- Interactive network visualization showing thematic connections between books
- See how your books relate through themes, genres, and narrative styles
- Click on any book to explore its connections

### 4. Suggested Reads
- Get 10 personalized book recommendations based on your Reading DNA
- **Genre diversity built-in**: Recommendations span multiple genres to prevent typecasting
- Includes both popular and lesser-known titles
- Each recommendation explains why it fits your taste

### 5. Book Evaluator
Considering a new book? Get intelligent feedback:
- **Match Score**: 1-10 rating of how well it fits your Reading DNA
- **Why It Fits**: Specific reasons this book appeals to you
- **Potential Concerns**: Aspects that might not align with your preferences
- **Content Warnings**: Spoiler-free trigger warnings
- **Alternative Suggestions**: Similar books if this isn't a perfect match

## Tech Stack

- **Frontend**: React with Recharts (charts) and react-force-graph (network visualization)
- **Backend**: Node.js with Express
- **AI**: OpenAI GPT-4 for intelligent analysis
- **Storage**: Local file-based JSON storage (MVP)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenAI API key

## Installation

1. **Clone the repository** (or navigate to the project directory):
```bash
cd reading-dna-app
```

2. **Install backend dependencies**:
```bash
npm install
```

3. **Install frontend dependencies**:
```bash
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

4. **Set up environment variables**:

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
PORT=5000
```

**Get your OpenAI API key**: Visit [platform.openai.com](https://platform.openai.com/api-keys)

## Running the App

### Development Mode

Run both the backend server and React development server:

```bash
npm run dev
```

This starts:
- Backend API on [http://localhost:5000](http://localhost:5000)
- React app on [http://localhost:3000](http://localhost:3000)

### Run Backend Only

```bash
npm run server
```

### Run Frontend Only

```bash
npm run client
```

## How to Use

### Step 1: Export Your Reading Data

#### From Goodreads:
1. Go to [goodreads.com/review/import](https://www.goodreads.com/review/import)
2. Click "Export Library"
3. Download the CSV file

#### From StoryGraph:
1. Go to your profile settings
2. Click "Export" under Data Management
3. Download the CSV file

### Step 2: Upload Your Data
1. Open the app at [http://localhost:3000](http://localhost:3000)
2. Select your source (Goodreads or StoryGraph)
3. Choose your CSV file
4. Click "Upload & Analyze"

### Step 3: Generate Your Reading DNA
1. Navigate to the "Reading DNA" tab
2. Click "Generate Reading DNA"
3. Wait for AI analysis (this may take 1-2 minutes)
4. Explore your personalized reading profile!

### Step 4: Explore Features
- **Book Connections**: Generate an interactive graph of your book relationships
- **Suggested Reads**: Get diverse, personalized recommendations
- **Evaluate a Book**: Check if a specific book matches your taste

## Project Structure

```
reading-dna-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── FileUpload.js
│   │   │   ├── ReadingDNA.js
│   │   │   ├── BookConnections.js
│   │   │   ├── Recommendations.js
│   │   │   ├── BookEvaluator.js
│   │   │   └── *.css
│   │   ├── App.js           # Main app component
│   │   └── App.css
│   └── package.json
├── server/                  # Express backend
│   ├── routes/              # API route handlers
│   │   ├── upload.js        # File upload endpoints
│   │   ├── analysis.js      # DNA & connections
│   │   ├── recommendations.js
│   │   └── evaluation.js
│   ├── services/
│   │   └── openaiService.js # OpenAI integration
│   └── index.js             # Server entry point
├── data/                    # User data storage
│   └── uploads/             # Temporary file uploads
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Backend dependencies
└── README.md
```

## API Endpoints

### Upload
- `POST /api/upload/goodreads` - Upload Goodreads CSV
- `POST /api/upload/storygraph` - Upload StoryGraph CSV
- `GET /api/upload/user/:userId` - Get user's book data

### Analysis
- `POST /api/analysis/reading-dna` - Generate Reading DNA
- `GET /api/analysis/reading-dna/:userId` - Get existing DNA
- `POST /api/analysis/book-connections` - Generate connection graph
- `GET /api/analysis/book-connections/:userId` - Get existing connections

### Recommendations
- `POST /api/recommendations/generate` - Generate recommendations
- `GET /api/recommendations/:userId` - Get existing recommendations

### Evaluation
- `POST /api/evaluation/evaluate` - Evaluate a specific book

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Backend server port (default: 5000)
- `REACT_APP_API_URL`: API URL for frontend (default: http://localhost:5000/api)

## Deployment

### Build for Production

1. Build the React app:
```bash
cd client
npm run build
cd ..
```

2. Set environment to production:
```bash
export NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

The server will serve the built React app from the `client/build` directory.

## Cost Considerations

This app uses OpenAI's GPT-4 API, which has associated costs:
- Reading DNA generation: ~$0.05-0.15 per analysis
- Book connections: ~$0.03-0.08 per graph
- Recommendations: ~$0.05-0.10 per set
- Book evaluation: ~$0.02-0.05 per book

Typical usage for one user: ~$0.20-0.50

## Troubleshooting

### "Failed to generate Reading DNA"
- Check that your OpenAI API key is valid in `.env`
- Ensure you have credits in your OpenAI account
- Check backend console for detailed error messages

### CSV Upload Fails
- Ensure the file is a valid CSV
- Check that the CSV is from Goodreads or StoryGraph
- Try re-exporting from the source platform

### Graph Doesn't Display
- Ensure you've uploaded books and generated Reading DNA first
- Check browser console for errors
- Try regenerating the graph

### Port Already in Use
Change the port in `.env`:
```
PORT=5001
```

## Future Enhancements

- User authentication and persistent storage
- Database integration (PostgreSQL/MongoDB)
- More detailed reading statistics
- Social features (compare DNA with friends)
- Mobile app version
- Additional data sources (LibraryThing, etc.)
- Reading goal tracking
- Book club features

## Contributing

This is a personal project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project as a starting point for your own reading tracker!

## Credits

Built with:
- React
- Node.js & Express
- OpenAI GPT-4
- react-force-graph (vasturiano)
- Recharts
- Inspiration from Goodreads and StoryGraph

---

Happy reading! 📚
