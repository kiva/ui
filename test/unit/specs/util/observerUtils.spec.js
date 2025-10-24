import {
	checkIntersectionObserverSupport,
	createIntersectionObserver,
} from '#src/util/observerUtils';

describe('observerUtils.js', () => {
	describe('checkIntersectionObserverSupport', () => {
		it('should return false when window is undefined', () => {
			delete global.window;

			const result = checkIntersectionObserverSupport();

			expect(result).toBe(false);
		});

		it('should return false when IntersectionObserver is not available', () => {
			global.window = {};

			const result = checkIntersectionObserverSupport();

			expect(result).toBe(false);
		});

		it('should return false when IntersectionObserverEntry is not available', () => {
			global.window = {
				IntersectionObserver: vi.fn(),
			};

			const result = checkIntersectionObserverSupport();

			expect(result).toBe(false);
		});

		it('should return false when intersectionRatio is not in prototype', () => {
			global.window = {
				IntersectionObserver: vi.fn(),
				IntersectionObserverEntry: {
					prototype: {},
				},
			};

			const result = checkIntersectionObserverSupport();

			expect(result).toBe(false);
		});

		it('should return true when all requirements are met', () => {
			global.window = {
				IntersectionObserver: vi.fn(),
				IntersectionObserverEntry: {
					prototype: {
						intersectionRatio: 0,
					},
				},
			};

			const result = checkIntersectionObserverSupport();

			expect(result).toBe(true);
		});
	});

	describe('createIntersectionObserver', () => {
		let mockTargets;
		let mockCallback;
		let MockIntersectionObserver;
		let observeSpy;

		beforeEach(() => {
			mockTargets = [
				{ id: 'target1' },
				{ id: 'target2' },
			];

			mockCallback = vi.fn();
			observeSpy = vi.fn();

			// Create mock class
			MockIntersectionObserver = vi.fn(function MockIntersectionObserverClass() {
				this.observe = observeSpy;
			});

			// Ensure IntersectionObserver support is available
			global.window = {
				IntersectionObserver: MockIntersectionObserver,
				IntersectionObserverEntry: {
					prototype: {
						intersectionRatio: 0,
					},
				},
			};
		});

		it('should create IntersectionObserver and return observer instance', () => {
			const options = { threshold: 0.5 };

			const result = createIntersectionObserver({
				callback: mockCallback,
				options,
				targets: mockTargets,
			});

			expect(result).toBeDefined();
			expect(result.observe).toBeDefined();
		});

		it('should call observe for each target', () => {
			// Set the mock directly on the window object being used by the code
			vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

			createIntersectionObserver({
				callback: mockCallback,
				targets: mockTargets,
			});

			expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
			expect(observeSpy).toHaveBeenCalledTimes(2);
			expect(observeSpy).toHaveBeenCalledWith(mockTargets[0]);
			expect(observeSpy).toHaveBeenCalledWith(mockTargets[1]);

			vi.unstubAllGlobals();
		});

		it('should return an observer instance', () => {
			const result = createIntersectionObserver({
				callback: mockCallback,
				targets: mockTargets,
			});

			expect(result).toBeDefined();
			expect(typeof result.observe).toBe('function');
		});

		it('should return undefined when IntersectionObserver is not supported', () => {
			delete global.window;

			const result = createIntersectionObserver({
				callback: mockCallback,
				targets: mockTargets,
			});

			expect(result).toBeUndefined();
		});

		it('should handle empty targets array without errors', () => {
			const result = createIntersectionObserver({
				callback: mockCallback,
				targets: [],
			});

			expect(result).toBeDefined();
			expect(typeof result.observe).toBe('function');
		});

		it('should handle being called without parameters', () => {
			// This tests the default parameter destructuring
			delete global.window;
			const result = createIntersectionObserver();
			expect(result).toBeUndefined();
		});
	});
});
