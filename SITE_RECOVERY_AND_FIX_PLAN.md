# NovaPure Labs prep-site recovery and fix plan

Last verified: 2026-11-02 (Asia/Bangkok)

## Verified ownership and source

- Prep site: `https://www.peptidelifewellness.com/`
- Source repository: `athenashopvn888/PeptideLifeWellness`
- Default branch: `main`
- Current source/deployed commit: `82d066cbeea10971d92ec13a3da87c014cd6410f`
- Live Vercel project: `norapure` (`prj_pJe3lscqGu1prstYGTAC08EhO7Wk`)
- Live Vercel deployment: `dpl_2AvgXdWX2zZ9kNqr74RPAhbo3ELz`
- Framework: Next.js 16.2.4 / React 19.2.4
- Data service: Supabase
- Analytics: Google Analytics `G-2CHHYD31SF`

The repository is now checked out in this workspace and tracks `origin/main`.

## Existing work recovered

The repository contains 29 source commits from May 6 through June 15, 2026. The work already built includes:

- Original Peptide Life Wellness storefront and shop.
- Full NovaPure Labs rebrand, responsive redesign, mobile navigation, hero carousel, category browsing, and branded artwork.
- A 36-product catalog with product detail pages and product imagery.
- Eleven educational guides plus a research hub, comparison pages, stack pages, category pages, and glossary.
- SEO/GEO metadata, structured data, sitemap, robots rules, Google Analytics, and Google Search Console verification.
- Calculator, quiz, tracker, journal, order tracking, checkout, cart, contact, legal, safety, and lab-testing pages.
- Supabase product inventory, customer/order, CRM, warehouse, purchase-order, batch, dispatch, return, report, and role-management schemas.
- An authenticated admin interface covering inventory, orders, CRM, dispatch, warehouse, staff, returns, and reports.
- Nine Supabase migrations and 94 public assets.

There are no GitHub pull requests, issues, tags, other branches, or Actions workflows. The README is still the default Create Next App text.

## Deployment history recovered

Four Vercel projects have been connected to the same GitHub repository:

1. `norapure` — owns the live custom domains and is the actual prep-site project.
2. `peptidelifewellness` — duplicate project with 37 deployments.
3. `peptidelife` — duplicate project with 22 deployments.
4. `peptide-life-wellness` — duplicate project with 10 deployments and a higher failure rate.

The live aliases currently include:

- `peptidelifewellness.com`
- `www.peptidelifewellness.com`
- `norapure.vercel.app`

## Current live-site findings

### Critical security and order-integrity risks

1. Supabase row-level-security policies labelled as admin access use `USING (true)` and `WITH CHECK (true)`. With the public anon key, this can permit unrestricted reads/writes to products, inventory history, customers, orders, order items, status history, suppliers, purchase orders, stock receipts, and CRM notes.
2. The seed endpoint falls back to a hard-coded admin password when the environment variable is missing.
3. The public order endpoint trusts client-submitted prices, subtotal, product identity, and stock quantities instead of re-pricing and validating server-side.
4. Packing slips and dispatch photos are configured for public read access, which can expose customer/order information.
5. The admin middleware logs Supabase cookie names, user IDs, and authentication errors for admin requests.

These issues should be fixed before accepting real orders or storing customer information.

### SEO and domain problems

1. The prep site declares `novapurelabs.ca` as its canonical URL across global metadata and product pages, even though that domain is not serving this site. This tells search engines to credit a parked/non-serving domain instead of the prep site.
2. `robots.txt` points to `https://novapurelabs.ca/sitemap.xml`, while the live sitemap itself uses `peptidelifewellness.com`.
3. Structured data mixes `peptidelifewellness.com` and `novapurelabs.ca` URLs.
4. The `.com` and `.ca` NovaPure domains are currently on Namecheap DNS/parking rather than Vercel. They must not become canonical until the main-site launch is ready.
5. Sitemap `lastModified` values for many routes are generated at build time rather than reflecting actual content updates.

### Performance and reliability problems

1. Product detail pages are forced dynamic and perform repeated Supabase calls. Live checks of two product pages took about 14.6 seconds each to return.
2. Each product request fetches the selected product during metadata generation, fetches it again for the page, then fetches the full catalog for related products.
3. The storefront falls back silently to hard-coded products when Supabase fails, which can hide stale price or availability data.
4. Four duplicate Vercel projects rebuild the same GitHub commit, adding deployment noise and making ownership confusing.

### Incomplete or inconsistent functionality

1. The contact form has no submit handler or backend; its button does not send a message.
2. Quiz email capture stores the address only in the visitor's browser; it does not create a lead in Supabase.
3. The news page is a coming-soon placeholder.
4. Multiple customer-facing and admin strings still use the old Peptide Life Wellness name and email addresses.
5. Product data includes entries explicitly labelled as mock products.
6. The checkout and tracking flows still use old PLW branding/order-number conventions.
7. The README does not document setup, deployment ownership, environment requirements, migrations, or release procedure.
8. There is no CI, automated test suite, dependency audit workflow, or deployment verification workflow.

## Recommended implementation sequence

### Phase 1 — Stabilize the prep site

1. Lock down Supabase RLS and storage policies.
2. Remove the seed-password fallback and protect or remove the production seed route.
3. Rebuild checkout validation so all prices, product IDs, stock, totals, and inventory changes are computed atomically on the server.
4. Stop sensitive admin authentication logging.
5. Make prep-site canonicals, robots, sitemap, Open Graph, and structured data consistently use `https://peptidelifewellness.com`.
6. Cache or statically generate product pages and remove redundant Supabase reads.
7. Fix the contact form and lead capture, then replace remaining old-brand strings only where the exact NovaPure value is already known.

### Phase 2 — Content and conversion cleanup

1. Audit every product against approved products, prices, images, purity/COA evidence, and publish state; remove unapproved mock listings.
2. Audit claims such as `99%+`, `99.5%`, `pharmaceutical grade`, `Canadian-sourced`, HPLC/MS testing, and COA availability against real evidence.
3. Finish or remove placeholder sections and verify every internal link, CTA, form, calculator, tracker, cart, checkout, and order-tracking path.
4. Improve accessibility, mobile layout, Core Web Vitals, metadata, and schema after factual content is approved.

### Phase 3 — Main-domain launch

1. Finish and verify the prep site first.
2. Connect `novapurelabs.com` to the chosen production Vercel project.
3. Update canonical URLs and schema in one controlled release.
4. Add permanent redirects from the prep domain only when the main site is confirmed live.
5. Verify DNS, TLS, production pages, sitemap, robots, analytics, Search Console, checkout, and admin workflows after the final release.

## Smallest safe first release

The best first release is Phase 1 items 1–6 as one security/performance branch, with migration review and a preview deployment before production. It reduces immediate risk without requiring any invented business facts or unverified product claims.

## Holds requiring exact business facts

The following should not be changed until an authoritative value or document is available:

- Real product catalog, approved prices, stock, and publish status.
- COAs and batch-specific purity/testing evidence.
- Final customer-service, payment, and admin email addresses.
- Shipping thresholds, policies, and fulfilment rules.
- Whether checkout should be enabled on the prep site.
- Legal/compliance wording approved for the intended Canadian business model.
