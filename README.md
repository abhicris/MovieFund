# MovieFund - Fractional Movie Investment Platform

A modern alternative investment platform for fractional ownership of movies. Investors can purchase lots in films (each lot represents 0.1% of the movie's budget) and earn returns from box office, streaming, and distribution revenue.

## Features

- **Movie Listings**: Browse available investment opportunities with detailed film information
- **Fractional Investment**: Invest in movies by purchasing lots (each lot = 0.1% of budget, 1000 lots per movie)
- **Returns Tracking**: View projected returns and track investment performance
- **Real-time Availability**: See available lots and investment status
- **Investment Dashboard**: Manage your portfolio and track returns
- **Genre Filtering**: Filter movies by genre, language, and status
- **Revenue Projections**: Detailed breakdown of box office, streaming, and distribution revenue

## Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Charts**: Recharts for data visualization

## Current Status: Alpha Demo Version

This is a **refined demo version** with:
- ✅ Fully functional frontend
- ✅ Mock movie data (12 real movies)
- ✅ Working build and deployment
- ⏳ Backend and database (to be built later)
- ⏳ Movie submission system (to be built later)
- ⏳ Approval workflow (to be built later)

See [DEMO_STATUS.md](./DEMO_STATUS.md) for details.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: The platform works perfectly fine without TMDB API key - it will use mock data. TMDB integration is optional for enhanced movie information and images.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
MovieFund/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── opportunities/     # Movie opportunities pages
│       ├── page.tsx       # Opportunities listing
│       └── [id]/          # Individual movie detail pages
├── components/            # React components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Footer component
│   ├── Hero.tsx          # Hero section
│   ├── Stats.tsx         # Platform statistics
│   ├── MovieCard.tsx     # Movie card component
│   ├── MovieShowcase.tsx # Featured movies section
│   ├── GenreFilter.tsx   # Genre filtering component
│   ├── HowItWorks.tsx    # How it works section
│   ├── Services.tsx      # Services/features section
│   └── Testimonials.tsx  # Testimonials section
├── types/                # TypeScript type definitions
│   └── index.ts
├── lib/                  # Utility functions and data
│   └── data.ts           # Mock data and helpers
└── README.md
```

## Key Pages

- `/` - Landing page with hero, stats, and featured movies
- `/opportunities` - Browse all investment opportunities
- `/opportunities/[id]` - Movie detail page with investment information
- `/dashboard` - User investment dashboard (to be implemented)
- `/invest/[id]` - Investment flow (to be implemented)

## Data Models

### Movie
- Movie details (title, director, producer, cast, genre, language)
- Investment details (price per lot, total lots: 1000, available lots)
- Revenue projections (box office, streaming, distribution)
- Returns projection (year 1-5)
- Status (pre-production, production, post-production, completed, released, fully_funded)

### Investment
- User investment records
- Lot ownership (each lot = 0.1% of movie budget)
- Returns earned
- Payment status

## Key Features

### Fractional Investment
Investors can purchase lots in movies (each lot represents 0.1% of the total budget). Each movie has 1000 lots available, and investors can purchase multiple lots based on their investment capacity.

### Revenue Sources
Returns are generated from multiple revenue streams:
- **Box Office**: Theatrical release revenue
- **Streaming**: OTT platform licensing deals
- **Distribution**: International and home video distribution

### Investment Tracking
Track your investments through the entire movie lifecycle:
- Pre-production
- Production
- Post-production
- Release
- Returns distribution

## Next Steps

1. ✅ Project setup and basic structure
2. ✅ Landing page with hero and stats
3. ✅ Movie listing page
4. ✅ Movie detail page with investment information
5. ⏳ User authentication
6. ⏳ Investment processing and payment integration
7. ⏳ User dashboard
8. ⏳ Returns calculation and distribution
9. ⏳ Admin panel for movie management
10. ⏳ Revenue tracking and reporting

## License

ISC
