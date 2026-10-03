import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // the icon barrel is huge; import only the glyphs actually used
    optimizePackageImports: ['@phosphor-icons/react'],
  },
};

export default withNextIntl(nextConfig);
