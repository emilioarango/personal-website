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
    // Emits a per-page CSP <meta> (hashes + directives below). vercel.json
    // also sets an HTTP CSP; browsers enforce both (AND).
    //
    // vercel.json script-src keeps 'unsafe-inline' only for the pre-paint
    // theme bootstrap (classic is:inline). Static hosting cannot put
    // per-build hashes into vercel.json. style-src stays 'self' only — no
    // 'unsafe-inline' for styles. Client modules are externalized (see
    // vite.build.assetsInlineLimit) so they use script-src 'self'.
    // va.vercel-scripts.com covers Analytics/Speed Insights debug builds;
    // production loads /_vercel/* (same-origin).
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://va.vercel-scripts.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "frame-src 'none'",
        "worker-src 'none'",
      ],
      // resources overrides Astro defaults — keep 'self' explicitly.
      scriptDirective: {
        resources: ["'self'", "https://va.vercel-scripts.com"],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Keep page scripts as /_astro/*.js so HTTP CSP can use script-src
    // 'self' without hashing inlined module bodies in vercel.json.
    build: { assetsInlineLimit: 0 },
  },
});
