import { isStickyLendBoxVisible } from '#src/composables/useStickyLendBoxClone';

describe('useStickyLendBoxClone', () => {
	// Sticky line at 96px and a 400px tall sticky lend box
	const visibleWith = ({ bandBottom, tagsBottom = 2160 }) => isStickyLendBoxVisible({
		bandBottom, tagsBottom, stickyTop: 96, stackHeight: 400,
	});

	it('shows the sticky lend box once the "Why loans" band has scrolled past the sticky line', () => {
		expect(visibleWith({ bandBottom: 90 })).toBe(true);
	});

	it('keeps the sticky lend box while its bottom is still above the bottom of the tags section', () => {
		// The lend box ends at 96 + 400 = 496px, above the tags bottom at 600px
		expect(visibleWith({ bandBottom: -500, tagsBottom: 600 })).toBe(true);
	});

	it('fades the sticky lend box out when its bottom reaches the bottom of the tags section', () => {
		// The tags end 480px down, but the lend box would end at 96 + 400 = 496px
		expect(visibleWith({ bandBottom: -500, tagsBottom: 480 })).toBe(false);
	});
});
