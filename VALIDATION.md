# Validation — 2026-10-19

The website was built and exercised locally on Windows in an isolated Chromium browser. These checks are not a production deployment or real-device Safari acceptance.

## Build

- `npm run build`: TypeScript and Vite production compilation passed.
- `npm audit`: zero vulnerabilities after updating the image-processing build tool.
- `npm audit --omit=dev`: zero production dependency vulnerabilities.
- Production assets served with `npm run preview -- --port 4173` and loaded in the browser.
- Vite reports one size advisory for the separately lazy-loaded full hls.js player. After restoring all pages, main app JS is about 414 KB (132 KB gzip); Text Type/GSAP is deferred (77 KB / 30 KB gzip); HLS is about 593 KB (185 KB gzip).

## Full navigation restoration

Production build and 67 targeted browser assertions passed after adding the original multi-page menu. See `scripts/qa-navigation.js` and `output/playwright/navigation-checks.json`.

- Seven desktop entries: Home, Vision, Services, Tools/Platforms, Resources, Working with us and About us.
- Working with us opens its overview and all three original subpages. Enter opens the disclosure; Escape closes it and restores focus.
- Mobile menu contains all eleven destinations, including Contact us. A nested workshop link was followed successfully; Escape closes the menu and restores focus.
- All ten inner pages opened directly with HTTP 200, a distinct heading and actual page content. Refresh preserved each page. Browser Back, `/home/`, nested trailing-slash URLs and unknown-page recovery were checked.
- Local site search lists all eleven pages, filters workshop/ALMOps queries, shows an empty state, follows a result to its page and restores focus on Escape. Escape handling explicitly closes the dialog even when a search input contains text.
- Homepage and Tools/Platforms header bounds and horizontal overflow checked at 320, 390, 768, 1024, 1190, 1280 and 1440px.
- No application exceptions occurred in these checks. The run used reduced motion for deterministic layout inspection; the initial motion/media checks below are earlier evidence and were not rerun for this navigation-only change.
- Visually inspected `navigation-desktop-1440.png`, `navigation-mobile-390.png` and `services-desktop.png`. Additional captures: `navigation-dropdown.png` and `workshops-mobile.png`.
- Generated physical HTML entries for all pages plus `/home` and `404.html`; deployment-specific rewrites and HTTP 404 status remain host configuration, not locally proven hosting behavior.

## Browser coverage

| Area | Observed result |
| --- | --- |
| Desktop hero | 1440×900; full-width image/video; glass header; bottom-left copy; no horizontal overflow |
| Mobile hero | 390×844; 24px copy inset; navigation menu; safe CTA and video-control positions |
| Responsive widths | 320, 360, 390, 768, 1024, 1440 and 1920px checked for horizontal overflow |
| HLS playback | hls.js/MediaSource playback; 1920×1080 decoded video; 8-second duration; time advances and loops |
| User pause | Playback stops; explicit pause persists after scrolling away and returning |
| Offscreen video | Pauses outside the hero; resumes on return when the visitor has not manually paused |
| HLS failure | Request aborted deliberately; MP4 fallback plays |
| Total video failure | Both media requests aborted deliberately; static poster remains; navigation still works |
| Autoplay denial | `play()` rejection simulated with `NotAllowedError`; poster remains; user click starts video |
| Reduced motion | Static title and lifecycle phrase; video source not loaded automatically; explicit play remains available |
| ALMOps | All six stages show their own content; arrow keys and End change selection/focus |
| Ecosystem | All three perspectives switch text and image |
| Research | Both details open; original diagram expands; Escape closes and focus returns to invoking button |
| Mobile menu | Opens; closes using Escape; section links work |
| Contact | Published company details and real mailto targets; no email sent |

No application error was seen during normal production use. Deliberately blocked media requests produce expected network errors in failure tests. Motion emits an informational reduced-motion warning in the development build when that setting is emulated.

## Text effects and transitions

- Blur Text: actual official component, word-by-word opacity/blur/short vertical motion; stable final title captured on desktop/mobile.
- Shiny Text: official component configured `trigger="view"`, one sweep; its first-view guard prevents repeating sweeps.
- Text Type: official component with four phrases; fixed 56px container and a pause control. Static fallback under reduced motion.
- Shatter substitute: 54 independently clipped polygon shards. First-entry assembly observed, click replay observed, mobile click dispatch replay observed. This is original code, **not the React Bits Pro Shatter Type source**.
- Hero framing stays fixed while scrolling; the white ALMOps surface enters in normal document flow. Ecosystem imagery expands and contracts via a scroll-linked clipping mask. Perspective changes crossfade. Research copy remains stable. Contact imagery gently reveals and its text enters once.

## Video contrast

All 240 frames of the delivered MP4 were decoded for both measured viewport layouts. A grid at 8px intervals was sampled across the entire title, supporting-copy and label bounding boxes, using the actual object-cover crop and numerical compositing of the CSS overlays. This is repeatable sampled contrast evidence, not a claim of pixel-exhaustive accessibility certification.

| Text | Desktop minimum | Mobile minimum |
| --- | ---: | ---: |
| White heading | 6.96:1 | 7.63:1 |
| Supporting copy | 9.83:1 | 8.95:1 |
| ALM label (base colour) | 6.20:1 | 4.80:1 |

These numerical results were recomputed across all 240 frames after the fixed-camera video export. Earlier scene screenshots predate that export.

Six full-size desktop frames were also captured around each scene and crossfade for visual review. See `output/playwright/contrast-report.json` and `scripts/measure-contrast.mjs`.

## Evidence and reproduction

- `output/playwright/production-1440.png`, `production-390.png`: final hero captures.
- `output/playwright/production-desktop-checks.json`, `production-responsive-checks.json`, `production-motion-checks.json`: successful production checks; motion verification samples the visible typing text rather than screen-reader fallback text.
- `output/playwright/desktop-full.png`, `mobile-full.png`: full-page captures.
- `output/playwright/desktop-film-*.png`: scene/crossfade snapshots.
- `output/playwright/video-failure-poster.png`: both-source failure.
- `scripts/qa-browser.js`, `qa-responsive.js`, `qa-video-fallbacks.js`: Playwright CLI `run-code` functions. Change the local URL from port 5173 to 4173 to exercise the production preview. No test framework is required.
- The rendering script generated actual H.264 MP4, HLS VOD manifest and four media segments. The original Remotion export failure and FFmpeg fallback are recorded in README.

## Footer simplification and steady hero follow-up

- Removed the footer's repeated page menu and its unused CSS; the top navigation and all eleven pages remain available.
- Removed hero scroll-linked scaling/translation and exported both MP4/HLS without camera zoom or pan. The three material scenes retain soft crossfades and matching first/last framing.
- `npm run build` passed. `scripts/qa-steady-hero.js` passed 20 browser assertions at 1440×900 and 390×844: HLS playback across a complete loop, unchanged hero transform at several scroll positions, user pause, absent footer menu, retained contact details and no horizontal overflow.
- Browser playback counters reported 3 dropped frames out of 265 desktop frames and 0 out of 260 mobile frames in this isolated Chromium run. This verifies playback and loop behavior, not a guarantee of zero device-dependent decoder drops.
- Decoded all 240 frames and compared downsampled luminance: static-shot mean differences were 0.0008–0.1561 on a 0–255 scale; the last-to-first difference was 0.4355. These are compression-level residuals with no programmed camera motion. Evidence: `output/playwright/steady-video-frames.json` and `steady-hero-checks.json`.
- Updated the full-loop text contrast values above. Footer captures: `footer-clean-1440.png` and `footer-clean-390.png`.

## Mobile page and alignment audit

- Audited all eleven pages at 320×568, 360×740, 390×844, 430×932 and 844×390: 55 page/viewport combinations. Reviewed full-page captures of all eleven pages at 390px.
- No horizontal page overflow or clipped text containers were found in the checked headings, body copy, breadcrumbs, buttons, lifecycle/ecosystem tabs and contact details.
- Fixed the narrow search dialog's flex-shrunk close button (previously about 35px at 320px): it now keeps a 44×44px hit area. The mobile header search target is also 44×44px; its input uses 16px text and a shorter, fully visible placeholder.
- Replaced mobile menu plus/minus, menu-row arrows, search-result arrows and search-close characters with fixed-size SVG icons. Menu row icons and labels share the same vertical centre.
- Fixed stale mobile-menu scroll position: reopening now starts at Home, while the entire eleven-link menu still scrolls to Contact us on short screens.
- Reran all 55 combinations after changes, checking header separation, menu bounds, last-item reachability, menu reset and icon centring. All passed. All five search dialogs fit their width and retain a 44px close target.
- Evidence: `scripts/qa-mobile-pages.js`, `output/playwright/mobile-pages-audit.json`, `audit-menu-*.png`, `audit-search-*.png` and `audit-page-*.png`.
- With normal motion enabled, 61 additional interaction checks passed: four portrait widths covering animated headline bounds, menu-toggle icon alignment, all six lifecycle stages, all three ecosystem perspectives, both research dialogs with original artwork expanded, submenu navigation and search-result navigation; desktop dropdown regression also passed. Evidence: `scripts/qa-mobile-interactions.js` and `output/playwright/mobile-interactions-checks.json`.
- The production build passed after these component/CSS changes. Coverage is local Chromium viewport emulation, not physical iOS/Android device acceptance.

## Desktop audit — 2026-10-20

- Checked all eleven pages at 1024×768, 1191×768, 1280×720, 1440×900, 1920×1080 and 2560×1440: 66 page/viewport combinations. The 1191px case covers the first width with the full desktop navigation. Reviewed full-page captures of every page at 1440px.
- No horizontal page overflow, clipped text containers, overlapping grid columns or navigation collisions were found. Checked headings, descriptions, breadcrumbs, chapter links, tabs, footer details, editorial insets and the expanded collaboration dropdown.
- Found and corrected the shared inner-page banner caption inset on large screens: at 2560px it was 113.91px while the content grid began at 88px. It now uses the same capped inset as the editorial content. Reran all 66 cases, including an explicit caption-alignment assertion: zero failures and no application errors.
- Passed 51 interaction assertions at 1191, 1440 and 1920px with normal motion enabled: animated headline bounds, every lifecycle and ecosystem selection, both expanded research dialogs, keyboard dropdown operation, submenu destinations, search dialog/results and chapter anchors.
- `npm run build` passed (TypeScript, Vite and all static page entries). Existing lazy hls.js size advisory remains. Staged whitespace checks also passed after removing trailing blank lines from the three upstream component files; their behavior is unchanged.
- Reproduction: `scripts/qa-desktop-pages.js` and `scripts/qa-desktop-interactions.js` are Playwright CLI `run-code` functions. Local reports: `output/playwright/desktop-pages-audit.json`, `desktop-interactions-checks.json`, and `desktop-audit-*.png`.
- This is local Chromium production-preview coverage. GitHub source delivery is separate from hosted-site deployment verification.

## Visual refinements — 2026-10-20

- Removed decorative diagonal/down/up arrows from CTAs, navigation rows, research links, ecosystem tabs and the Oversight accent. Functional menu, dropdown, search and disclosure controls remain.
- Removed the persistent film overlay. The background video control remains available to assistive technology and becomes visible only on keyboard focus.
- Text Type now types “Discover and register.” once and keeps it. Scrolling away and back does not restart or erase the phrase. This supersedes the earlier four-phrase cycling/pause-control behavior.
- Removed the old-company-material link from both research dialogs. Replaced the dated ecosystem matrix image with a generated conceptual People / Data / Technology illustration, optimized to a 189,950-byte WebP. Its prompt and source are in `design/research/`.
- Converted shared text CTAs to rounded pale-blue buttons with cobalt hover/focus feedback and no underline/bottom border.
- All 66 desktop page/viewport combinations and 55 mobile page/viewport combinations passed again. Five mobile search dialogs and the narrow research dialog also passed. Evidence: `refinement-desktop.json` and `refinement-mobile.json` under `output/playwright/`.
- All 22 targeted assertions passed at 1440px and 390px, including non-decreasing typed text, retained completion, no scroll restart, hidden idle playback control, new image decoding, removed external source links, hover color changes, no CTA underline, no page overflow, and reduced-motion behavior. Evidence: `scripts/qa-visual-refinements.js` and `refinement-details.json`.
- Nine video assertions passed: HLS-to-MP4 fallback, total-failure poster, descriptive unavailable state, usable page on failure, blocked-autoplay poster, keyboard recovery, persistent user pause, offscreen pause and onscreen resume. The autoplay-denial test disables native autoplay as well as rejecting `play()`; overriding the method alone does not simulate browser policy. Evidence: `refinement-video.json`.
- Reviewed screenshots of the desktop hero, desktop hover buttons and mobile research illustration. Production TypeScript/Vite build and all eleven page entries passed. Existing lazy hls.js size advisory remains.
- Coverage is local Chromium with emulated viewports; hosted deployment and physical Safari/iPhone acceptance remain separate.

## Retained lifecycle copy and company details — 2026-10-20

- Corrected the preceding single-phrase interpretation: all four phrases now type in order and remain visible: “Discover and register.”, “Assess and authorise.”, “Operate and evolve.” and “Retire responsibly.”
- Desktop uses two columns and two rows; phones up to 600px use four rows. Each phrase reserves its complete text footprint before typing starts, and its animated layer fills that space. No cursor is rendered. Reduced motion displays all four immediately.
- Removed the ABN from the shared footer, About us and Contact us content.
- Production TypeScript/Vite build passed. All 33 targeted assertions passed, including sequential appearance, no deletion, completion retention, stable reserved height, actual character bounds, no cursor, no scroll restart, reduced motion and ABN removal.
- Rechecked the three affected pages at six desktop and five mobile sizes: 18 desktop and 15 mobile page/viewport cases passed; the five mobile search-dialog checks and narrow research-dialog check also passed.
- Visually inspected final desktop and phone lifecycle screenshots. Local evidence: `lifecycle-retained-checks.json`, `lifecycle-desktop-layout.json`, `lifecycle-mobile-layout.json`, and `lifecycle-retained-{1440,390}.png` under `output/playwright/`.

## Requested website copy and ALMOps image — 2026-10-23

- Applied the supplied revision list to Home, Vision, Services and Tools/Platforms. Preserved the requested wording “Agent evolve.”. The shared contact invitation uses the new enterprise agentic practice headline while retaining “A clearer way forward.” as supporting text.
- Replaced the animated Oversight label with “Agent Governance and Management”, with responsive word-safe wrapping. A solid glyph appears after the fragment animation settles to remove visible polygon seams; keyboard replay and reduced-motion support remain.
- Placed the existing company ALM platform concept image above chapter 01 ALMOps, with a full-size link and the existing development/verification distinction. No new product metrics or integration claims were introduced.
- All 66 desktop and 55 mobile page/viewport checks passed. The mobile search and narrow research-dialog checks also passed. No application errors or layout failures were reported in the desktop audit.
- All 36 targeted checks passed at 1440px, 390px and 320px: requested copy, glyph bounds, keyboard replay, image position/loading, full-size image opening and horizontal overflow. Reviewed desktop/mobile screenshots of the new section heading, contact invitation and Tools/Platforms title.
- Production TypeScript/Vite build passed; the existing lazy hls.js chunk advisory remains. Reports and screenshots are in `output/playwright/oct23-*`.

## Remaining device and delivery boundaries

- Native HLS on a physical Safari/iPhone device and real low-power/data-saving modes have not been tested.
- Browser touch-style click dispatch and responsive emulation do not establish physical touch-device acceptance.
- Tab/document-visibility handling is implemented; actual operating-system background suspension is device-dependent and was not separately certified.
- No hosting/CDN deployment, external-account integration, contact-message delivery or business UAT was performed.
- Exact React Bits Pro Shatter Type integration requires its licensed source. The original replacement is fully usable but is not claimed to match the licensed component.
