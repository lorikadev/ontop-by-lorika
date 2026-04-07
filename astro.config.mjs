// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: "ta37clzz",
      dataset: "production",
      apiVersion: '2026-04-02',
      useCdn: false, // for static builds
    }),
  ]
});