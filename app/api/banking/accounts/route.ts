import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';
import crypto from 'crypto';

// Encryption key (in production, use environment variable and proper key management)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32chars!!';
const ALGORITHM = 'aes-256-cbc';

// Encrypt account number
function encryptAccountNumber(accountNumber: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(accountNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// POST /api/banking/accounts - Add bank account
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    const body = await request.json();
    const {
      accountHolderName,
      accountNumber,
      bankName,
      routingNumber,
      swiftCode,
      country,
      currency = 'USD',
      isPrimary = false,
    } = body;

    // Validation
    if (!accountHolderName || !accountNumber || !bankName || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate account number length
    if (accountNumber.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Invalid account number' },
        { status: 400 }
      );
    }

    // Get last 4 digits for display
    const last4 = accountNumber.slice(-4);

    // Encrypt account number
    const encryptedAccountNumber = encryptAccountNumber(accountNumber);

    // If setting as primary, unset other primary accounts
    if (isPrimary) {
      await query(
        'UPDATE bank_accounts SET is_primary = FALSE WHERE user_id = $1',
        [user.id]
      );
    }

    // Create bank account
    const result = await query(
      `INSERT INTO bank_accounts (
        user_id, account_holder_name, account_number_encrypted, account_number_last4,
        bank_name, routing_number, swift_code, country, currency, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, account_holder_name, account_number_last4, bank_name, 
                routing_number, swift_code, country, currency, is_primary, 
                is_verified, created_at`,
      [
        user.id,
        accountHolderName,
        encryptedAccountNumber,
        last4,
        bankName,
        routingNumber || null,
        swiftCode || null,
        country,
        currency,
        isPrimary,
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Bank account added successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Add bank account error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add bank account' },
      { status: 500 }
    );
  }
}

// GET /api/banking/accounts - List bank accounts
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;

    const result = await query(
      `SELECT 
        id, account_holder_name, account_number_last4, bank_name,
        routing_number, swift_code, country, currency, is_primary,
        is_verified, verified_at, created_at
      FROM bank_accounts 
      WHERE user_id = $1 
      ORDER BY is_primary DESC, created_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('List bank accounts error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bank accounts' },
      { status: 500 }
    );
  }
}
