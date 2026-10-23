# DataEco Lab website

React + Vite + TypeScript + Tailwind CSS. A standalone corporate website in this directory; the ALMOps application in `../prototype` is a separate project.

## Run

```powershell
cd D:\AgentMS\DataecolabWebsite
npm ci
npm run dev -- --port 5173
```

Development: http://127.0.0.1:5173

```powershell
npm run build
npm run preview -- --port 4173
```

Production preview: http://127.0.0.1:4173. Deploy the contents of `dist/` to a static host. Serve `.m3u8` as `application/vnd.apple.mpegurl`, `.ts` as `video/mp2t`, and `.mp4` as `video/mp4`. The bundled media uses relative segment paths and same-origin requests. No backend or account credentials are required.

## What is included

- Full original navigation and eleven independent pages: Home, Vision, Services, Tools/Platforms, Resources, Working with us, About us, Joining R&D Project, Partners & Clients, Workshops & Forums, and Contact us. The three collaboration subpages remain under Working with us. Homepage ALMOps / Ecosystem / Research links are secondary section navigation.
- Desktop disclosure menu, scrollable mobile menu, current-page indicators, breadcrumbs and keyboard-accessible local page search. The footer contains the invitation and company/contact information without repeating the navigation. Search covers page titles and descriptions; it does not claim to index external documents.
- Original page paths are preserved, including `/toolsplatforms`, all three `/working-with-us/...` paths and the `/home` alias. Each page receives a physical `dist/<path>/index.html` entry with its own title and description. Standard static hosts must support directory index files; unknown-path HTTP handling depends on the host's 404 configuration.
- Resources and collaboration pages retain the original site's unpublished/under-construction status. No partner logos, events, project vacancies or team biographies were invented. DataPro and data-product marketing remain excluded.
- Full-bleed hero with a locally hosted 8-second, 1920×1080 H.264 HLS loop, MP4 fallback and WebP poster. Glass navigation, bottom-left heading and two working section links.
- Six selectable lifecycle stages. The descriptions are introductory lifecycle guidance, not a released-feature checklist. The page explicitly identifies ALMOps as in development.
- People / Data / Technology tabs with distinct imagery and text. Keyboard arrows, Home and End work for both tab groups.
- Two editorial research perspectives, accessible native dialogs, expandable supporting illustrations, including a generated enterprise ecosystem visual. No papers, author metadata, clients or commercial results have been invented.
- Real published company address and `mailto:info@dataecolab.com`. The contact action opens the visitor's email client; no message has been sent or backend form delivery implied.
- Natural scrolling with Motion reveal, crossfade and image-mask transitions. The hero uses a fixed camera and no scroll-linked scale or translation. No wheel interception, scroll snapping or forced section advance.

## Animation provenance and the Pro exception

Blur Text, Shiny Text and Text Type were downloaded as source from the official React Bits TypeScript/Tailwind registry on 2026-10-19. Their registry snapshots and license are retained in `research/react-bits/`.

- Blur Text: word-based upward reveal, 5px blur, 12px movement, short stagger. The root was changed from a paragraph to a span so it can sit inside a semantic `h1`.
- Shiny Text: one sweep on first viewport entry. No continuous shine.
- Text Type: all four lifecycle phrases typed sequentially and retained, with no cursor. A reserved two-column layout (one column on phones) prevents shifts; reduced motion displays all four immediately. The component starts typing when visible and does not restart on scrolling. Its official source uses GSAP; site interactions use Motion.
- **Shatter Type: the licensed React Bits Pro implementation is not included.** The public documentation was read, but no Pro source or license was available. `src/components/ShardWord.tsx` is an original substitute: polygon-clipped glyph fragments independently translate and rotate into “Agent Governance and Management” across two responsive lines, with a short replay on hover, click/tap or keyboard activation. It is not a fade mislabeled as Pro Shatter Type. To require exact Pro parity, provide the legitimately licensed source for integration.

Reduced motion switches the headline and typing line to static text, removes section transforms and stops background autoplay. A visitor can explicitly opt into playing the video. Screen-reader content stays intact independently of the decorative animations.

## Video and image provenance

The project already contained generated optical-glass, porcelain and architecture images plus an 8-second Remotion preview. These are conceptual brand visuals, not photographs of company premises or product hardware.

The existing Remotion renderer failed on this Windows host with `write EOF`; its bundled native FFmpeg exited with `0xC0000005`. The delivered video was therefore exported with a standalone FFmpeg pipeline using the same existing images, scene order, crossfade timing and looping structure. It is an actual playable motion video made from still images; it is not live-action footage or newly generated 3D animation. Existing Remotion source files were preserved.

```powershell
npm run media:build
```

This regenerates the three optimized WebP images, `public/media/hero.mp4`, HLS manifest and four two-second segments. Shots use a locked camera with crossfades only: no zoom/pan stepping. The first/last composition matches the poster to avoid a framing jump on load or repeat. It requires no external media host at runtime. The MP4 is approximately 2.6 MB. The poster is approximately 83 KB.

The background player supports native HLS where available, lazy hls.js elsewhere, fallback on fatal HLS errors, MP4 failure poster, autoplay denial, document visibility, IntersectionObserver offscreen pause and persistent keyboard user pause. The playback control is visually hidden except when focused by keyboard; there is no persistent film-control overlay. Slow source loading has a bounded timeout. A large lazy-loaded hls.js chunk produces a Vite size advisory; it is separate from the initial page bundle.

## Main files

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Page selection, five homepage sections, tabs and research dialogs |
| `src/site-map.json` | Shared page paths, navigation labels and search metadata |
| `src/site-content.ts` | Source-grounded content for ten inner pages |
| `src/components/SiteNavigation.tsx` | Full navigation, collaboration submenu, mobile menu and search |
| `src/components/ContentPage.tsx` | Inner-page layout, breadcrumbs and recovery page |
| `scripts/build-page-entries.mjs` | Static HTML entry files for direct URLs and refresh |
| `src/styles.css` | Responsive blue/white art direction and typography |
| `src/content.ts` | Editable lifecycle, ecosystem and research copy |
| `src/components/BackgroundVideo.tsx` | Media loading and fallback state |
| `src/components/ShardWord.tsx` | Original fragment assembly substitute |
| `src/components/react-bits/` | Official free React Bits components |
| `scripts/render-media.mjs` | Reproducible local video export |
| `research/CONTENT-SOURCES.md` | Source verification and editorial boundaries |
| `VALIDATION.md` | Checks, evidence and remaining device coverage |

All generated QA screenshots and numerical reports are under `output/playwright/` (Git-ignored). The repository contains the runnable website, delivered media, original stills needed to regenerate it, component licenses and audit scripts. Earlier Remotion experiments, unused original-site downloads and local deployment records remain separate from this source delivery. Git delivery does not itself verify a hosted deployment.
