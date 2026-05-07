/**
 * Feature Flags — Toggle pages and features on/off
 * 
 * Set any flag to `false` to disable that feature/page site-wide.
 * When disabled, pages return 404 and nav links are hidden.
 * 
 * Future: Move to Supabase for real-time admin control.
 */

export const featureFlags = {
  // ─── Content Pages ───
  /** Wolverine Stack (BPC-157 + TB-500) research guide */
  wolverineStack: true,

  /** Peptide comparison pages (vs pages) */
  comparisonPages: true,

  /** Research hub landing page */
  researchHub: true,

  /** Peptide stacking guides */
  stackingGuides: true,

  // ─── Site Features ───
  /** Announcement bar at top of site */
  announcementBar: true,

  /** Mobile bottom navigation */
  mobileBottomNav: true,

  /** Product page FAQ sections */
  productFAQ: true,

  /** Search bar in header */
  searchBar: true,

  /** Age verification gate */
  ageVerification: true,

  /** Cart & checkout functionality */
  cart: true,

  /** Calculator page */
  calculator: true,

  /** Guides section */
  guides: true,

  /** Lab testing page */
  labTesting: true,

  /** Contact page */
  contact: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

/** Check if a feature is enabled */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag] ?? false;
}
