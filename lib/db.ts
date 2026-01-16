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
    // Supabase and most cloud databases require SSL
    // Always enable SSL for production or external databases
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const isProduction = process.env.NODE_ENV === 'production';
    const isSupabase = connectionString.includes('supabase.co');
    const isCloudDB = 
      connectionString.includes('vercel-storage.com') ||
      connectionString.includes('neon.tech') ||
      connectionString.includes('railway.app') ||
      connectionString.includes('.com') || // Any external domain
      connectionString.includes('.net') ||
      connectionString.includes('.io');

    // For Supabase, cloud databases, or production, always use SSL
    // Set rejectUnauthorized: false to handle self-signed certificates in certificate chains
    // This is safe for managed databases like Supabase
    const sslConfig = (!isLocalhost && (isSupabase || isCloudDB || isProduction)) ? {
      rejectUnauthorized: false
    } : false;

    pool = new Pool({
      connectionString,
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
