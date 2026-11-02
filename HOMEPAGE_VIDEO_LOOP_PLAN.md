# Nova Pure Labs Homepage Video Loop Plan

Status: Superseded on 2026-11-02. Tri rejected the motion treatment and directed its removal in favor of a static-image carousel.

## Vaughan Peptides implementation found

The live Vaughan Peptides hero uses a standard HTML `<video>` background with:

- file type: MP4 (`video/mp4`);
- codec delivery: Shopify-hosted HD 1080p MP4;
- dimensions: 1920 × 1080;
- duration: 30.016 seconds;
- source filename reports approximately 7.2 Mbps;
- attributes: `autoplay`, `loop`, `muted`, `playsinline`, and `preload="auto"`.

It is not a GIF. The movement comes from a normal muted looping video placed behind HTML text and buttons.

## Nova Pure Labs creative

- Create an original arctic laboratory loop based on Nova Pure’s current panel 02 direction.
- Scene: cool silver/cyan laboratory, glassware, test-tube rack, microscope, subtle molecular light patterns, and gentle reflected light movement.
- Motion: slow cinematic push-in, mild parallax, liquid shimmer, and drifting molecular highlights.
- Keep the left side calm enough for the existing headline and buttons.
- Do not bake text, logos, product names, strengths, medical claims, people, hands, or dosing imagery into the video.
- Build a seamless loop with no visible jump.

## Delivery format

- Primary: 1920 × 1080 H.264 MP4, muted/no audio, approximately 8–12 seconds.
- Web target: ideally 3–7 MB after compression, with `faststart` metadata for quick playback.
- Poster/fallback: the existing arctic laboratory banner.
- Optional WebM fallback only if it materially reduces weight without visual damage.

The shorter loop is recommended over Vaughan’s 30-second/7.2 Mbps asset because it should load faster while still creating the same living-banner effect.

## Site integration

- Replace the homepage hero background image with a responsive `<video>` element.
- Use `autoPlay`, `loop`, `muted`, and `playsInline`.
- Keep all headline, buttons, and research-use copy as accessible HTML above the video.
- Use the existing navy overlay to preserve contrast.
- Respect `prefers-reduced-motion`: show the static poster instead of autoplaying video.
- Avoid loading the video on data-constrained/reduced-motion sessions where the static image is the better experience.

## Workflow and approval

1. Quote the connected video-generation model before spending credits.
2. Present the exact credit cost for approval if generation is not free.
3. Generate one original loop, inspect it, and revise only if the first render has a concrete defect.
4. Save the final project-bound MP4 in `public/videos/`.
5. Integrate, build, preview-test desktop/mobile, merge, deploy, and live-verify playback and fallback behaviour.

