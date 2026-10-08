# Public content authoring

The website reads approved public records from JSON. Atlas's source connection, timing and publication permissions still need to be agreed and configured; no Atlas schedule or visitor model service is active in this foundation.

## Draft, review, publish

1. Prepare a private draft in Atlas or another private authoring location outside this repository. Use only sources Sam has approved for this purpose.
2. Review the exact public text. Remove private details and unsupported claims. A quiet day can have no entry.
3. Add the approved record to the relevant public JSON array. Keep a stable ID when correcting a record; use a distinct ID for a separately published recap revision.
4. Run `npm run validate:content`, `npm test` and `npx tsc --noEmit -p tsconfig.app.json`. Then build normally, or use a fresh temporary output directory when reviewing this repository's tracked build artifacts.
5. Review the local view and search result before publishing through the normal site workflow.

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
    "links": [{ "label": "A public project", "href": "#/projects?entry=presight" }]
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

Dates display in `Asia/Dubai`, independently of the host computer. Daily notes group by `activityDate`, not publication time. Publication ordering compares actual instants and breaks ties by ID. A late-published note stays in its activity week. The overview shows the newest published item; Updates leads with the latest weekly recap and lists daily notes once, newest week first, including daily notes newer than that recap. If a week has recap revisions, its newest publication is shown in the collection; each revision remains directly addressable and searchable.

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

Public links allow HTTPS without embedded credentials, or these hash routes: `#/`, `#/experience`, `#/projects`, `#/updates`, `#/books` and `#/search`. An `entry` parameter must resolve to a published record in Projects, Updates or Books. Current project IDs are `presight`, `aviation`, `executive-briefings` and `quip`. Executable schemes, HTTP and unknown routes are rejected. Authored text renders as text, not HTML or Markdown.

```sh
npm run validate:content
```

The same command runs automatically before both production and development builds. Invalid content exits nonzero, so CI cannot deploy it over the last successful site. For temporary acceptance fixtures outside the public files:

```sh
node --experimental-strip-types scripts/validate-content.mjs --content-dir /path/to/fixture-directory
```

The fixture directory needs `activity.json`, `books.json` and `site-versions.json`; each can be an empty array. Never commit fixture posts to the public collections.

## Previous versions

`content/site-versions.json` is an array of strict metadata records with `id`, `label`, `capturedOn`, `sourceRevision` (a verified Git SHA) and `path`. The current saved build uses `history/2026-10-08/index.html`; the date inside the path must match `capturedOn`. The shell resolves that relative path against the deployment base, including repository subdirectories.

Capture an actual build with its assets and CV files before changing that version. Record its capture date, not a guessed launch date. Preserve snapshots unchanged and exclude their history tree from future captures.

## Follow-on integrations

For Atlas, agree on approved sources, daily and weekly timing, draft review and publishing permissions before connecting or scheduling it. The JSON contract is ready for that connection.

For “Ask about Sam”, use the same approved public knowledge behind a protected application API. Benchmark a local model on Sam's existing machine before selecting hardware. Ordinary browsing and search should remain available when inference is offline. The model service and public API remain separate implementation work.
