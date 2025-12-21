# Documentation Site Setup - /docs Route

## ✅ No Separate Vercel Project Needed!

The Docusaurus documentation site is integrated into your main Next.js project and will be served at `/docs` on the same domain.

## How It Works

1. **Single Repository**: Everything is in one repo
2. **Single Deployment**: One Vercel project deploys both
3. **Single Domain**: Docs available at `moviebitfund.kcolbchain.com/docs`

## Build Process

When Vercel builds your project:

1. Runs `npm run build:all` (defined in root `package.json`)
2. Builds Docusaurus site in `docs-site/`
3. Copies build output to `public/docs/`
4. Builds Next.js app
5. Next.js serves static files from `public/` at `/docs` path

## Configuration

### Root `package.json`
- `build:docs` - Builds docs site and copies to public
- `build:all` - Builds docs then Next.js app

### `vercel.json`
- Uses `build:all` command
- No special rewrites needed (Next.js handles static files)

### `docusaurus.config.ts`
- `baseUrl: '/docs/'` - Correctly configured
- `url: 'https://moviebitfund.kcolbchain.com'` - Your domain

## Accessing Docs

After deployment:
- **Main docs**: `https://moviebitfund.kcolbchain.com/docs`
- **Individual pages**: `https://moviebitfund.kcolbchain.com/docs/CEO_PRODUCT_ROADMAP`

## Local Development

### Option 1: Docusaurus Dev Server (Recommended for docs editing)
```bash
cd docs-site
npm install
npm start
# Visit http://localhost:3000
```

### Option 2: Build and Test with Next.js
```bash
# Build docs
npm run build:docs

# Start Next.js
npm run dev
# Visit http://localhost:3000/docs
```

## Adding New Documentation

1. Add markdown file to `docs-site/docs/`
2. Add frontmatter:
   ```markdown
   ---
   sidebar_position: 1
   ---
   ```
3. Update `docs-site/sidebars.ts` to include in navigation
4. Commit and push - Vercel will rebuild automatically

## Updating Investor Deck Link

When your Gamma presentation is ready:

1. Edit `docs-site/sidebars.ts`
2. Update the Investor Deck link:
   ```typescript
   {
     type: 'link',
     label: 'Investor Deck',
     href: 'https://gamma.app/your-link',
   },
   ```
3. Commit and push

## Troubleshooting

### Docs not appearing after deployment

1. **Check build logs**: Ensure `build:all` completes successfully
2. **Verify public/docs exists**: Check that files are copied
3. **Check baseUrl**: Should be `/docs/` in `docusaurus.config.ts`
4. **Clear cache**: Try clearing Vercel cache and redeploying

### Local build issues

```bash
# Clean and rebuild
cd docs-site
rm -rf node_modules build
npm install
npm run build
cd ..
npm run build:docs
```

## File Structure

```
MovieFund/
├── docs-site/           # Docusaurus site
│   ├── docs/           # Documentation markdown files
│   ├── src/            # Custom CSS and components
│   └── docusaurus.config.ts
├── public/             # Next.js public directory
│   └── docs/           # Docusaurus build output (generated)
├── app/
│   └── docs/           # Next.js route (minimal, static files served)
└── package.json        # Build scripts
```

## Benefits

✅ **No separate project** - Everything in one place  
✅ **Single deployment** - One push, everything updates  
✅ **Same domain** - Professional, integrated experience  
✅ **Easy maintenance** - All docs in one repo  
✅ **Automatic builds** - Vercel handles everything  

---

*Last Updated: December 2025*
