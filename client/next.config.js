/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.samsung.com',
      },
      {
        protocol: 'https',
        hostname: 'gscs.lge.com',
      },
      {
        protocol: 'https',
        hostname: 'product-images.whirlpool.com',
      },
      {
        protocol: 'https',
        hostname: 'kitchenaid-h.assetsadobe.com',
      },
      {
        protocol: 'https',
        hostname: 'ninjakitchen.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
  experimental: {
    // Using Pages Router
  },
};

module.exports = nextConfig; 