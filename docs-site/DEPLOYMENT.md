# Docusaurus Documentation Site Deployment

## Option 1: Deploy as Separate Vercel Project (Recommended)

1. Create a new Vercel project for the docs site
2. Connect the `docs-site` directory
3. Configure:
   - **Root Directory**: `docs-site`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
4. Set custom domain: `docs.moviebitfund.kcolbchain.com`

## Option 2: Deploy as Subdirectory (Monorepo)

1. Update `vercel.json` in root:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    },
    {
      "src": "docs-site/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/docs/(.*)",
      "dest": "/docs-site/$1"
    }
  ]
}
```

2. Update `docs-site/docusaurus.config.ts`:
```typescript
baseUrl: '/docs/',
```

## Option 3: Deploy to Netlify

1. Create `netlify.toml`:
```toml
[build]
  base = "docs-site"
  command = "npm install && npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Connect to Netlify and deploy

## Local Development

```bash
cd docs-site
npm install
npm start
```

Visit `http://localhost:3000` to see the docs site.

## Adding New Documentation

1. Add markdown files to `docs-site/docs/`
2. Update `docs-site/sidebars.ts` to include new files
3. Add frontmatter to markdown files:
```markdown
---
sidebar_position: 1
---
```

## Updating Investor Deck Link

Edit `docs-site/sidebars.ts` and update the Investor Deck link:
```typescript
{
  type: 'link',
  label: 'Investor Deck',
  href: 'https://gamma.app/your-link',
},
```
