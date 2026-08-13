# Animation Specification

## 1. Hero scroll scrub
Desktop hero is 320vh with a sticky 100vh viewport.
A muted MP4 is scrubbed using GSAP ScrollTrigger progress -> video.currentTime.
Text intro fades out, then three headline beats appear at staged scroll progress.

### Video storyboard (8–12 sec)
0–3s: wide refinery / petrochemical plant; supervisor, pipefitter and welder visible.
3–6s: subtle camera push; team starts moving toward operational area.
6–9s: camera closer to workforce and piping systems.
9–12s: team enters project environment; finish on strong operational composition.

Important: no camera shake, no dramatic explosions/smoke, no text embedded in video.

## 2. Workforce sticky section
Left side scrolls through 6 roles. Right side image stays sticky and crossfades based on active role.

## 3. Industries pipeline
V1 uses an SVG pipeline connector. V2 can animate strokeDashoffset with ScrollTrigger.

## 4. Accessibility/performance
Respect prefers-reduced-motion.
Disable heavy scroll-sync effects on mobile.
Keep hero video muted and playsInline.
Compress poster and video before production deploy.
