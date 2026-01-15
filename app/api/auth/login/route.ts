import { NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword } from '@/lib/auth';
import { query } from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user with password hash
    const user = await query<{
      id: string;
      email: string;
      password_hash: string;
      name: string;
      role: string;
      account_status: string;
    }>(
      'SELECT id, email, password_hash, name, role, account_status FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const dbUser = user.rows[0];

    // Verify password
    const isValidPassword = await verifyPassword(password, dbUser.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check account status
    if (dbUser.account_status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'Account is suspended' },
        { status: 403 }
      );
    }

    // Create session
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await query(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
      [dbUser.id, sessionToken, expiresAt]
    );

    // Return user data and session token
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          accountStatus: dbUser.account_status,
        },
        sessionToken,
        expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
