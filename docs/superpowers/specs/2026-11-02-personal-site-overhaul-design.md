# Personal site overhaul: Sam, app projects and website evolution

Date: 2 November 2026

Status: Working brief for the local review implementation. The user clarified the broader personal-site structure, a growing project collection and website history. Art-direction decisions below are designer recommendations. Production publication is outside this work.

## Intent and agreed requirements

The first look should give visitors a clear sense of Sam. The site should feel individual and deliberately designed, using Sam's real work and voice. Sam specifically wants his personal projects to be prominent: bassh, Run Your World (RYW) and Kapture initially, with more apps added as he builds them.

The iPhone is the home for app projects within a broader personal website. It is not the website's navigation or a container for Sam's biography, career, contact details or website archive. All projects belong in the collection, including projects without recordings.

Sam also explicitly wants to build on the existing ability to explore older versions of his websites and their development. The archive should become a visible part of the site, with authentic saved versions and factual accounts of how they changed.

## Approaches and selected direction

The conversation considered one prominent iPhone with selectable projects and several phones showing the portfolio together. Sam clarified the controlling choice: a broader personal site with the phone serving as the home of projects, and a growing collection rather than a fixed three-project composition.

Use that direction. A phone-led whole-site interface would contradict Sam's clarification. Repeating a full phone for every app would become unwieldy as the collection grows. One project launcher, supported by an ordinary readable project directory, accommodates both discovery and future additions.

## Proposed page structure

Keep the existing React, TypeScript, Vite and Tailwind stack. This overhaul changes composition, presentation and content organization; it does not need a framework migration or new external service.

The homepage has four distinct parts, connected by a consistent visual identity:

1. **Introduction.** Sam's name, a short first-person introduction, ServiceNow/UAE context, and direct contact/CV access. Visitors should understand who he is without interacting with the phone. Use approved facts; do not imply that Sam is job hunting.
2. **What I'm building.** The app collection, with one interactive iPhone and a compact, visible directory of all projects. The directory identifies each app's purpose before any click. Initially order it bassh, RYW, Kapture, following Sam's stated list. This order is a design recommendation, not a new claim about priority or release readiness.
3. **Professional background.** A concise introduction to Sam's consulting and architecture work, linking to the existing detailed experience and qualifications. Keep employer initiatives and personal apps explicitly separate.
4. **The site, over time.** A preview of preserved website editions, a link to the complete history, and a short account of what changed between editions when evidence supports it.

Contact links remain easy to find at the end as well as in the introduction. The phone occupies only the projects section. Do not put the CV or site-history gallery inside its launcher.

Use clear top-level navigation to Home, Projects, Experience and Site history. Keep ordinary search and existing deep links available. Keep Updates and Books routes working; de-emphasize them in primary navigation while their collections are empty. Surface those collections when real content is published, without inventing filler.

Retain the existing detail routes and clean `/bassh` and `/kapture` pages. The Projects route uses the same collection and phone experience; it must not become a separate hard-coded portfolio. Homepage previews and project details should have a clear purpose rather than replaying duplicate media.

## Visual direction: designer recommendations

Use a restrained editorial composition built around Sam's name, real app imagery and authentic website previews. Retain the quiet graphite foundation as a starting point, but replace the generic `Overview` opening with a stronger identity and introduction. Use deliberate differences in scale, spacing and alignment rather than giving every section identical cards.

The introduction should have a distinctive sans-serif name treatment; factual labels and dates can use a quieter monospace treatment. The app section can feel tactile and device-oriented. The site-history section uses browser-shaped previews so it has its own recognizable purpose. Keep one considered accent and strong readable contrast across all sections.

These are proposed art-direction choices. Typography and color are not claims about Sam's preferences beyond his stated desire for an individual, immediately understandable site. Do not add a stock portrait or invent personal interests. Existing app icons and media should remain original assets. Motion is limited to useful interaction feedback and explicitly played recordings, with reduced-motion support.

On mobile, use normal vertical flow: introduction, readable project directory and phone, professional background, history and contact. Do not shrink the desktop layout or require sideways navigation. Desktop and mobile both retain visible links to the main areas.

## A growing app collection

Use the existing project records as the single source of truth. Adding a normal app should require a new record and its optional assets, not editing the launcher component, page layout and a separate set of cards.

Every project appears in both the launcher and the readable directory. Title, summary, platform and truthful development status are independent of recording availability. Icons and recordings are optional. Use a clearly typographic fallback for a missing icon; do not generate an imitation of a native app icon.

Recommended interaction:

- The phone opens on its home screen with every current app represented.
- Choosing an app with a recording opens that actual recording, with the app title and supporting description visible outside the screen. Preserve the existing direct-to-recording interaction rather than adding an unnecessary intermediate step.
- Choosing an app without a recording opens a readable in-phone project overview. It still has a purpose and a way home.
- Home, the bottom home control and Escape return to the launcher and restore focus to the launch control. Selecting from the external directory has the same result as choosing the corresponding app icon.
- Keep essential descriptions and conventional project links available outside the phone. Search results and existing project-entry links must still reach the relevant record.
- The launcher has a fixed status area and an app area that scrolls vertically within the device as the collection grows. Its caption cannot overlap later rows. No swipe-only pagination or three-item layout limit.
- Mount and load only the selected recording. Explicit playback, pause, failure handling, reduced-motion posters and visible keyboard focus remain available. Describe the media as recordings, not functioning embedded native apps.

The existing bassh and Kapture recordings are usable assets. RYW currently has neither approved public artwork nor a recording: its prior screenshot was withdrawn. Include RYW with its approved description, an `In development` label and an honest indication that a recording is not available. Do not restore the withdrawn route image or fabricate running maps or app interactions. A new genuine RYW recording can be added separately when available.

## Website editions and development notes

Build on `content/site-versions.json`, `PreviousVersions` and the real snapshot at `public/history/2026-10-08/index.html`. Preserve its stable ID, URL and bytes. Do not reinterpret its capture date as a launch date.

Add a dedicated Site history view, proposed route `#/history`, with chronological entries containing:

- Edition name and capture date.
- An authentic screenshot preview when one has been captured; otherwise a clear text presentation.
- A short optional summary and making notes describing evidenced decisions, changes and lessons.
- An `Open this version` link to the actual saved build.

Keep making notes visible in the history view; do not add an empty extra page for every edition. Screenshots are previews, not replacements for the preserved sites. Avoid loading all archived sites in live iframes. Show the current site distinctly from preserved editions; it links to the current homepage and is not described as an already frozen archive.

Extend the strict version schema with optional summary, notes and constrained preview-asset metadata so the existing record continues to validate unchanged. Update route validation, fixtures and search together: searching archive titles, summaries and notes should lead to the correct history entry without changing existing CV section-search behavior. Use stable record IDs for links and deterministic capture-date ordering.

Preserve the present design as a new edition before changing product code. This checkout has extensive existing modified and untracked work; `HEAD` alone does not describe it. Freeze the accepted baseline in an isolated source copy and record truthful provenance: either an exact committed source revision, or an explicitly identified working-tree capture with its base revision and source/build manifests. Extend the provenance contract if needed; never label a dirty build as the exact output of its parent commit. Public metadata must not contain raw private diffs or local filesystem paths.

Capture into a new dated directory. If another edition already uses that date, use a validated unique suffix rather than overwriting it. Existing dated paths remain supported. Build and prepare all snapshot-relative asset and navigation URLs before freezing the new artifact. Include standalone app pages, shared styles/scripts, original public app media and the public PDF CV needed by that edition. Exclude the entire prior history tree, installer archives and non-public Word originals. Existing download-withdrawal rules and redirects continue to apply; archiving must not restore withdrawn public downloads or images.

Generate build checksums and verify that each new snapshot can open, navigate and load its own assets under its saved path and under a temporary deployment subdirectory. Once accepted, freeze its bytes. Document capture steps so later substantial redesigns can be added by following the same process. Archive meaningful editions, not every minor edit.

## Implementation boundaries

Preserve all pre-existing dirty work and the repository's `AGENTS.md`. Implement against a frozen copy of the actual current source in an isolated workspace; an ordinary clean worktree at `HEAD` would omit the existing app-gallery work. Keep source changes, deliberate historical artifacts and generated review output separate. Use fresh temporary production-build directories.

Retain approved CV facts, public-content validation, direct contact and PDF access, accessible navigation, smooth section scrolling with reduced-motion support, and existing public app availability statements. No deployment, Git push, application release, backend change or physical-device installation is part of design approval. Continue using direct Vercel publication only when publication is separately authorized.

## Acceptance and verification

Implementation is ready for review when:

- The first screen identifies Sam and makes the app collection and main site areas apparent without requiring interaction.
- The phone remains confined to the projects area. All three projects are represented, and a fixture collection larger than the visible launcher capacity remains reachable without overlap or horizontal overflow.
- Apps without media remain useful and truthful. Home, Escape, focus restoration, keyboard activation, playback, reduced-motion and failed-media behavior work.
- The history view exposes authentic editions and making notes, the October snapshot remains unchanged, and the pre-overhaul edition is preserved with accurate provenance and independently working assets.
- Existing routes, entry links, search, CV downloads and app-availability restrictions retain their behavior.
- Focused regression tests for changed contracts and interactions, content validation, application type checking, focused lint and a fresh production build pass. Expand testing only where changes affect shared behavior.
- Desktop and mobile visual checks cover first impression, section balance, readable typography, overflow, keyboard navigation, route reloads and archive opening. Do not claim visual acceptance from source inspection or SSR alone.

## Review checkpoint

Review the local implementation against this brief. Browser visual and interaction acceptance must be reported separately from source, SSR and build checks. Publishing remains a separate authorized step.
