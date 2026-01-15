import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/auth';
import { UserRole } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, productionCompany, companyRegistration, taxId } = body;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['investor', 'producer', 'admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(
      email,
      password,
      name,
      role as UserRole,
      phone,
      role === 'producer' ? {
        productionCompany,
        companyRegistration,
        taxId,
      } : undefined
    );

    // Remove sensitive data before sending
    const { password_hash, ...userResponse } = user as any;

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User registered successfully',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
