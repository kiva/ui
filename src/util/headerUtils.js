export const COUNTRIES_NOT_LENT_TO_URL = '/lend/filter?countries-not-lent-to=true';

// The header pins only where a lender can add to basket: My Kiva and the borrower profile.
// Matched exactly rather than by substring so neighbours like /lender/:publicId,
// /settings/autolending and /portfolio/lending-stats are not caught incidentally.
export function isStickyHeaderRoute(route) {
	const { path = '', name } = route ?? {};
	return path === '/mykiva' || path.startsWith('/mykiva/') || name === 'borrowerProfile';
}
