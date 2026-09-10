import { isStickyHeaderRoute } from '#src/util/headerUtils';

describe('headerUtils.js', () => {
	describe('isStickyHeaderRoute', () => {
		it('should pin My Kiva', () => {
			expect(isStickyHeaderRoute({ path: '/mykiva' })).toBe(true);
		});

		it('should pin My Kiva sub-pages', () => {
			expect(isStickyHeaderRoute({ path: '/mykiva/next-steps' })).toBe(true);
		});

		it('should pin the borrower profile by route name', () => {
			expect(isStickyHeaderRoute({ path: '/lend/2451905', name: 'borrowerProfile' })).toBe(true);
		});

		// These all matched the previous `path.includes('lend') || path.includes('mykiva')` rule.
		it.each([
			'/lend/saved-search',
			'/lender/matt-2519',
			'/settings/autolending',
			'/portfolio/lending-stats',
			'/instant-lending-error',
			'/process-instant-lending/2451905/25',
			'/possibility/12-days-of-lending',
			'/lend-vue',
			'/mykivalike',
		])('should not pin %s', path => {
			expect(isStickyHeaderRoute({ path })).toBe(false);
		});

		it('should not pin the homepage', () => {
			expect(isStickyHeaderRoute({ path: '/' })).toBe(false);
		});

		it('should not pin when there is no route', () => {
			expect(isStickyHeaderRoute(undefined)).toBe(false);
		});
	});
});
