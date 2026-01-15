# TMDB API Integration Setup

## What is TMDB?

The Movie Database (TMDB) is a free, community-driven movie and TV database API that provides:
- Movie information (similar to IMDb)
- High-quality movie posters and images
- Cast and crew information
- Release dates and ratings
- Genre information

## Getting Your Free API Key

### Step 1: Create a TMDB Account
1. Visit [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Sign up for a free account

### Step 2: Request API Key
1. After logging in, click on your profile icon (top right)
2. Go to **Settings**
3. Click on the **API** tab
4. Click **Request an API Key**
5. Select **Developer** (for personal/non-commercial use)
6. Fill out the application form:
   - Application name: "MovieFund"
   - Application URL: "https://moviebitfund.kcolbchain.com"
   - Application summary: "Fractional movie investment platform"
7. Accept the terms and submit

### Step 3: Get Your API Key
1. Once approved (usually instant), go back to **Settings > API**
2. Copy your **API Key (v3 auth)**

## Setting Up the API Key

### For Local Development:
1. Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

2. Restart your development server:
```bash
npm run dev
```

### For Production (Vercel):
1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_TMDB_API_KEY`
   - **Value**: Your TMDB API key
   - **Environment**: Production, Preview, Development (select all)
4. Redeploy your application

## How It Works

Once the API key is configured:

1. **Automatic Enrichment**: Movie data is automatically enriched with:
   - Real movie posters from TMDB
   - High-quality backdrop images
   - Updated descriptions
   - Cast information
   - Director information
   - Release dates

2. **Fallback**: If the API key is not set or API fails:
   - The platform uses mock data
   - All features still work
   - No errors or broken functionality

3. **API Endpoints**: The following endpoints are available:
   - `/api/movies?action=search&query=MovieName` - Search movies
   - `/api/movies?action=details&id=123` - Get movie details
   - `/api/movies?action=popular` - Get popular movies
   - `/api/movies?action=upcoming` - Get upcoming movies

## Features

- ✅ Free API (no cost)
- ✅ High-quality images
- ✅ Comprehensive movie data
- ✅ Automatic fallback to mock data
- ✅ No breaking changes if API unavailable

## Rate Limits

TMDB API has generous rate limits:
- **40 requests per 10 seconds**
- More than enough for this alpha version

## Support

- TMDB API Documentation: [https://developer.themoviedb.org/docs](https://developer.themoviedb.org/docs)
- TMDB Support: [https://www.themoviedb.org/talk](https://www.themoviedb.org/talk)

---

*Note: This integration is optional. The platform works perfectly fine with mock data if you don't want to set up TMDB API.*









