// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",

  // デプロイ後にCloudflare PagesのURLに変更
  site: 'https://your-domain.pages.dev',

  adapter: cloudflare()
});