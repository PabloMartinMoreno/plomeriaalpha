// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const SITE = process.env.SITE_URL ?? 'https://plomeriaalpha.com.ar';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  prefetch: { prefetchAll: false, defaultStrategy: 'viewport' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon({ include: { lucide: ['*'], logos: ['whatsapp-icon'] } }),
    sitemap({
      serialize(item) {
        const u = new URL(item.url);
        const p = u.pathname.replace(/\/$/, '') || '/';
        if (p === '/') Object.assign(item, { priority: 1.0, changefreq: 'weekly' });
        else if (p === '/servicios' || p === '/zonas') Object.assign(item, { priority: 0.9, changefreq: 'weekly' });
        else if (/^\/servicios\/[^/]+$/.test(p)) Object.assign(item, { priority: 0.8, changefreq: 'monthly' });
        else if (/^\/zonas\/[^/]+$/.test(p)) Object.assign(item, { priority: 0.8, changefreq: 'monthly' });
        else if (/^\/servicios\/[^/]+\/[^/]+$/.test(p)) Object.assign(item, { priority: 0.6, changefreq: 'monthly' });
        else if (p === '/contacto') Object.assign(item, { priority: 0.7, changefreq: 'monthly' });
        else if (p === '/privacidad' || p === '/gracias') Object.assign(item, { priority: 0.2, changefreq: 'yearly' });
        return item;
      },
    }),
  ],
});
