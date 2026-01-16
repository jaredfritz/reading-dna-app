# Reading DNA App - Quick Start

## ✅ What's Ready

Your Reading DNA app is now:
- ✅ **On GitHub**: https://github.com/jaredfritz/reading-dna-app
- ✅ **Rate Limited**: Max 10 API calls/hour, 50/day
- ✅ **Pre-loaded**: Your wife's 869 books analyzed and ready
- ✅ **Protected**: .gitignore prevents API key from being committed

## 🚀 Deploy to Render.com (Free)

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest)

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account if prompted
3. Select the `reading-dna-app` repository
4. Click "Connect"

### Step 3: Configure Service
Fill in these settings:

**Basic Settings:**
- **Name**: `reading-dna-app` (or any name you want)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**:
  ```
  npm install && cd client && npm install && npm run build && cd ..
  ```
- **Start Command**:
  ```
  node server/index.js
  ```

**Plan:**
- Select **Free** (scroll down to find it)

### Step 4: Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these 3 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `ANTHROPIC_API_KEY` | `your-api-key-from-env-file` |

**Note**: Get your API key from `/Users/jaredfritz/reading-dna-app/.env` file on your local machine.

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for build to complete
3. Your app URL will be shown at the top (e.g., `https://reading-dna-app-xxxx.onrender.com`)

### Step 6: Configure Frontend
After deployment completes:

1. Copy your app's URL from Render dashboard
2. On your local computer, create this file:

   **File**: `/Users/jaredfritz/reading-dna-app/client/.env.production`

   **Content**:
   ```
   REACT_APP_API_URL=https://reading-dna-app-xxxx.onrender.com/api
   ```
   Replace `xxxx` with your actual Render URL

3. Commit and push:
   ```bash
   cd /Users/jaredfritz/reading-dna-app
   git add client/.env.production
   git commit -m "Add production API URL"
   git push
   ```

4. Render will automatically redeploy (2-3 minutes)

### Step 7: Access Your App
- Go to your Render URL: `https://reading-dna-app-xxxx.onrender.com`
- The app will show your wife's Reading DNA immediately!

## 📊 What Works

**FREE (Instant Loading):**
- ✅ Reading DNA profile
- ✅ Book connection graph
- ✅ All 869 books pre-loaded

**USES API (Rate Limited):**
- ⚡ Get Recommendations (10/hour max)
- ⚡ Evaluate a Book (10/hour max)

## ⚠️ Important Notes

### Free Tier Sleep Mode
- Render free tier sleeps after 15 minutes of inactivity
- First visit after sleep: ~30 seconds to wake up
- After that: normal speed

### Rate Limits
If you see "Too many requests":
- **Hourly limit**: Wait 1 hour
- **Daily limit**: Wait until next day
- This protects your API costs!

### Costs
- **Render**: $0/month (free)
- **GitHub**: $0/month (free for public/private repos)
- **Anthropic API**: Only charged for recommendations/evaluations
  - ~$0.03-0.06 per recommendation
  - ~$0.01-0.03 per book evaluation
  - Typical usage: $0.30-1.00/month

### Monitoring
Check usage at:
- **API Usage**: https://console.anthropic.com/settings/usage
- **Render Logs**: Dashboard → Your service → Logs tab

## 🔄 Making Changes

To update the app:

```bash
cd /Users/jaredfritz/reading-dna-app
# Make your changes
git add .
git commit -m "Description of changes"
git push
```

Render auto-deploys within 2-3 minutes!

## 🆘 Troubleshooting

**Blank page after deployment:**
- Check that `client/.env.production` has the correct Render URL
- Push the change to GitHub
- Wait for Render to redeploy

**"Failed to generate recommendations":**
- Check rate limits (wait 1 hour)
- Verify ANTHROPIC_API_KEY in Render dashboard
- Check Render logs for errors

**App is slow:**
- First load after sleep: normal (30 sec)
- Always slow: Check Render logs for errors

## 📚 Full Documentation

- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Preloaded Data**: See [PRELOADED_DATA_SETUP.md](PRELOADED_DATA_SETUP.md)
- **Project Overview**: See [README.md](README.md)

## ✨ You're Done!

Once deployed, share the URL with your wife. She can bookmark it and use it from any device - phone, tablet, or computer!
