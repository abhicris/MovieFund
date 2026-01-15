#!/bin/bash
# Build Docusaurus docs site
cd docs-site
npm install
npm run build
cd ..

# Copy build output to public/docs for Next.js to serve
mkdir -p public/docs
cp -r docs-site/build/* public/docs/









