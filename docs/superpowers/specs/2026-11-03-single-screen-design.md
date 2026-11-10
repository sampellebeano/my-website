# Single-screen personal site

Sam approved development on 3 November: save the old style, keep the primary experience visible on one screen, place the iPhone on the right, and put app descriptions on a matching next page.

## Direction

Use the supplied reference's warm white, black typography, fine dividers and small blue punctuation. The signature is Sam's real app launcher at the right, with a compact selected-project index at the left. Keep the current React/Vite/hash-router stack and all factual project/CV records. No dependencies, infrastructure or production changes are required.

Palette: canvas `#f3f2ef`, paper `#fffefd`, ink `#191b1e`, secondary `#65666b`, line `#e7e5e2`, accent `#2455e8`. Display and body use the native sans-serif stack, with tightly tracked display type and monospace only for small utility labels. A simple typographic `sg.` mark keeps the introduction quiet enough for the actual apps to stand out.

## Composition and navigation

- Persistent brand/navigation header and a compact contact/CV/history footer.
- Home: name, short technology/AI/building introduction, current ServiceNow/UAE context, contact action, three compact project links; iPhone launcher at right.
- Projects: same two-column composition, compact app index at left, launcher at right.
- `#/projects/:projectId`: app summary and full factual description at left, selected recording or honest unavailable state at right. Longer app descriptions are split into short numbered pages, never clipped. App links and browser history remain normal links.
- Experience: select one role or highlight at a time. History: select one preserved edition at a time. All records remain reachable, including deep links.
- Existing search, notes, books, standalone app/setup pages, public routes and download restrictions remain available.

The desktop shell fits the viewport at ordinary laptop/desktop sizes. Phones retain a compact introduction and smaller right-side device when space permits. Short screens, narrow devices and enlarged text may naturally overflow rather than shrink text or hide controls. No nested scroll containers around descriptions. Respect reduced motion and visible keyboard focus. Do not add a synthetic notch/island to supplied captures. RYW has no approved artwork or recording.

## Preservation

Freeze the current dirty source before editing. Build that source to an external fresh directory, capture it as `public/history/2026-11-03-graphite`, retain source/build manifests, add a truthful working-tree edition record and verify saved links/digests. Preserve earlier archives and release bytes unchanged.

## Approaches

The previous discussion considered a scrolling detail page or short content screens. Sam chose the single-screen direction with app descriptions on the next page and a right-hand iPhone. Use routes and short selectable content pages; do not put the old long homepage inside a scrolling panel.

## Validation

Focused SSR tests cover compact homepage/project navigation, app detail content and pagination, controlled phone selection, role/highlight and edition selection. Run application types, focused lint, content validation and a fresh production build. Review desktop/mobile/keyboard visually if browser access is available; source/tests/build do not establish visual acceptance. The local browser is disabled in Work settings in this session.
