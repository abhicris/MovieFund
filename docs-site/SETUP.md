# Docusaurus Documentation Site Setup

## Quick Start

1. **Install Dependencies**
   ```bash
   cd docs-site
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   Opens `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
docs-site/
├── docs/              # Documentation markdown files
├── src/
│   └── css/          # Custom CSS
├── static/           # Static assets (images, etc.)
├── docusaurus.config.ts  # Main config
├── sidebars.ts       # Sidebar navigation
└── package.json
```

## Adding Documentation

1. Add markdown file to `docs/` directory
2. Add frontmatter:
   ```markdown
   ---
   sidebar_position: 1
   ---
   ```
3. Update `sidebars.ts` to include in navigation

## Configuration

### Update Base URL
Edit `docusaurus.config.ts`:
```typescript
baseUrl: '/docs/',  // or '/' if deploying to root domain
```

### Update Site URL
```typescript
url: 'https://docs.moviebitfund.kcolbchain.com',
```

### Customize Theme
Edit `src/css/custom.css` for custom styling.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Current Documentation Files

All documentation has been copied from the root directory:
- CEO_PRODUCT_ROADMAP.md
- BUSINESS_MODEL.md
- PLATFORM_PLAN.md
- MOVIE_OPERATIONS.md
- LEGAL_AGREEMENTS.md
- PARTNERSHIPS.md
- MARKETING_LAUNCH_PLAN.md
- DEV_ROADMAP.md
- DEMO_STATUS.md

## Next Steps

1. Install dependencies: `npm install`
2. Test locally: `npm start`
3. Deploy to Vercel/Netlify
4. Update main app Header link if needed
5. Add Investor Deck link to sidebars when ready









