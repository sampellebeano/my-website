# App recordings

The homepage and Projects page show an interactive iPhone. Selecting Kapture or bassh opens a short recording of the native app in Simulator. Selecting highlighter opens a written overview. Sam withdrew its screenshot and public image file.

## Current Kapture walkthrough — 2 November 2026

The current recording is `kapture-journey-demo.gif`: 402 × 874, 427 frames, 35.58 seconds, 4,129,556 bytes. Its 402 × 874 still poster, `kapture-journey-demo-poster.png`, shows the owner’s Portfolio and is 157,186 bytes.

The sequence starts in Explore, opens Kapture UI Demo’s profile and flower photo, then moves to Projects. The editorial project shows Active status, one deliverable and two of four milestones complete. It expands the brief, shows the remaining two image uploads and delivery check, previews the uploaded flower image, and finishes on Demo Creator’s own Portfolio with Add work, Preview and Arrange available. The final Portfolio holds for about four seconds.

These are real native Kapture views in a temporary recording build, using approved public demo image bytes and in-memory sample project and owner data. The existing application repository was not changed. No authenticated session was restored or copied, and no hosted project, task, upload or account data was edited. The capture used a separate **Kapture Website Journey 20261102** simulator, which is now shut down. Keyboard shortcuts in that temporary build and native controls drove the navigation. Native transitions and image proportions are retained; only idle time was cut. No screen content, overlays or cursor were composited into the recording. Raw capture, temporary source, frame mapping and editing tools remain outside this repository.

The superseded active `kapture-demo.gif` and its poster are removed. Their copies inside the frozen 2 November site edition remain unchanged. Play/Pause, reduced-motion posters and on-demand loading retain the existing viewer behavior.

The walkthrough is published on [samjgreen.com](https://samjgreen.com/) as production deployment `dpl_2dV8bSpFnfyTRPijA4wziwwQNUUV` (READY, all custom domains assigned). Publication used a byte-verified copy of the previous live deployment, with only the Kapture recording, poster, descriptions and required bundle references changed; the separate local site overhaul was not published.

Verification: all 33 focused project, viewer and route regressions, application type checking, focused lint, content validation and a fresh production build passed. All 32 deployed public-file hashes match the reviewed package; the new GIF returns `image/gif`, both clean Kapture page URLs serve the new recording, and both old media URLs return HTTP 404. The native source screens and GIF frames were visually reviewed. Browser access is disabled in this session, so website browser layout and interaction acceptance was not rechecked. This recording does not establish physical-device or released-app acceptance.

## Original recordings — 2 November 2026 (Kapture superseded)

| Asset in `public/images/apps/` | Source | Delivery |
| --- | --- | --- |
| `kapture-demo.gif` | Actual Kapture native public-profile and photo-viewer screens. Opens the demo flower photograph, shows its camera information, and returns to the portfolio. All demo photographs remain visible. | 402 × 874, 8.01 seconds, 1,359,373 bytes |
| `bassh-demo.gif` | Actual bassh connected over SSH to a disposable loopback server on this Mac. A real zsh process runs `ls`, `./hello.sh` and `git status -sb` in a throwaway Git project. | 402 × 874, 9.91 seconds, 125,366 bytes |
| `kapture-demo-poster.png`, `bassh-demo-poster.png` | Still frames from those same recordings, for paused playback and reduced-motion preferences. | 402 × 874 |

The recordings come from the isolated **Website App Gallery 20261102** simulator. Native screen capture was converted with FFmpeg, retaining the screen aspect ratio and the actual app transitions. Idle recording time was trimmed; no app interactions, photographs, route geometry or terminal output were generated or composited into the recordings. Raw MP4 files and capture tools stay outside this repository.

Kapture’s normal local Debug configuration points at a local backend, and the new direct-handle RPC is not deployed on the hosted backend. A temporary source copy outside the Kapture repository used the existing release public-client configuration and a recording-only entry into the existing native public-profile route. It loaded the approved public demo profile through the already deployed creator-directory API. The native profile, gallery and photo viewer were used unchanged. No authentication was bypassed, no session was copied, and no hosted data was edited. This capture does not establish production deep-link readiness. The synthetic far-future dates in some other demo portfolio items were left unchanged; the recorded flower photo has its actual 8 September 2026 date.

Bassh used a loopback-only server with a throwaway password and independently verified ECDSA host fingerprint. No system Remote Login, personal SSH keys, authorised-key files, Tailscale configuration or real project files were changed. Shell commands were driven on the disposable server and their real output was rendered by the app.

Both GIFs loop and have a keyboard-accessible Play/Pause control. Pausing shows the still poster. Visitors who prefer reduced motion start with the poster; they can explicitly play a recording. Full-size media opens only when selected. The app’s captured status bar supplies the Dynamic Island; the frame adds no second overlay.

These are development/demo recordings, not proof of physical-device acceptance or app release state. The temporary Kapture build is only for capture and is not released. Original application repositories, dated website snapshots, release archives and existing app-download restrictions are preserved. Superseded promotional PNGs were removed from the public assets.

## Publication and verification

The RYW withdrawal was first published separately as production deployment `dpl_2GjxjASYm17BaZS8EU5i5N6dG4kX` (READY, custom domains assigned). Live CSS hides the previous figure and its image URL returns HTTP 404. The new source removes the image reference entirely.

The recordings are published on [samjgreen.com](https://samjgreen.com/) as production deployment `dpl_3zR5FWQT7o4gFhCR1JUbwrHmixBj` (READY, all custom domains assigned).

- All 73 regression tests, application type checking, the production build, and focused lint of the changed TypeScript and playback JavaScript pass. The SSR suite needed local-server permission; its initial sandbox-only listen failure was rerun successfully with that permission.
- Overview, Projects, bassh and Kapture were checked at 375px and 768px without horizontal overflow. The 1280px overview shows two matching phone frames and a text-only RYW row.
- React and static-page Play/Pause controls work, including keyboard activation. Reduced-motion SSR checks start with posters and Play controls. The live overview renders both 402 × 874 posters correctly when paused, resumes both GIFs through keyboard activation, and the live Projects hash route reloads correctly.
- All 32 deployed public-file hashes match the reviewed build, including GIFs, posters, current bundles, app pages, PDF CV and historical assets. Both GIFs return `image/gif`.
- Eleven live route checks pass: clean app-page URLs, four superseded image URLs returning HTTP 404, and existing installer/current Word/historical Word redirects returning HTTP 307.
- Full-repository lint continues to report three existing errors in `src/components/ui/command.tsx`, `src/components/ui/textarea.tsx` and `tailwind.config.ts`, plus seven warnings. These files were not changed for this work.

A live visual proof is saved in the task’s visualization folder as `app-gifs-live.jpg`. Capture tools and raw videos remain temporary local artifacts. The disposable SSH server is stopped and the recording simulator is shut down. No Git push, application release or physical-device installation was performed; the existing dirty checkout was preserved.

## Interactive Projects iPhone — 2 November 2026 (local)

Projects now starts with a single iPhone home screen. Its Kapture and bassh icons open the existing GIFs inside that screen. Home, the bottom home gesture and Escape return to the launcher and restore focus to the icon that opened the demo. Only the selected recording is mounted; the launcher downloads neither recording. The native captured status bar replaces the simulated home-screen status bar while an app is open, with the original 402 × 874 aspect ratio preserved.

Play/Pause uses the existing posters. A reduced-motion preference starts each demo paused, and switching to that preference pauses playback. Visitors can explicitly play a recording. A failed image shows a readable error and leaves Home available. All three project descriptions and the existing project links remain below the phone.

The Kapture home-screen icon is copied byte-for-byte from `AppIcon60x60@2x.png` in the existing native capture build, delivered as `public/images/apps/kapture-icon.png` (120 × 120). Bassh uses its existing public icon. No new RYW artwork or recording has been added.

Local verification: all 73 regression tests pass, with the localhost route test rerun outside the restricted sandbox; application type checking, focused lint and the production build pass. Seventeen DOM interaction checks cover launch, playback, Home/Escape, focus restoration, reduced-motion changes, image failure/recovery and listener cleanup. Browser access is disabled in this session, so mobile layout, visual appearance and browser hash-route reloads have not been rechecked for this change. This interactive version has not been deployed.

## Growing project collection — 2 November 2026 (local overhaul)

The single project iPhone now appears within the broader personal homepage and Projects view. Every project record appears in its launcher and a readable directory. Current order: bassh, RYW, Kapture. Recording availability is optional: RYW uses a typographic tile and its approved project summary, with an explicit no-recording state. Its withdrawn artwork remains absent. Future app records need no separate launcher edit.

The launcher scrolls vertically when the collection grows. Only a selected recording is loaded; Home, Escape, focus restoration and reduced-motion playback remain supported. Browser visual/interaction acceptance is pending because local browser access was disabled during implementation. SSR checks cover all three projects and a larger collection; these do not establish real scroll geometry or physical-device behavior.

The actual pre-overhaul working build is preserved at `public/history/2026-11-02/index.html`. Its capture is identified as a working-tree edition with a base revision and source/build manifests. The October snapshot remains byte-for-byte unchanged. The new snapshot includes its own app pages, media and PDF, excluding nested history, installer archives and Word originals.

## Homepage app launcher — 2 November 2026 (local)

The interactive iPhone now lives only in the homepage’s personal-app section. Its bassh, RYW and Kapture icons open the existing recording or project overview, with Home screen, the home gesture and Escape returning to the launcher. On narrow layouts, the phone comes before the readable app directory. Recordings still load only after an app is selected; RYW still has no recording.

Projects retains the full project descriptions and links to the homepage iPhone. The standalone bassh and Kapture pages also link there instead of embedding separate phone recordings. Existing media and dated snapshots are preserved.

Local verification: 95 regression tests, application type checking, focused TypeScript lint and a fresh production build pass. Browser access is disabled in Work settings, so responsive layout and browser interaction checks remain pending. This change has not been deployed.
