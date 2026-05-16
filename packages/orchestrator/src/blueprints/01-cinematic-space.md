# Blueprint 01: Cinematic Space-Travel Landing Page

## Visual Goal
Build a single-page landing site with two full-height sections (Hero + Capabilities), both using looping background videos with custom JS crossfade, a shared liquid-glass design system, and Framer Motion entrance animations.

## Tech Stack
- Tailwind CSS (CDN)
- React 18
- Babel Standalone
- Framer Motion

## Design Tokens
- Body BG: #000
- Font Heading: 'Instrument Serif' (Italic)
- Font Body: 'Barlow'
- Border Radius: 9999px (Pills)

## Components
1. **FadingVideo**: Custom JS crossfade (rAF-driven).
2. **Liquid Glass**: .liquid-glass and .liquid-glass-strong utilities.
3. **Hero**: 120% scale video background, fixed navbar, stats row.
4. **Capabilities**: Full-bleed video background, grid of 3 liquid-glass cards.

## Source Assets
- Hero Video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4
- Capabilities Video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4
