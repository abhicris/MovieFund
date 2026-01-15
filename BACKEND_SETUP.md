# Backend Setup Guide - MovieFund Platform

## Overview

This guide covers the complete backend setup for the MovieFund platform, including database schema, API architecture, and integration requirements.

## Architecture

### Database
- **PostgreSQL** - Primary database for all transactional data
- **Schema**: See `database/schema.sql`
- **Connection Pool**: pg-pool for efficient connection management

### API Structure
- **Framework**: Next.js API Routes
- **Authentication**: Session-based with bcrypt password hashing
- **Authorization**: Role-based (investor, producer, admin)

---

## Setup Instructions

### 1. Database Setup

#### Install PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Create Database
```bash
createdb moviefund
```

#### Run Schema
```bash
psql -d moviefund -f database/schema.sql
```

#### Verify Setup
```bash
psql -d moviefund -c "\dt"  # List all tables
```

### 2. Install Dependencies

```bash
npm install
```

**Required packages:**
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `@types/pg` - TypeScript types
- `@types/bcryptjs` - TypeScript types

### 3. Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/moviefund

# Encryption (for bank account numbers)
ENCRYPTION_KEY=your-32-character-encryption-key-here!!

# Node Environment
NODE_ENV=development

# File Storage (for document uploads)
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=moviefund-documents

# OR Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Providers
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_MODE=sandbox  # or 'live'
```

### 4. File Storage Setup

Choose one:

#### Option A: AWS S3
1. Create S3 bucket
2. Configure IAM user with S3 access
3. Set CORS policy for uploads
4. Update `.env.local` with credentials

#### Option B: Cloudinary
1. Create Cloudinary account
2. Get API credentials
3. Update `.env.local` with credentials

**Note**: Document upload API (`/api/film-plans/[id]/documents`) currently uses placeholder URLs. Implement actual file upload in production.

### 5. Payment Provider Setup

#### Stripe
1. Create Stripe account
2. Get API keys from dashboard
3. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. For producers: Set up Stripe Connect

#### Razorpay
1. Create Razorpay account
2. Get API keys
3. Set up webhook: `https://yourdomain.com/api/webhooks/razorpay`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get session
- `GET /api/auth/session` - Get current user
- `DELETE /api/auth/session` - Logout

### Film Plans (Producers)
- `GET /api/film-plans` - List film plans
- `GET /api/film-plans/[id]` - Get film plan details
- `POST /api/film-plans` - Create film plan
- `PUT /api/film-plans/[id]` - Update film plan
- `POST /api/film-plans/[id]/submit` - Submit for review
- `GET /api/film-plans/[id]/documents` - List documents
- `POST /api/film-plans/[id]/documents` - Upload document

### Admin
- `POST /api/admin/film-plans/[id]/review` - Start review
- `POST /api/admin/film-plans/[id]/approve` - Approve and create movie
- `POST /api/admin/film-plans/[id]/reject` - Reject film plan
- `POST /api/admin/users/[id]/verify` - Verify user account

### Payment & Banking
- `POST /api/payments/connect` - Connect payment provider
- `GET /api/payments/connect` - List connected providers
- `POST /api/banking/accounts` - Add bank account
- `GET /api/banking/accounts` - List bank accounts

### Movies
- `GET /api/movies/[id]` - Get movie with role-based data

See `API_DOCUMENTATION.md` for complete API reference.

---

## Database Schema

### Core Tables

1. **users** - User accounts (investors, producers, admins)
2. **sessions** - User sessions
3. **film_plans** - Film proposals from producers
4. **documents** - Documents uploaded for film plans
5. **movies** - Approved and published films
6. **investments** - Investor investments
7. **returns** - Returns paid to investors
8. **payment_integrations** - Payment provider connections
9. **bank_accounts** - Bank account information
10. **transactions** - All financial transactions
11. **platform_stats** - Cached platform statistics

See `database/schema.sql` for complete schema.

---

## Workflow

### Film Plan Submission Flow

1. **Producer Registration**
   - Producer creates account
   - Account status: `pending`
   - Admin verifies account → status: `verified`

2. **Film Plan Creation**
   - Producer creates film plan
   - Status: `draft`
   - Producer can edit and add documents

3. **Submission**
   - Producer submits film plan
   - Status: `submitted`
   - Admin can start review

4. **Review**
   - Admin marks as under review
   - Status: `under_review`
   - Admin reviews documents and details

5. **Approval/Rejection**
   - **Approved**: Creates `movie` record, status: `approved` → `published`
   - **Rejected**: Status: `rejected`, includes rejection reason

### Investment Flow

1. Investor views published movie
2. Investor makes investment
3. Creates `investment` record (status: `reserved`)
4. Payment processed
5. Investment confirmed (status: `confirmed` → `active`)

### Returns Flow

1. Movie generates revenue
2. Admin creates `returns` records
3. Returns distributed to investors
4. Status updated to `paid`

---

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- Session tokens stored in database
- Sessions expire after 30 days
- Account status checks on login

### Authorization
- Role-based access control
- Producers can only edit their own film plans
- Admins have full access
- Investors can only view and invest

### Data Protection
- Bank account numbers encrypted at rest
- Only last 4 digits stored for display
- Sensitive data not logged
- SQL injection prevention (parameterized queries)

### Payment Security
- PCI compliance required for payment processing
- Use payment provider SDKs (Stripe, Razorpay)
- Never store full card numbers
- Webhook signature verification

---

## Testing

### Database Connection Test

```typescript
import { query } from '@/lib/db';

async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
```

### API Testing

Use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code)

Example:
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "producer@example.com",
    "password": "password123",
    "name": "Producer Name",
    "role": "producer",
    "productionCompany": "Production Co."
  }'
```

---

## Production Checklist

- [ ] Database backups configured
- [ ] Environment variables set
- [ ] File storage configured (S3/Cloudinary)
- [ ] Payment providers configured
- [ ] Webhook endpoints secured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Monitoring set up
- [ ] Database indexes optimized
- [ ] Connection pooling configured
- [ ] Encryption keys rotated
- [ ] Security audit completed

---

## Next Steps

1. **File Upload Implementation**
   - Implement S3/Cloudinary upload in document API
   - Add file validation and virus scanning
   - Set up CDN for file delivery

2. **Payment Integration**
   - Implement Stripe/Razorpay SDKs
   - Create payment processing endpoints
   - Set up webhook handlers
   - Implement refund logic

3. **Investment Processing**
   - Create investment reservation system
   - Implement payment flow
   - Add investment confirmation logic
   - Update movie available lots

4. **Returns Distribution**
   - Create returns calculation logic
   - Implement payout system
   - Add returns history tracking

5. **Admin Dashboard**
   - Build admin UI for approvals
   - Add analytics and reporting
   - Create user management interface

6. **Notifications**
   - Email notifications for status changes
   - SMS notifications (optional)
   - In-app notifications

---

## Support

For issues or questions:
- Check `API_DOCUMENTATION.md` for API details
- Review `database/README.md` for database setup
- See `database/schema.sql` for schema reference
