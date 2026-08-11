import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Published to GitHub Pages at https://mihirbpi.github.io/Proof-Ladder/, so the
// site lives under a path rather than at a domain root. Every internal link
// goes through `withBase` in src/lib/content.ts, which reads import.meta.env
// .BASE_URL — "/" under `pnpm dev`, "/Proof-Ladder/" in the built site. A link
// written as a bare "/about/" works locally and 404s once deployed.
//
// `base` is deliberately hardcoded rather than read from an env var: the whole
// point is that dev and production differ, and a build that silently picked up
// the wrong prefix would produce a site whose every link is broken.

export default defineConfig({
  site: 'https://mihirbpi.github.io',
  base: '/Proof-Ladder',
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

