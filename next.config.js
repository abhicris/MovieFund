/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      // Handle Docusaurus clean URLs (without .html extension)
      // Docusaurus generates /docs/PageName/index.html for /docs/PageName routes
      {
        source: '/docs/:path*',
        destination: '/docs/:path*/index.html',
      },
    ];
  },
}

module.exports = nextConfig
