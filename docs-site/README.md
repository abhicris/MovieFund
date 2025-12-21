# MovieFund Documentation Site

This is the Docusaurus documentation site for MovieFund. It provides a professional, searchable documentation experience for all MovieFund documentation.

## Features

- 📚 Organized documentation with sidebar navigation
- 🔍 Built-in search (can be enhanced with Algolia)
- 📱 Mobile-responsive design
- 🌙 Dark mode support
- ⚡ Fast static site generation
- 🔗 Easy linking between documents

## Quick Start

### Installation

```bash
cd docs-site
npm install
```

### Development

```bash
npm start
```

This starts a local development server at `http://localhost:3000`

### Build

```bash
npm run build
```

Generates static files in the `build/` directory.

## Documentation Structure

All documentation is organized into categories:

- **Business & Strategy**: CEO roadmap, business model, platform plan
- **Operations**: Movie operations, legal agreements, partnerships
- **Marketing & Launch**: Marketing strategy and launch plans
- **Development**: Developer roadmap, demo status

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Create new Vercel project
2. Set root directory to `docs-site`
3. Build command: `npm install && npm run build`
4. Output directory: `build`
5. Deploy!

## Configuration

- **Config**: `docusaurus.config.ts`
- **Sidebar**: `sidebars.ts`
- **Styling**: `src/css/custom.css`

## Adding New Docs

1. Add markdown file to `docs/` directory
2. Add frontmatter with `sidebar_position`
3. Update `sidebars.ts` to include in navigation

## Updating Investor Deck

When your Gamma presentation is ready, update `sidebars.ts`:

```typescript
{
  type: 'link',
  label: 'Investor Deck',
  href: 'https://gamma.app/your-link',
},
```

---

*Built with [Docusaurus](https://docusaurus.io/)*
