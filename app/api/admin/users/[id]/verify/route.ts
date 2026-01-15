import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// POST /api/admin/users/[id]/verify - Verify user account (producer)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user: adminUser } = authResult;
    const { id } = await params;

    // Get user to verify
    const user = await queryOne<{ id: string; role: string; account_status: string }>(
      'SELECT id, role, account_status FROM users WHERE id = $1',
      [id]
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update account status
    await query(
      `UPDATE users 
       SET account_status = 'verified', 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    // If producer, update platform stats
    if (user.role === 'producer') {
      await query(
        `UPDATE platform_stats 
         SET producers_registered = producers_registered + 1,
             updated_at = CURRENT_TIMESTAMP`
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User account verified successfully',
    });
  } catch (error: any) {
    console.error('Verify user error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify user' },
      { status: 500 }
    );
  }
}
