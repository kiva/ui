import useIsMobile from '#src/composables/useIsMobile';

vi.mock('vue', () => ({
	onMounted: callback => { callback(); },
	onUnmounted: () => { },
	ref: value => ({ value })
}));

describe('useIsMobile.js', () => {
	it('should use breakpoint from primitives by default and set false', () => {
		window.innerWidth = 734;

		const { isMobile } = useIsMobile();

		expect(isMobile.value).toBe(false);
	});

	it('should use breakpoint from primitives by default and set true', () => {
		window.innerWidth = 733;

		const { isMobile } = useIsMobile();

		expect(isMobile.value).toBe(true);
	});

	it('should use provided breakpoint and set false', () => {
		window.innerWidth = 500;

		const { isMobile } = useIsMobile(500);

		expect(isMobile.value).toBe(false);
	});

	it('should use provided breakpoint and set true', () => {
		window.innerWidth = 499;

		const { isMobile } = useIsMobile(500);

		expect(isMobile.value).toBe(true);
	});
});
