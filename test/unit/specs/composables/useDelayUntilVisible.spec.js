import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import * as observerUtils from '#src/util/observerUtils';

vi.mock('#src/util/observerUtils');

describe('useDelayUntilVisible.js', () => {
	let mockObserver;
	let mockCreateIntersectionObserver;

	beforeEach(() => {
		mockObserver = {
			disconnect: vi.fn(),
		};
		mockCreateIntersectionObserver = vi.fn();
		vi.spyOn(observerUtils, 'createIntersectionObserver').mockImplementation(mockCreateIntersectionObserver);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should create intersection observer with provided elements and callback', () => {
		mockCreateIntersectionObserver.mockReturnValue(mockObserver);

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }, { id: 'element2' }];

		delayUntilVisible(mockCallback, mockElements);

		expect(observerUtils.createIntersectionObserver).toHaveBeenCalledTimes(1);
		expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
			targets: mockElements,
			callback: expect.any(Function),
		});
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('should call callback immediately when observer is not created', () => {
		mockCreateIntersectionObserver.mockReturnValue(null);

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }];

		delayUntilVisible(mockCallback, mockElements);

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('should invoke callback when element becomes visible', () => {
		let intersectionCallback;
		mockCreateIntersectionObserver.mockImplementation(({ callback }) => {
			intersectionCallback = callback;
			return mockObserver;
		});

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }];

		delayUntilVisible(mockCallback, mockElements);

		// Simulate intersection observer callback
		const mockEntry = {
			target: mockElements[0],
			intersectionRatio: 0.5,
		};
		intersectionCallback([mockEntry]);

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith(mockEntry);
	});

	it('should not invoke callback when element is not visible', () => {
		let intersectionCallback;
		mockCreateIntersectionObserver.mockImplementation(({ callback }) => {
			intersectionCallback = callback;
			return mockObserver;
		});

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }];

		delayUntilVisible(mockCallback, mockElements);

		// Simulate intersection observer callback with no intersection
		const mockEntry = {
			target: mockElements[0],
			intersectionRatio: 0,
		};
		intersectionCallback([mockEntry]);

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('should handle multiple entries in intersection callback', () => {
		let intersectionCallback;
		mockCreateIntersectionObserver.mockImplementation(({ callback }) => {
			intersectionCallback = callback;
			return mockObserver;
		});

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }, { id: 'element2' }];

		delayUntilVisible(mockCallback, mockElements);

		// Simulate multiple entries
		const mockEntries = [
			{ target: mockElements[0], intersectionRatio: 0.8 },
			{ target: mockElements[1], intersectionRatio: 0 },
			{ target: mockElements[0], intersectionRatio: 1 },
		];
		intersectionCallback(mockEntries);

		expect(mockCallback).toHaveBeenCalledTimes(2);
		expect(mockCallback).toHaveBeenCalledWith(mockEntries[0]);
		expect(mockCallback).toHaveBeenCalledWith(mockEntries[2]);
	});

	it('should handle empty elements array', () => {
		mockCreateIntersectionObserver.mockReturnValue(mockObserver);

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();

		delayUntilVisible(mockCallback, []);

		expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
			targets: [],
			callback: expect.any(Function),
		});
	});

	it('should handle undefined elements parameter', () => {
		mockCreateIntersectionObserver.mockReturnValue(mockObserver);

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();

		delayUntilVisible(mockCallback);

		expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
			targets: [],
			callback: expect.any(Function),
		});
	});

	it('should handle null elements parameter', () => {
		mockCreateIntersectionObserver.mockReturnValue(mockObserver);

		const { delayUntilVisible } = useDelayUntilVisible();
		const mockCallback = vi.fn();

		delayUntilVisible(mockCallback, null);

		expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
			targets: [],
			callback: expect.any(Function),
		});
	});

	it('should disconnect observer on unmount when observer exists', async () => {
		let unmountCallback;
		vi.resetModules();
		vi.doMock('vue', () => ({
			ref: value => ({ value }),
			onUnmounted: callback => {
				unmountCallback = callback;
			}
		}));

		// Re-import after mocking
		vi.doMock('#src/util/observerUtils', () => ({
			createIntersectionObserver: vi.fn().mockReturnValue(mockObserver)
		}));

		const { default: useDelayUntilVisibleMocked } = await import('#src/composables/useDelayUntilVisible');
		const { delayUntilVisible } = useDelayUntilVisibleMocked();
		const mockCallback = vi.fn();
		const mockElements = [{ id: 'element1' }];

		delayUntilVisible(mockCallback, mockElements);

		// Trigger unmount
		unmountCallback();

		expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);

		vi.doUnmock('vue');
		vi.doUnmock('#src/util/observerUtils');
	});

	it('should handle unmount when observer is null', async () => {
		let unmountCallback;
		vi.resetModules();
		vi.doMock('vue', () => ({
			ref: value => ({ value }),
			onUnmounted: callback => {
				unmountCallback = callback;
			}
		}));

		vi.doMock('#src/util/observerUtils', () => ({
			createIntersectionObserver: vi.fn().mockReturnValue(null)
		}));

		const { default: useDelayUntilVisibleMocked } = await import('#src/composables/useDelayUntilVisible');
		const { delayUntilVisible } = useDelayUntilVisibleMocked();
		const mockCallback = vi.fn();

		delayUntilVisible(mockCallback);

		// Trigger unmount - should not throw
		expect(() => unmountCallback()).not.toThrow();

		vi.doUnmock('vue');
		vi.doUnmock('#src/util/observerUtils');
	});
});
