// Authentication utilities
import bcrypt from 'bcryptjs';
import { query, queryOne } from './db';
import { User, UserRole } from '@/types';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await queryOne<{
    id: string;
    email: string;
    password_hash: string;
    name: string;
    phone: string | null;
    role: UserRole;
    account_status: string;
    production_company: string | null;
    company_registration: string | null;
    tax_id: string | null;
    bank_account_connected: boolean;
    stripe_account_id: string | null;
    kyc_status: string | null;
    kyc_verified_at: Date | null;
    admin_level: string | null;
    created_at: Date;
    updated_at: Date;
  }>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (!user) return null;

  // Map database fields to User type
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    role: user.role,
    accountStatus: user.account_status as any,
    productionCompany: user.production_company ?? undefined,
    companyRegistration: user.company_registration ?? undefined,
    taxId: user.tax_id ?? undefined,
    bankAccountConnected: user.bank_account_connected,
    stripeAccountId: user.stripe_account_id ?? undefined,
    kycStatus: user.kyc_status as any,
    kycVerifiedAt: user.kyc_verified_at ?? undefined,
    adminLevel: user.admin_level as any,
    investments: [],
    totalInvested: 0,
    totalReturns: 0,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const user = await queryOne<{
    id: string;
    email: string;
    password_hash: string;
    name: string;
    phone: string | null;
    role: UserRole;
    account_status: string;
    production_company: string | null;
    company_registration: string | null;
    tax_id: string | null;
    bank_account_connected: boolean;
    stripe_account_id: string | null;
    kyc_status: string | null;
    kyc_verified_at: Date | null;
    admin_level: string | null;
    created_at: Date;
    updated_at: Date;
  }>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    role: user.role,
    accountStatus: user.account_status as any,
    productionCompany: user.production_company ?? undefined,
    companyRegistration: user.company_registration ?? undefined,
    taxId: user.tax_id ?? undefined,
    bankAccountConnected: user.bank_account_connected,
    stripeAccountId: user.stripe_account_id ?? undefined,
    kycStatus: user.kyc_status as any,
    kycVerifiedAt: user.kyc_verified_at ?? undefined,
    adminLevel: user.admin_level as any,
    investments: [],
    totalInvested: 0,
    totalReturns: 0,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

// Create user
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  phone?: string,
  additionalData?: {
    productionCompany?: string;
    companyRegistration?: string;
    taxId?: string;
  }
): Promise<User> {
  const passwordHash = await hashPassword(password);
  
  const result = await query<{
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: UserRole;
    account_status: string;
    production_company: string | null;
    created_at: Date;
    updated_at: Date;
  }>(
    `INSERT INTO users (
      email, password_hash, name, phone, role, 
      production_company, company_registration, tax_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, name, phone, role, account_status, production_company, created_at, updated_at`,
    [
      email,
      passwordHash,
      name,
      phone || null,
      role,
      additionalData?.productionCompany || null,
      additionalData?.companyRegistration || null,
      additionalData?.taxId || null,
    ]
  );

  const user = result.rows[0];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    role: user.role,
    accountStatus: user.account_status as any,
    productionCompany: user.production_company ?? undefined,
    investments: [],
    totalInvested: 0,
    totalReturns: 0,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
