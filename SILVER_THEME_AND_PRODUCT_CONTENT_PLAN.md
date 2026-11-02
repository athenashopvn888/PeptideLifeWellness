# Nova Pure Labs silver-theme and product-content plan

Status: approved by Tri on 2026-11-02 and implemented on `codex/silver-theme-product-content`.

## Design direction

Move the storefront away from large solid-black surfaces and toward a premium laboratory-equipment look inspired by the supplied silver-label reference.

### Proposed palette

- Platinum white: `#F7F8F8` for primary page backgrounds.
- Frosted silver: `#E5E7E9` for section bands and card surfaces.
- Brushed silver: `#BCC2C8` for borders, dividers, badges, and metallic highlights.
- Graphite: `#202327` for headings, navigation, and the footer.
- Carbon black: `#08090A` only for high-contrast buttons and small emphasis areas.
- Steel blue: `#526F82` as a restrained accent for active navigation, links, icons, and focus states.

This keeps the brand monochrome at its core while the cool steel-blue accent gives the site more life without making it look colourful or clinical-blue everywhere.

## Homepage changes

1. Replace the solid-black hero with a layered platinum-to-silver gradient, subtle brushed-metal texture, graphite type, and soft chrome borders.
2. Keep the three-vial composition, but place it over a silver halo/platform so the black labels remain the strongest visual anchor.
3. Convert the current black announcement/hero blocks into a balanced system: silver hero, white product sections, graphite footer, and only one dark closing band.
4. Restyle the statistic strip as raised metallic tiles instead of one flat grey band.
5. Give product cards chrome-edged frames, cooler shadows, silver badges, and a steel-blue `View Details` accent.
6. Add a compact `Research catalogue standards` section describing what information each listing does and does not currently include, without implying testing or documentation that has not been supplied.
7. Preserve accessibility contrast and the existing mobile layout.

## Catalogue and detail-page changes

1. Use a silver-gradient catalogue header instead of a full black banner.
2. Carry the platinum/silver/graphite visual system through all 18 cards and detail pages.
3. Upgrade each detail page from the current sparse draft layout to a structured information page with:
   - product name and supplied strength;
   - price `TBA`;
   - research category;
   - concise compound overview written in original language;
   - catalogue specifications;
   - documentation status shown honestly as `Not yet posted` where applicable;
   - research-use-only notice;
   - related catalogue products where a sensible relationship exists.
4. Keep ordering disabled and continue omitting the supplied inventory quantities.
5. Do not add dosing, reconstitution instructions, human-use guidance, treatment claims, purity percentages, stock claims, reviews, shipping promises, COAs, or testing claims.
6. For `GLOW`, `Wolverine`, and `CJC-1295 No DAC / Ipamorelin`, do not invent ingredient ratios or per-component strengths.

## Competitor research used

Vaughan Peptides provides useful structural ideas: research-area categories, a compact specifications block, a documentation section, FAQs, and related products. Nova Pure Labs will use the useful information architecture, but not copy their wording, prices, ratings, reviews, inventory status, purity/testing claims, shipping claims, or manufacturing claims.

Product background will be checked against primary scientific sources or authoritative databases before it is added. The competitor site will not be treated as proof of a factual or quality claim.

## Data model

Extend the existing local product records with only presentation-safe content:

- `category`
- `overview`
- `catalogueFacts`
- `researchReferences`
- `relatedSlugs`

Each claim-bearing overview sentence must have an appropriate source. Blend records with unknown composition will receive a limited catalogue description rather than inferred compound details.

## Verification and release

- Confirm the revised theme is visibly silver-led on desktop and mobile.
- Confirm black is used as an accent rather than the dominant page background.
- Confirm all 18 cards and detail routes still render.
- Confirm every product retains the exact supplied name and strength.
- Confirm every price is `TBA`, quantities remain absent, and ordering remains disabled.
- Confirm no unsupported quality, medical, inventory, purity, COA, shipping, or manufacturing claims were introduced.
- Run scoped lint and the production build.
- Create a preview, visually review the homepage, catalogue, a standard product page, and a blend page.
- Merge, deploy, and verify the final production domain after approval.
