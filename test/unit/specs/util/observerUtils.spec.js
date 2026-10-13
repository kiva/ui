import {
	checkIntersectionObserverSupport,
	createIntersectionObserver,
	reobserveNextFrame,
	isInRevealArea,
	previousSiblingsLaidOut,
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

	describe('reobserveNextFrame', () => {
		let frames;
		const target = { id: 'target' };
		const makeObserver = () => ({ observe: vi.fn(), unobserve: vi.fn() });
		const runFrames = () => frames.splice(0).forEach(cb => cb());

		beforeEach(() => {
			frames = [];
			vi.stubGlobal('requestAnimationFrame', cb => frames.push(cb));
		});

		afterEach(() => {
			vi.unstubAllGlobals();
		});

		it('unobserves the target immediately and observes it again on the next frame', () => {
			const observer = makeObserver();

			reobserveNextFrame(() => observer, target);

			expect(observer.unobserve).toHaveBeenCalledWith(target);
			expect(observer.observe).not.toHaveBeenCalled();
			runFrames();
			expect(observer.observe).toHaveBeenCalledWith(target);
		});

		it('does not re-observe when the observer is torn down before the frame fires', () => {
			const observer = makeObserver();
			let current = observer;

			reobserveNextFrame(() => current, target);
			current = null;
			runFrames();

			expect(observer.observe).not.toHaveBeenCalled();
		});

		it('does not re-observe when the observer is replaced before the frame fires', () => {
			const observer = makeObserver();
			const replacement = makeObserver();
			let current = observer;

			reobserveNextFrame(() => current, target);
			current = replacement;
			runFrames();

			expect(observer.observe).not.toHaveBeenCalled();
			expect(replacement.observe).not.toHaveBeenCalled();
		});

		it('does nothing when there is no observer', () => {
			expect(() => {
				reobserveNextFrame(() => null, target);
				runFrames();
			}).not.toThrow();
		});
	});

	describe('isInRevealArea', () => {
		// Root spans 0..1000px, so with a 0.1 inset the reveal line sits at 900px.
		const ROOT = { top: 0, bottom: 1000, height: 1000 };
		const rect = (top, height) => ({ top, bottom: top + height, height });

		it('returns true for an element overlapping the area above the reveal line', () => {
			expect(isInRevealArea(rect(100, 200), ROOT, 0.1)).toBe(true);
		});

		it('returns false for an element whose top is at or below the reveal line', () => {
			expect(isInRevealArea(rect(900, 200), ROOT, 0.1)).toBe(false);
			expect(isInRevealArea(rect(950, 200), ROOT, 0.1)).toBe(false);
		});

		it('returns true for an element whose top is just above the reveal line', () => {
			expect(isInRevealArea(rect(899, 200), ROOT, 0.1)).toBe(true);
		});

		it('returns false for an element scrolled fully above the root', () => {
			expect(isInRevealArea(rect(-300, 300), ROOT, 0.1)).toBe(false);
		});

		it('returns true for an element partly scrolled above the root', () => {
			expect(isInRevealArea(rect(-100, 300), ROOT, 0.1)).toBe(true);
		});

		it('returns false for a 0-height element even inside the area', () => {
			expect(isInRevealArea(rect(100, 0), ROOT, 0.1)).toBe(false);
		});

		it('treats the whole root as the area when the inset is 0', () => {
			expect(isInRevealArea(rect(950, 200), ROOT, 0)).toBe(true);
		});

		it('offsets the reveal line from a root that does not start at 0', () => {
			const root = { top: 200, bottom: 700, height: 500 };
			// Reveal line at 700 - 50 = 650.
			expect(isInRevealArea(rect(640, 100), root, 0.1)).toBe(true);
			expect(isInRevealArea(rect(660, 100), root, 0.1)).toBe(false);
		});
	});

	describe('previousSiblingsLaidOut', () => {
		// Builds sibling elements whose getBoundingClientRect reports the given heights.
		const buildSiblings = heights => {
			const parent = document.createElement('div');
			return heights.map(height => {
				const el = document.createElement('div');
				el.getBoundingClientRect = () => ({ height });
				parent.appendChild(el);
				return el;
			});
		};

		it('returns true when every earlier sibling has laid out', () => {
			const siblings = buildSiblings([500, 300, 200]);
			expect(previousSiblingsLaidOut(siblings[2])).toBe(true);
		});

		it('returns false when any earlier sibling is still 0 height', () => {
			const siblings = buildSiblings([500, 0, 200]);
			expect(previousSiblingsLaidOut(siblings[2])).toBe(false);
		});

		it('returns true for the first sibling, which has none before it', () => {
			const siblings = buildSiblings([0, 0]);
			expect(previousSiblingsLaidOut(siblings[0])).toBe(true);
		});

		it('ignores later siblings', () => {
			const siblings = buildSiblings([500, 200, 0]);
			expect(previousSiblingsLaidOut(siblings[1])).toBe(true);
		});

		it('returns true when there is no element', () => {
			expect(previousSiblingsLaidOut(null)).toBe(true);
		});
	});
});
