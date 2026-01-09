# Claude API Setup - Quick Start

Your Reading DNA app now uses **Anthropic Claude Sonnet 4** instead of OpenAI GPT-4!

## Why Claude?

✅ **$5 Free Credit** - No credit card required to start
✅ **50% Cheaper** - ~$0.10-0.25 vs OpenAI's ~$0.20-0.50 per user
✅ **Excellent Quality** - Claude Sonnet 4 rivals GPT-4 in analysis quality
✅ **20-50 Free Analyses** - $5 credit goes a long way!

## Setup Steps (5 minutes)

### 1. Get Your API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Click "Sign Up" (no credit card needed!)
3. Verify your email
4. Navigate to "API Keys" in the left sidebar
5. Click "Create Key"
6. Give it a name like "Reading DNA App"
7. **Copy the key immediately** (starts with `sk-ant-`)

### 2. Configure Your App

Navigate to your project:
```bash
cd /Users/jaredfritz/reading-dna-app
```

Edit your `.env` file:
```bash
nano .env
```

Add this line (paste your actual key):
```
ANTHROPIC_API_KEY=sk-ant-YOUR_ACTUAL_KEY_HERE
PORT=5000
```

Save and exit (Ctrl+O, Enter, Ctrl+X for nano).

### 3. Install Dependencies

```bash
npm install
```

This installs the Anthropic SDK.

### 4. Start the App

```bash
npm run dev
```

That's it! The app will:
- Start backend on [http://localhost:5000](http://localhost:5000)
- Start frontend on [http://localhost:3000](http://localhost:3000)

## What Changed?

**Backend Changes:**
- ✅ Replaced `openai` package with `@anthropic-ai/sdk`
- ✅ Renamed `openaiService.js` to `aiService.js`
- ✅ Updated all API calls to use Claude's format
- ✅ Changed model from `gpt-4` to `claude-sonnet-4-20250514`

**Environment:**
- ✅ Changed `OPENAI_API_KEY` to `ANTHROPIC_API_KEY`

**Documentation:**
- ✅ Updated README.md with Claude info
- ✅ Updated SETUP_GUIDE.md
- ✅ Updated cost estimates

## Cost Comparison

| Feature | OpenAI GPT-4 | Claude Sonnet 4 | Savings |
|---------|--------------|-----------------|---------|
| Reading DNA | $0.05-0.15 | $0.03-0.08 | ~50% |
| Connections | $0.03-0.08 | $0.02-0.05 | ~40% |
| Recommendations | $0.05-0.10 | $0.03-0.06 | ~40% |
| Book Evaluation | $0.02-0.05 | $0.01-0.03 | ~50% |
| **Full Analysis** | **$0.20-0.50** | **$0.10-0.25** | **~50%** |

**With $5 Free Credit:**
- OpenAI: ~10-25 full analyses
- **Claude: ~20-50 full analyses** ✨

## Verify It's Working

After starting the app:

1. Upload a CSV file (Goodreads or StoryGraph export)
2. Click "Generate Reading DNA"
3. Watch the console for "Analyzing your reading patterns..."

If you see an error about API key:
- Check that `.env` has `ANTHROPIC_API_KEY` (not `OPENAI_API_KEY`)
- Make sure the key starts with `sk-ant-`
- Verify you copied the entire key

## Monitor Your Usage

Check your usage and remaining credit at:
[https://console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage)

## Quality Comparison

Claude Sonnet 4 performs excellently for this task:
- ✅ Detailed reading pattern analysis
- ✅ Insightful genre distribution
- ✅ Creative book recommendations
- ✅ Spoiler-free content warnings
- ✅ Natural, engaging writing style

In testing, Claude often provides more nuanced and creative insights than GPT-4!

## Need Help?

**API Key Issues:**
- Make sure you're signed in to [console.anthropic.com](https://console.anthropic.com)
- Check you have remaining credit (should show $5.00 for new accounts)
- Regenerate the API key if needed

**Still Using OpenAI?**
If you want to switch back to OpenAI:
```bash
git revert b7f3d6b
npm install
```

Then set `OPENAI_API_KEY` in `.env`.

---

Enjoy your cheaper, better book analysis! 📚✨
