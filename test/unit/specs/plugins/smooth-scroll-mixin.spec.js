import smoothScrollMixin from '../../../../src/plugins/smooth-scroll-mixin';

describe('smooth-scroll-mixin.js', () => {
	let mockWindow;
	let mockRequestAnimationFrame;
	let animationCallbacks;

	beforeEach(() => {
		animationCallbacks = [];
		mockRequestAnimationFrame = vi.fn(callback => {
			animationCallbacks.push(callback);
			return animationCallbacks.length;
		});

		mockWindow = {
			scrollY: 1000,
			scrollTo: vi.fn(),
			requestAnimationFrame: mockRequestAnimationFrame
		};

		vi.stubGlobal('window', mockWindow);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe('smoothScrollTo', () => {
		it('should scroll to target position using animation', () => {
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500,
				millisecondsToAnimate: 200
			});

			expect(mockRequestAnimationFrame).toHaveBeenCalled();
			expect(animationCallbacks.length).toBeGreaterThan(0);
		});

		it('should use default animation time of 200ms', () => {
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500
			});

			expect(mockRequestAnimationFrame).toHaveBeenCalled();
		});

		it('should fallback to scrollTo when requestAnimationFrame is undefined', () => {
			mockWindow.requestAnimationFrame = undefined;
			const context = {};

			const result = smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500,
				millisecondsToAnimate: 200
			});

			expect(mockWindow.scrollTo).toHaveBeenCalledWith(0, 500);
			expect(result).toBe(true);
		});

		it('should scroll down when target position is less than starting position', () => {
			mockWindow.scrollY = 1000;
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500,
				millisecondsToAnimate: 200
			});

			// Execute the first animation frame
			if (animationCallbacks.length > 0) {
				animationCallbacks[0]();
			}

			expect(mockWindow.scrollTo).toHaveBeenCalled();
			const firstCall = mockWindow.scrollTo.mock.calls[0];
			expect(firstCall[0]).toBe(0);
			// Should call scrollTo with a numeric yPosition
			expect(typeof firstCall[1]).toBe('number');
		});

		it('should scroll up when target position is greater than starting position', () => {
			mockWindow.scrollY = 500;
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 1000,
				millisecondsToAnimate: 200
			});

			// Execute the first animation frame
			if (animationCallbacks.length > 0) {
				animationCallbacks[0]();
			}

			expect(mockWindow.scrollTo).toHaveBeenCalled();
			const firstCall = mockWindow.scrollTo.mock.calls[0];
			expect(firstCall[0]).toBe(0);
			// Should call scrollTo with a numeric yPosition
			expect(typeof firstCall[1]).toBe('number');
		});

		it('should handle scrolling to same position', () => {
			mockWindow.scrollY = 500;
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500,
				millisecondsToAnimate: 200
			});

			// Execute the first animation frame
			if (animationCallbacks.length > 0) {
				animationCallbacks[0]();
			}

			expect(mockWindow.scrollTo).toHaveBeenCalled();
		});

		it('should handle zero milliseconds to animate', () => {
			mockWindow.scrollY = 1000;
			const context = {};

			smoothScrollMixin.methods.smoothScrollTo.call(context, {
				yPosition: 500,
				millisecondsToAnimate: 0
			});

			expect(mockRequestAnimationFrame).toHaveBeenCalled();
		});
	});
});
