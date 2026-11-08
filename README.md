# Emilio Arango — personal site

Personal site for Emilio Arango. Built with Astro and Tailwind CSS and deployed at [emilioarango.com](https://emilioarango.com).

The homepage centers on a name-and-knight composition with an interactive matte-black chess piece, plus compact résumé and contact sections. A fuller work overview lives on `/resume`. Copy lives in `src/config/index.ts`. Asset credits are in [CREDITS.md](CREDITS.md).

## Getting started

```bash
git clone https://github.com/emilioarango/personal-website.git
cd personal-website
pnpm install
```

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `pnpm install`      | Installs dependencies                       |
| `pnpm dev`          | Starts the dev server at `localhost:4321`   |
| `pnpm build`        | Type-checks and builds the site to `./dist` |
| `pnpm preview`      | Serves the production build locally         |
| `pnpm format`       | Formats the repo with Prettier              |
| `pnpm format:check` | Checks formatting                           |

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) (client-only knight scene)
- [TypeScript](https://www.typescriptlang.org/)

## License

MIT
