import type { MetadataRoute } from 'next';

// Same live-deploy URL used as metadataBase in src/app/layout.tsx — see
// that file's comment for sourcing (README.md + src/data/expConst.ts).
const baseUrl = 'https://vontrauwitz-portfolio.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
