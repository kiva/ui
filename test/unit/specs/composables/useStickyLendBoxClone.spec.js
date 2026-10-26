import { isStickyLendBoxVisible } from '#src/composables/useStickyLendBoxClone';

describe('useStickyLendBoxClone', () => {
	// Sticky line at 96px
	const visibleWith = bandBottom => isStickyLendBoxVisible({ bandBottom, stickyTop: 96 });

	it('shows the sticky lend box once the "Why loans" band has scrolled past the sticky line', () => {
		expect(visibleWith(90)).toBe(true);
	});

	it('keeps the sticky lend box hidden while the band is still under the sticky line', () => {
		expect(visibleWith(200)).toBe(false);
	});

	it('shows the sticky lend box when the band bottom sits exactly on the sticky line', () => {
		expect(visibleWith(96)).toBe(true);
	});
});
