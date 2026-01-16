// Database connection utility
// This file provides database connection helpers
// For production, use a connection pool like pg-pool or Prisma

import { Pool } from 'pg';

// Database connection pool
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    // Vercel managed Supabase uses POSTGRES_URL, but also check DATABASE_URL
    const connectionString = 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error(
        'Database connection string not found. ' +
        'Please set one of: DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING'
      );
    }

    // Determine SSL configuration
    // Supabase connection strings include sslmode=require, but we handle SSL via Pool config
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const isSupabase = 
      connectionString.includes('supabase.co') || 
      connectionString.includes('pooler.supabase.com') ||
      connectionString.includes('supa=base');
    const isCloudDB = 
      connectionString.includes('vercel-storage.com') ||
      connectionString.includes('neon.tech') ||
      connectionString.includes('railway.app');
    const isProduction = process.env.NODE_ENV === 'production';
    const isExternal = !isLocalhost && (connectionString.includes('.com') || connectionString.includes('.net') || connectionString.includes('.io'));

    // Clean connection string - remove only sslmode parameter to avoid conflicts
    // We'll handle SSL entirely through Pool config
    // Keep other parameters like supa=base-pooler.x
    let cleanConnectionString = connectionString;
    // Remove sslmode parameter but preserve other query parameters
    // Handle: ?sslmode=require&supa=base-pooler.x -> ?supa=base-pooler.x
    if (cleanConnectionString.includes('sslmode=')) {
      // Remove ?sslmode=value& or ?sslmode=value (end of string)
      cleanConnectionString = cleanConnectionString.replace(/\?sslmode=[^&]*(&|$)/, (match, after) => {
        // If there's a & after, replace with ? to keep the next param
        // If it's the end, remove entirely
        return after === '&' ? '?' : '';
      });
      // Remove &sslmode=value (if it's a later parameter)
      cleanConnectionString = cleanConnectionString.replace(/&sslmode=[^&]*/g, '');
      // Clean up any ?& sequences (shouldn't happen but just in case)
      cleanConnectionString = cleanConnectionString.replace(/\?&/g, '?');
      // Remove trailing ? if no params remain
      cleanConnectionString = cleanConnectionString.replace(/\?$/, '');
    }

    // For Supabase, cloud databases, external connections, or production:
    // Always use SSL with rejectUnauthorized: false to handle certificate chain issues
    // This is necessary for Supabase pooler which uses self-signed certificates
    const needsSSL = isSupabase || isCloudDB || isExternal || isProduction;
    
    const sslConfig = needsSSL ? {
      rejectUnauthorized: false
    } : false;

    pool = new Pool({
      connectionString: cleanConnectionString,
      ssl: sslConfig,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// Helper function to execute queries
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getDbPool();
  const start = Date.now();
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.log('Slow query:', { text, duration, rows: res.rowCount });
    }
    
    return {
      rows: res.rows,
      rowCount: res.rowCount ?? 0,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper to get a single row
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.rows[0] || null;
}

// Close the pool (useful for tests)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Transaction helper - executes a function within a transaction
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getDbPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
