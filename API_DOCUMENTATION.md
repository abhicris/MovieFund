# MovieFund API Documentation

## Overview

This document describes the REST API endpoints for the MovieFund platform. All APIs return JSON responses with a consistent structure:

```json
{
  "success": true|false,
  "data": {...},
  "error": "error message",
  "message": "success message"
}
```

## Authentication

Most endpoints require authentication. Include the session token in the Authorization header:

```
Authorization: Bearer <session_token>
```

## Base URL

```
/api
```

---

## Authentication APIs

### Register User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "investor" | "producer" | "admin",
  "phone": "+1234567890",
  "productionCompany": "Production Co." (producer only),
  "companyRegistration": "REG123" (producer only),
  "taxId": "TAX123" (producer only)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "investor",
    "accountStatus": "pending"
  }
}
```

---

### Login

**POST** `/api/auth/login`

Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "investor",
      "accountStatus": "verified"
    },
    "sessionToken": "token_string",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

---

### Get Session

**GET** `/api/auth/session`

Get current authenticated user.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "investor",
    ...
  }
}
```

---

### Logout

**DELETE** `/api/auth/session`

Delete current session.

**Headers:**
```
Authorization: Bearer <session_token>
```

---

## Film Plan APIs

### List Film Plans

**GET** `/api/film-plans`

List film plans with optional filters.

**Query Parameters:**
- `status` - Filter by status (draft, submitted, under_review, approved, rejected, published, archived)
- `producer_id` - Filter by producer ID
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "producerId": "uuid",
      "title": "Movie Title",
      "director": "Director Name",
      "budget": 50000000,
      "status": "submitted",
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get Film Plan

**GET** `/api/film-plans/[id]`

Get detailed information about a specific film plan.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Movie Title",
    "director": "Director Name",
    "budget": 50000000,
    "revenueProjection": {...},
    "returnsProjection": {...},
    ...
  }
}
```

---

### Create Film Plan

**POST** `/api/film-plans`

Create a new film plan (producer only).

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "title": "Movie Title",
  "tagline": "Movie tagline",
  "director": "Director Name",
  "producer": "Producer Name",
  "productionCompany": "Production Co.",
  "genre": ["action", "drama"],
  "language": "hindi",
  "budget": 50000000,
  "description": "Movie description",
  "cast": ["Actor 1", "Actor 2"],
  "releaseDate": "2026-08-14",
  "revenueProjection": {
    "boxOffice": 95000000,
    "streaming": 38000000,
    "distribution": 25000000,
    "total": 158000000
  },
  "returnsProjection": {
    "year1": 38,
    "year2": 77,
    "year3": 115,
    "year4": 154,
    "year5": 192
  }
}
```

---

### Update Film Plan

**PUT** `/api/film-plans/[id]`

Update film plan (producer can only update draft/submitted plans).

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "budget": 60000000,
  ...
}
```

---

### Submit Film Plan

**POST** `/api/film-plans/[id]/submit`

Submit film plan for admin review (producer only).

**Headers:**
```
Authorization: Bearer <session_token>
```

---

## Document APIs

### List Documents

**GET** `/api/film-plans/[id]/documents`

Get all documents for a film plan.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "script",
      "title": "Script Document",
      "fileName": "script.pdf",
      "fileUrl": "https://...",
      "fileSize": 1024000,
      "isVerified": false,
      ...
    }
  ]
}
```

---

### Upload Document

**POST** `/api/film-plans/[id]/documents`

Upload a document for a film plan.

**Headers:**
```
Authorization: Bearer <session_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - File to upload (max 50MB)
- `type` - Document type (script, budget_breakdown, production_agreement, etc.)
- `title` - Document title

---

## Admin APIs

### Approve Film Plan

**POST** `/api/admin/film-plans/[id]/approve`

Approve film plan and create movie listing (admin only).

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "images": ["https://..."],
  "poster": "https://...",
  "projectedROI": 38.5,
  "minimumInvestment": 50000,
  "maximumInvestment": 5000000
}
```

---

### Reject Film Plan

**POST** `/api/admin/film-plans/[id]/reject`

Reject a film plan (admin only).

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "rejectionReason": "Reason for rejection"
}
```

---

### Start Review

**POST** `/api/admin/film-plans/[id]/review`

Mark film plan as under review (admin only).

**Headers:**
```
Authorization: Bearer <session_token>
```

---

### Verify User Account

**POST** `/api/admin/users/[id]/verify`

Verify a user account (admin only).

**Headers:**
```
Authorization: Bearer <session_token>
```

---

## Payment & Banking APIs

### Connect Payment Provider

**POST** `/api/payments/connect`

Connect a payment provider (Stripe, Razorpay, etc.) - producer only.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "provider": "stripe" | "razorpay" | "paypal",
  "accountId": "account_id_from_provider"
}
```

---

### Get Payment Integrations

**GET** `/api/payments/connect`

Get connected payment providers for current user.

**Headers:**
```
Authorization: Bearer <session_token>
```

---

### Add Bank Account

**POST** `/api/banking/accounts`

Add a bank account for withdrawals/payments.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "accountHolderName": "John Doe",
  "accountNumber": "1234567890",
  "bankName": "Bank Name",
  "routingNumber": "123456789" (US only),
  "swiftCode": "SWIFT123" (international),
  "country": "US",
  "currency": "USD",
  "isPrimary": false
}
```

---

### List Bank Accounts

**GET** `/api/banking/accounts`

Get all bank accounts for current user.

**Headers:**
```
Authorization: Bearer <session_token>
```

---

## Error Responses

All endpoints may return error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Payment Integration Requirements

### Stripe Integration

**Required:**
- Stripe Account ID
- Stripe API Keys (publishable and secret)
- Webhook endpoint for payment events
- Connect account for producers (for payouts)

**Setup Steps:**
1. Create Stripe account
2. Get API keys from dashboard
3. Set up webhook endpoint: `/api/webhooks/stripe`
4. For producers: Create Connect account

### Razorpay Integration

**Required:**
- Razorpay Key ID
- Razorpay Key Secret
- Webhook secret for verification
- Razorpay account for producers

**Setup Steps:**
1. Create Razorpay account
2. Get API keys
3. Set up webhook: `/api/webhooks/razorpay`
4. Configure payout accounts for producers

### PayPal Integration

**Required:**
- PayPal Client ID
- PayPal Client Secret
- PayPal Merchant ID (for producers)
- Webhook URL

---

## Database Setup

See `database/README.md` for database setup instructions.

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/moviefund
ENCRYPTION_KEY=your-32-character-encryption-key
```

---

## Next Steps

1. Set up PostgreSQL database
2. Run database schema: `psql -d moviefund -f database/schema.sql`
3. Install dependencies: `npm install pg bcryptjs @types/pg @types/bcryptjs`
4. Configure environment variables
5. Set up file storage (S3/Cloudinary) for document uploads
6. Configure payment provider accounts
7. Set up webhook endpoints for payment providers
