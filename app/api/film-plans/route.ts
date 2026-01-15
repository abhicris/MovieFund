import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';
import { FilmPlan, FilmPlanStatus } from '@/types';

// GET /api/film-plans - List film plans (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const producerId = searchParams.get('producer_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let queryText = `
      SELECT 
        fp.*,
        u.name as producer_name,
        u.email as producer_email,
        u.production_company as producer_company
      FROM film_plans fp
      JOIN users u ON fp.producer_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND fp.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (producerId) {
      queryText += ` AND fp.producer_id = $${paramCount}`;
      params.push(producerId);
      paramCount++;
    }

    queryText += ` ORDER BY fp.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM film_plans WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 1;

    if (status) {
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
      countParamCount++;
    }

    if (producerId) {
      countQuery += ` AND producer_id = $${countParamCount}`;
      countParams.push(producerId);
      countParamCount++;
    }

    const countResult = await queryOne<{ total: string }>(countQuery, countParams);
    const total = parseInt(countResult?.total || '0');

    // Transform results
    const filmPlans = result.rows.map((row: any) => ({
      id: row.id,
      producerId: row.producer_id,
      title: row.title,
      tagline: row.tagline,
      director: row.director,
      producer: row.producer,
      productionCompany: row.production_company,
      genre: row.genre,
      language: row.language,
      budget: parseFloat(row.budget),
      description: row.description,
      cast: row.cast,
      releaseDate: row.release_date,
      revenueProjection: {
        boxOffice: parseFloat(row.revenue_projection_box_office),
        streaming: parseFloat(row.revenue_projection_streaming),
        distribution: parseFloat(row.revenue_projection_distribution),
        total: parseFloat(row.revenue_projection_total),
      },
      returnsProjection: {
        year1: parseFloat(row.returns_projection_year1),
        year2: parseFloat(row.returns_projection_year2),
        year3: parseFloat(row.returns_projection_year3),
        year4: parseFloat(row.returns_projection_year4),
        year5: parseFloat(row.returns_projection_year5),
      },
      status: row.status,
      submittedAt: row.submitted_at,
      reviewedBy: row.reviewed_by,
      reviewedAt: row.reviewed_at,
      rejectionReason: row.rejection_reason,
      approvedMovieId: row.approved_movie_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      producerName: row.producer_name,
      producerEmail: row.producer_email,
      producerCompany: row.producer_company,
    }));

    return NextResponse.json({
      success: true,
      data: filmPlans,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('List film plans error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch film plans' },
      { status: 500 }
    );
  }
}

// POST /api/film-plans - Create new film plan (producer only)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    // Only producers can create film plans
    if (user.role !== 'producer') {
      return NextResponse.json(
        { success: false, error: 'Only producers can create film plans' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      tagline,
      director,
      producer,
      productionCompany,
      genre,
      language,
      budget,
      description,
      cast,
      releaseDate,
      revenueProjection,
      returnsProjection,
    } = body;

    // Validation
    if (!title || !director || !producer || !productionCompany || !genre || !language || 
        !budget || !description || !cast || !releaseDate || !revenueProjection || !returnsProjection) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate budget
    if (budget <= 0) {
      return NextResponse.json(
        { success: false, error: 'Budget must be greater than 0' },
        { status: 400 }
      );
    }

    // Create film plan
    const result = await query<FilmPlan>(
      `INSERT INTO film_plans (
        producer_id, title, tagline, director, producer, production_company,
        genre, language, budget, description, cast, release_date,
        revenue_projection_box_office, revenue_projection_streaming,
        revenue_projection_distribution, revenue_projection_total,
        returns_projection_year1, returns_projection_year2, returns_projection_year3,
        returns_projection_year4, returns_projection_year5, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, 'draft'
      ) RETURNING *`,
      [
        user.id,
        title,
        tagline || null,
        director,
        producer,
        productionCompany,
        genre,
        language,
        budget,
        description,
        cast,
        releaseDate,
        revenueProjection.boxOffice,
        revenueProjection.streaming,
        revenueProjection.distribution,
        revenueProjection.total,
        returnsProjection.year1,
        returnsProjection.year2,
        returnsProjection.year3,
        returnsProjection.year4,
        returnsProjection.year5,
      ]
    );

    const filmPlan = result.rows[0];

    return NextResponse.json({
      success: true,
      data: filmPlan,
      message: 'Film plan created successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create film plan' },
      { status: 500 }
    );
  }
}
