# Platform Planning Document

## Overview

MovieFund is a fractional movie investment platform that enables individuals to invest in films and earn returns from box office, streaming, and distribution revenue.

---

## Platform Features

### Core Features

1. **Movie Listings**
   - Browse available investment opportunities
   - Filter by genre, language, status, budget
   - Detailed movie information pages
   - Revenue projections and returns estimates

2. **Investment Flow**
   - Share purchase interface
   - Investment amount selection
   - Payment processing
   - Investment confirmation

3. **User Dashboard**
   - Portfolio overview
   - Investment history
   - Returns tracking
   - Revenue breakdown by source

4. **Movie Tracking**
   - Production status updates
   - Release date tracking
   - Box office performance
   - Streaming and distribution updates

5. **Returns Management**
   - Returns calculation
   - Distribution to investors
   - Returns history
   - Tax documentation

### Advanced Features (Future)

1. **Secondary Market**
   - Buy/sell shares before movie release
   - Share price discovery
   - Trading interface

2. **Analytics & Insights**
   - Portfolio performance analysis
   - Genre performance trends
   - Director/cast success rates
   - Market insights

3. **Social Features**
   - Investor community
   - Movie discussions
   - Reviews and ratings

4. **Notifications**
   - Investment updates
   - Returns notifications
   - Movie release alerts
   - Production updates

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks / Context API
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Validation**: Zod

### Backend (Future)
- **Framework**: Next.js API Routes / Node.js
- **Database**: PostgreSQL / MongoDB
- **Authentication**: NextAuth.js / Auth0
- **Payment**: Razorpay / Stripe
- **File Storage**: AWS S3 / Cloudinary
- **Email**: SendGrid / Resend

### Infrastructure
- **Hosting**: Vercel / AWS
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Google Analytics / Mixpanel

---

## Data Models

### Movie
```typescript
{
  id: string
  title: string
  tagline?: string
  director: string
  producer: string
  productionCompany: string
  genre: MovieGenre[]
  language: MovieLanguage
  budget: number
  totalShares: number
  availableShares: number
  pricePerShare: number
  projectedROI: number
  images: string[]
  poster: string
  description: string
  cast: string[]
  releaseDate: Date
  status: MovieStatus
  revenueProjection: {
    boxOffice: number
    streaming: number
    distribution: number
    total: number
  }
  returnsProjection: {
    year1: number
    year2: number
    year3: number
    year4: number
    year5: number
  }
  minimumInvestment: number
  maximumInvestment?: number
  createdAt: Date
  updatedAt: Date
}
```

### Investment
```typescript
{
  id: string
  userId: string
  movieId: string
  shares: number
  totalAmount: number
  status: InvestmentStatus
  reservedAt: Date
  confirmedAt?: Date
  returnsEarned: number
  paymentId?: string
}
```

### User
```typescript
{
  id: string
  email: string
  name: string
  phone: string
  investments: Investment[]
  totalInvested: number
  totalReturns: number
  createdAt: Date
}
```

### Returns
```typescript
{
  id: string
  investmentId: string
  amount: number
  period: string
  source: RevenueSource
  paidAt: Date
  status: ReturnsStatus
}
```

---

## Key Pages & Routes

### Public Pages
- `/` - Landing page
- `/opportunities` - Movie listings
- `/opportunities/[id]` - Movie detail page
- `/about` - About page
- `/faq` - FAQ page
- `/terms` - Terms of service
- `/privacy` - Privacy policy

### Authenticated Pages
- `/dashboard` - User dashboard
- `/invest/[id]` - Investment flow
- `/investments` - Investment history
- `/returns` - Returns history
- `/profile` - User profile
- `/settings` - Account settings

### Admin Pages (Future)
- `/admin/movies` - Movie management
- `/admin/investments` - Investment management
- `/admin/returns` - Returns management
- `/admin/users` - User management
- `/admin/analytics` - Platform analytics

---

## Design Considerations

### Design System
- **Colors**: Black, white, green accent
- **Typography**: Clean, minimal, light font weights
- **Layout**: Grid-based, spacious
- **Components**: Border-heavy, card-based design
- **Interactions**: Subtle hover effects, smooth transitions

### User Experience
- **Simplicity**: Clean, uncluttered interface
- **Clarity**: Clear information hierarchy
- **Transparency**: Visible investment details
- **Trust**: Professional, credible design
- **Accessibility**: WCAG compliant

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized images

---

## Security & Compliance

### Security Measures
- HTTPS encryption
- Secure authentication
- Payment security (PCI compliance)
- Data encryption at rest
- Regular security audits
- Input validation and sanitization

### Compliance
- KYC/AML compliance
- Financial regulations
- Data protection (GDPR, etc.)
- Terms of service
- Privacy policy
- Risk disclosures

---

## Development Roadmap

### Phase 1: MVP (Current)
- ✅ Project setup
- ✅ Landing page
- ✅ Movie listings
- ✅ Movie detail pages
- ✅ Basic components

### Phase 2: Core Features
- ⏳ User authentication
- ⏳ Investment flow
- ⏳ Payment integration
- ⏳ User dashboard
- ⏳ Investment tracking

### Phase 3: Advanced Features
- ⏳ Returns calculation
- ⏳ Returns distribution
- ⏳ Email notifications
- ⏳ Admin panel
- ⏳ Analytics

### Phase 4: Enhancements
- ⏳ Secondary market
- ⏳ Advanced analytics
- ⏳ Mobile app
- ⏳ Social features
- ⏳ API integrations

---

## Key Metrics to Track

### Platform Metrics
- Total movies listed
- Total capital raised
- Number of investors
- Average investment size
- Platform conversion rate

### Movie Metrics
- Funding progress
- Time to fully funded
- Box office performance
- Streaming revenue
- Distribution revenue
- Actual vs projected ROI

### User Metrics
- User registrations
- Active users
- Investment frequency
- Average portfolio size
- User retention rate

---

*Last Updated: December 2025*
