import touchDetectionMixin from '../../../../src/plugins/touch-detection-mixin';

describe('touch-detection-mixin.js', () => {
	let mockWindow;
	let touchStartListeners;

	beforeEach(() => {
		touchStartListeners = [];
		mockWindow = {
			addEventListener: vi.fn((event, listener) => {
				if (event === 'touchstart') {
					touchStartListeners.push(listener);
				}
			}),
			removeEventListener: vi.fn()
		};

		vi.stubGlobal('window', mockWindow);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe('data', () => {
		it('should initialize usingTouch to false', () => {
			const data = touchDetectionMixin.data();
			expect(data.usingTouch).toBe(false);
		});
	});

	describe('created', () => {
		it('should add touchstart event listener when window is defined', () => {
			const context = {
				usingTouch: false
			};

			touchDetectionMixin.created.call(context);

			expect(mockWindow.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
			expect(touchStartListeners.length).toBe(1);
		});

		it('should set usingTouch to true when touchstart event fires', () => {
			const context = {
				usingTouch: false
			};

			touchDetectionMixin.created.call(context);

			// Simulate touchstart event
			touchStartListeners[0]();

			expect(context.usingTouch).toBe(true);
		});

		it('should remove touchstart listener after first touch', () => {
			const context = {
				usingTouch: false
			};

			touchDetectionMixin.created.call(context);

			// Simulate touchstart event
			touchStartListeners[0]();

			expect(mockWindow.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
		});

		it('should not add event listener when window is undefined', () => {
			vi.stubGlobal('window', undefined);

			const context = {
				usingTouch: false
			};

			touchDetectionMixin.created.call(context);

			// No listeners should be added
			expect(touchStartListeners.length).toBe(0);
		});
	});
});
