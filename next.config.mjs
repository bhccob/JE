import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The legacy static site still lives in /pages and /assets; keep Next from treating it as routes or lint targets.
  pageExtensions: ['tsx', 'ts'],
  eslint: { dirs: ['app', 'components', 'lib', 'content', 'i18n'] },
  transpilePackages: ['three'],
};

export default withNextIntl(nextConfig);
