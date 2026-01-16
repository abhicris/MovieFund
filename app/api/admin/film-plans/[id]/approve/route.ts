import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { query, queryOne, withTransaction } from '@/lib/db';

// POST /api/admin/film-plans/[id]/approve - Approve film plan and create movie
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;
    const { id } = await params;

    // Get film plan
    const filmPlan = await queryOne<any>(
      'SELECT * FROM film_plans WHERE id = $1',
      [id]
    );

    if (!filmPlan) {
      return NextResponse.json(
        { success: false, error: 'Film plan not found' },
        { status: 404 }
      );
    }

    // Can only approve submitted or under_review plans
    if (!['submitted', 'under_review'].includes(filmPlan.status)) {
      return NextResponse.json(
        { success: false, error: `Cannot approve film plan with status: ${filmPlan.status}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      images = [],
      poster,
      projectedROI,
      minimumInvestment,
      maximumInvestment,
    } = body;

    // Calculate price per lot (0.1% of budget)
    const pricePerLot = parseFloat(filmPlan.budget) / 1000;

    // Execute in transaction
    const result = await withTransaction(async (client) => {
      // Create movie from approved film plan
      const movieResult = await client.query(
      `INSERT INTO movies (
        film_plan_id, title, tagline, director, producer, production_company,
        genre, language, description, "cast", release_date, budget,
        total_lots, available_lots, price_per_lot, projected_roi,
        minimum_investment, maximum_investment, images, poster,
        revenue_projection_box_office, revenue_projection_streaming,
        revenue_projection_distribution, revenue_projection_total,
        returns_projection_year1, returns_projection_year2, returns_projection_year3,
        returns_projection_year4, returns_projection_year5, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
      ) RETURNING *`,
      [
        id, // film_plan_id
        filmPlan.title,
        filmPlan.tagline,
        filmPlan.director,
        filmPlan.producer,
        filmPlan.production_company,
        filmPlan.genre,
        filmPlan.language,
        filmPlan.description,
        filmPlan.cast,
        filmPlan.release_date,
        filmPlan.budget,
        1000, // total_lots
        1000, // available_lots
        pricePerLot,
        projectedROI || 30.0, // Default ROI
        minimumInvestment || pricePerLot,
        maximumInvestment || null,
        images,
        poster || null,
        filmPlan.revenue_projection_box_office,
        filmPlan.revenue_projection_streaming,
        filmPlan.revenue_projection_distribution,
        filmPlan.revenue_projection_total,
        filmPlan.returns_projection_year1,
        filmPlan.returns_projection_year2,
        filmPlan.returns_projection_year3,
        filmPlan.returns_projection_year4,
        filmPlan.returns_projection_year5,
        'pre-production',
      ]
    );

      const movie = movieResult.rows[0];

      // Update film plan status and link to movie
      await client.query(
        `UPDATE film_plans 
         SET status = 'approved', 
             reviewed_by = $1, 
             reviewed_at = CURRENT_TIMESTAMP,
             approved_movie_id = $2
         WHERE id = $3`,
        [user.id, movie.id, id]
      );

      // Update platform stats
      await client.query(
        `UPDATE platform_stats 
         SET film_plans_approved = film_plans_approved + 1,
             updated_at = CURRENT_TIMESTAMP`
      );

      return {
        filmPlan: {
          id: filmPlan.id,
          status: 'approved',
          approvedMovieId: movie.id,
        },
        movie: {
          id: movie.id,
          title: movie.title,
          status: movie.status,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Film plan approved and movie created successfully',
    });
  } catch (error: any) {
    console.error('Approve film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve film plan' },
      { status: 500 }
    );
  }
}
