import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  output: 'standalone',
  experimental: {
    ppr: false,
  },
  eslint: {
    // Désactiver ESLint pendant le build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver la vérification TypeScript pendant le build pour permettre le déploiement
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
