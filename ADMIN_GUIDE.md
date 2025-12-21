# Admin Guide: Adding New Movies

## Quick Start

### Using cURL

```bash
# Create a new movie
curl -X POST http://localhost:3000/api/admin/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Movie",
    "director": "Director Name",
    "producer": "Producer Name",
    "productionCompany": "Studio Name",
    "genre": ["action"],
    "language": "english",
    "budget": 50000000,
    "releaseDate": "2027-06-15",
    "description": "Movie description here",
    "cast": ["Actor 1", "Actor 2"],
    "poster": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "images": ["https://image.tmdb.org/t/p/w1280/backdrop.jpg"]
  }'
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('/api/admin/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: "My New Movie",
    director: "Director Name",
    producer: "Producer Name",
    productionCompany: "Studio Name",
    genre: ["action", "thriller"],
    language: "english",
    budget: 50000000,
    releaseDate: "2027-06-15",
    description: "Movie description",
    cast: ["Actor 1", "Actor 2"],
    poster: "https://image.tmdb.org/t/p/w500/poster.jpg",
    images: ["https://image.tmdb.org/t/p/w1280/backdrop.jpg"],
    projectedROI: 38.5,
    revenueProjection: {
      boxOffice: 95000000,
      streaming: 38000000,
      distribution: 25000000,
      total: 158000000
    }
  })
});

const result = await response.json();
console.log(result);
```

## Required Fields

When creating a movie, these fields are **required**:

- `title` - Movie title
- `director` - Director name
- `producer` - Producer name
- `productionCompany` - Production company name
- `genre` - Array of genres (e.g., `["action", "thriller"]`)
- `language` - Language code (e.g., `"hindi"`, `"english"`, `"spanish"`)
- `budget` - Total production budget in USD (number)
- `releaseDate` - Release date (ISO format: `"YYYY-MM-DD"`)

## Optional Fields

- `tagline` - Movie tagline
- `description` - Detailed description
- `cast` - Array of cast member names
- `poster` - Poster image URL
- `images` - Array of backdrop/image URLs
- `status` - Movie status (default: `"pre-production"`)
- `projectedROI` - Projected ROI percentage (default: 35.0)
- `revenueProjection` - Revenue projections object
- `returnsProjection` - 5-year returns projection object
- `maximumInvestment` - Maximum investment per investor (default: 10% of budget)

## Automatic Calculations

The API automatically calculates:
- `pricePerLot` = `budget / 1000` (0.1% of budget)
- `totalLots` = 1000 (always)
- `availableLots` = 1000 (initially)
- `minimumInvestment` = `pricePerLot`

## Document Management

### Upload Documents

```bash
curl -X POST http://localhost:3000/api/admin/movies/[movie-id]/documents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contract",
    "title": "Production Agreement",
    "description": "Main production contract",
    "fileUrl": "https://example.com/contract.pdf",
    "uploadedBy": "admin"
  }'
```

**Document Types:**
- `contract` - Production contracts, agreements
- `financial` - Budget sheets, financial projections
- `legal` - Legal documents, compliance
- `production` - Production schedules, scripts
- `other` - Other documents

## Example: Complete Workflow

1. **Create Movie**
```bash
curl -X POST http://localhost:3000/api/admin/movies \
  -H "Content-Type: application/json" \
  -d @movie-data.json
```

2. **Update Movie Status**
```bash
curl -X PUT http://localhost:3000/api/admin/movies/[movie-id] \
  -H "Content-Type: application/json" \
  -d '{"status": "production"}'
```

3. **Upload Documents**
```bash
curl -X POST http://localhost:3000/api/admin/movies/[movie-id]/documents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contract",
    "title": "Production Contract",
    "fileUrl": "https://example.com/contract.pdf"
  }'
```

4. **View Movie**
```bash
curl http://localhost:3000/api/admin/movies/[movie-id]
```

## Getting Movie Images

### Option 1: Use TMDB API
1. Get TMDB API key (free): https://www.themoviedb.org/settings/api
2. Search for movie: `GET /api/movies?action=search&query=MovieName`
3. Use poster and backdrop URLs from TMDB

### Option 2: Upload to Cloud Storage
1. Upload images to AWS S3, Cloudinary, or similar
2. Use the returned URLs in movie creation

### Option 3: Direct Image URLs
Use publicly accessible image URLs

## Current Limitations

- **No Authentication**: All endpoints are public (add auth in production)
- **In-Memory Storage**: Data resets on server restart (use database in production)
- **No File Upload**: Documents require pre-uploaded URLs (add file upload in production)

## Next Steps for Production

1. **Add Database**: PostgreSQL, MongoDB, or similar
2. **Add Authentication**: Admin login, API keys, JWT tokens
3. **Add File Upload**: Direct file upload to cloud storage
4. **Add Validation**: Comprehensive input validation
5. **Add Logging**: API request logging and monitoring

---

*See [BACKEND_API.md](./BACKEND_API.md) for complete API documentation*
