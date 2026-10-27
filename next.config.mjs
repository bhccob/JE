/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The legacy static site still lives in /pages and /assets; keep Next from treating it as routes or lint targets.
  pageExtensions: ['tsx', 'ts'],
  eslint: { dirs: ['app', 'components', 'lib'] },
  transpilePackages: ['three'],
  // Lets a second dev server run beside the first without sharing (and corrupting) one build folder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // A concept build (lib/store.ts CONCEPT) keeps every file out of search engines, the film's frames and photos included.
  async headers() {
    if (process.env.NEXT_PUBLIC_OFFICIAL_SITE === '1') return [];
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default nextConfig;
