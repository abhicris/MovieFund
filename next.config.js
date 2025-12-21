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
      // Handle Docusaurus clean URLs
      // For routes like /docs/PageName, serve /docs/PageName/index.html
      // Only apply to paths that don't already have a file extension
      {
        source: '/docs/:path((?!.*\\.[^/]+$).*)',
        destination: '/docs/:path/index.html',
      },
    ];
  },
}

module.exports = nextConfig
