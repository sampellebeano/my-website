# Sam Green: personal website

A personal CV, portfolio and public activity feed for Sam Green, Senior Solution Consultant at ServiceNow, based in the UAE. Built with React, TypeScript, Vite and Tailwind CSS.

The primary website address is [samjgreen.com](https://samjgreen.com/). The `www.samjgreen.com` address redirects to the primary domain.

The compact overview features personal projects, four career roles and the latest published update. Navigation opens Experience, Projects, Updates and Books. Personal builds such as Kapture and bassh live in `src/data/projects.ts`. Employer initiatives belong to career records in `src/data/cv.ts`, associated with their role through `roleId`; they appear under Experience. Career copy distinguishes proposals and demonstrations from completed implementation. Client names are omitted from the current website copy. Daily notes and books start empty; add only real, publication-approved content.

## Views and search

Routes live inside the URL hash: `#/`, `#/experience`, `#/projects`, `#/updates`, `#/books` and `#/search`. Experience, projects, updates and books accept `?entry=<stable-id>` for a readable individual record; unavailable IDs return the collection with a notice. Old project links to career highlights redirect to their Experience detail.

A nonempty query at `#/search?query=...` searches the CV, personal projects, published activity and books. Matching ignores case and accents and requires every query word. Existing `?section=about|experience|work|qualifications|contact` links filter the CV only; `work` is labelled Career highlights. An empty or whitespace-only query browses the full CV or selected CV section; an unknown section returns no results.

## Public content

CV facts remain in `src/data/cv.ts`. Public daily notes and weekly recaps live in `content/activity.json`; books live in `content/books.json`. Strict schemas reject unknown fields, invalid dates, duplicate IDs, unsafe links and invalid weekly references. Builds validate content before producing the site, and CI runs the focused tests before TypeScript and build checks.

See [public authoring and the future Atlas connection](docs/atlas-publishing.md) for the exact formats. Keep private drafts outside this repository. All dates display in `Asia/Dubai`; activity weeks run Monday through Sunday. Daily notes group by their activity date even if published later.

Atlas publishing and visitor LLM answers are follow-on integrations. This release provides ordinary search and a validated publishing format; it has no active model service or schedule.

## Deployment

Vercel’s Git integration connects `sampellebeano/my-website` to the `my-website`
project in the `samjgreen` account. Pushes to `main` create production deployments
and automatically assign `samjgreen.com` after a successful build. GitHub Actions
runs verification separately; it does not deploy the site.

Use Sam’s GitHub commit email in this repository so GitHub attributes commits to
the connected account:

```sh
git config --local user.email '64439967+sampellebeano@users.noreply.github.com'
```

If a push creates no deployment, check [Vercel status](https://www.vercel-status.com/)
for a Git integration or deployment incident before changing project settings.
Then check Vercel’s **Settings → Git** for repository access errors.
A GitHub rate-limit error can interrupt automatic deployments;
allow the limit to clear and use **Reconnect** on the existing repository link.
If the link is healthy but pushes still produce no deployment, disconnect and
connect the same repository again; Vercel preserves the project settings.
Check that Production still tracks `main` with automatic domain assignment,
then confirm a fresh push produces a Git-triggered production deployment.

## Previous website

The CV/search site captured on 8 October 2026 is saved independently at `public/history/2026-10-08/index.html`, including its own assets and both CV files. `content/site-versions.json` records the capture date and source revision. The Previous versions control opens this actual snapshot. Use the explicit `index.html` URL: Vite's development server otherwise falls back to the current SPA for the directory URL.

Never rebuild over a saved snapshot or copy an existing history tree into a new one. Historical snapshots are deliberate public artifacts, distinct from root build output.

## bassh Mac preview

The public download and setup page lives at [samjgreen.com/bassh](https://samjgreen.com/bassh).
It is a standalone, script-free page in `public/bassh/`; the Vercel rewrite serves
it at the clean URL without changing the existing hash routes. Projects links to it.
The page includes a prefilled email link to express interest in the iPhone App
Store release and an expandable five-step installation guide. Release interest
goes to Sam’s email; there is no signup form or mailing-list service.

Versioned release assets live in `public/downloads/bassh/0.2.0-3-preview/`.
The DMG and ZIP are the unchanged universal Mac preview from the private bassh
release, accompanied by installation notes, metadata and SHA-256 checksums.
The companion supports macOS 15 or later, Tailscale and ordinary Remote Login.
It is ad hoc signed and **not notarized by Apple**. The page also explains the
separate requirement for the private iPhone TestFlight beta when following the
setup guide. The beta is not open for public access requests.

For each new release, add a fresh versioned directory, verify the assets against
the release checksums, update the page's version, size, date and download links,
and update the independently verified asset hashes in `tests/bassh-downloads.test.mjs`.
Never replace bytes in an existing release directory: these URLs are cached as
immutable. Developer ID signing/notarization and the iPhone App Store release
are separate release steps; only change the page's status when verified.

## CV downloads

The original downloadable CV is available in both formats:

[PDF CV](public/cv/Sam-Green-Solution-Architecture-CV.pdf)

[Word CV](public/cv/Sam-Green-Solution-Architecture-CV.docx)

Replace these files when updating the CV. Vite copies them unchanged into the published site. Website content is maintained in `src/data/cv.ts`, with the homepage introduction and featured work in `src/pages/Index.tsx`.

## Local development

Use Node.js 22.6 or later (CI installs current 22.x). The Node test runner strips types from the pure TypeScript modules.

```sh
npm ci --include=dev
npm run dev
```

For an isolated checkout while another preview is running:

```sh
npm run dev -- --host 127.0.0.1 --port 8081 --strictPort
```

## Verification and build

```sh
npm test
npm run validate:content
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run preview
```

In this repository, build review output into a fresh temporary directory to preserve its historically tracked `dist` files:

```sh
npm run build -- --outDir /private/tmp/my-website-review-build
```

Use a new output directory for each review. Production QA should also mount the build below a path such as `/portfolio/` and exercise hash-route reloads, both CV files and the saved version's own assets.

## Publishing

Vercel hosts the site and deploys the GitHub repository `sampellebeano/my-website`. The production branch is `main`; other branches receive preview deployments. The project belongs to the `samjgreen` Vercel account.

`vercel.json` configures the Vite build, checks TypeScript before building, and publishes `dist`. The GitHub Actions workflow in `.github/workflows/verify.yml` runs the public content and search tests, checks TypeScript and verifies the production build; it does not publish the site.

Cloudflare manages registration and DNS for `samjgreen.com`. The root domain serves the Vercel production deployment, and `www.samjgreen.com` redirects to `https://samjgreen.com/`. Use the exact DNS targets shown in the Vercel project's Domains settings and keep these records **DNS only**. Vercel manages HTTPS certificates. GitHub Pages is disabled.

Dependencies and generated build output are ignored for future additions. The existing repository already tracks historical copies of `node_modules` and `dist`; removing these from history is a separate maintenance task.

The original project remains editable in [Lovable](https://lovable.dev/projects/3f3c17b9-b82f-422a-9f3d-f8b7e44a6f86).
