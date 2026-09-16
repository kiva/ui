// The public prod host for the ad `link` (the lend URL Google serves to real lenders). Deliberately
// hardcoded and NOT derived from config.app.host / BASE_URL: Google serves this URL to real lenders, so
// it must always point at the live prod site even when the feed is generated in a non-prod environment.
export const KIVA_PROD_HOST = 'https://www.kiva.org';

// Settings Manager (uiConfigSetting) keys holding the comma-separated loan, partner, and sector ids
// to keep out of the ad feed. Bare setting names -- `ui.` is the Settings Manager storage namespace,
// not part of the query key. Empty or absent means no exclusions.
export const EXCLUDED_LOAN_IDS_SETTING_KEY = 'live_loan_ads_excluded_loan_ids';
export const EXCLUDED_PARTNER_IDS_SETTING_KEY = 'live_loan_ads_excluded_partner_ids';
export const EXCLUDED_SECTOR_IDS_SETTING_KEY = 'live_loan_ads_excluded_sector_ids';
