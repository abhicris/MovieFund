import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// POST /api/film-plans/[id]/submit - Submit film plan for review
export async function POST(
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

    // Only producer can submit their own plan
    if (filmPlan.producer_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 403 }
      );
    }

    // Can only submit from draft status
    if (filmPlan.status !== 'draft') {
      return NextResponse.json(
        { success: false, error: 'Film plan can only be submitted from draft status' },
        { status: 400 }
      );
    }

    // Update status to submitted
    const result = await query(
      `UPDATE film_plans 
       SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );

    // Update platform stats
    await query(
      `UPDATE platform_stats 
       SET film_plans_submitted = film_plans_submitted + 1,
           updated_at = CURRENT_TIMESTAMP`
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Film plan submitted for review',
    });
  } catch (error: any) {
    console.error('Submit film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit film plan' },
      { status: 500 }
    );
  }
}
