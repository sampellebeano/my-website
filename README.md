# Sam Green: personal website

A personal CV, portfolio and public activity feed for Sam Green, Senior Solution Consultant at ServiceNow, based in the UAE. Built with React, TypeScript, Vite and Tailwind CSS.

The primary website address is [samjgreen.com](https://samjgreen.com/). The `www.samjgreen.com` address redirects to the primary domain.

The compact overview features personal projects, four career roles and the latest published update. Navigation opens Experience, Projects, Updates and Books. Personal builds such as Kapture and bassh live in `src/data/projects.ts`. Employer initiatives belong to career records in `src/data/cv.ts`, associated with their role through `roleId`; they appear under Experience. Career copy distinguishes proposals and demonstrations from completed implementation. Client names are omitted from the current website copy. Daily notes and books start empty; add only real, publication-approved content.

## Views and CV

Routes live inside the URL hash: `#/`, `#/cv`, `#/experience`, `#/projects`, `#/updates`, `#/books` and `#/history`. Experience, projects, updates and books accept `?entry=<stable-id>` for a readable individual record; unavailable IDs return the collection with a notice. Old project links to career highlights redirect to their Experience detail.

Open `#/cv` for the full CV or add `?section=about|experience|work|qualifications|contact` to open one section. `qualifications` opens Courses & credentials and `work` opens Career highlights. Old `#/search` bookmarks redirect to `#/cv` and retain a recognised section.

## Public content

CV facts remain in `src/data/cv.ts`. Public daily notes and weekly recaps live in `content/activity.json`; books live in `content/books.json`. Strict schemas reject unknown fields, invalid dates, duplicate IDs, unsafe links and invalid weekly references. Builds validate content before producing the site, and CI runs the focused tests before TypeScript and build checks.

See [public authoring and the future Atlas connection](docs/atlas-publishing.md) for the exact formats. Keep private drafts outside this repository. All dates display in `Asia/Dubai`; activity weeks run Monday through Sunday. Daily notes group by their activity date even if published later.

Atlas publishing and visitor LLM answers are follow-on integrations. The site has a validated publishing format for public content.

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

The CV/search site captured on 8 October 2026 is saved independently at `public/history/2026-10-08/index.html`, including its own assets and both CV files. `content/site-versions.json` records the capture date and source revision. The Site history view (`#/history`) opens this actual snapshot and the pre-overhaul working edition captured on 2 November 2026. Each edition can include a summary, making notes and an authentic screenshot preview when available. Use the explicit `index.html` URL: Vite's development server otherwise falls back to the current SPA for the directory URL.

Never rebuild over a saved snapshot or copy an existing history tree into a new one. `scripts/capture-site-version.mjs` captures a separately built edition, prepares its local asset paths and records source/build manifests; see `docs/atlas-publishing.md` for the workflow. Historical snapshots are deliberate public artifacts, distinct from root build output.

## bassh downloads and access

[bassh setup](https://samjgreen.com/bassh) links to the standalone
[download page](https://samjgreen.com/bassh/download) for testers. The Mac
companion link opens the private GitHub release, where an invited account can
download the notarized ZIP. The iPhone section opens a prefilled email to Sam
for access to the private TestFlight beta.

Keep the versioned archives in `public/downloads/bassh/` unchanged and excluded
from deployment. The old download URLs redirect to the setup page. For a new
Mac preview, update the download page to point at the verified private release.

## CV downloads

The original downloadable CV is available in both formats:

[PDF CV](public/cv/Sam-Green-Solution-Architecture-CV.pdf)

[Word CV](public/cv/Sam-Green-Solution-Architecture-CV.docx)

Replace these files when updating the CV. Vite copies them unchanged into the published site. Website content is maintained in `src/data/cv.ts`, with the homepage introduction and featured work in `src/pages/Showcase.tsx`.

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

`vercel.json` configures the Vite build, checks TypeScript before building, and publishes `dist`. The GitHub Actions workflow in `.github/workflows/verify.yml` runs the regression tests, checks TypeScript and verifies the production build.

Cloudflare manages registration and DNS for `samjgreen.com`. The root domain serves the Vercel production deployment, and `www.samjgreen.com` redirects to `https://samjgreen.com/`. Use the exact DNS targets shown in the Vercel project's Domains settings and keep these records **DNS only**. Vercel manages HTTPS certificates. GitHub Pages is disabled.

Dependencies and generated build output are ignored for future additions. The existing repository already tracks historical copies of `node_modules` and `dist`; removing these from history is a separate maintenance task.

The original project remains editable in [Lovable](https://lovable.dev/projects/3f3c17b9-b82f-422a-9f3d-f8b7e44a6f86).
