# Purlina Matrix

Next.js 16 + React 19 + Three.js (@react-three/fiber + drei) cinematic 3D
landing page ("Purlina Matrix"). A single chrome "liquid ribbon" morphs and
shatters into product reveals as the user scrolls. Turkish copy.

Dev server: `npm run dev` (port 3000, see `.claude/launch.json` →
`purlina-matrix` config, autoPort true).

## Core architecture: scroll drives everything

`src/lib/scrollState.ts` exports a single mutable object `{ progress: 0..1 }`.
`src/components/ScrollManager.tsx` wires Lenis (smooth scroll easing) +
GSAP ScrollTrigger (scrub over `document.body`, "top top" → "bottom bottom")
to write `scrollState.progress` every frame. Every 3D component reads
`scrollState.progress` in its own `useFrame` and derives its own pose —
there's no central animation timeline object.

ScrollTrigger also has **magnetic snap points**: `SHATTER_SNAP_POINTS`
(from `src/lib/shatterTimeline.ts`) plus every `FORM_KEYFRAMES.progress`
value. After the user stops scrolling, it eases to the nearest of these —
so the scroll can never rest mid-shatter on "broken pieces".

## Key files

- `src/components/Experience.tsx` — `<Canvas>` (fixed, z-0, fov 32, camera
  at `[0,0,6.2]`), wraps `<Scene>`.
- `src/components/Scene.tsx` — mounts `CameraRig`, `LiquidForm`, lighting.
- `src/components/LiquidForm.tsx` — the chrome ribbon mesh + its animated
  parent `<group>`. Also hosts the two `<ShatterField>` + `<ProductMesh>`
  pairs (lipstick, spray). The group's position/rotation/scale are lerped
  toward `sampleFormKeyframes(progress)` each frame (see "Nested transforms"
  below). Also drives the ribbon material's iridescence shimmer and its
  `opacity` (fades out while a shatter field is "active").
- `src/lib/keyframes.ts` — `FORM_KEYFRAMES`: 5 narrative beats (progress
  0/0.32/0.5/0.7/1.0), each with position/rotation/scale/shape/noise for the
  ribbon group. `sampleFormKeyframes`/`sampleMorphInfluences` lerp+smoothstep
  between adjacent beats. **This is the file to edit for "where does the
  ribbon sit on screen at progress X" questions.**
- `src/components/CameraRig.tsx` — `CAMERA_KEYFRAMES`, separate small camera
  dolly/fov keyframes, lerped similarly. Camera always `lookAt(0,0,0)`.
- `src/components/ShatterField.tsx` — exports `ShatterEnvelope` type and
  `shatterEnvelope(envelope, progress)` → `{t, opacity}` plus
  `productRevealAmount`. Renders the particle "fragment" swarm that flies
  from ribbon-surface points to product-surface points and back.
- `src/lib/shatterTimeline.ts` — `LIPSTICK_ENVELOPE` (shatterStart 0.56,
  reformed 0.65, holdEnd 0.74, shatterEnd 0.83) and `SPRAY_ENVELOPE`
  (shatterStart 0.86, reformed 0.95, holdEnd 1.01, shatterEnd 1.02), plus
  `SHATTER_SNAP_POINTS`.
- `src/components/ProductMesh.tsx` — the solid product model (lipstick /
  spray bottle) that fades in once the shatter field has mostly converged.
  `FLIGHT` record defines per-product enter/exit offsets + spin count for
  the fly-in/fly-out "swirl". `basePosition` is the product's resting
  position **in the LiquidForm group's local space**.
- `src/components/sections/*` — the actual scrollable HTML content (Hero,
  Benefits, Sectors, SectorShowcase, Cta), all Turkish copy, laid out over
  the fixed canvas.

## Nested transform gotcha

`ProductMesh` is a child of LiquidForm's animated `<group ref={group}>`,
which itself is driven by `FORM_KEYFRAMES` (position/rotation/scale all
change with scroll progress). So a product's on-screen position is
`basePosition` (local) transformed by the *current* group pose — which
itself depends on progress. There's no simple closed-form way to predict
screen position; iterate empirically instead of computing it analytically.

To change *where a product sits relative to the page layout* at a given
scroll beat, prefer editing the relevant `FORM_KEYFRAMES` entry's
`position` (moves the whole ribbon+product group) over changing
`ProductMesh`'s `basePosition` (moves the product away from the ribbon it's
supposed to be coalescing from/into — looks disconnected).

## Testing scroll-driven visuals with preview tools

Don't `window.scrollTo()` directly and expect it to stick — Lenis owns the
scroll position and will ease it back toward its own internal target,
fighting a raw `scrollTo`. Also, jumping straight to a target progress skips
the gradual lerps (ribbon opacity fade, idle spin, etc.), so things look
"stuck mid-transition" even at a nominally-resolved progress value.

For real verification:
1. Temporarily expose the Lenis instance: `(window).__lenis = lenis` in
   `ScrollManager.tsx`, then drive `window.__lenis.scrollTo(y, {immediate:
   true})` from `preview_eval`.
2. Step toward the target in small increments (e.g. 20-30px steps with a
   short `setTimeout` between) rather than jumping straight there, so
   per-frame lerps (`lerpFactor = 1 - Math.pow(K, delta)`) actually converge.
3. `progress = scrollY / (document.body.scrollHeight - window.innerHeight)`.
4. Remove the `window.__lenis` exposure (and any debug `console.log`s)
   before finishing — don't leave debug hooks in committed code.

If the magnetic snap interferes with reaching a precise test position,
it's because `progress` computed from a raw `scrollTo` doesn't match what
ScrollTrigger/Lenis currently track — driving via `window.__lenis.scrollTo`
avoids this.

## Repo notes

- Branch `experiment` is local-only (don't touch the Cloudflare-deployed
  branch). Package name `purlina` matches the Cloudflare Worker
  self-reference binding.
- `.mcp.json` (gitignored) holds project MCP servers with API keys —
  `chrome-devtools`, `refero`, `magic` (21st-dev).
- Installed skills in `.claude/skills/`: `gsap`, `vercel-react-best-practices`,
  `web-design-guidelines`, `industrial-brutalist-ui`, `graphify`.
