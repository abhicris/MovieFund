import { NextRequest, NextResponse } from 'next/server';
import { Movie } from '@/types';

// TODO: Replace with actual database in production
// For alpha version, we'll use in-memory storage
// In production: Use PostgreSQL, MongoDB, or similar database

let moviesData: Movie[] = [];

// Initialize with mock data (in production, load from database)
async function initializeMovies() {
  if (moviesData.length === 0) {
    const { mockMovies } = await import('@/lib/data');
    moviesData = [...mockMovies];
  }
}

// GET - List all movies (with optional filters)
export async function GET(request: NextRequest) {
  await initializeMovies();
  
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const genre = searchParams.get('genre');
  const language = searchParams.get('language');

  let filteredMovies = [...moviesData];

  if (status) {
    filteredMovies = filteredMovies.filter(m => m.status === status);
  }
  if (genre) {
    filteredMovies = filteredMovies.filter(m => m.genre.includes(genre));
  }
  if (language) {
    filteredMovies = filteredMovies.filter(m => m.language === language);
  }

  return NextResponse.json({
    success: true,
    data: filteredMovies,
    total: filteredMovies.length,
  });
}

// POST - Create a new movie
export async function POST(request: NextRequest) {
  await initializeMovies();

  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'director', 'producer', 'productionCompany',
      'genre', 'language', 'budget', 'releaseDate'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Calculate lot pricing
    const budget = Number(body.budget);
    const pricePerLot = budget / 1000; // 0.1% of budget

    // Create new movie
    const newMovie: Movie = {
      id: `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: body.title,
      tagline: body.tagline || '',
      director: body.director,
      producer: body.producer,
      productionCompany: body.productionCompany,
      genre: Array.isArray(body.genre) ? body.genre : [body.genre],
      language: body.language,
      budget: budget,
      totalLots: 1000, // Always 1000 lots
      availableLots: 1000, // Start with all lots available
      pricePerLot: pricePerLot,
      projectedROI: body.projectedROI || 35.0,
      images: body.images || [],
      poster: body.poster || '',
      description: body.description || '',
      cast: Array.isArray(body.cast) ? body.cast : [],
      releaseDate: new Date(body.releaseDate),
      status: body.status || 'pre-production',
      revenueProjection: body.revenueProjection || {
        boxOffice: budget * 1.5,
        streaming: budget * 0.6,
        distribution: budget * 0.4,
        total: budget * 2.5,
      },
      returnsProjection: body.returnsProjection || {
        year1: 35,
        year2: 70,
        year3: 105,
        year4: 140,
        year5: 175,
      },
      minimumInvestment: pricePerLot,
      maximumInvestment: body.maximumInvestment || budget * 0.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    moviesData.push(newMovie);

    return NextResponse.json({
      success: true,
      data: newMovie,
      message: 'Movie created successfully',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create movie' },
      { status: 500 }
    );
  }
}
