# Sam Green: personal website

A searchable personal CV and portfolio for Sam Green, Senior Solution Consultant at ServiceNow, based in the UAE. Built with React, TypeScript, Vite and Tailwind CSS.

The primary website address is [samjgreen.com](https://samjgreen.com/). The `www.samjgreen.com` address redirects to the primary domain.

The homepage features the Presight enterprise architecture initiative and current career history. Search and section navigation cover experience, selected work, education, courses and credentials. Project copy distinguishes proposals and demonstrations from completed implementation.

## CV downloads

The current CV, including the Presight example, is available in both formats:

[PDF CV](public/cv/Sam-Green-Solution-Architecture-CV.pdf)

[Word CV](public/cv/Sam-Green-Solution-Architecture-CV.docx)

Replace these files when updating the CV. Vite copies them unchanged into the published site. Website content is maintained in `src/data/cv.ts`, with the homepage introduction and featured work in `src/pages/Index.tsx`.

## Local development

Use Node.js 22 or later.

```sh
npm ci --include=dev
npm run dev
```

## Verification and build

```sh
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run preview
```

## Publishing

Vercel hosts the site and deploys the GitHub repository `sampellebeano/my-website`. The production branch is `main`; other branches receive preview deployments. The project belongs to the `samjgreen` Vercel account.

`vercel.json` configures the Vite build, checks TypeScript before building, and publishes `dist`. The GitHub Actions workflow in `.github/workflows/verify.yml` checks TypeScript and the production build; it does not publish the site.

Cloudflare manages registration and DNS for `samjgreen.com`. The root domain serves the Vercel production deployment, and `www.samjgreen.com` redirects to `https://samjgreen.com/`. Use the exact DNS targets shown in the Vercel project's Domains settings and keep these records **DNS only**. Vercel manages HTTPS certificates. GitHub Pages is disabled.

The custom domain in Settings > Pages is `samjgreen.com`. Cloudflare manages registration and DNS. Both the root (`@`) and `www` use DNS-only CNAME records pointing to `sampellebeano.github.io`; Cloudflare flattens the root record. GitHub Pages handles HTTPS and redirects `www` to the root domain. Keep **Enforce HTTPS** enabled once GitHub has issued the certificate. Because publishing uses GitHub Actions, the custom domain is managed in repository settings rather than a `CNAME` file.

Dependencies and generated build output are ignored for future additions. The existing repository already tracks historical copies of `node_modules` and `dist`; removing these from history is a separate maintenance task.

The original project remains editable in [Lovable](https://lovable.dev/projects/3f3c17b9-b82f-422a-9f3d-f8b7e44a6f86).
