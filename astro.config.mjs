// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://your-domain.pages.dev', // デプロイ後にCloudflare PagesのURLに変更
});
