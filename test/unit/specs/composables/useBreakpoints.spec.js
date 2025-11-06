import useBreakpoints from '#src/composables/useBreakpoints';

vi.mock('vue', () => ({
	onMounted: callback => { callback(); },
	onUnmounted: () => { },
	ref: value => ({ value })
}));

describe('useBreakpoints.js', () => {
	describe('isMobile', () => {
		it('should return true when width is below md breakpoint (733px)', () => {
			window.innerWidth = 733;

			const { isMobile } = useBreakpoints();

			expect(isMobile.value).toBe(true);
		});

		it('should return false when width is at md breakpoint (734px)', () => {
			window.innerWidth = 734;

			const { isMobile } = useBreakpoints();

			expect(isMobile.value).toBe(false);
		});

		it('should return false when width is above md breakpoint', () => {
			window.innerWidth = 1000;

			const { isMobile } = useBreakpoints();

			expect(isMobile.value).toBe(false);
		});
	});

	describe('isMedium', () => {
		it('should return false when width is below md breakpoint (733px)', () => {
			window.innerWidth = 733;

			const { isMedium } = useBreakpoints();

			expect(isMedium.value).toBe(false);
		});

		it('should return true when width is at md breakpoint (734px)', () => {
			window.innerWidth = 734;

			const { isMedium } = useBreakpoints();

			expect(isMedium.value).toBe(true);
		});

		it('should return true when width is between md and lg breakpoints', () => {
			window.innerWidth = 900;

			const { isMedium } = useBreakpoints();

			expect(isMedium.value).toBe(true);
		});

		it('should return true when width is at lg breakpoint (1024px)', () => {
			window.innerWidth = 1024;

			const { isMedium } = useBreakpoints();

			expect(isMedium.value).toBe(true);
		});
	});

	describe('isLarge', () => {
		it('should return false when width is below lg breakpoint (1023px)', () => {
			window.innerWidth = 1023;

			const { isLarge } = useBreakpoints();

			expect(isLarge.value).toBe(false);
		});

		it('should return true when width is at lg breakpoint (1024px)', () => {
			window.innerWidth = 1024;

			const { isLarge } = useBreakpoints();

			expect(isLarge.value).toBe(true);
		});

		it('should return true when width is between lg and xl breakpoints', () => {
			window.innerWidth = 1200;

			const { isLarge } = useBreakpoints();

			expect(isLarge.value).toBe(true);
		});

		it('should return true when width is at xl breakpoint (1440px)', () => {
			window.innerWidth = 1440;

			const { isLarge } = useBreakpoints();

			expect(isLarge.value).toBe(true);
		});
	});

	describe('isExtraLarge', () => {
		it('should return false when width is below xl breakpoint (1439px)', () => {
			window.innerWidth = 1439;

			const { isExtraLarge } = useBreakpoints();

			expect(isExtraLarge.value).toBe(false);
		});

		it('should return true when width is at xl breakpoint (1440px)', () => {
			window.innerWidth = 1440;

			const { isExtraLarge } = useBreakpoints();

			expect(isExtraLarge.value).toBe(true);
		});

		it('should return true when width is above xl breakpoint', () => {
			window.innerWidth = 1920;

			const { isExtraLarge } = useBreakpoints();

			expect(isExtraLarge.value).toBe(true);
		});
	});

	describe('multiple breakpoints', () => {
		it('should return correct values for all breakpoints at mobile size', () => {
			window.innerWidth = 500;

			const {
				isMobile, isMedium, isLarge, isExtraLarge,
			} = useBreakpoints();

			expect(isMobile.value).toBe(true);
			expect(isMedium.value).toBe(false);
			expect(isLarge.value).toBe(false);
			expect(isExtraLarge.value).toBe(false);
		});

		it('should return correct values for all breakpoints at medium size', () => {
			window.innerWidth = 900;

			const {
				isMobile, isMedium, isLarge, isExtraLarge,
			} = useBreakpoints();

			expect(isMobile.value).toBe(false);
			expect(isMedium.value).toBe(true);
			expect(isLarge.value).toBe(false);
			expect(isExtraLarge.value).toBe(false);
		});

		it('should return correct values for all breakpoints at large size', () => {
			window.innerWidth = 1200;

			const {
				isMobile, isMedium, isLarge, isExtraLarge,
			} = useBreakpoints();

			expect(isMobile.value).toBe(false);
			expect(isMedium.value).toBe(true);
			expect(isLarge.value).toBe(true);
			expect(isExtraLarge.value).toBe(false);
		});

		it('should return correct values for all breakpoints at extra large size', () => {
			window.innerWidth = 1920;

			const {
				isMobile, isMedium, isLarge, isExtraLarge,
			} = useBreakpoints();

			expect(isMobile.value).toBe(false);
			expect(isMedium.value).toBe(true);
			expect(isLarge.value).toBe(true);
			expect(isExtraLarge.value).toBe(true);
		});
	});
});
