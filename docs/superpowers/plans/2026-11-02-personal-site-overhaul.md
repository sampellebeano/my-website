# Personal Site Overhaul Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for independent feature slices and one fresh integration review. Work continuously through the authorized reversible local implementation.

**Goal:** Build an individual personal site with a growing app launcher and an authentic website-development archive.

**Architecture:** Preserve the actual pre-overhaul working source in an isolated baseline, then extend its existing records/components. One launcher consumes every app record; a dedicated history route consumes version metadata. The homepage introduces Sam and presents projects, professional context and history as distinct sections.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3, node:test. No new dependencies or services.

**Spec:** `docs/superpowers/specs/2026-11-02-personal-site-overhaul-design.md`.

## Global Constraints

- Preserve the dirty canonical checkout and existing `AGENTS.md`; integrate only exact files whose frozen original hashes still match.
- Preserve the October snapshot bytes and URL; never restore withdrawn images, installers or Word downloads.
- RYW must appear without a fabricated recording or icon.
- Preserve existing routes, public facts and explicit playback/reduced-motion behavior.
- All work remains local; no deployment, push, release or installation.

## Review Focus

- No-media app records remain visible and usable.
- More apps than fit on the phone remain reachable without overlapping its footer.
- Old version records still validate and saved versions use their own assets.
- New history links are validated and search leaves CV section behavior intact.
- Mobile/keyboard use remains readable and ordinary site navigation stays outside the phone.

## Design tokens and signature

Palette: graphite `#15191f`, slate surface `#1e242d`, paper text `#f0f3f7`, muted steel `#aeb8c5`, divider `#394351`, ice-blue accent `#9abfff`. Display: restrained system sans with large tightly tracked name treatment; body: system sans; utility: system monospace. The signature is the juxtaposition of a real app collection in one iPhone and genuine old websites in browser previews, within a personal introduction. Keep motion purposeful. Avoid decorative statistics or repeated card grids.

## Task 1: Freeze and preserve the present edition (root)

- [x] Run the existing baseline tests and build into a fresh external directory before changing product code.
- [x] Prepare an independently rooted snapshot in `public/history/2026-11-02/`, exclude prior history/installers/Word files and repair root-relative paths during creation.
- [x] Record checksums and a working-source manifest; identify the dirty source honestly rather than claiming HEAD is exact.
- [x] Verify all archived HTML/CSS/JS local references and preserve October checksums.

## Task 2: Growing app launcher (showcase agent)

Files: `src/components/IPhoneShowcase.tsx`, `src/components/iphone-showcase.css`, `src/data/projects.ts`, `src/pages/Projects.tsx`, focused launcher tests.

Interfaces: retain exported `IPhoneShowcase`; optional props may accept fixture projects. Keep `projects` as the source. Do not edit global CSS, Index, history/schema/search, routing, or shared render fixture.

- [x] Add focused regressions for all three launcher records and a no-media RYW view; run red.
- [x] Implement all-record launcher, typographic missing-icon fallback, readable project directory and selectable app state; keep conventional title links.
- [x] Use a scrollable launcher area, focus restoration, Escape/Home, explicit playback and reduced-motion states.
- [x] Run focused checks and report exact files changed and limitations.

## Task 3: Site history (archive agent)

Files: `src/lib/public-content.ts`, `src/lib/public-search.ts`, `src/pages/SiteHistory.tsx`, `src/components/PreviousVersions.tsx`, `src/pages/SearchResults.tsx`, focused content/search/history tests. Metadata `content/site-versions.json` is root-owned during snapshot creation; send any needed record changes to root.

Interfaces: export default `SiteHistory`; route `/history`; version source in search. Optional version fields `summary`, `notes`, `preview`; optional provenance explicitly distinguishes exact revisions from working-tree captures. Existing metadata must validate unchanged. Root owns App/nav/global CSS/render fixtures.

- [x] Add failing contracts for backward compatibility, metadata/path safety, history route and version search while preserving CV filters.
- [x] Implement metadata support, history view and supporting compact archive link.
- [x] Current edition stays distinct from preserved versions; archived notes remain factual.
- [x] Run focused tests, and report the exact fixture/routing/CSS integration needed.

## Task 4: Broader personal composition (root)

Files: `src/pages/Index.tsx`, `src/components/SiteShell.tsx`, `src/components/SiteNavigation.tsx`, `src/index.css`, `src/App.tsx`, `src/components/RouteScroll.tsx`, `tests/render-site.mjs`, affected view tests.

- [x] Add/update focused render assertions for the new homepage identity, project section and history navigation; retain deep-link records.
- [x] Implement a top navigation and identity-led overview with the phone only in its projects section, concise professional context, and visible site-history introduction.
- [x] Integrate `/history` and archive search entry navigation; show Updates/Books navigation when populated.
- [x] Update obsolete two-autoplay-phone assertions to verify a single lazy launcher.

## Task 5: Review and integrate (root + fresh reviewer)

- [x] Run `npm test`, content validation, application type check, focused lint and a fresh production build. Resolve failures caused by this work.
- [x] Verify preservation hashes, snapshot references, data-driven larger project fixture and public-download exclusions.
- [x] Request fresh code/spec review; address material findings.
- [x] Compare every modified canonical file against its frozen baseline before exact-file integration. Do not reset or stage other work.
- [x] Report local source/check results separately from visual browser acceptance and publication.

Ruling: Build a reversible local review version from the clarified user request without a further permission round; publishing remains outside this task. The isolated baseline preserves all original source for review and rollback.

## Local review result

91 regression tests, public-content validation, application type checking, scoped ESLint and the production build pass. The independent review found an archive metadata rewrite defect and missing introductory CV access; both were fixed and rechecked. Eight preview HTTP routes and three existing download redirects pass. The October archive is unchanged. Reviewed files were integrated only after their originals matched the frozen baseline.

Desktop/mobile visual and browser interaction acceptance remains pending because local browser use is disabled in Work settings. The production build is available locally at http://127.0.0.1:8082/ with the existing hosting rewrites and redirects applied. No publishing or Git push occurred.
