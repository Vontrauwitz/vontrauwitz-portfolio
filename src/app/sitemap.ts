import type { MetadataRoute } from 'next';

// Same live-deploy URL used as metadataBase in src/app/layout.tsx — see
// that file's comment for sourcing (README.md + src/data/expConst.ts).
const baseUrl = 'https://vontrauwitz-portfolio.vercel.app';

const routes = ['', '/about', '/projects', '/certificates', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
