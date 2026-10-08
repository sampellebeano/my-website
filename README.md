# Sam Green: personal website

A personal CV, portfolio and public activity feed for Sam Green, Senior Solution Consultant at ServiceNow, based in the UAE. Built with React, TypeScript, Vite and Tailwind CSS.

The primary website address is [samjgreen.com](https://samjgreen.com/). The `www.samjgreen.com` address redirects to the primary domain.

The compact overview features Presight and aviation work, four career roles and the latest published update. Navigation opens Experience, Projects, Updates and Books. Project copy distinguishes proposals and demonstrations from completed implementation. Daily notes and books start empty; add only real, publication-approved content.

## Views and search

Routes live inside the URL hash: `#/`, `#/experience`, `#/projects`, `#/updates`, `#/books` and `#/search`. Projects, updates and books accept `?entry=<stable-id>` for a readable individual record; unavailable IDs return the collection with a notice.

A nonempty query at `#/search?query=...` searches the CV, published activity and books. Matching ignores case and accents and requires every query word. Existing `?section=about|experience|work|qualifications|contact` links filter the CV only. An empty or whitespace-only query browses the full CV or selected CV section; an unknown section returns no results.

## Public content

CV facts remain in `src/data/cv.ts`. Public daily notes and weekly recaps live in `content/activity.json`; books live in `content/books.json`. Strict schemas reject unknown fields, invalid dates, duplicate IDs, unsafe links and invalid weekly references. Builds validate content before producing the site, and CI runs the focused tests before TypeScript and build checks.

See [public authoring and the future Atlas connection](docs/atlas-publishing.md) for the exact formats. Keep private drafts outside this repository. All dates display in `Asia/Dubai`; activity weeks run Monday through Sunday. Daily notes group by their activity date even if published later.

Atlas publishing and visitor LLM answers are follow-on integrations. This release provides ordinary search and a validated publishing format; it has no active model service or schedule.

## Previous website

The CV/search site captured on 8 October 2026 is saved independently at `public/history/2026-10-08/index.html`, including its own assets and both CV files. `content/site-versions.json` records the capture date and source revision. The Previous versions control opens this actual snapshot. Use the explicit `index.html` URL: Vite's development server otherwise falls back to the current SPA for the directory URL.

Never rebuild over a saved snapshot or copy an existing history tree into a new one. Historical snapshots are deliberate public artifacts, distinct from root build output.

## CV downloads

The current CV, including the Presight example, is available in both formats:

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

The GitHub Actions workflow in `.github/workflows/jekyll-gh-pages.yml` builds the Vite application and deploys `dist` to GitHub Pages on pushes to `main`. The workflow filename is retained from the original project; it does not run Jekyll.

GitHub Pages must use **GitHub Actions** as its publishing source under Settings > Pages. Hash-based navigation and relative asset paths allow page refreshes on GitHub Pages and deployments at a repository subdirectory or domain root.

The custom domain in Settings > Pages is `samjgreen.com`. Cloudflare manages registration and DNS. Both the root (`@`) and `www` use DNS-only CNAME records pointing to `sampellebeano.github.io`; Cloudflare flattens the root record. GitHub Pages handles HTTPS and redirects `www` to the root domain. Keep **Enforce HTTPS** enabled once GitHub has issued the certificate. Because publishing uses GitHub Actions, the custom domain is managed in repository settings rather than a `CNAME` file.

Dependencies and generated build output are ignored for future additions. The existing repository already tracks historical copies of `node_modules` and `dist`; removing these from history is a separate maintenance task.

The original project remains editable in [Lovable](https://lovable.dev/projects/3f3c17b9-b82f-422a-9f3d-f8b7e44a6f86).
