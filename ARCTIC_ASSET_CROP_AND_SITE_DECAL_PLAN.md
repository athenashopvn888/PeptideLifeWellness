# Arctic Asset Crop and Site Decal Plan

Status: Approved by Tri and implemented on `codex/arctic-site-decals`.

## Goal

Use clean crops from the three supplied Nova Pure Labs image sheets to give the silver storefront more branded arctic-cyan energy while keeping the site modern, readable, and research-focused.

## Source treatment

- Crop deterministically from the supplied originals; do not regenerate, redraw, or alter the brand artwork.
- Export web-ready PNG/WebP derivatives into `public/images/nova-arctic/` and preserve the source files outside the repository.
- Avoid the banner panels containing product labels with conflicting strengths (for example BPC-157 5 mg), so decorative artwork cannot contradict the catalogue.
- Keep cyan as a controlled accent against the existing platinum, silver, graphite, and navy palette.

## Planned crops

1. `logo-horizontal-cyan`
   - Source: top-right logo from `NOVA PURE LABS logo preview sheet-1.png`.
   - Use: desktop/mobile header identity on the light silver navigation.
   - Treatment: trim excess white margin while preserving the full symbol and wordmark.

2. `logo-horizontal-white`
   - Source: middle-left white-on-navy logo from the same sheet.
   - Use: footer identity on graphite/navy.
   - Treatment: retain the navy field so the supplied white artwork stays crisp.

3. `arctic-lab-wide`
   - Source: clean laboratory panel 02 from `Nova Pure Labs Arctic Science Banner Collection-2.png`.
   - Use: a restrained full-width visual break between catalogue content and research resources.
   - Treatment: exclude the sheet heading, panel number badge, and surrounding contact-sheet chrome where practical.

4. `molecular-structure-square`
   - Source: top-row third panel from `Arctic cyan laboratory visual collection-3.png`.
   - Use: subtle product-catalogue hero decal/background image.

5. `laboratory-glassware-square`
   - Source: bottom-row second panel from the same collection.
   - Use: research-resources image tile on the homepage.

6. `blank-vials-square`
   - Source: top-row fourth panel from the same collection.
   - Use: secondary catalogue visual where product context is helpful without introducing incorrect names, strengths, or claims.

## Site changes

- Update header and footer logo assets to the cyan and white/navy crops.
- Add the wide arctic laboratory visual as a branded separator with a soft silver/cyan overlay so text remains readable.
- Add one image-led research-resources tile and one subtle catalogue decal; preserve generous whitespace.
- Use responsive `next/image` sizing and cropping so desktop and mobile layouts remain stable.
- Keep all existing research-only, TBA, documentation-status, and no-medical-claims messaging unchanged.

## Verification and release

- Run scoped ESLint for touched TSX files and the production build.
- Review desktop and mobile preview layouts, crop quality, legibility, and image loading.
- Merge the PR, deploy to production, and verify the live homepage, product catalogue, header, footer, and console.
- Record the release in `COMMAND_CENTER_LEDGER.md`.

