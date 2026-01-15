import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// POST /api/payments/connect - Connect payment provider (Stripe, Razorpay, etc.)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    // Only producers need payment integrations
    if (user.role !== 'producer') {
      return NextResponse.json(
        { success: false, error: 'Only producers can connect payment providers' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { provider, accountId } = body;

    if (!provider || !accountId) {
      return NextResponse.json(
        { success: false, error: 'Provider and account ID are required' },
        { status: 400 }
      );
    }

    const allowedProviders = ['stripe', 'razorpay', 'paypal', 'other'];
    if (!allowedProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment provider' },
        { status: 400 }
      );
    }

    // Check if integration already exists
    const existing = await queryOne(
      'SELECT id FROM payment_integrations WHERE user_id = $1 AND provider = $2',
      [user.id, provider]
    );

    if (existing) {
      // Update existing integration
      const result = await query(
        `UPDATE payment_integrations 
         SET account_id = $1, status = 'connected', connected_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND provider = $3
         RETURNING *`,
        [accountId, user.id, provider]
      );

      // Update user's bank_account_connected status
      await query(
        'UPDATE users SET bank_account_connected = TRUE WHERE id = $1',
        [user.id]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Payment provider connected successfully',
      });
    } else {
      // Create new integration
      const result = await query(
        `INSERT INTO payment_integrations (user_id, provider, account_id, status, connected_at)
         VALUES ($1, $2, $3, 'connected', CURRENT_TIMESTAMP)
         RETURNING *`,
        [user.id, provider, accountId]
      );

      // Update user's bank_account_connected status
      await query(
        'UPDATE users SET bank_account_connected = TRUE WHERE id = $1',
        [user.id]
      );

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        message: 'Payment provider connected successfully',
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Connect payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect payment provider' },
      { status: 500 }
    );
  }
}

// GET /api/payments/connect - Get connected payment providers
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    const result = await query(
      'SELECT * FROM payment_integrations WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows.map((row: any) => ({
        id: row.id,
        provider: row.provider,
        accountId: row.account_id,
        status: row.status,
        connectedAt: row.connected_at,
        lastVerifiedAt: row.last_verified_at,
      })),
    });
  } catch (error: any) {
    console.error('Get payment integrations error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment integrations' },
      { status: 500 }
    );
  }
}
