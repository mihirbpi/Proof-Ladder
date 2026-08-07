import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// For local dev we leave `site` and `base` unset so `pnpm dev` and `pnpm preview`
// serve at the root. When we're ready to publish to GitHub Pages, set these
// (via env or hardcode) and update internal links to use import.meta.env.BASE_URL.


export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { output: 'htmlAndMathml' }]],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { output: 'htmlAndMathml' }]],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
});

