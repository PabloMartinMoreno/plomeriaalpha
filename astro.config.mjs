// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const SITE = process.env.SITE_URL ?? 'https://plomerojonatanreyes.com.ar';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  prefetch: { prefetchAll: true },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon({ include: { lucide: ['*'], logos: ['whatsapp-icon'] } }),
    sitemap(),
  ],
});
