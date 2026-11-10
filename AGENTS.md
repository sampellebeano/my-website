# Repository Guidelines

## Project Structure & Module Organization

This React/TypeScript site uses Vite and hash routes in `src/App.tsx`. Views live in `src/pages/`; shared components in `src/components/`, including Radix/shadcn primitives in `ui/`. `src/data/` holds CV and project records; `src/lib/` handles validation and search. `content/` contains public JSON. `public/` holds static assets, CV files, snapshots and bassh releases. Tests live in `tests/`; publishing rules are in `docs/atlas-publishing.md`.

## Build, Test, and Development Commands

Use Node.js 22.6+ and the npm lockfile.

- `npm ci --include=dev`: install locked dependencies.
- `npm run dev`: start Vite on port 8080.
- `npm test`: run regression tests.
- `npm run validate:content`: validate JSON schemas and references.
- `npx tsc --noEmit -p tsconfig.app.json`: check application types.
- `npm run lint`: run ESLint.
- `npm run build -- --outDir /private/tmp/my-website-review-1`: validate content and build production assets.
- `npm run preview -- --outDir /private/tmp/my-website-review-1`: serve that build.

Choose a fresh output directory per review. Historical `dist` and dependency files are tracked; exclude generated changes from commits.

## Coding Style & Naming Conventions

Match surrounding code: two-space indentation, semicolons and double quotes in application TypeScript. Use PascalCase component filenames (`Projects.tsx`), camelCase functions, and kebab-case utility filenames. Use `@/` imports for `src/` and existing CSS/Tailwind conventions. ESLint checks TypeScript, React Hooks and Fast Refresh; no Prettier configuration exists.

## Testing Guidelines

Use `node:test` and `node:assert/strict` in `tests/<feature>.test.mjs`, with descriptive behavior names and reusable `tests/fixtures.mjs`. Add focused regressions for changed behavior; no numeric coverage threshold is configured. Run one suite with `node --experimental-strip-types --test tests/public-search.test.mjs`. CI runs tests, type checking and a production build. For UI changes, check mobile overflow, keyboard navigation, hash-route reloads and downloads.

## Commit & Pull Request Guidelines

Recent history uses `feat:`, `fix:` and `docs:` with concise imperative subjects, such as `fix: validate literal public hash routes`. Keep commits focused. PRs should explain behavior changes, link related issues, report verification results and include screenshots for visual changes.

## Public Content & Artifact Safety

Publish approved facts only; keep secrets and private drafts outside the repository. Preserve stable record IDs and truthful empty states. Keep personal projects separate from career highlights. Preserve dated snapshots and existing versioned release bytes; add new release directories and verify checksums.
