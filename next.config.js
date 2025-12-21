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
      // Handle Docusaurus clean URLs - serve index.html for directory routes
      // Matches /docs/PageName (no extension) and serves /docs/PageName/index.html
      {
        source: '/docs/:path*',
        destination: '/docs/:path*/index.html',
      },
    ];
  },
}

module.exports = nextConfig
