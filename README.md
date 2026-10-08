# Sam Green: personal website

A searchable personal CV and portfolio for Sam Green, Senior Solution Consultant at ServiceNow, based in the UAE. Built with React, TypeScript, Vite and Tailwind CSS.

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

The GitHub Actions workflow in `.github/workflows/jekyll-gh-pages.yml` builds the Vite application and deploys `dist` to GitHub Pages on pushes to `main`. The workflow filename is retained from the original project; it does not run Jekyll.

GitHub Pages must use **GitHub Actions** as its publishing source under Settings > Pages. Hash-based navigation and relative asset paths allow page refreshes on GitHub Pages and deployments at a repository subdirectory or domain root.

Dependencies and generated build output are ignored for future additions. The existing repository already tracks historical copies of `node_modules` and `dist`; removing these from history is a separate maintenance task.

The original project remains editable in [Lovable](https://lovable.dev/projects/3f3c17b9-b82f-422a-9f3d-f8b7e44a6f86).
