// Middleware for API route authentication
import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from './db';
import { getUserById } from './auth';
import { User } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: User;
}

// Get session token from request
export function getSessionToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.replace('Bearer ', '') || null;
}

// Verify session and get user
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: User | null; error: string | null }> {
  const sessionToken = getSessionToken(request);

  if (!sessionToken) {
    return { user: null, error: 'No session token provided' };
  }

  try {
    // Get session
    const session = await queryOne<{
      user_id: string;
      expires_at: Date;
    }>(
      'SELECT user_id, expires_at FROM sessions WHERE session_token = $1',
      [sessionToken]
    );

    if (!session) {
      return { user: null, error: 'Invalid session' };
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      const { query } = await import('./db');
      await query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
      return { user: null, error: 'Session expired' };
    }

    // Get user
    const user = await getUserById(session.user_id);
    if (!user) {
      return { user: null, error: 'User not found' };
    }

    // Check if account is suspended
    if (user.accountStatus === 'suspended') {
      return { user: null, error: 'Account is suspended' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

// Require authentication middleware
export async function requireAuth(
  request: NextRequest
): Promise<{ user: User; error?: NextResponse }> {
  const { user, error } = await authenticateRequest(request);

  if (!user || error) {
    return {
      user: null as any,
      error: NextResponse.json(
        { success: false, error: error || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  return { user };
}

// Require specific role
export async function requireRole(
  request: NextRequest,
  roles: string[]
): Promise<{ user: User; error?: NextResponse }> {
  const { user, error } = await authenticateRequest(request);

  if (!user || error) {
    return {
      user: null as any,
      error: NextResponse.json(
        { success: false, error: error || 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  if (!roles.includes(user.role)) {
    return {
      user: null as any,
      error: NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

// Require admin role
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: User; error?: NextResponse }> {
  return requireRole(request, ['admin']);
}
