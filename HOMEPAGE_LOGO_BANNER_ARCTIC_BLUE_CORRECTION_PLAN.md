# Homepage Logo, Banner, and Arctic Blue Correction Plan

Status: Approved by Tri and implemented on `codex/homepage-arctic-logo-correction`.

## Correction

The current cyan wordmark and lower-page laboratory insert do not match the requested hierarchy. The corrected direction is:

- the supplied navy/white Nova Pure Labs logo remains the primary brand geometry;
- silver becomes the logo treatment and supporting metallic accent;
- the clean arctic laboratory artwork becomes the actual homepage hero banner;
- pale arctic blue becomes the main site background rather than a minor accent.

## Logo treatment

- Use the exact horizontal logo from the supplied two-logo sheet, preserving the hexagonal mark, wording, spacing, and proportions.
- Produce a silver/graphite version for the light header and homepage using the built-in image-editing workflow.
- Preserve the supplied white-on-navy version for dark/footer use.
- If the image edit changes any lettering or geometry, reject it and use the exact navy source with a silver metallic frame/gradient treatment in CSS instead. Brand accuracy takes priority over the silver effect.
- Remove the cyan wordmark as the main header identity.

## Homepage hero banner

- Promote panel 02 from the Arctic Cyan collection to the homepage hero background.
- Keep the existing homepage headline and calls to action over the banner’s clear left-side space.
- Use a navy-to-transparent overlay for desktop and a stronger navy overlay for mobile readability.
- Remove the duplicated lower-page laboratory banner after it becomes the hero.
- Do not use panels 01 or 03 because their visible product names/strengths conflict with the current catalogue.

## Site palette

- Primary background: pale arctic blue (`#EAF8FC` / `#F2FBFD`).
- Structural dark: deep navy (`#061B3A`).
- Metallic accents: cool silver (`#C4CDD4`, `#E2E7EA`).
- Cyan: restrained edge/highlight only, not the main wordmark color.
- Update homepage, catalogue, navigation, cards, and footer transitions so the palette flows across the public storefront.

## Verification and release

- Confirm exact logo spelling and geometry before integration.
- Run scoped ESLint and the production build.
- Review desktop and mobile hero crops, contrast, navigation, catalogue, and footer.
- Merge, deploy, and verify the real production domain with console and image-load checks.
- Record the correction in `COMMAND_CENTER_LEDGER.md`.

