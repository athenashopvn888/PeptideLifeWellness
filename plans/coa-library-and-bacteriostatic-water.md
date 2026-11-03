# COA Library + Bacteriostatic Water Implementation Plan

## Goal

Add Bacteriostatic Water 10 mL to the public research catalogue and introduce a polished, honest Certificate of Analysis (COA) experience without publishing inventory quantities or inventing laboratory results.

## Implementation

1. Add **Bacteriostatic Water — 10 mL** as the nineteenth catalogue product.
   - Omit the supplied inventory count (`605`) from all public pages.
   - Keep price as `TBA`.
   - Use conservative research-catalogue wording and avoid unsupported formulation or medical claims.
   - Create a new matching product image: silver label, black Nova Pure Labs treatment, deep arctic-blue cap, exact `10 ML` label text.

2. Extend the product data model with COA metadata.
   - Support product-specific status, document URL, batch/lot, test date, and laboratory name when those facts are supplied.
   - Leave all current products in a clearly labeled `Not yet posted` state until real certificates are provided.
   - Never create placeholder test values or fake downloadable reports.

3. Add a dedicated **COA Library** at `/coa`.
   - Branded arctic-blue and silver introduction explaining what a COA is.
   - Responsive catalogue cards for all 19 products.
   - Each card shows product name, strength, documentation status, and either a real `View COA` action or a tasteful `COA pending` state.
   - Include guidance for matching a certificate to its product and batch/lot number.

4. Upgrade each product detail page.
   - Add a prominent COA documentation panel near price/status.
   - Show `View COA` only when a genuine document URL exists.
   - Otherwise show `COA not yet posted` with a link to the COA Library for status.

5. Connect the experience across the site.
   - Add `COA Library` to desktop/mobile navigation and the footer where appropriate.
   - Update homepage and catalogue product counts from 18 to 19.
   - Include `/coa` and the new product route in the sitemap.

6. Release workflow.
   - Make targeted edits on a `codex/` branch.
   - Run the existing build after implementation, fix any failures, open a PR, merge after required checks, deploy, and verify the production routes.
   - Record the release in `COMMAND_CENTER_LEDGER.md`.

## Inputs still needed later

Actual COA PDF files and their matching batch/lot details. The site will be ready for them, but certificates will remain visibly pending until genuine documents are supplied.
