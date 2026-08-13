# Antigravity — Step-by-step Commands

## First message
Read `PROJECT-BRIEF.md`, `ANIMATIONS.md`, `VIDEO-PROMPT.md` and the current source code. Do not redesign or rewrite the project yet. First inspect the implementation and report any technical issue that would prevent `npm install`, `npm run dev` or Vercel deployment. Preserve the visual concept, content architecture and multilingual structure.

## Second message
Run the project locally. Fix only blocking TypeScript, Vite, dependency or asset errors. Do not change visual direction. Confirm the Home renders in EN and that PT/ES/IT switching works.

## Third message
Refine only Header + Hero. Preserve the existing GSAP ScrollTrigger architecture. The hero must use `/public/assets/hero/luminous-hero-desktop.mp4` when present and `/public/assets/hero/hero-poster.jpg` as fallback. Desktop: scrub video with scroll. Mobile: use a lightweight non-scrub experience. Respect `prefers-reduced-motion`. Do not embed translated text inside image/video assets.

## Fourth message
Refine the Workforce section. Keep a sticky media panel on desktop and make each role activate the corresponding image as the user scrolls. On mobile, convert it to a straightforward stacked presentation. Do not add third-party UI libraries.

## Fifth message
Refine Industries + Global Presence. Animate the SVG pipeline with GSAP ScrollTrigger, keeping it subtle and performant. Do not add Three.js unless specifically requested later.

## Sixth message
Perform a production pass: semantic HTML, accessibility, metadata, responsive behavior, reduced-motion, lazy-loading below the fold, asset compression recommendations and Vercel build compatibility. Do not change copy without identifying the proposed copy change first.
