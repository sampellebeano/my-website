# Single-screen personal site implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Preserve the current edition and build the approved warm single-screen personal site with a right-hand app launcher.

**Architecture:** Retain React/Vite/hash routes and existing public data. Shared shell handles framing; home, project index and project details share the same split composition. The phone accepts a selected project and navigation callbacks; careers and archives select one record through query links.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3, node:test. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-03-single-screen-design.md`

## Global constraints

- Preserve unrelated dirty work, dated snapshots, release bytes, public facts and download restrictions.
- Keep RYW text-only; no synthetic notch/island over captures.
- No deployment or Git staging/commits in this task.
- Natural overflow is allowed for small/short screens and text enlargement; no clipped content or nested description scrolling.

## Review focus

- Unknown project IDs must produce a useful return path.
- Direct app, role/highlight and archive links must survive reload/back.
- Enlarged text must remain reachable, including the phone controls and footer.
- Reduced motion starts the selected app paused; no other GIF is mounted.
- Saved edition assets and manifests must remain self-contained and truthful.

### Task 1: Preserve the graphite edition

**Files:** new `public/history/2026-11-03-graphite/`, `content/site-versions.json`.
**Interfaces:** emits canonical edition metadata consumed by History; source frozen before other tasks begin.

- [x] Freeze source; build the frozen copy to fresh external output.
- [x] Capture edition with existing capture script and add returned record.
- [x] Verify source/build digest, asset references and historical immutability.

### Task 2: Compact reusable phone

**Files:** `src/components/IPhoneShowcase.tsx`, `iphone-showcase.css`, `tests/iphone-showcase.test.mjs`.
**Interfaces:** optional `projects`, `selectedId`, `onSelectProject(project)`, `onHome()`; only renders device/controls/status.

- [x] Write and run failing controlled-selection, media-isolation and app-pagination SSR checks.
- [x] Implement reusable device with callback navigation, no scrollIntoView, accessible controls and reduced motion.
- [x] Run the focused phone suite.

### Task 3: Shell, home and projects

**Files:** shell/navigation, Index/Projects/new ProjectOverview, App/routes, new single-screen CSS, SSR fixture and focused view tests.
**Interfaces:** project routes `/projects/:projectId`, project collection component receives optional selected ID; phone contract from Task 2.

- [x] Write and run failing homepage/detail-route/pagination regressions.
- [x] Implement paper shell, intro/project rows and matching app overview; split long description into two paragraphs per page.
- [x] Keep direct CV/contact/history access and existing public document routes.
- [x] Run focused tests, types and lint for changed source.

### Task 4: Compact career/history views

**Files:** Experience/SiteHistory, collection-view stylesheet and their tests.
**Interfaces:** `?entry=` selects a role/highlight/edition with valid fallback.

- [x] Write/run failing record-selection tests.
- [x] Implement all-record indexes and one selected detail.
- [x] Run focused collection tests.

### Task 5: Integrate and review

- [x] Reconcile view regressions that intentionally depended on the former stacked homepage.
- [x] Run impacted suites, content validation, application types, focused lint and production build to fresh external output.
- [x] Request independent review and resolve material findings.
- [x] Verify built asset/archive/PDF links over local HTTP; hash-route page content verified by SSR tests. Supported browser tool reports browser disabled; rendered reload/keyboard/layout review remains unverified.
- [x] Record browser limitations separately from automated evidence and provide local preview.

Pre-flight: Task 1 freezes source before Tasks 2–4 mutate. Task 2's explicit phone prop contract is consumed by Task 3. Task 4 uses the theme variables supplied by Task 3 and edition metadata supplied by Task 1. No agent shares source-file ownership.


## Delivery evidence

- Graphite source frozen before edits at `/private/tmp/my-website-graphite-source.KXwpnc`; new saved edition is `public/history/2026-11-03-graphite/index.html` (26 files, 5,602,147 bytes).
- Source/build manifests, 27 saved asset/edition references and PDF bytes verified; previous source files removed: zero. Only the planned existing files differ from the frozen source.
- Focused integration suites: 47/47 passed. Full suite: 106/106 passed with localhost permission. Repeated final verification exposed a Vite dependency-optimizer race writing deps_temp files during SSR cache cleanup. Added `scripts/ssr-vite-options.mjs` to disable browser dependency optimization after React SWC resolves its injected include. Shared by both SSR fixtures and the content validator. The cancellation regression failed before the fix, then 11/11 focused checks passed without optimizer errors before final full verification.
- Application TypeScript, focused changed-component ESLint and whitespace checks passed.
- Production build succeeded to `/private/tmp/my-website-single-screen-build-20261103-3`; content validator accepts all three saved editions.
- Local HTTP returned 200 for 12 built assets/pages/archive/PDF/recording requests; archive manifest verified for all 25 payload files.
- Independent source review found two material issues: laptop viewport budget and route-controlled phone autofocus. Fixed the desktop sizing/breakpoint and retained main-content focus for route-controlled phone selection. Local in-place phone selection still focuses its Home control. No additional material source findings.
- Browser inventory reports local browser use disabled in Work settings and locked native surface; visual fit, interactive playback, focus and actual browser reload acceptance remain pending. No screenshot evidence is claimed.
- No Git stage/commit, push, deployment, dependency or release changes.

## Production publication — 3 November 2026

Sam authorized publication after the local handoff. Published the exact verified static output through the authenticated Vercel connection; the local CLI was logged out. No GitHub Actions, commits or pushes were used.

- Project: `my-website` / `prj_zuY6VeRT47tDQkiThp8kdcTTK5RM`.
- Prior production: `dpl_2dV8bSpFnfyTRPijA4wziwwQNUUV`; checked unchanged immediately before release.
- New production: `dpl_4qZyYgQ3qarR1pwstWAZt2JghMTT`, READY, aliased to `https://samjgreen.com/` and its established domains.
- Isolated static package: 85 reviewed static files plus deployment configuration. Word CV originals and all app installer/download files excluded; repository originals untouched.
- All 85 published files (14,492,480 bytes), including root JS/CSS and both manifest-backed saved editions, matched the reviewed SHA-256 hashes over public HTTPS.
- Home, bassh and Kapture clean URLs returned 200. All current/historical Word CV URLs return 307 to the corresponding PDFs; the disabled Bassh download route returns 307 to `/bassh`. The www domain returns 308 to the canonical domain.
- Evidence: `/private/tmp/my-website-single-screen-live-verification.json` and `/private/tmp/my-website-single-screen-publication-sha256.json`.
- Actual browser layout, keyboard and playback acceptance remains unverified because browser use is disabled in this session. Publication and HTTP/hash verification do not substitute for that evidence.

### Header favicon follow-up

Replaced the typographic `sg.` home mark with the existing `favicon.png` portrait. Preserved the accessible home-link label and 44px target; image is 40px on desktop and 36px on mobile. Focused production build and rendered-header inspection passed. Only root HTML/JS/CSS changed in the publication package; public images and saved editions match the previous release. Published production `dpl_NG7gp7mSA2etZ1Qpq4GZGaN4gUFH` (READY); live root HTML, JS, CSS and favicon SHA-256 values match the reviewed build.

### Setup pages and consistent phone position follow-up

- Added `DeviceStage` as the shared Home/Projects/app-overview layout. Identical columns, device sizing and top alignment now determine the phone position; removed per-page centering and mobile phone padding. Stable scrollbar space avoids horizontal movement when a description overflows.
- Updated Bassh and Kapture standalone pages to the warm frame and favicon branding, with return/preview links to the matching app overview. Bassh setup instructions, section IDs and navigation script are unchanged. The overview setup action now opens `/bassh#setup` directly using an optional `setupHref` record field.
- Focused checks 39/39; full release checks 110/110; application types, focused lint, fresh production build and whitespace checks pass. Independent source review found no material issues. A stale history-preview assertion was narrowed to the edition article so the shared header favicon remains valid.
- Browser access remains disabled and the Mac locked. The common positioning rules and DOM are verified from source/SSR; actual rendered pixel coordinates remain unverified.
- Release package: `/private/tmp/my-website-setup-alignment-publish-20261103-gbuwtjwl`, 86 files, exactly seven changed published paths (root HTML/JS/CSS and two standalone HTML/CSS pairs). Archives, CV, app recordings, icons and publication config remain byte-identical to the current production package. Word CV and installer files remain excluded.
- Automatic approval review rejected production creation because it did not consider publication explicitly authorized for this update. A hosted preview attempt was also rejected because the package references existing CV/archive files. No deployment was created; canonical production remains `dpl_NG7gp7mSA2etZ1Qpq4GZGaN4gUFH`.
- Local review only: `http://127.0.0.1:8084/`. Publication awaits explicit user approval.

### Whole-site style consistency follow-up

- Centralized current-site palette, fonts, frame spacing, responsive header/brand sizes and hero/section typography in `public/styles/site-theme.css`. React and both standalone app entrypoints load the same stylesheet; all 40 referenced theme tokens resolve.
- Shared `PageHeading` now covers Experience, History, Search/CV, Books and Updates. Unified section-page spacing and mobile heading scale, flat empty/recap states, and the common error treatment for missing pages and projects. The 404 page now retains the favicon, main navigation, footer and return-home control through `SiteShell`.
- Standalone Bassh/Kapture now match main navigation, app context navigation, contact/CV/history footer and shared frame/typography tokens. Existing setup instructions, IDs, reading pane, availability and installer restrictions remain intact.
- The final audit found and fixed trailing-slash document URLs losing their layout classification. Its regression failed before normalizing the pathname and passes afterward.
- Final verification: 116/116 tests, application types, focused lint, fresh production build and whitespace checks pass. All 62 files in the saved historical tree match the prior build unchanged. Browser visual and pixel-position acceptance remains unavailable because browser access is disabled.
- Latest local preview: `http://127.0.0.1:8084/`; build `/private/tmp/my-website-all-pages-style-build-20261103-2`.
- Latest release candidate: `/private/tmp/my-website-all-pages-style-publish-20261103-87cl7pzo`; file manifest `/private/tmp/my-website-all-pages-style-publication-files.json`; package info `/private/tmp/my-website-all-pages-style-publication-info.json`. 87 files, eight changed paths from current production (root HTML/JS/CSS, two standalone HTML/CSS pairs, new shared theme); CV/archive/recording bytes unchanged and Word/installers excluded.
- No new deployment attempts. The earlier explicit publication-approval request is still pending; the user’s request to finish style consistency was treated as further implementation work, not publication approval.

Local review note: Vite's SPA preview served the main app at bare `/bassh` and `/kapture` instead of applying the production rewrites. The current review URL uses `python3 -m http.server 8084 --bind 127.0.0.1 --directory /private/tmp/my-website-all-pages-style-build-20261103-2`, which redirects directory URLs correctly. All three current HTML entrypoints and their nine linked CSS/script resources now serve the checked bytes; the shared theme loads on each. Production rewrite configuration was not changed.
