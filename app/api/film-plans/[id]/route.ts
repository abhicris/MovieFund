import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';
import { FilmPlanStatus } from '@/types';

// GET /api/film-plans/[id] - Get film plan details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const filmPlan = await queryOne<any>(
      `SELECT 
        fp.*,
        u.name as producer_name,
        u.email as producer_email,
        u.production_company as producer_company
      FROM film_plans fp
      JOIN users u ON fp.producer_id = u.id
      WHERE fp.id = $1`,
      [id]
    );

    if (!filmPlan) {
      return NextResponse.json(
        { success: false, error: 'Film plan not found' },
        { status: 404 }
      );
    }

    // Transform result
    const result = {
      id: filmPlan.id,
      producerId: filmPlan.producer_id,
      title: filmPlan.title,
      tagline: filmPlan.tagline,
      director: filmPlan.director,
      producer: filmPlan.producer,
      productionCompany: filmPlan.production_company,
      genre: filmPlan.genre,
      language: filmPlan.language,
      budget: parseFloat(filmPlan.budget),
      description: filmPlan.description,
      cast: filmPlan.cast,
      releaseDate: filmPlan.release_date,
      revenueProjection: {
        boxOffice: parseFloat(filmPlan.revenue_projection_box_office),
        streaming: parseFloat(filmPlan.revenue_projection_streaming),
        distribution: parseFloat(filmPlan.revenue_projection_distribution),
        total: parseFloat(filmPlan.revenue_projection_total),
      },
      returnsProjection: {
        year1: parseFloat(filmPlan.returns_projection_year1),
        year2: parseFloat(filmPlan.returns_projection_year2),
        year3: parseFloat(filmPlan.returns_projection_year3),
        year4: parseFloat(filmPlan.returns_projection_year4),
        year5: parseFloat(filmPlan.returns_projection_year5),
      },
      status: filmPlan.status,
      submittedAt: filmPlan.submitted_at,
      reviewedBy: filmPlan.reviewed_by,
      reviewedAt: filmPlan.reviewed_at,
      rejectionReason: filmPlan.rejection_reason,
      approvedMovieId: filmPlan.approved_movie_id,
      createdAt: filmPlan.created_at,
      updatedAt: filmPlan.updated_at,
      producerName: filmPlan.producer_name,
      producerEmail: filmPlan.producer_email,
      producerCompany: filmPlan.producer_company,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Get film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch film plan' },
      { status: 500 }
    );
  }
}

// PUT /api/film-plans/[id] - Update film plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;
    const { id } = await params;

    // Get film plan
    const filmPlan = await queryOne<{ producer_id: string; status: string }>(
      'SELECT producer_id, status FROM film_plans WHERE id = $1',
      [id]
    );

    if (!filmPlan) {
      return NextResponse.json(
        { success: false, error: 'Film plan not found' },
        { status: 404 }
      );
    }

    // Check permissions (producer can only edit their own draft/submitted plans)
    if (user.role === 'producer' && filmPlan.producer_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this film plan' },
        { status: 403 }
      );
    }

    // Producers can only edit draft or submitted plans
    if (user.role === 'producer' && !['draft', 'submitted'].includes(filmPlan.status)) {
      return NextResponse.json(
        { success: false, error: 'Cannot update film plan in current status' },
        { status: 400 }
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
      status,
    } = body;

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (tagline !== undefined) {
      updates.push(`tagline = $${paramCount++}`);
      values.push(tagline);
    }
    if (director !== undefined) {
      updates.push(`director = $${paramCount++}`);
      values.push(director);
    }
    if (producer !== undefined) {
      updates.push(`producer = $${paramCount++}`);
      values.push(producer);
    }
    if (productionCompany !== undefined) {
      updates.push(`production_company = $${paramCount++}`);
      values.push(productionCompany);
    }
    if (genre !== undefined) {
      updates.push(`genre = $${paramCount++}`);
      values.push(genre);
    }
    if (language !== undefined) {
      updates.push(`language = $${paramCount++}`);
      values.push(language);
    }
    if (budget !== undefined) {
      updates.push(`budget = $${paramCount++}`);
      values.push(budget);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (cast !== undefined) {
      updates.push(`cast = $${paramCount++}`);
      values.push(cast);
    }
    if (releaseDate !== undefined) {
      updates.push(`release_date = $${paramCount++}`);
      values.push(releaseDate);
    }
    if (revenueProjection !== undefined) {
      updates.push(`revenue_projection_box_office = $${paramCount++}`);
      values.push(revenueProjection.boxOffice);
      updates.push(`revenue_projection_streaming = $${paramCount++}`);
      values.push(revenueProjection.streaming);
      updates.push(`revenue_projection_distribution = $${paramCount++}`);
      values.push(revenueProjection.distribution);
      updates.push(`revenue_projection_total = $${paramCount++}`);
      values.push(revenueProjection.total);
    }
    if (returnsProjection !== undefined) {
      updates.push(`returns_projection_year1 = $${paramCount++}`);
      values.push(returnsProjection.year1);
      updates.push(`returns_projection_year2 = $${paramCount++}`);
      values.push(returnsProjection.year2);
      updates.push(`returns_projection_year3 = $${paramCount++}`);
      values.push(returnsProjection.year3);
      updates.push(`returns_projection_year4 = $${paramCount++}`);
      values.push(returnsProjection.year4);
      updates.push(`returns_projection_year5 = $${paramCount++}`);
      values.push(returnsProjection.year5);
    }
    if (status !== undefined && user.role === 'admin') {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    const updateQuery = `UPDATE film_plans SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await query(updateQuery, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Film plan updated successfully',
    });
  } catch (error: any) {
    console.error('Update film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update film plan' },
      { status: 500 }
    );
  }
}

