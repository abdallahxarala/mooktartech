import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    ppr: false,
    turbo: {
      root: process.cwd(),
    },
  },
  images: {
    domains: ['placehold.co', 'placeholder.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  typescript: {
    // !! ATTENTION !!
    // Ignore les erreurs TypeScript en développement
    // À CORRIGER plus tard
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore les erreurs ESLint en développement
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);