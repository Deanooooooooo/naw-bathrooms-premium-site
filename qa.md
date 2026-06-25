# N.A.W. Bathrooms Premium Site QA

Status: rebuilt premium version using the prior premium React stack.

## Stack

- PASS: Next.js + React + TypeScript.
- PASS: Tailwind CSS.
- PASS: React Three Fiber + Drei scene present in hero.
- PASS: GSAP ScrollTrigger present for service/gallery motion.
- PASS: Motion for React counters/animation present.
- PASS: Lenis smooth scroll present.
- PASS: shadcn-style Button/Card primitives and lucide icons used.
- PASS: Static export build passes.

## Source/Facts

- PASS: Facebook and Nextdoor facts recorded in `image-map.md`.
- PASS: No invented reviews, prices, guarantees, awards, credentials, working hours or review counts.

## Local/SEO/Footer

- PASS: Location/contact section includes Penda's Way, Leeds, LS15 8HX.
- PASS: Google Maps iframe and exactly one visible Google Maps navigation CTA in the map block.
- PASS: Footer has icon links for phone, email, Facebook and Google Maps.
- PASS: Metadata, OG image, robots, schema JSON and canonical-ready deployment URL present.

## Screenshots

- PASS: Local desktop and mobile screenshots captured.
- NOTE: Headless Chrome with GPU disabled does not render the WebGL canvas fully, but the React Three Fiber scene is present and the rest of the layout renders.

## Deploy

- PASS: Live GitHub Pages returned 200 and live HTML/assets contain business name, schema, map/contact block and OG image.
