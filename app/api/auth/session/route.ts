import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

// Get current session user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 401 }
      );
    }

    // Get session
    const session = await queryOne<{
      user_id: string;
      expires_at: Date;
    }>(
      'SELECT user_id, expires_at FROM sessions WHERE session_token = $1',
      [sessionToken]
    );

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
      return NextResponse.json(
        { success: false, error: 'Session expired' },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserById(session.user_id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Session error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Session check failed' },
      { status: 500 }
    );
  }
}

// Logout - delete session
export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionToken = authHeader?.replace('Bearer ', '');

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session token provided' },
        { status: 400 }
      );
    }

    await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
