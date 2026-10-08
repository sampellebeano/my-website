# Personal website: overview and published content

Date: 8 October 2026

Status: Written design for review; implementation planning follows approval.

## Purpose and agreed direction

Sam's website should make his professional background and current interests understandable in one glance. Its foundation is a clear CV and selected projects, with public daily notes, weekly recaps, a curated book shelf and an archive of previous site versions adding personal context.

The working audience is people assessing Sam's experience or exploring potential collaboration. The site should help them understand who he is, what he has worked on and how to learn more or contact him. It should not imply that he is seeking a new role or that proposed work has been delivered.

The user favours Brittany Chiang's restrained CV structure and highlighted projects. They like a compact overview, but dislike sideways scrolling and layouts whose contents are difficult to understand at a glance. They rejected Seán Halpin's fonts and colours, Maggie Appleton's density, and the overall appearance of Josh Comeau's and Lynn Fisher's sites. Bruno Simon's immersive approach is admired but outside the intended implementation.

The user accepted the recommendation to build the compact overview and publishing feed first, followed by local question answering. This document specifies that first build. Atlas publishing automation and the local model service each receive their own implementation scope after the foundation is usable.

## First-build scope

1. A compact overview with Sam's identity, career summary, selected projects and latest published activity.
2. Readable experience, projects and qualifications views using the existing CV content.
3. A public activity view with dated daily entries and weekly recaps.
4. A book collection with a public content contract and an honest empty state until Sam supplies real books.
5. A previous-versions control containing an immutable snapshot of the existing site.
6. Search across the published CV, activity and books, with PDF and Word downloads remaining prominent.

The first build uses the existing React, TypeScript, Vite, Tailwind and hash-routing setup. It remains a static website compatible with the repository's GitHub Pages build pipeline.

It does not create a model service, hardware purchase, public network tunnel, Atlas schedule or new hosting account. The free-form LLM feature follows as a separate subsystem. The first build keeps useful ordinary search and does not present generated or scripted answers as an active LLM.

## Layout and visual decisions

Use a quiet graphite palette, clear sans-serif typography, thin dividers and restrained emphasis. The visual signature is a compact professional dossier: an identity column alongside an overview of work and current interests.

Proposed colour roles:

| Role | Colour |
| --- | --- |
| Page background | `#15191F` |
| Raised surface | `#1E242D` |
| Primary text | `#F0F3F7` |
| Secondary text | `#AEB8C5` |
| Divider | `#394351` |
| Link and focus accent | `#9ABFFF` |

These are design values; implementation must check contrast for actual text, controls and focus states. No gradients, decorative serif display face, oversized slogan or scroll animation is needed. Use a local system sans-serif stack so typography does not depend on a third-party font request.

On a desktop viewport around 1440 × 900, the overview should fit comfortably in the first screen:

- Identity column: Sam Green, current role, ServiceNow and UAE, a concise introduction, PDF/Word downloads and contact links.
- Main area: two selected projects, a compact career summary, and the latest published update or weekly recap.
- Visible navigation: Overview, Experience, Projects, Updates and Books. Qualifications remain directly accessible within the CV view and existing section routes.
- Search is available as a compact, clearly labelled control rather than occupying the centre of the page.
- Previous versions is a small utility control.

Every main destination should be apparent immediately; no sideways scrolling or concealed primary navigation. Detailed content can exceed one screen. At smaller desktop sizes and on mobile, allow ordinary vertical scrolling rather than shrinking text or clipping content.

Use actual links for navigation, with the current destination marked. Keep usable browser history and deep links through the hash router:

| Destination | Route inside the URL hash |
| --- | --- |
| Overview | `/` |
| Experience | `/experience` |
| Projects | `/projects` |
| Updates | `/updates` |
| Books | `/books` |
| Search and full CV | `/search` |

Preserve existing `/search?query=...` and `/search?section=...` links. The section parameter retains its existing CV categories; Qualifications is linked directly from Experience. Each view has one primary heading, clear landmarks and a visible keyboard focus. After a view change, focus should move predictably to the content heading. The skip link must focus the main content without changing the route to an invalid hash path.

## Public content and data flow

Keep the existing CV facts in `src/data/cv.ts`. New public content lives in dedicated JSON files under `content/`, validated before the production build. The site renders these records without executing authored code or accepting arbitrary HTML.

Only content approved for publication belongs in these files. Drafts remain in Atlas's private task output or another private authoring location. They must not be hidden inside a browser bundle or committed to a potentially public repository. Raw conversation history, calendar records and private work notes are not visitor content.

Each activity record has:

- A stable, unique ID and kind: `daily` or `weekly`.
- A short title and one to four plain-text paragraphs or bullets.
- A publication timestamp with an explicit UTC offset.
- For daily records, the activity date; for weekly records, a start and end date.
- For weekly records, the IDs of the published daily entries used to produce the recap.
- Optional links to related public projects, books or public source pages.

Authored links may be HTTPS URLs or supported routes on this site. Reject executable URL schemes and unsupported record references.

Display dates in `Asia/Dubai`. Weekly intervals run Monday through Sunday in that timezone. Sort published activity by its publication timestamp, with a stable ID tie-breaker. A weekly recap is derived from that week's published daily notes and can link back to them. It must not introduce achievements unsupported by those notes.

The overview shows the newest published item. The Updates view leads with the latest published weekly recap and offers the associated daily entries, followed by older weeks. If no weekly recap exists, show daily entries directly. Empty weeks do not produce fabricated posts. With no activity records, use a short message that Sam has not published updates yet.

Each book record has a stable ID, title, author, reading status (`reading`, `read` or `want-to-read`), an optional completion date, an optional public link, and Sam's optional short note. No books, endorsements, ratings or reading dates are invented. The overview only shows reading content when real entries exist; Books has a readable empty state otherwise. The first version works without cover artwork.

Search uses the published plain text from CV entries, activity and books. Retain case- and accent-insensitive matching. Group or label results by their source type and link to the relevant view. With a query and no CV section filter, search all public content types. With a recognised section parameter, search that CV section. An empty query browses the selected CV section, or the full CV at `/search` with no section. An unmatched query offers useful navigation. Updates and Books provide their own collection browsing views.

## Previous site versions

Before replacing the current layout, preserve its existing production build as an immutable snapshot under a dated history path. Include its CSS, JavaScript and CV assets so the snapshot works independently of future source changes.

Label it as the CV/search version saved on 8 October 2026, with a thumbnail or concise description and a link that opens the old version. This is a capture date, not a claim about when the design first launched. Start with this one authentic snapshot; do not invent earlier versions or turn every minor edit into an archive entry.

## Atlas authoring workflow after the foundation

The foundation provides a documented, validated public-content format that Atlas can update later. Once the site is usable, agree on the source material, daily timing, weekly timing and publication permissions with Sam.

The intended workflow is: approved sources → private draft → reviewed public entry → validated website content → normal site build. Begin with reviewed drafts to establish tone and publication boundaries. Automation can follow for the agreed kinds of content. A quiet day can have no public update.

The GitHub Pages build should validate content before deployment. An invalid new record fails that build so it cannot replace the last successful published site. The initial site needs no live activity API to render its existing entries.

This design does not assume a direct API to Atlas's private memories or turn Atlas into the visitor-facing agent. Dot scheduling and local access are documented capabilities, while the actual publishing connection still needs configuration for Sam's account.

## Local question answering after the foundation

The intended public feature is “Ask about Sam”, using natural questions and answers supported by public sources. Its knowledge collection is the same approved CV, projects, activity and book content the website displays.

The future architecture keeps the public site available on conventional hosting while a small application API routes visitor questions to a local model on Sam's Mac. Model selection follows a benchmark on his existing machine before deciding whether a dedicated Mac mini is appropriate.

The service should retrieve relevant public material, generate an answer, attach links to the supporting records, and say when the published information does not answer a question. The application API supplies request limits and protection around the model endpoint. If the model is offline or busy, the site continues to offer browsing and ordinary search.

Visitor inference may run locally. Atlas itself remains a cloud agent, including when it delegates work to a connected Mac. No service implementation or public exposure is authorized by this design document alone.

## Validation for the first build

Add focused coverage for the new content contracts and search behaviour, including:

- Duplicate IDs, invalid dates, malformed week intervals and invalid links.
- Publication ordering and Dubai date/week boundaries.
- Empty daily, weekly and book collections.
- Search across each public content type, including case and accent handling.
- Weekly references resolving to the intended published daily entries.

Run TypeScript checks and a production build. Inspect the overview and navigation at desktop and mobile sizes, checking readable layout, keyboard operation, focus handling, deep links, search and downloads. Verify that the historical snapshot opens and serves its own assets. Record screenshots of the resulting overview and activity view.

Preserve the pre-existing tracked changes to `.DS_Store` files and the two deleted esbuild binaries. Generated build output and dependency caches must not be bundled into the change. The repository tracks historical `dist` and dependency files, so build QA should use a temporary output directory.

## Completion criteria

The first build is ready when visitors can understand Sam's role, career, selected work and latest published activity from the overview; navigate the full public content; search it; download either CV format; and open the authentic previous version. Empty content states are truthful, mobile layout remains readable, and all focused checks pass.

Atlas automation and local question answering remain explicit follow-on work until their sources, connections and operational requirements are configured and verified.

## Evidence and references

- Current repository: `src/data/cv.ts`, `src/pages/Index.tsx`, `src/pages/SearchResults.tsx`, `src/App.tsx`, `README.md` and the GitHub Pages workflow.
- Existing site revision: `43a89421` — Update personal CV site and add PDF and Word downloads.
- User's website-reference feedback and acceptance of the staged recommendation in this conversation.
- [Dot tasks and schedules](https://learn.chatgpt.com/docs/dots/tasks-and-memory).
- [Dot computer access and cloud/local distinction](https://learn.chatgpt.com/docs/dots/computers-and-apps).
- [LM Studio system requirements](https://lmstudio.ai/docs/app/system-requirements).
- [Ollama local API authentication](https://docs.ollama.com/api/authentication).
