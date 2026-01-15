import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// POST /api/admin/film-plans/[id]/review - Mark film plan as under review
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

    // Can only review submitted plans
    if (filmPlan.status !== 'submitted') {
      return NextResponse.json(
        { success: false, error: `Film plan must be in 'submitted' status to start review` },
        { status: 400 }
      );
    }

    // Update film plan status
    await query(
      `UPDATE film_plans 
       SET status = 'under_review', 
           reviewed_by = $1, 
           reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [user.id, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Film plan marked as under review',
    });
  } catch (error: any) {
    console.error('Review film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to start review' },
      { status: 500 }
    );
  }
}
