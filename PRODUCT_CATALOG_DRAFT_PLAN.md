# Nova Pure Labs draft product catalogue plan

Status: awaiting approval before implementation, as required by the repository rules.

## Requested result

- Replace the current blue/green NovaPure identity in the site header and footer with the new monochrome hexagon-and-diamond Nova Pure Labs identity shown in the supplied references.
- Restyle the homepage around the same black, silver, white, and glass visual language so the logo, hero, navigation, catalogue, and detail pages feel like one brand system.
- Add one simple catalogue card and one `View Details` page for each requested product.
- Show strength but omit every supplied quantity.
- Show `TBA` instead of a numeric price.
- Do not enable purchasing for these draft products.
- Use neutral research-only copy and do not invent benefits, purity, stock, COAs, ingredients, or medical claims.

## Draft catalogue

| Display name | Strength | Proposed slug |
| --- | ---: | --- |
| NAD+ | 500 mg | `nad-plus-500mg` |
| Retatrutide | 10 mg | `retatrutide-10mg` |
| Retatrutide | 20 mg | `retatrutide-20mg` |
| GLOW | 70 mg | `glow-70mg` |
| KPV | 10 mg | `kpv-10mg` |
| Tesamorelin | 10 mg | `tesamorelin-10mg` |
| MOTS-c | 40 mg | `mots-c-40mg` |
| TB-500 | 10 mg | `tb-500-10mg` |
| BPC-157 | 10 mg | `bpc-157-10mg` |
| Semax | 10 mg | `semax-10mg` |
| SS-31 | 10 mg | `ss-31-10mg` |
| PT-141 | 10 mg | `pt-141-10mg` |
| Selank | 10 mg | `selank-10mg` |
| BPC-157 / TB-500 (Wolverine) | 10 mg | `wolverine-10mg` |
| GHK-Cu | 100 mg | `ghk-cu-100mg` |
| CJC-1295 No DAC / Ipamorelin | 10 mg | `cjc-1295-no-dac-ipamorelin-10mg` |
| Melanotan II (MT2) | 10 mg | `melanotan-ii-10mg` |
| DSIP | 10 mg | `dsip-10mg` |

`GLOW 70 mg` and the two blends will be labelled exactly at the total strength provided. The implementation will not invent ingredient ratios.

## Product-image system

Create 18 separate square catalogue images using the supplied images as brand/style references:

- Clear glass research vial with black cap.
- Premium white studio background.
- Black label with silver/white new Nova Pure Labs emblem and wordmark.
- Product name and strength rendered prominently and exactly.
- `RESEARCH USE ONLY` rendered on every vial.
- Consistent camera angle, lighting, scale, margins, and label hierarchy across the full set.
- No quantity, price, purity percentage, dosage directions, syringe, person, watermark, or extra claims.

The selected final image for every SKU will be copied into `public/products/nova-pure-drafts/` using stable slug-based filenames.

## Page implementation

1. Add a dedicated `/products` draft catalogue so the new list is isolated from the existing hard-coded/Supabase shop and cannot accidentally inherit old prices or purchase buttons.
2. Add `/products/[slug]` detail pages backed by one small local data file containing only the approved name, strength, image, and `TBA` state.
3. Use `View Details` as the only product-card action.
4. Detail pages will show the product image, name, strength, `Price: TBA`, research-only notice, and a link back to all products.
5. Add `Products` to the public navigation.
6. Replace the header/footer logo assets with a clean transparent version of the new supplied mark while preserving accessible text.
7. Keep all draft product pages out of checkout and cart.

## Homepage and visual-system update

1. Replace the current homepage logo treatment with the new Nova Pure Labs hexagon-and-diamond mark and wordmark.
2. Rework the hero into a clean black/silver/white presentation that uses the new vial photography and sends visitors to the draft product catalogue through a `View Products` action.
3. Carry the new visual language through the announcement bar, navigation, section headings, cards, buttons, borders, backgrounds, and footer.
4. Use restrained metallic-silver texture only as an accent; preserve strong contrast, readable text, and a clean laboratory-product aesthetic.
5. Update homepage product presentation to use the new draft catalogue and `View Details` actions, with `TBA` prices and no cart controls.
6. Remove or visually reconcile blue/green elements that conflict with the new monochrome brand, while keeping functional status colors where accessibility requires them.
7. Preserve useful educational and legal sections, but simplify spacing and hierarchy so the homepage flows from brand introduction to products, quality information, research tools, education, and the research-only notice.
8. Do not introduce new testing, purity, sourcing, medical, popularity, or availability claims during the redesign.

## Verification after implementation

- Confirm all 18 catalogue cards and all 18 detail routes render.
- Confirm no supplied quantity appears anywhere.
- Confirm every price reads `TBA` and there is no add-to-cart control.
- Confirm every product name/strength matches this approved table.
- Confirm the new logo appears in the header and footer on desktop and mobile.
- Confirm the homepage hero, navigation, buttons, product section, supporting sections, and footer use one cohesive black/silver/white design system.
- Confirm homepage product actions lead to the new detail pages rather than checkout or the legacy priced shop.
- Run the repository lint/build only after explicit approval, then create a preview deployment for review before any production release.

## Deliberately excluded from this draft

- Product benefits or indications.
- Ingredient ratios for GLOW or either blend.
- Numeric prices, inventory, availability, purity, ratings, or COA claims.
- Checkout enablement.
- Production deployment before the draft preview is reviewed.
