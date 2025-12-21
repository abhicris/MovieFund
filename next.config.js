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
      {
        source: '/docs/:path*',
        destination: '/docs/:path*',
      },
    ];
  },
}

module.exports = nextConfig
