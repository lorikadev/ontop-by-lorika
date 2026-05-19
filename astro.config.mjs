// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  site:'https://www.lorikacover.com',
  integrations: [
    sanity({
      projectId: "ta37clzz",
      dataset: "production",
      apiVersion: '2026-04-02',
      useCdn: false, // for static builds
    }),
    sitemap()
  ]
});