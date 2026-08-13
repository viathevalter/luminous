# Luminous Alley Premium — V1 Starter

Premium React/Vite/TypeScript starter for Luminous Alley with:
- GSAP + ScrollTrigger Hero
- EN / PT / ES / IT with react-i18next
- Sticky workforce storytelling
- Industry pipeline visual
- UAE + Europe positioning
- Vercel-ready Vite structure

## Start
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Assets to replace
1. `/public/assets/logo/logo-placeholder.svg` — replace with final logo (same filename or update Header path).
2. `/public/assets/hero/luminous-hero-desktop.mp4` — add final 8–12 sec hero video.
3. `/public/assets/hero/hero-poster.jpg` — current concept poster; replace when final video exists.
4. `/public/assets/workforce/*.svg` — replace placeholders with final worker imagery and update extension in `WorkforceScroll.tsx` if needed.

## Vercel
Vercel normally detects Vite automatically.
Build command: `npm run build`
Output directory: `dist`

## Notes
Dependencies use the npm `latest` dist-tag so Antigravity can resolve the current compatible ecosystem at install time. After a successful install, commit the generated `package-lock.json` for reproducible deploys.
