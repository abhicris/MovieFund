# Docusaurus Documentation Site Deployment

## Integrated Deployment (Same Vercel Project)

The docs site is now integrated into the main Next.js project and will be deployed together.

### How It Works

1. **Build Process**: When Vercel builds your project, it runs `npm run build:all`
2. **Docs Build**: This builds the Docusaurus site in `docs-site/`
3. **Copy to Public**: The build output is copied to `public/docs/`
4. **Serving**: Next.js automatically serves static files from `public/` at the `/docs` path

### No Separate Project Needed

✅ **You do NOT need a separate Vercel project**  
✅ Everything is in one repository  
✅ One deployment, one domain  

### Build Commands

The root `package.json` includes:
- `build:docs` - Builds only the docs site
- `build:all` - Builds docs then Next.js app

Vercel uses `build:all` automatically.

### Accessing Docs

Once deployed, visit:
- `https://moviebitfund.kcolbchain.com/docs` - Main docs page
- `https://moviebitfund.kcolbchain.com/docs/CEO_PRODUCT_ROADMAP` - Individual docs

### Local Development

```bash
# Build and serve docs locally
cd docs-site
npm install
npm start
# Visit http://localhost:3000

# Or build and copy to public for Next.js
npm run build:docs
npm run dev
# Visit http://localhost:3000/docs
```

### Troubleshooting

If docs don't appear:
1. Check that `public/docs/` exists after build
2. Verify `baseUrl: '/docs/'` in `docusaurus.config.ts`
3. Check Vercel build logs for errors
4. Ensure `build:all` script runs successfully









