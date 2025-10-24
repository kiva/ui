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

	it('should add resize event listener on mount', async () => {
		const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

		vi.resetModules();
		vi.doMock('vue', () => ({
			onBeforeMount: callback => { callback(); },
			onBeforeUnmount: () => {},
			ref: value => ({ value })
		}));

		const { default: useIsMobileMocked } = await import('#src/composables/useIsMobile');
		window.innerWidth = 500;

		useIsMobileMocked();

		expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

		addEventListenerSpy.mockRestore();
		vi.doUnmock('vue');
	});

	it('should remove resize event listener on unmount', async () => {
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
		let unmountCallback;

		vi.resetModules();
		vi.doMock('vue', () => ({
			onBeforeMount: callback => { callback(); },
			onBeforeUnmount: callback => { unmountCallback = callback; },
			ref: value => ({ value })
		}));

		const { default: useIsMobileMocked } = await import('#src/composables/useIsMobile');
		window.innerWidth = 500;

		useIsMobileMocked();

		// Trigger unmount
		unmountCallback();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

		removeEventListenerSpy.mockRestore();
		vi.doUnmock('vue');
	});
});
