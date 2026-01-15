# User Types & Roles - MovieFund Platform

## Overview

The MovieFund platform supports **3 main user roles**, each with distinct permissions and capabilities:

1. **Investor** - Can invest in movies
2. **Producer** - Can submit film plans and receive funding
3. **Admin** - Can approve film plans and manage the platform

---

## 1. Investor Role 👤

### Purpose
Investors browse and invest in approved movie projects to earn returns.

### Account Status
- **pending** - New account, awaiting verification
- **verified** - Account verified, can invest
- **rejected** - Account verification rejected
- **suspended** - Account temporarily suspended

### KYC Status (Know Your Customer)
- **pending** - KYC verification not started
- **verified** - KYC completed, can invest
- **rejected** - KYC verification failed

### Capabilities
✅ **Can:**
- View published movies
- Browse investment opportunities
- Make investments in movies
- View investment portfolio
- Track returns and earnings
- View investment history
- Access investor dashboard

❌ **Cannot:**
- Submit film plans
- Approve/reject film plans
- Verify other users
- Access admin features
- Upload documents for film plans

### Required Information
- Email
- Name
- Phone (optional)
- Password

### Optional Information
- KYC documents (for verification)

---

## 2. Producer Role 🎬

### Purpose
Producers (film production companies/teams) submit film plans to raise funding from investors.

### Account Status
- **pending** - New account, awaiting admin verification
- **verified** - Account verified by admin, can submit film plans
- **rejected** - Account verification rejected
- **suspended** - Account temporarily suspended

### Producer-Specific Fields
- **production_company** - Name of production company
- **company_registration** - Company registration number
- **tax_id** - Tax identification number
- **bank_account_connected** - Whether payment account is connected
- **stripe_account_id** - Stripe Connect account ID (for payouts)

### Capabilities
✅ **Can:**
- Create and edit film plans (draft status)
- Submit film plans for review
- Upload documents/agreements for film plans
- View their submitted film plans
- Connect payment providers (Stripe, Razorpay, PayPal)
- Add bank accounts for payouts
- View funding progress for their movies
- Access producer dashboard

❌ **Cannot:**
- Approve their own film plans
- Approve/reject other film plans
- Verify other users
- Access admin features
- Invest in movies (unless they also have investor account)

### Required Information
- Email
- Name
- Phone (optional)
- Password
- Production Company Name
- Company Registration (optional)
- Tax ID (optional)

### Workflow
1. **Register** → Account status: `pending`
2. **Admin Verification** → Account status: `verified`
3. **Create Film Plan** → Status: `draft`
4. **Upload Documents** → Add required agreements
5. **Submit for Review** → Status: `submitted`
6. **Admin Review** → Status: `under_review`
7. **Approval/Rejection** → Status: `approved` or `rejected`
8. **If Approved** → Movie created, investors can invest

---

## 3. Admin Role 🔧

### Purpose
Admins manage the platform, verify accounts, and approve/reject film plans.

### Account Status
- **verified** - Admin accounts are always verified
- **suspended** - Can be suspended if needed

### Admin Levels
- **super** - Full admin access
- **moderator** - Limited admin access (can review but not delete)

### Capabilities
✅ **Can:**
- View all film plans (all statuses)
- Review film plans
- Approve film plans (creates movie listing)
- Reject film plans (with reason)
- Verify producer accounts
- Verify investor accounts
- View all users
- View platform statistics
- Access admin dashboard
- Manage platform settings

❌ **Cannot:**
- Submit film plans (unless they also have producer account)
- Invest in movies (unless they also have investor account)

### Admin Actions
1. **Account Verification**
   - Verify producer accounts
   - Verify investor accounts
   - Suspend/unsuspend accounts

2. **Film Plan Management**
   - Mark film plans as "under review"
   - Approve film plans → Creates movie listing
   - Reject film plans → Provides rejection reason
   - View all documents

3. **Platform Management**
   - View platform statistics
   - Monitor investments
   - Manage returns distribution

---

## Account Status Flow

### For Investors
```
pending → [Admin Verification] → verified → [Can Invest]
         ↓
      rejected (if verification fails)
```

### For Producers
```
pending → [Admin Verification] → verified → [Can Submit Film Plans]
         ↓
      rejected (if verification fails)
```

### For All Users
```
Any Status → [Admin Action] → suspended (temporary ban)
```

---

## Role Permissions Matrix

| Action | Investor | Producer | Admin |
|--------|----------|----------|-------|
| View Movies | ✅ | ✅ | ✅ |
| Invest in Movies | ✅ | ❌ | ❌ |
| Create Film Plan | ❌ | ✅ | ❌ |
| Submit Film Plan | ❌ | ✅ | ❌ |
| Upload Documents | ❌ | ✅ | ✅ |
| Approve Film Plan | ❌ | ❌ | ✅ |
| Reject Film Plan | ❌ | ❌ | ✅ |
| Verify Users | ❌ | ❌ | ✅ |
| View All Film Plans | ❌ | ❌ | ✅ |
| View Platform Stats | ❌ | ❌ | ✅ |
| Connect Payment Provider | ❌ | ✅ | ❌ |
| Add Bank Account | ✅ | ✅ | ❌ |

---

## Multi-Role Accounts

**Note:** A user can potentially have multiple roles, but the current implementation uses a single `role` field. For multi-role support, you would need:

1. A separate `user_roles` junction table, OR
2. An array field for roles, OR
3. Separate accounts for each role

**Current Limitation:** One user = One role

---

## KYC (Know Your Customer) Status

### For Investors
KYC verification is required before making investments:
- **pending** - Cannot invest
- **verified** - Can invest
- **rejected** - Cannot invest (must resubmit)

### For Producers
KYC is not required, but account verification by admin is required.

---

## Payment Integration

### Producers Only
Producers can connect payment providers to receive payouts:
- **Stripe** - Stripe Connect account
- **Razorpay** - Razorpay account
- **PayPal** - PayPal account
- **Other** - Custom payment provider

**Status:**
- `connected` - Payment provider connected and active
- `pending` - Connection in progress
- `disconnected` - Connection removed

---

## Bank Accounts

### Who Can Add Bank Accounts
- **Investors** - For receiving returns
- **Producers** - For receiving payouts

### Bank Account Fields
- Account holder name
- Account number (encrypted, only last 4 digits shown)
- Bank name
- Routing number (US accounts)
- SWIFT code (international accounts)
- Country
- Currency
- Primary account flag
- Verification status

---

## API Access by Role

### Public Endpoints (No Auth)
- `GET /api/movies/[id]` - View movie details
- `GET /api/film-plans` - List film plans (filtered)

### Investor Endpoints
- `POST /api/auth/register` (role: investor)
- `POST /api/auth/login`
- `GET /api/auth/session`
- `GET /api/movies/[id]` - With investment data
- `POST /api/investments` - Make investment (future)
- `GET /api/investments` - View portfolio (future)

### Producer Endpoints
- `POST /api/auth/register` (role: producer)
- `POST /api/film-plans` - Create film plan
- `PUT /api/film-plans/[id]` - Update film plan
- `POST /api/film-plans/[id]/submit` - Submit for review
- `POST /api/film-plans/[id]/documents` - Upload documents
- `POST /api/payments/connect` - Connect payment provider
- `POST /api/banking/accounts` - Add bank account

### Admin Endpoints
- `POST /api/admin/film-plans/[id]/review` - Start review
- `POST /api/admin/film-plans/[id]/approve` - Approve film plan
- `POST /api/admin/film-plans/[id]/reject` - Reject film plan
- `POST /api/admin/users/[id]/verify` - Verify user account

---

## Database Schema

### Users Table Fields

**Common Fields:**
- `id` - UUID primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `name` - User's full name
- `phone` - Phone number (optional)
- `role` - 'investor' | 'producer' | 'admin'
- `account_status` - 'pending' | 'verified' | 'rejected' | 'suspended'
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Producer-Specific:**
- `production_company` - Company name
- `company_registration` - Registration number
- `tax_id` - Tax identification
- `bank_account_connected` - Boolean flag
- `stripe_account_id` - Stripe Connect ID

**Investor-Specific:**
- `kyc_status` - 'pending' | 'verified' | 'rejected'
- `kyc_verified_at` - KYC verification timestamp

**Admin-Specific:**
- `admin_level` - 'super' | 'moderator'

---

## Summary

The platform uses a **role-based access control (RBAC)** system with:

- **3 Primary Roles:** Investor, Producer, Admin
- **4 Account Statuses:** pending, verified, rejected, suspended
- **3 KYC Statuses:** pending, verified, rejected (investors only)
- **2 Admin Levels:** super, moderator

Each role has distinct permissions and capabilities, ensuring proper access control and workflow management throughout the platform.
