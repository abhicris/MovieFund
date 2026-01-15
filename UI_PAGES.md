# UI Pages Overview - MovieFund Platform

## Current Pages

### 1. **Home Page** (`/`)
**File:** `app/page.tsx`

**Components Used:**
- Header
- Hero
- Stats (platform statistics)
- Services
- MovieShowcase (featured movies)
- HowItWorks
- Testimonials
- Footer

**Purpose:** Landing page showcasing the platform, stats, and featured movies

---

### 2. **Opportunities Page** (`/opportunities`)
**File:** `app/opportunities/page.tsx`

**Features:**
- Lists all available movie investment opportunities
- Filter by status (All, Live, Fully Funded)
- Genre filter
- Movie cards with key information
- Links to individual movie detail pages

**Purpose:** Browse all available investment opportunities

---

### 3. **Movie Detail Page** (`/opportunities/[id]`)
**File:** `app/opportunities/[id]/page.tsx`

**Features:**
- Full movie details
- Movie poster/image
- Investment information (price per lot, ROI)
- Funding progress bar
- Cast information
- Revenue projections
- 5-year returns projection
- "Invest Now" button (links to `/invest/[id]` - not yet implemented)

**Purpose:** Detailed view of a specific movie investment opportunity

---

### 4. **Dashboard Page** (`/dashboard`)
**File:** `app/dashboard/page.tsx`

**Current Status:** ⚠️ **Placeholder** - "Coming soon"

**Planned Features:**
- Track investments
- View returns
- Manage portfolio
- Investment history

**Purpose:** User dashboard (role-specific views needed)

---

### 5. **About Page** (`/about`)
**File:** `app/about/page.tsx`

**Purpose:** Information about the platform

---

### 6. **FAQ Page** (`/faq`)
**File:** `app/faq/page.tsx`

**Purpose:** Frequently asked questions

---

## Missing Pages (Based on Backend APIs)

### Authentication Pages
- ❌ `/login` - User login
- ❌ `/register` - User registration
- ❌ `/register/investor` - Investor registration
- ❌ `/register/producer` - Producer registration

### Producer Pages
- ❌ `/producer/dashboard` - Producer dashboard
- ❌ `/producer/film-plans` - List film plans
- ❌ `/producer/film-plans/new` - Create new film plan
- ❌ `/producer/film-plans/[id]` - Edit film plan
- ❌ `/producer/film-plans/[id]/documents` - Upload documents
- ❌ `/producer/settings` - Producer settings
- ❌ `/producer/payments` - Payment provider setup
- ❌ `/producer/banking` - Bank account management

### Investor Pages
- ❌ `/investor/dashboard` - Investor dashboard
- ❌ `/investor/portfolio` - Investment portfolio
- ❌ `/investor/investments` - Investment history
- ❌ `/investor/returns` - Returns tracking
- ❌ `/investor/kyc` - KYC verification
- ❌ `/investor/settings` - Investor settings
- ❌ `/investor/banking` - Bank account for returns

### Investment Pages
- ❌ `/invest/[id]` - Investment flow (referenced in movie detail page)
- ❌ `/invest/[id]/confirm` - Confirm investment
- ❌ `/invest/[id]/payment` - Payment processing

### Admin Pages
- ❌ `/admin/dashboard` - Admin dashboard
- ❌ `/admin/film-plans` - Review film plans
- ❌ `/admin/film-plans/[id]` - Film plan review detail
- ❌ `/admin/users` - User management
- ❌ `/admin/users/[id]` - User detail/verification
- ❌ `/admin/analytics` - Platform analytics
- ❌ `/admin/settings` - Platform settings

### Movie Pages (Role-Based Views)
- ❌ `/movies/[id]` - Movie page with role-based data
  - Investor view: Investment data, returns
  - Producer view: Funding progress, investor stats
  - Admin view: Full analytics
  - Public view: Basic stats

---

## Components Available

### Layout Components
- ✅ `Header.tsx` - Navigation header
- ✅ `Footer.tsx` - Footer
- ✅ `AlphaBanner.tsx` - Alpha version notice

### Content Components
- ✅ `Hero.tsx` - Hero section
- ✅ `Stats.tsx` - Platform statistics
- ✅ `Services.tsx` - Services section
- ✅ `MovieShowcase.tsx` - Featured movies
- ✅ `MovieCard.tsx` - Movie card component
- ✅ `HowItWorks.tsx` - How it works section
- ✅ `Testimonials.tsx` - Testimonials
- ✅ `GenreFilter.tsx` - Genre filter component

---

## Page Structure Summary

```
/
├── / (Home)
├── /opportunities
│   └── /[id] (Movie Detail)
├── /dashboard (Placeholder)
├── /about
└── /faq
```

---

## Recommended Next Steps

### Priority 1: Authentication Pages
1. **Login Page** (`/login`)
   - Email/password login
   - Link to register
   - Forgot password

2. **Register Pages**
   - `/register` - Role selection
   - `/register/investor` - Investor registration
   - `/register/producer` - Producer registration

### Priority 2: Role-Specific Dashboards
1. **Investor Dashboard** (`/investor/dashboard`)
   - Portfolio overview
   - Recent investments
   - Returns summary
   - Quick stats

2. **Producer Dashboard** (`/producer/dashboard`)
   - Film plans overview
   - Submission status
   - Funding progress
   - Quick actions

3. **Admin Dashboard** (`/admin/dashboard`)
   - Pending reviews
   - Platform stats
   - Recent activity
   - Quick actions

### Priority 3: Film Plan Management (Producer)
1. **Film Plans List** (`/producer/film-plans`)
   - All film plans with status
   - Filter by status
   - Create new button

2. **Create/Edit Film Plan** (`/producer/film-plans/new` or `/producer/film-plans/[id]`)
   - Form for all film plan fields
   - Save as draft
   - Submit for review
   - Upload documents

### Priority 4: Investment Flow
1. **Investment Page** (`/invest/[id]`)
   - Select number of lots
   - Calculate total amount
   - Review investment
   - Payment processing

### Priority 5: Admin Pages
1. **Film Plan Review** (`/admin/film-plans/[id]`)
   - View film plan details
   - Review documents
   - Approve/Reject actions
   - Add rejection reason

2. **User Management** (`/admin/users`)
   - List all users
   - Filter by role/status
   - Verify users
   - View user details

---

## Current UI Status

✅ **Completed:**
- Home page with all sections
- Movie listing page
- Movie detail page
- Basic navigation
- Reusable components

⚠️ **Placeholder:**
- Dashboard page

❌ **Missing:**
- All authentication pages
- All role-specific pages
- Film plan management
- Investment flow
- Admin pages

---

## Design System

The platform uses:
- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS
- **Design Style:** Minimalist, black/white with green accents
- **Typography:** Light font weights, clean spacing
- **Components:** Reusable, consistent styling

---

## Notes

1. The movie detail page references `/invest/[id]` which doesn't exist yet
2. Dashboard is just a placeholder
3. No authentication UI yet (login/register)
4. No role-based navigation or access control in UI
5. All pages currently use mock data from `lib/data.ts`
6. Need to integrate with backend APIs we created
