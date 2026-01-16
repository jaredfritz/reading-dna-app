# Deployment Guide

## Rate Limiting Protection

The app now has built-in rate limiting to prevent API cost overruns:
- **10 API calls per hour** (for recommendations and book evaluations)
- **50 API calls per day** (combined limit)
- Preloaded data (Reading DNA, Book Connections) has NO limits - loads instantly!

## Deploy to Render.com (Free)

### Step 1: Push to GitHub

1. Make sure you're in the project directory:
```bash
cd /Users/jaredfritz/reading-dna-app
```

2. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Reading DNA app with rate limiting"
```

3. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `reading-dna-app`
   - Make it **Private** (recommended)
   - Don't initialize with README
   - Click "Create repository"

4. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/reading-dna-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render.com

1. Go to https://render.com and sign up (free)

2. Click "New +" → "Web Service"

3. Connect your GitHub account and select the `reading-dna-app` repository

4. Configure the service:
   - **Name**: `reading-dna-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd client && npm install && npm run build && cd ..`
   - **Start Command**: `node server/index.js`
   - **Plan**: `Free`

5. Add Environment Variables:
   - Click "Advanced"
   - Add:
     - `NODE_ENV` = `production`
     - `ANTHROPIC_API_KEY` = `your-api-key-here`
     - `PORT` = `10000`

6. Click "Create Web Service"

7. Wait 5-10 minutes for the build to complete

8. Your app will be live at: `https://reading-dna-app-XXXX.onrender.com`

### Step 3: Update Frontend API URL

After deployment, you need to tell the React app where the backend is:

1. In Render dashboard, copy your app's URL (e.g., `https://reading-dna-app-xxxx.onrender.com`)

2. On your local machine, create `client/.env.production`:
```bash
REACT_APP_API_URL=https://reading-dna-app-xxxx.onrender.com/api
```

3. Commit and push:
```bash
git add client/.env.production
git commit -m "Add production API URL"
git push
```

4. Render will automatically rebuild and deploy

## Important Notes

### Free Tier Limitations
- **Render Free Tier**: App sleeps after 15 minutes of inactivity
- **First load**: Takes ~30 seconds to wake up
- **After wake**: Normal speed

### Costs
- **Render**: $0/month (free tier)
- **Anthropic API**: Only charged for recommendations and evaluations
  - ~$0.03-0.06 per recommendation generation
  - ~$0.01-0.03 per book evaluation
  - Reading DNA & Book Connections: **FREE** (preloaded!)

### Rate Limits Protect You
Even if someone finds and abuses your app:
- Max 10 AI calls per hour
- Max 50 AI calls per day
- Max cost: ~$3/day (if all 50 calls are recommendations)
- Likely cost: ~$0.30/day (normal usage)

### Monitoring
1. Check Anthropic API usage: https://console.anthropic.com/settings/usage
2. Check Render logs: In your Render dashboard → Logs tab

## Alternative: Deploy to Railway.app

If you prefer Railway (has better free tier):

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `reading-dna-app`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV` = `production`
6. Railway will auto-detect and deploy

Railway free tier: $5/month credit (usually enough for this app)

## Troubleshooting

### App shows blank page
- Check browser console for errors
- Verify `REACT_APP_API_URL` in `client/.env.production` matches your deployed backend URL

### API calls fail
- Check Render logs for errors
- Verify `ANTHROPIC_API_KEY` is set in environment variables
- Check if you've hit rate limits (wait 1 hour and try again)

### Rate limit errors
- Expected behavior! Wait 1 hour to reset hourly limit
- Daily limit resets at midnight UTC

## Updating the App

When you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Render will automatically rebuild and deploy within 2-3 minutes.
