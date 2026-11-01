// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://emilioarango.com",
  trailingSlash: "never",
  integrations: [sitemap()],
  // No Markdown content; disabling Shiki avoids its CSP-incompatible inline styles.
  markdown: { syntaxHighlight: false },
  security: {
    // Emits a per-page CSP <meta> with hashes for every inline script and
    // style, including the pre-paint theme script and the JSON-LD block.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "base-uri 'self'",
        "form-action 'none'",
        "object-src 'none'",
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
