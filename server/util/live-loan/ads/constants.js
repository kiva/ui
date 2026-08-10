// The public prod host for every ad-facing URL (Final URL, image URL, image source). Deliberately
// hardcoded and NOT derived from config.app.host / BASE_URL: Google serves these URLs to real
// lenders, so they must always point at the live prod site even when the feed is generated in a
// non-prod environment.
export const KIVA_PROD_HOST = 'https://www.kiva.org';
