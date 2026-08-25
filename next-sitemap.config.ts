import type { IConfig } from 'next-sitemap';

const config: IConfig = {
  siteUrl: 'https://thiago-lab.vercel.app',
  generateRobotsTxt: false, // we serve robots.txt from app route
  outDir: './public',
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
};

export default config;
