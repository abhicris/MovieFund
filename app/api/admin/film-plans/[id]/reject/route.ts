import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// POST /api/admin/film-plans/[id]/reject - Reject film plan
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

    // Can only reject submitted or under_review plans
    if (!['submitted', 'under_review'].includes(filmPlan.status)) {
      return NextResponse.json(
        { success: false, error: `Cannot reject film plan with status: ${filmPlan.status}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rejectionReason } = body;

    if (!rejectionReason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Update film plan status
    await query(
      `UPDATE film_plans 
       SET status = 'rejected', 
           reviewed_by = $1, 
           reviewed_at = CURRENT_TIMESTAMP,
           rejection_reason = $2
       WHERE id = $3`,
      [user.id, rejectionReason, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Film plan rejected successfully',
    });
  } catch (error: any) {
    console.error('Reject film plan error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reject film plan' },
      { status: 500 }
    );
  }
}
