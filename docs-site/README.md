# MovieFund Documentation Site

This is the Docusaurus documentation site for MovieFund.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The site can be deployed to Vercel, Netlify, or any static hosting service.

For Vercel:
1. Connect the repository
2. Set build command: `cd docs-site && npm install && npm run build`
3. Set output directory: `docs-site/build`
4. Set base path: `/docs`
