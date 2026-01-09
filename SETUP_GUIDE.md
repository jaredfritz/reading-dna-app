# Quick Setup Guide

Follow these steps to get your Reading DNA app up and running.

## Step 1: Get Your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account (includes $5 credit - no credit card required!)
3. Navigate to "API Keys" in the menu
4. Click "Create Key"
5. Copy the key (you won't be able to see it again!)

## Step 2: Configure Environment

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and paste your Anthropic API key:
```bash
nano .env
```

Or use any text editor. The file should look like:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
```

Save and exit.

## Step 3: Install Dependencies

Run this command to install all dependencies for both backend and frontend:

```bash
npm run install-all
```

This will:
- Install backend packages (Express, Anthropic SDK, etc.)
- Install frontend packages (React, Recharts, react-force-graph)

## Step 4: Start the App

Start both the backend and frontend in development mode:

```bash
npm run dev
```

This will:
- Start the Express server on port 5000
- Start the React dev server on port 3000
- Open your browser automatically to http://localhost:3000

## Step 5: Export Your Reading Data

### From Goodreads:

1. Visit [https://www.goodreads.com/review/import](https://www.goodreads.com/review/import)
2. Click the "Export Library" button
3. Wait for the email with your export (may take a few minutes)
4. Download the CSV file from the email

### From StoryGraph:

1. Go to your StoryGraph profile
2. Click on Settings/Menu
3. Find "Data Management" section
4. Click "Export"
5. Download the CSV file

## Step 6: Use the App

1. Open http://localhost:3000 in your browser
2. Click "Choose CSV file" and select your export
3. Select whether it's from Goodreads or StoryGraph
4. Click "Upload & Analyze"
5. Once uploaded, click "Generate Reading DNA" in the next tab
6. Explore your Reading DNA, book connections, and recommendations!

## Troubleshooting

### "Failed to generate Reading DNA"

**Problem**: Anthropic API call failed

**Solutions**:
- Check that your API key is correct in `.env`
- Verify you have credits in your Anthropic account
- Check the terminal/console for error messages

### "Port 5000 is already in use"

**Problem**: Another service is using port 5000

**Solution**:
Edit `.env` and change the port:
```
PORT=5001
```

Then restart the server.

### CSV Upload Error

**Problem**: File won't upload or parse

**Solutions**:
- Make sure the file is actually a `.csv` file
- Try re-exporting from Goodreads/StoryGraph
- Check that you selected the correct source (Goodreads vs StoryGraph)
- Make sure the file isn't corrupted

### React App Won't Start

**Problem**: Port 3000 is in use

**Solution**:
The terminal will ask if you want to use a different port. Type `y` and press Enter.

### Dependencies Won't Install

**Problem**: npm install fails

**Solutions**:
- Make sure you have Node.js v14+ installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and try again:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Testing Without Your Own Data

Want to test the app before exporting your data?

You can create a sample CSV file with this structure for Goodreads:

```csv
Title,Author,My Rating,Date Read,Exclusive Shelf
"The Great Gatsby","F. Scott Fitzgerald",5,2024-01-15,read
"1984","George Orwell",4,2024-02-20,read
"To Kill a Mockingbird","Harper Lee",5,2024-03-10,read
```

Save this as `sample_books.csv` and upload it to test the app.

## Next Steps

Once everything is working:

1. **Explore all features**: Try each tab to see what the app can do
2. **Generate recommendations**: See what books the AI suggests for you
3. **Evaluate books**: Try evaluating a book you're considering
4. **Customize**: Feel free to modify the code to add your own features!

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Look at the API error messages in the terminal
- Check the browser console (F12) for frontend errors

## Cost Tracking

Monitor your Anthropic usage at [https://console.anthropic.com](https://console.anthropic.com)

Typical costs per user:
- Initial analysis (DNA + connections): ~$0.05-0.15
- Recommendations: ~$0.03-0.06 per generation
- Book evaluations: ~$0.01-0.03 each

**Remember**: New accounts get $5 free credit, which covers ~20-50 full analyses!

---

Enjoy discovering your Reading DNA! 📚
