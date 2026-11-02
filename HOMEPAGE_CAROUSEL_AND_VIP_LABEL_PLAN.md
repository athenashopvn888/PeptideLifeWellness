# Homepage Carousel and VIP-Inspired Label Plan

Status: Approved by Tri and implemented on 2026-11-02; release verification pending.

## 1. Remove the current motion banner

- Remove the homepage MP4 and its `<video>` implementation.
- Replace it with a three-slide image carousel using Nova Pure’s existing arctic visual system.
- Slides:
  1. arctic laboratory / catalogue introduction;
  2. clean research-vial visual / product catalogue;
  3. molecular laboratory visual / research resources.
- Keep text and buttons as accessible HTML; do not bake marketing copy into the images.
- Include manual previous/next buttons and slide-position dots.
- Auto-advance approximately every six seconds, pause while hovered or keyboard-focused, and disable automatic motion when reduced-motion is requested.
- Preserve a static first-slide fallback if JavaScript is unavailable.
- Remove the obsolete MP4 asset after the replacement is live and verified.

## 2. New bottle-label system

Use the supplied VIP-inspired reference as the design direction, without copying the number or wording shown beneath the reference image.

Each catalogue bottle will use:

- the existing clear research vial with a deep arctic-blue upper cap and metallic silver lower cap band;
- a silver main label panel;
- a black vertical brand strip on the left;
- the Nova Pure Labs symbol plus vertical `NOVA PURE LABS` branding;
- large black product name on the silver panel;
- a bordered strength box;
- the exact footer `RESEARCH USE ONLY`;
- a clean white catalogue background;
- no pricing, quantities, SKU counts, dosing instructions, medical claims, VIP number, or extra decorative text.

To prevent AI spelling errors, the base vial/label treatment will be produced visually and the final product names and strengths will be applied deterministically from one template. All eighteen exported images will retain their existing filenames so every card and product page updates consistently.

## 3. Locked product-label matrix

| Filename | Product text | Strength text |
| --- | --- | --- |
| `nad-plus-500mg.png` | `NAD+` | `500 MG` |
| `retatrutide-10mg.png` | `RETATRUTIDE` | `10 MG` |
| `retatrutide-20mg.png` | `RETATRUTIDE` | `20 MG` |
| `glow-70mg.png` | `GLOW` | `70 MG` |
| `kpv-10mg.png` | `KPV` | `10 MG` |
| `tesamorelin-10mg.png` | `TESAMORELIN` | `10 MG` |
| `mots-c-40mg.png` | `MOTS-C` | `40 MG` |
| `tb-500-10mg.png` | `TB-500` | `10 MG` |
| `bpc-157-10mg.png` | `BPC-157` | `10 MG` |
| `semax-10mg.png` | `SEMAX` | `10 MG` |
| `ss-31-10mg.png` | `SS-31` | `10 MG` |
| `pt-141-10mg.png` | `PT-141` | `10 MG` |
| `selank-10mg.png` | `SELANK` | `10 MG` |
| `wolverine-10mg.png` | `BPC-157 / TB-500` and `WOLVERINE` | `10 MG` |
| `ghk-cu-100mg.png` | `GHK-CU` | `100 MG` |
| `cjc-1295-no-dac-ipamorelin-10mg.png` | `CJC-1295 NO DAC / IPAMORELIN` | `10 MG` |
| `melanotan-ii-10mg.png` | `MELANOTAN II (MT2)` | `10 MG` |
| `dsip-10mg.png` | `DSIP` | `10 MG` |

The two long blend names will use controlled multiline typography rather than shrinking the entire label to unreadable size. No component ratio will be invented.

## 4. Accuracy and release checks

- Compare every exported label against the locked matrix above.
- Confirm all eighteen files exist, are square, and load through the existing product-card and product-detail paths.
- Confirm the carousel works with mouse, touch, and keyboard controls.
- Confirm the carousel stops automatic advancement for reduced-motion visitors.
- Run the production build.
- Open a preview and inspect desktop and mobile header, carousel, representative short-name label, and both long-name labels.
- Merge through a pull request, deploy, and verify the production homepage, product grid, and representative product detail pages after the final deployment.
- Update the Command Center ledger with the PR, merge, deployment, and live verification.

## Recommended smallest useful test

First produce three proof labels before the full set:

1. `NAD+ / 500 MG` — short name;
2. `RETATRUTIDE / 20 MG` — medium name and strength variant;
3. `CJC-1295 NO DAC / IPAMORELIN / 10 MG` — longest name.

Once those three share the correct layout and readable hierarchy, apply the same locked template to the remaining fifteen images.
