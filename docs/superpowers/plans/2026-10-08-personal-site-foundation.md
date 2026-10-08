# Personal Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a compact, readable CV and project website with published activity, books, searchable public content and an authentic previous-version archive.

**Architecture:** Keep the existing static React application and hash router. Validate public JSON content before builds, expose it through one typed loader, and share pure content/search functions between the browser and Node tests. Use one responsive site shell and separate content views; Atlas automation and visitor LLM inference follow in separate scopes.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind 3, React Router 6, existing Zod 3, Node.js 22.6 or later for the TypeScript-stripping test command. The existing CI installs the current 22.x release. Use Node's test runner for pure `.ts` modules; add no product dependencies.

**Spec:** [Approved design](../specs/2026-10-08-personal-site-foundation-design.md).

## Global Constraints

- “The first build uses the existing React, TypeScript, Vite, Tailwind and hash-routing setup.”
- “Display dates in `Asia/Dubai`. Weekly intervals run Monday through Sunday in that timezone.”
- “Keep the existing CV facts in `src/data/cv.ts`.”
- “Only content approved for publication belongs in these files.” Drafts remain outside the public repository and browser bundle.
- “Every main destination should be apparent immediately; no sideways scrolling or concealed primary navigation.”
- “At smaller desktop sizes and on mobile, allow ordinary vertical scrolling rather than shrinking text or clipping content.”
- Palette: background `#15191F`, surface `#1E242D`, text `#F0F3F7`, secondary text `#AEB8C5`, divider `#394351`, accent `#9ABFFF`; use a local system sans-serif stack.
- Preserve existing search/section links, PDF/Word downloads and truthful distinctions between proposed, demonstrated and completed work.
- Preserve dirty and parallel work. Stage only each task's named files; exclude tracked dependency caches, historical root `dist`, `.DS_Store` changes and deleted esbuild binaries.
- Do not introduce fake posts/books, scripted LLM answers, new hosting, a network tunnel, an Atlas schedule or a hardware purchase.

## Review Focus

1. A public JSON record containing an unrecognised private field must fail validation rather than serialize that field — Task 2.
2. UTC midnight and Sunday/Monday boundaries must display and group in Dubai time, independently of the execution host — Task 2.
3. Existing full-CV and section URLs must retain their meaning while non-empty unfiltered searches include new public content — Tasks 3 and 4.
4. The previous version and both CV downloads must work under a repository subdirectory, without recopying its own history recursively — Tasks 1 and 6.
5. A long activity entry or project title on mobile, and keyboard navigation after a route change, must stay readable and reachable — Tasks 4 through 6.

## File Map and Execution Setup

Paths below are relative to the isolated implementation checkout. Use `superpowers:using-git-worktrees` at execution time: inspect attached worktrees, reuse a suitable checkout or create a managed worktree from this approved design/plan branch. Name a new implementation branch `codex/personal-site-foundation`. Record baseline status before setup and preserve unrelated edits throughout.

| Files | Responsibility |
| --- | --- |
| `public/history/2026-10-08/`, `content/site-versions.json` | Immutable existing-site snapshot and its public metadata |
| `content/activity.json`, `content/books.json` | Approved public records; initially empty arrays |
| `src/lib/public-content.ts` | Strict schemas, cross-record validation, Dubai dates and activity ordering/grouping |
| `src/data/public-content.ts` | Load and validate authored JSON for the application |
| `src/lib/text-search.ts`, `src/lib/public-search.ts` | Shared text matching and search-result projection |
| `scripts/validate-content.mjs`, `tests/*.test.mjs`, `tests/fixtures.mjs` | Build validation and focused pure-function tests |
| `src/components/SiteShell.tsx`, `SiteNavigation.tsx`, `PreviousVersions.tsx` | Shared identity, navigation and historical-version control |
| `src/pages/Experience.tsx`, `Projects.tsx`, `Updates.tsx`, `Books.tsx` | Readable, directly addressable collection views |
| Existing `Index.tsx`, `SearchResults.tsx`, `App.tsx`, `RouteScroll.tsx`, CSS and download/footer components | Overview, compatibility, routing, focus and visual system |
| `README.md`, `docs/atlas-publishing.md` | Content authoring, preview, validation and follow-on integration instructions |

The native test command is `node --experimental-strip-types --test tests/*.test.mjs`. Pure TypeScript modules use relative `.ts` imports and no Vite aliases or `import.meta.env`; fixtures are test-only examples. The application loader handles JSON imports. Add `resolveJsonModule: true` to `tsconfig.app.json` when that loader is introduced.

---

### Task 1: Preserve the existing website before changing it

**Files:** Create `public/history/2026-10-08/` and `content/site-versions.json`.

**Interfaces:** Produce `SiteVersion { id: string; label: string; capturedOn: string; sourceRevision: string; path: string }`. Initial ID is `cv-search-2026-10-08`, label is `CV and search · October 2026`, capture date is `2026-10-08`, and path is `history/2026-10-08/`. Record the verified source revision, not a guessed launch date.

- [x] **Step 1: Establish the capture baseline.** Confirm the product source still matches the accepted existing version (`43a89421`). If parallel product changes have appeared, build that revision in a separate managed checkout so the historical snapshot remains accurate; do not reset those changes.
- [x] **Step 2: Build the old source.** Run `npm run build -- --outDir /private/tmp/my-website-original-20261008`. Use a fresh output directory or a unique suffix if that path already contains work. Expect an exit-zero build containing HTML, relative asset references and both CV files.
- [x] **Step 3: Save the immutable snapshot and metadata.** Copy the verified build into the history path before any new history directory can be included in that build. Use a concise description of the captured version. Never rebuild over an existing saved snapshot or include one history tree inside another.
- [x] **Step 4: Verify the saved website.** Open the snapshot through the dev server, navigate its full CV/search and request its PDF and Word URLs. Expect rendered old content and HTTP 200 for both files; inspect that asset paths stay inside the snapshot. Repeat with the production site mounted below a temporary `/portfolio/` path during Task 6.
- [x] **Step 5: Commit only the snapshot and metadata.** Commit message: `feat: preserve the previous CV website`.

### Task 2: Add validated public content and Dubai activity dates

**Files:** Create `content/activity.json`, `content/books.json`, `src/lib/public-content.ts`, `src/data/public-content.ts`, `scripts/validate-content.mjs`, `tests/fixtures.mjs`, `tests/public-content.test.mjs`; modify `package.json`, `tsconfig.app.json` and `.github/workflows/jekyll-gh-pages.yml`.

**Interfaces:**

- `DailyActivity { id: string; kind: "daily"; title: string; body: string[]; publishedAt: string; activityDate: string; links?: PublicLink[] }`.
- `WeeklyActivity { id: string; kind: "weekly"; title: string; body: string[]; publishedAt: string; startDate: string; endDate: string; dailyEntryIds: string[]; links?: PublicLink[] }`; `ActivityEntry = DailyActivity | WeeklyActivity`.
- `BookEntry { id: string; title: string; author: string; status: "reading" | "read" | "want-to-read"; completedOn?: string; url?: string; note?: string }`.
- `PublicLink { label: string; href: string }`; `PublicContent { activity: ActivityEntry[]; books: BookEntry[]; versions: SiteVersion[] }`.
- `parsePublicContent(input: unknown, cvIds: readonly string[]): PublicContent` throws an actionable validation error. All record schemas are strict; IDs are unique across public record collections. New links permit HTTPS or a recognised hash route, and validate `entry` references when supplied.
- `sortActivity(entries: readonly ActivityEntry[]): ActivityEntry[]` orders publication timestamps descending, then IDs ascending.
- `formatPublicDate(value: string): string` displays a calendar date or timestamp in Dubai using `en-GB`, numeric day, abbreviated month and numeric year.
- `activityWeek(value: string): { startDate: string; endDate: string }` accepts a date or timestamp; `groupActivity(entries: readonly ActivityEntry[]): ActivityWeek[]` returns descending weeks with sorted daily entries and optional recap. `ActivityWeek { startDate: string; endDate: string; daily: DailyActivity[]; recap: WeeklyActivity | null }`. Group daily records by `activityDate`, weekly records by their stated interval, and use the latest publication when a week has revised recaps. A week's endpoints are Monday and Sunday, seven calendar days inclusive.
- Application loader exports `publicContent: PublicContent`. The CLI is `node --experimental-strip-types scripts/validate-content.mjs [--content-dir <directory>]`, defaulting to the repository's `content/` directory; the optional directory enables fixture-based failure tests. Its CV ID input comes from the existing CV records; CLI obtains IDs from a temporary Vite SSR module load because `cv.ts` contains a Vite environment expression. Use production mode and middleware mode so validation does not bind a server port, and close the Vite server after that load.

- [x] **Step 1: Write failing content tests.** Use test-only fixture factories `daily()`, `weekly()` and `book()` accepting field overrides. Pin these assertions:

```js
assert.throws(() => parsePublicContent({ activity: [daily({ privateNotes: "private" })], books: [], versions: [] }, []));
assert.deepEqual(activityWeek("2026-10-11T21:30:00Z"), { startDate: "2026-10-12", endDate: "2026-10-18" });
assert.match(formatPublicDate("2026-10-08T21:30:00Z"), /9.*Oct.*2026/);
assert.deepEqual(sortActivity([daily({ id: "b" }), daily({ id: "a" })]).map(x => x.id), ["a", "b"]);
```

Also name and assert `duplicate_ids_rejected`, `february_30_rejected`, `timestamp_without_offset_rejected`, `non_monday_week_rejected`, `missing_or_out_of_week_daily_reference_rejected`, `javascript_and_unknown_routes_rejected`, `late_published_daily_stays_in_its_activity_week`, `latest_revision_is_week_recap`, and `empty_collections_valid`.
- [x] **Step 2: Run the red tests.** Run the native test command scoped to `tests/public-content.test.mjs`; expect missing-module/export failures before implementing the functions.
- [x] **Step 3: Implement the interfaces and build validation.** Use existing Zod with explicit date refinements and cross-record checks. Reject empty titles/body paragraphs, bodies outside one to four items, duplicate weekly references and invalid calendar dates. Initialise activity/books as `[]`; import the authentic Task 1 metadata. Add `test` and `validate:content` scripts and run validation via `prebuild` and `prebuild:dev`. Add focused tests before the existing TypeScript/build workflow steps. Validation errors identify collection and record without printing private field values.
- [x] **Step 4: Verify the tests and build gate.** Run the focused tests with `TZ=UTC` and `TZ=America/Los_Angeles`; expect identical passing results. Run `npm run validate:content`, TypeScript and a build into a fresh temporary directory. In a test fixture, prove an invalid record exits non-zero; never leave malformed content in the live files.
- [x] **Step 5: Commit only this task's files.** Commit message: `feat: validate public activity and reading content`.

### Task 3: Search across the published CV, updates and books

**Files:** Create `src/lib/text-search.ts`, `src/lib/public-search.ts`, `tests/public-search.test.mjs`; modify the helper portion of `src/data/cv.ts` and `src/pages/SearchResults.tsx`.

**Interfaces:** `normaliseText(value: string): string`, `matchesQuery(text: string, query: string): boolean`; `searchPublicContent(query: string, section: string, cv: readonly CVEntry[], content: PublicContent): PublicSearchResult[]`. `PublicSearchResult { id: string; source: "cv" | "activity" | "book"; title: string; context: string; paragraphs: string[]; href: string }`. Preserve CV keywords. CV hits link to `/search?section=<section>&query=<query>`; activity/book hits link to `/updates?entry=<id>` and `/books?entry=<id>`. The router generates the hash. Reuse text matching in existing `searchEntries` without changing the authored CV facts.

- [x] **Step 1: Write failing search tests.** Use fixture CV entries and public records; assert non-empty unfiltered queries match all three source types, accent/case variations match, all query words are required, and results link to the matching record. Assert `searchPublicContent("", "", cv, content)` returns exactly the CV entries. A recognised section filters only CV; unknown sections retain the legacy empty-results behaviour rather than broadening a stale link.
- [x] **Step 2: Run the red tests.** Run `node --experimental-strip-types --test tests/public-search.test.mjs`; expect the new module/exports to be missing.
- [x] **Step 3: Implement matching and result rendering.** Consume Task 2's validated data. Label results by source, preserve the contact links and existing query/section URLs, and keep full-CV browsing at `/search` without a query. Render authored text as React text; do not use `dangerouslySetInnerHTML`.
- [x] **Step 4: Verify behaviour.** Run the focused search tests and TypeScript. In the browser, check Presight still returns its two existing CV matches, Qualifications shows five entries, and the empty full-CV view has sixteen entries. Empty, whitespace-only and unmatched queries must have useful outcomes.
- [x] **Step 5: Commit the named files.** Commit message: `feat: search published website content`.

### Task 4: Build the shared shell, navigation and readable CV views

**Files:** Create `src/components/SiteShell.tsx`, `SiteNavigation.tsx`, `PreviousVersions.tsx`, `src/pages/Experience.tsx`, `Projects.tsx`; modify `src/App.tsx`, `src/index.css`, `tailwind.config.ts`, `src/components/CVDownloads.tsx`, `CVFooter.tsx`, `RouteScroll.tsx`, `SearchBox.tsx` and `src/pages/SearchResults.tsx`.

**Interfaces:** `SiteShell({ children }: { children: React.ReactNode })` supplies identity, navigation, downloads and `<main id="main-content" tabIndex={-1}>`. Each converted page wraps its content in this shell; do not wrap the router itself and create duplicate main landmarks on the still-existing homepage. Navigation initially uses `NavLink` with Overview `/`, Experience `/experience`, Projects `/projects`; Task 5 adds Updates `/updates` and Books `/books` when those views exist. `PreviousVersions` consumes Task 2's metadata and resolves `path` against `import.meta.env.BASE_URL`; no hardcoded domain-root path. The shell's visible heading is the content view's single `<h1>`; the identity name is a home link.

- [x] **Step 1: Record the new-view acceptance checks before implementation.** Required browser checks for the new Experience/Projects views and converted search view are: each available navigation link reaches its destination; browser Back restores the prior view; a route change focuses the main content; the skip link keeps the current route; PDF/Word links resolve; and the previous-version control opens the saved build. These views/behaviours are absent or incomplete in the baseline. The homepage is converted in Task 5.
- [x] **Step 2: Implement the shell and visual tokens.** Apply the approved palette using existing HSL token conventions and a system sans stack. Use a readable identity column and clearly labelled navigation, compact search and visible downloads. Preserve focus outlines, reduced-motion support and semantic landmarks. After pathname or query changes, `RouteScroll` scrolls to the top and focuses the main content without an extra scroll.
- [x] **Step 3: Implement CV views and wire routes.** Experience renders the four existing roles and directly links Qualifications and the full CV. Projects renders existing work records, showing the original status/context labels; an `entry` query identifies a matching article. Unknown entry IDs show the collection with a brief unavailable-entry message. Both views are readable on mobile; search uses the shared shell.
- [x] **Step 4: Run acceptance checks, TypeScript and a temporary production build.** Inspect at 1440 × 900 and 390 × 844; long titles must wrap, links remain reachable, and there is no horizontal page overflow. Test keyboard focus and browser history through actual UI interactions. Fix contrast failures against the spec before claiming this task passes.
- [x] **Step 5: Commit the named files.** Commit message: `feat: add the personal website navigation and CV views`.

### Task 5: Add the compact overview, activity view and books

**Files:** Modify `src/pages/Index.tsx`; create `src/pages/Updates.tsx`, `Books.tsx`; update `src/App.tsx`, `src/components/SiteNavigation.tsx` and the relevant shared CSS.

**Interfaces:** Consume Task 2's `publicContent`, `sortActivity`, `groupActivity` and `formatPublicDate`, and Task 4's shell. `Updates` and `Books` accept an optional `entry` query via the router and identify the requested record; their article IDs use the validated stable IDs.

- [x] **Step 1: Define acceptance fixtures and missing-baseline checks.** Use temporary test-only datasets for an empty feed, daily-only notes, a recap with referenced daily notes, a newer daily note after the latest recap, and all three book statuses. Fixtures must never enter the committed public files. Require every daily entry to remain reachable exactly once in the daily list even when a recap leads the page.
- [x] **Step 2: Implement the overview.** Show two selected projects (Presight and aviation), four compact career rows and the latest item by publication time. Reading appears only for a real `reading` entry. At the target desktop size, identity, navigation, work, career and recent activity are visible without scrolling; smaller screens may scroll normally. Maintain the original factual wording and project status.
- [x] **Step 3: Implement Updates and Books and wire their navigation.** Add their routes and navigation links together. Lead Updates with the latest weekly recap when present; show daily entries grouped by week, newest week first, including newer daily entries not yet covered by that recap. Link recap references to their daily articles. Group Books by status with Sam's notes and optional public links. Empty copy is “No updates published yet.” and “No books added yet.” A valid `entry` query shows that record's readable detail and a link back to its collection; an unknown ID shows the collection plus an unavailable-entry message, not a blank page.
- [x] **Step 4: Verify the acceptance fixtures and restore real content.** In the browser check recap/daily visibility, selected record links, date labels, empty states and a long note at mobile width. Run focused content/search tests, TypeScript and a temporary build. Confirm the committed activity/books arrays remain empty unless Sam has supplied publication-approved records.
- [x] **Step 5: Commit the named files.** Commit message: `feat: add the overview activity feed and reading shelf`.

### Task 6: Verify the whole flow and document public authoring

**Files:** Modify `README.md`; create `docs/atlas-publishing.md`. Save review screenshots outside the repository. Update only defects found in the new flows, with focused tests when behaviour changes.

**Interfaces:** Document the final Task 2 content fields and validation command, the Task 3 search semantics, and actual historical snapshot path. Explain that Atlas integration is a later connection/scheduling step and that visitor LLM inference is not active in this release.

- [x] **Step 1: Write authoring instructions.** Provide syntactically valid, explicitly labelled test/example records matching the real schemas. Explain how to prepare a private draft, publish an approved daily record, reference daily IDs in a Monday-to-Sunday recap, add a real book and run validation before a normal build. Do not include private drafts or credentials.
- [x] **Step 2: Run the complete focused checks.** Run `npm test`, `npm run validate:content`, `npx tsc --noEmit -p tsconfig.app.json`, and `npm run build -- --outDir <fresh-private-temporary-path>`. Then run `git diff --check`. Expect exit zero from each; report actual warnings without treating them as failures or claiming unrelated gates passed.
- [x] **Step 3: Inspect the production flow below a subdirectory.** Serve the built site under `/portfolio/` using a temporary static server. Open its overview, all new views, query/section links and saved historical version. Download URLs and archive asset URLs must resolve under `/portfolio/`, and a direct hash-route reload must render the requested view. Check that no nested history copy was created.
- [x] **Step 4: Finish visual and keyboard QA.** Verify the target desktop overview and mobile views, long content, navigation, focus, skip link, CV files, empty states and previous versions. Capture the overview and Updates screenshots with computer-use tools, and embed them in the user-facing delivery. Leave the working local preview open for review.
- [x] **Step 5: Review and deliver the implementation branch.** Follow the user-selected execution method's review workflow. Confirm the diff contains only intended source, public content, documentation and the deliberate historical snapshot; preserve all other changes. Commit the authoring docs with `docs: explain public website content publishing`. Deliver the preview, focused check results and remaining Atlas/model integration work; keep publishing and infrastructure changes for their own authorized step.

## Implementation Order and Handoff

Run Tasks 1–6 in order: the snapshot must precede product changes, and the content/search interfaces must precede their views. Each task's checks must pass before moving on. Keep implementation in an isolated checkout and use exact-file staging.

Recommended execution is **Native**: one implementer handles the six dependent tasks in this session, then a fresh reviewer checks the complete branch. The shared content contracts and UI shell make sequential ownership efficient; the local preview and focused tests provide concrete review evidence before any publishing step.

Atlas source selection, schedules, publishing permissions and the local LLM API remain follow-on work. The finished foundation is independently useful even when there are no daily records, books or model service.

## Execution completion

Completed locally on 8 October 2026 on `codex/personal-site-foundation`. All six tasks and fresh review are complete; 30 focused tests, content validation, TypeScript and production build pass. Desktop/mobile and `/portfolio/` production checks pass, including downloads and the actual archived site. The review identified a 404 contrast regression, repaired and verified at 15.85:1.

The original snapshot records the current approved source revision `6390bafdf6350745703e52a3c8f651c9eddd610a`, including existing canonical metadata, and opens through `history/2026-10-08/index.html` so Vite resolves the saved build correctly. No private drafts or fabricated public records were added. Atlas connection and visitor inference remain follow-on work.
