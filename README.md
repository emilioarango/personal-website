# Emilio Arango — personal site

Personal site for Emilio Arango. Built with Astro and Tailwind CSS and deployed at [emilioarango.com](https://emilioarango.com).

The homepage is about him. Work history is only on `/resume`. Copy lives in `src/config/index.ts`. Add a project by appending an object to `PROJECTS`; empty slots are not shown. Search that file for `resume.todo` before publishing. Photograph credits are in [CREDITS.md](CREDITS.md).

## Getting started

```bash
git clone https://github.com/emilioarango/personal-website.git
cd personal-website
pnpm install
```

| Command        | Action                                      |
| :------------- | :------------------------------------------ |
| `pnpm install` | Installs dependencies                       |
| `pnpm dev`     | Starts the dev server at `localhost:4321`   |
| `pnpm build`   | Type-checks and builds the site to `./dist` |
| `pnpm preview` | Serves the production build locally         |

## Stack

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

MIT
