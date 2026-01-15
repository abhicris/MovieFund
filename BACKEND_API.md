# Backend API Documentation

## Overview

This document describes the backend API for managing movies and their associated documents in the MovieFund platform.

**Current Status**: Alpha Testnet Version
- Uses in-memory storage (data resets on server restart)
- No authentication (to be added)
- No database (to be added)
- API endpoints are functional for testing

---

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://moviebitfund.kcolbchain.com/api`

---

## Movie Management API

### List All Movies

**GET** `/api/admin/movies`

Get a list of all movies with optional filters.

**Query Parameters:**
- `status` (optional): Filter by status (`pre-production`, `production`, `post-production`, `completed`, `released`, `fully_funded`)
- `genre` (optional): Filter by genre
- `language` (optional): Filter by language

**Example Request:**
```bash
GET /api/admin/movies?status=production&genre=action
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "War 2",
      "director": "Ayan Mukerji",
      "budget": 50000000,
      "totalLots": 1000,
      "availableLots": 350,
      "pricePerLot": 50000,
      ...
    }
  ],
  "total": 1
}
```

---

### Get Movie by ID

**GET** `/api/admin/movies/[id]`

Get details of a specific movie.

**Example Request:**
```bash
GET /api/admin/movies/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "War 2",
    "director": "Ayan Mukerji",
    ...
  }
}
```

---

### Create New Movie

**POST** `/api/admin/movies`

Create a new movie listing.

**Request Body:**
```json
{
  "title": "Movie Title",
  "tagline": "Movie tagline",
  "director": "Director Name",
  "producer": "Producer Name",
  "productionCompany": "Production Company",
  "genre": ["action", "thriller"],
  "language": "hindi",
  "budget": 50000000,
  "releaseDate": "2026-08-14",
  "description": "Movie description",
  "cast": ["Actor 1", "Actor 2"],
  "poster": "https://image.tmdb.org/t/p/w500/poster.jpg",
  "images": ["https://image.tmdb.org/t/p/w1280/image1.jpg"],
  "status": "pre-production",
  "projectedROI": 38.5,
  "revenueProjection": {
    "boxOffice": 95000000,
    "streaming": 38000000,
    "distribution": 25000000,
    "total": 158000000
  },
  "returnsProjection": {
    "year1": 38,
    "year2": 77,
    "year3": 115,
    "year4": 154,
    "year5": 192
  },
  "maximumInvestment": 5000000
}
```

**Required Fields:**
- `title`
- `director`
- `producer`
- `productionCompany`
- `genre` (array)
- `language`
- `budget`
- `releaseDate`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "movie-1234567890-abc123",
    "title": "Movie Title",
    "pricePerLot": 50000,
    "totalLots": 1000,
    "availableLots": 1000,
    ...
  },
  "message": "Movie created successfully"
}
```

---

### Update Movie

**PUT** `/api/admin/movies/[id]`

Update an existing movie.

**Request Body:** (Same as POST, but all fields are optional - only include fields to update)

**Example Request:**
```bash
PUT /api/admin/movies/1
Content-Type: application/json

{
  "status": "production",
  "availableLots": 300
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "War 2",
    "status": "production",
    "availableLots": 300,
    "updatedAt": "2025-12-21T10:30:00Z",
    ...
  },
  "message": "Movie updated successfully"
}
```

---

### Delete Movie

**DELETE** `/api/admin/movies/[id]`

Delete a movie (use with caution).

**Example Request:**
```bash
DELETE /api/admin/movies/1
```

**Example Response:**
```json
{
  "success": true,
  "message": "Movie deleted successfully"
}
```

---

## Document Management API

### Get Movie Documents

**GET** `/api/admin/movies/[id]/documents`

Get all documents associated with a movie.

**Example Request:**
```bash
GET /api/admin/movies/1/documents
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-123",
      "movieId": "1",
      "type": "contract",
      "title": "Production Agreement",
      "fileUrl": "https://example.com/contract.pdf",
      "uploadedAt": "2025-12-21T10:00:00Z",
      "uploadedBy": "admin"
    }
  ],
  "total": 1
}
```

---

### Upload Movie Document

**POST** `/api/admin/movies/[id]/documents`

Upload a document for a movie.

**Request Body:**
```json
{
  "type": "contract",
  "title": "Production Agreement",
  "description": "Main production contract",
  "fileUrl": "https://example.com/contract.pdf",
  "uploadedBy": "admin"
}
```

**Document Types:**
- `contract`: Production contracts, agreements
- `financial`: Budget sheets, financial projections
- `legal`: Legal documents, compliance
- `production`: Production schedules, scripts
- `other`: Other documents

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc-1234567890-xyz789",
    "movieId": "1",
    "type": "contract",
    "title": "Production Agreement",
    "fileUrl": "https://example.com/contract.pdf",
    "uploadedAt": "2025-12-21T10:00:00Z",
    "uploadedBy": "admin"
  },
  "message": "Document uploaded successfully"
}
```

---

## How to Add a New Movie

### Step 1: Prepare Movie Data

Gather all required information:
- Basic info (title, director, producer, etc.)
- Budget and financial projections
- Cast and crew
- Images and poster
- Release date

### Step 2: Make API Call

```bash
curl -X POST https://moviebitfund.kcolbchain.com/api/admin/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Movie",
    "director": "Director Name",
    "producer": "Producer Name",
    "productionCompany": "Production Co",
    "genre": ["action"],
    "language": "hindi",
    "budget": 30000000,
    "releaseDate": "2026-12-25",
    "description": "Movie description",
    "cast": ["Actor 1", "Actor 2"],
    "poster": "https://image.tmdb.org/t/p/w500/poster.jpg"
  }'
```

### Step 3: Upload Documents (Optional)

```bash
curl -X POST https://moviebitfund.kcolbchain.com/api/admin/movies/[movie-id]/documents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contract",
    "title": "Production Contract",
    "fileUrl": "https://example.com/contract.pdf"
  }'
```

---

## Current Limitations (Alpha Version)

1. **No Authentication**: All endpoints are publicly accessible
2. **In-Memory Storage**: Data is lost on server restart
3. **No File Upload**: Documents require pre-uploaded URLs
4. **No Validation**: Limited input validation
5. **No Database**: Using temporary in-memory storage

---

## Future Enhancements

### Phase 1: Database Integration
- [ ] PostgreSQL/MongoDB integration
- [ ] Persistent data storage
- [ ] Data migrations

### Phase 2: Authentication & Authorization
- [ ] Admin authentication
- [ ] Role-based access control
- [ ] API key management

### Phase 3: File Management
- [ ] File upload endpoint
- [ ] Cloud storage integration (S3, Cloudinary)
- [ ] Document versioning

### Phase 4: Advanced Features
- [ ] Movie approval workflow
- [ ] Investment tracking
- [ ] Returns calculation
- [ ] Email notifications

---

## Example: Complete Movie Creation Flow

```bash
# 1. Create the movie
MOVIE_RESPONSE=$(curl -X POST http://localhost:3000/api/admin/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The New Blockbuster",
    "director": "Famous Director",
    "producer": "Producer Name",
    "productionCompany": "Studio Name",
    "genre": ["action", "thriller"],
    "language": "english",
    "budget": 100000000,
    "releaseDate": "2027-06-15",
    "description": "An epic action thriller",
    "cast": ["Star Actor 1", "Star Actor 2"],
    "poster": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "images": ["https://image.tmdb.org/t/p/w1280/backdrop.jpg"],
    "projectedROI": 40.0
  }')

# Extract movie ID
MOVIE_ID=$(echo $MOVIE_RESPONSE | jq -r '.data.id')

# 2. Upload documents
curl -X POST http://localhost:3000/api/admin/movies/$MOVIE_ID/documents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "contract",
    "title": "Production Agreement",
    "fileUrl": "https://example.com/contract.pdf"
  }'

curl -X POST http://localhost:3000/api/admin/movies/$MOVIE_ID/documents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "financial",
    "title": "Budget Breakdown",
    "fileUrl": "https://example.com/budget.xlsx"
  }'
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

*Last Updated: December 2025*









