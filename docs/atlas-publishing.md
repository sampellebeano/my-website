# Public content authoring

The website reads approved public records from JSON. Atlas's source connection, timing and publication permissions still need to be agreed and configured; no Atlas schedule or visitor model service is active in this foundation.

## Draft, review, publish

1. Prepare a private draft in Atlas or another private authoring location outside this repository. Use only sources Sam has approved for this purpose.
2. Review the exact public text. Remove private details and unsupported claims. A quiet day can have no entry.
3. Add the approved record to the relevant public JSON array. Keep a stable ID when correcting a record; use a distinct ID for a separately published recap revision.
4. Run `npm run validate:content`, `npm test` and `npx tsc --noEmit -p tsconfig.app.json`. Then build normally, or use a fresh temporary output directory when reviewing this repository's tracked build artifacts.
5. Review the local view before publishing through the normal site workflow.

Only publish-ready content belongs in `content/`. Do not add private fields, drafts, conversations, calendars, credentials or raw work notes. Validation rejects unrecognised fields and reports their location without printing their values. This gate checks structure and references; a human review still checks the truth and publication suitability of the text.

## Daily and weekly activity

`content/activity.json` is an array of daily and weekly records. Both kinds require:

| Field | Format |
| --- | --- |
| `id` | Unique lowercase letters/numbers separated by hyphens |
| `kind` | `daily` or `weekly` |
| `title` | Short, nonblank plain text |
| `body` | One to four nonblank plain-text paragraphs |
| `publishedAt` | ISO timestamp including seconds and an explicit offset, e.g. `+04:00` or `Z` |
| `links` | Optional array of `{ "label": "...", "href": "..." }` |

Daily records additionally require `activityDate`, a real `YYYY-MM-DD` calendar date. Weekly records require `startDate`, `endDate` and a nonempty `dailyEntryIds` array. A week runs Monday through Sunday, seven calendar days inclusive. Every referenced ID must name a published daily record whose activity date lies within that interval; references cannot repeat. A recap should summarise those public notes without adding unsupported achievements.

**Test/example records only — these are not Sam's actual updates.** This complete array passes the schema:

```json
[
  {
    "id": "daily-example-2026-10-08",
    "kind": "daily",
    "title": "An example public note",
    "body": ["This is a format example, not a real update."],
    "publishedAt": "2026-10-08T20:00:00+04:00",
    "activityDate": "2026-10-08",
    "links": [{ "label": "Personal projects", "href": "#/projects" }]
  },
  {
    "id": "weekly-example-2026-10-05",
    "kind": "weekly",
    "title": "An example weekly recap",
    "body": ["This format example recaps only the example daily note."],
    "publishedAt": "2026-10-11T20:00:00+04:00",
    "startDate": "2026-10-05",
    "endDate": "2026-10-11",
    "dailyEntryIds": ["daily-example-2026-10-08"]
  }
]
```

Dates display in `Asia/Dubai`, independently of the host computer. Daily notes group by `activityDate`, not publication time. Publication ordering compares actual instants and breaks ties by ID. A late-published note stays in its activity week. The overview shows the newest published item; Updates leads with the latest weekly recap and lists daily notes once, newest week first, including daily notes newer than that recap. If a week has recap revisions, its newest publication is shown in the collection; each revision remains directly addressable.

There is no placeholder post for an empty day or week. Leave `activity.json` as `[]` when nothing has been approved.

## Books

`content/books.json` is an array. Each record requires `id`, `title`, `author` and `status`. The allowed statuses are `reading`, `read` and `want-to-read`. Optional fields are `completedOn` (real `YYYY-MM-DD`), `url` (a permitted public link) and `note` (nonblank plain text).

**Test/example only — this is not a book on Sam's shelf:**

```json
[
  {
    "id": "book-example",
    "title": "An example book title",
    "author": "Example Author",
    "status": "read",
    "completedOn": "2026-10-08",
    "note": "A format example, not an endorsement or actual reading note."
  }
]
```

Add real books and Sam's actual notes. The overview shows a book only when a `reading` record exists; Books groups all three statuses. Leave the array as `[]` until a real collection is supplied. No cover image or rating is required.

## IDs, links and validation

IDs must be unique across activity, books and previous-version records. Keep them stable because direct links and weekly references use them.

Public links allow HTTPS without embedded credentials, or these hash routes: `#/`, `#/cv`, `#/experience`, `#/projects`, `#/updates`, `#/books` and `#/history`. Link to whole sections for CV, apps and activity; site-history links can select a preserved edition with `#/history?entry=<stable-id>`. Legacy `entry` parameters must still resolve to a published record for validation, but the views keep the full section visible. Personal project IDs are `kapture`, `bassh` and `ryw`. Use `/#/projects/highlighter` for the highlighter overview. The `ryw` ID still resolves in existing project links. Only bassh currently has a linked standalone page. Career highlight IDs are `enterprise-front-door`, `aviation`, `executive-briefings` and `quip`, and stay inline under their roles in `#/experience`. Projects contains Sam's personal builds; employer initiatives stay under Experience unless Sam explicitly changes that classification. Add further personal builds to `src/data/projects.ts` with approved public descriptions, and add an optional `href` only when a standalone page is ready to link. Executable schemes, HTTP and unknown routes are rejected. Authored text renders as text, not HTML or Markdown.

```sh
npm run validate:content
```

The same command runs automatically before both production and development builds. Invalid content exits nonzero, so CI cannot deploy it over the last successful site. For temporary acceptance fixtures outside the public files:

```sh
node --experimental-strip-types scripts/validate-content.mjs --content-dir /path/to/fixture-directory
```

The fixture directory needs `activity.json`, `books.json` and `site-versions.json`; each can be an empty array. Never commit fixture posts to the public collections.

## CV downloads

Publish the PDF CV only. Preserve the Word originals locally; `.vercelignore` excludes both current and historical `.docx` CV files from source deployments. When deploying a prebuilt static output, omit those files there too. `vercel.json` redirects former Word CV URLs to their corresponding PDFs. Verify the PDF download and both current and historical Word redirects after publishing.

## App downloads

The Bassh download page at `/bassh/download` links to the private GitHub release for approved Mac testers and to a prefilled email for iPhone TestFlight requests. Keep installer files off the hosted site. Preserve the versioned files in `public/downloads/bassh/`; `.vercelignore` excludes them from source deployments and the build prunes them from `dist`. Omit them from any prebuilt deployment as well. After publishing, verify that the former installer URLs still redirect to `/bassh` and that GitHub requires access to download the current ZIP.

## Previous versions

`content/site-versions.json` is an array of strict edition records. Every record has `id`, `label`, `capturedOn` and `path`, plus either an exact `sourceRevision`, or `sourceKind: "working-tree"`, `baseRevision`, `sourceManifestSha256` and `buildManifestSha256`. A base revision alone does not identify a dirty working build. Existing exact-revision records remain valid unchanged.

Optional `summary` and `notes` (plain-text paragraph array) explain real changes. Optional `preview` points to a captured PNG, JPEG, WebP or AVIF in the edition's own directory. Omit it when no actual screenshot exists. Paths use `history/YYYY-MM-DD/index.html`, with an optional unique suffix on the dated directory for another same-day edition. The path date must match `capturedOn`; IDs and snapshot paths remain unique.

`#/history` shows all saved editions and their making notes. Selecting an edition keeps the rest of the timeline visible. The current edition is clearly separate from frozen snapshots.

Capture an actual build before changing it. Record its capture date, not a guessed launch date. Preserve snapshots unchanged and exclude their history tree from future captures. Freeze a source copy first, then build into a fresh external directory. Run the capture script with `--build-dir`, `--source-dir`, `--output-dir`, `--captured-on`, a full `--base-revision`, `--id` and `--label`. `--source-dir` must be the frozen source that produced the build, not source modified after it. The output directory's basename must match the date, with an optional safe suffix. The script refuses an existing output.

The script excludes nested history, installers and Word files; rebases local HTML/CSS/module asset links; and writes `source-manifest.json` and `build-manifest.json`. Review the returned record before adding it to the version collection. Verify both manifest digests, all saved-site asset/route links and the PDF. Existing snapshots and shared app media must remain unchanged. Future captures using additional URL patterns may require extending the capture rules and their regressions.

The 2 November pre-overhaul edition is a saved local working site, not a claim about what was deployed at that instant. Its original source and build are identified by the manifests; its making notes explain what the saved edition contains.

## Follow-on integrations

For Atlas, agree on approved sources, daily and weekly timing, draft review and publishing permissions before connecting or scheduling it. The JSON contract is ready for that connection.

For “Ask about Sam”, use the same approved public knowledge behind a protected application API. Benchmark a local model on Sam's existing machine before selecting hardware. Ordinary browsing should remain available when inference is offline. The model service and public API remain separate implementation work.
