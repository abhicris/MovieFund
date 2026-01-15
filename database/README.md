# Database Schema Documentation

## Overview

This directory contains the PostgreSQL database schema for the MovieFund platform. The schema supports:

- Multi-role user management (Investors, Producers, Admins)
- Film plan submission and approval workflow
- Document management and verification
- Investment tracking
- Payment and banking integrations
- Returns distribution

## Setup Instructions

### Prerequisites

- PostgreSQL 12+ installed
- Database user with CREATE privileges

### Installation

1. Create a new database:
```bash
createdb moviefund
```

2. Run the schema:
```bash
psql -d moviefund -f schema.sql
```

### Environment Variables

Add these to your `.env.local`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/moviefund
```

## Schema Overview

### Core Tables

1. **users** - All user accounts (investors, producers, admins)
2. **sessions** - User session management
3. **film_plans** - Film proposals submitted by producers
4. **documents** - Documents/agreements uploaded for film plans
5. **movies** - Approved and published film plans
6. **investments** - Investor investments in movies
7. **returns** - Returns paid to investors
8. **payment_integrations** - Payment provider connections
9. **bank_accounts** - Bank account information
10. **transactions** - All financial transactions
11. **platform_stats** - Cached platform statistics

## Key Relationships

- `film_plans` → `users` (producer_id)
- `documents` → `film_plans` (film_plan_id)
- `movies` ← `film_plans` (approved_movie_id)
- `investments` → `users` (user_id) + `movies` (movie_id)
- `returns` → `investments` (investment_id)
- `payment_integrations` → `users` (user_id)
- `bank_accounts` → `users` (user_id)

## Workflow

1. **Producer Registration**: Producer creates account → Account verification pending
2. **Film Plan Submission**: Producer submits film plan → Status: 'draft' → 'submitted'
3. **Document Upload**: Producer uploads required documents
4. **Admin Review**: Admin reviews film plan and documents → Status: 'under_review'
5. **Approval/Rejection**: Admin approves → Creates `movie` record → Status: 'approved' → 'published'
6. **Investment**: Investor invests → Creates `investment` record
7. **Returns**: Returns distributed → Creates `returns` records

## Security Considerations

- Passwords are bcrypt hashed
- Account numbers are encrypted (use encryption at application level)
- Sensitive data should be encrypted at rest
- Use parameterized queries to prevent SQL injection
- Implement row-level security policies for multi-tenant data

## Indexes

All foreign keys and frequently queried columns are indexed for performance.

## Migrations

For production, use a migration tool like:
- Prisma Migrate
- Knex.js migrations
- TypeORM migrations
- Custom migration scripts
