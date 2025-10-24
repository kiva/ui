import delayUntilVisibleMixin from '#src/plugins/delay-until-visible-mixin';
import * as observerUtils from '#src/util/observerUtils';

vi.mock('#src/util/observerUtils', () => ({
	createIntersectionObserver: vi.fn()
}));

describe('delay-until-visible-mixin.js', () => {
	let context;
	let mockObserver;

	beforeEach(() => {
		mockObserver = {
			disconnect: vi.fn()
		};

		context = {
			$el: document.createElement('div'),
			delayUntilVisibleObserver: null
		};

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('data', () => {
		it('should initialize delayUntilVisibleObserver to null', () => {
			const data = delayUntilVisibleMixin.data();
			expect(data.delayUntilVisibleObserver).toBeNull();
		});
	});

	describe('delayUntilVisible', () => {
		it('should create IntersectionObserver with default element', () => {
			const callback = vi.fn();
			observerUtils.createIntersectionObserver.mockReturnValue(mockObserver);

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback);

			expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
				targets: [context.$el],
				callback: expect.any(Function)
			});
			expect(context.delayUntilVisibleObserver).toBe(mockObserver);
		});

		it('should create IntersectionObserver with provided elements', () => {
			const callback = vi.fn();
			const elements = [document.createElement('div'), document.createElement('span')];
			observerUtils.createIntersectionObserver.mockReturnValue(mockObserver);

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback, elements);

			expect(observerUtils.createIntersectionObserver).toHaveBeenCalledWith({
				targets: elements,
				callback: expect.any(Function)
			});
		});

		it('should call callback when element is visible', () => {
			const callback = vi.fn();
			let observerCallback;

			observerUtils.createIntersectionObserver.mockImplementation(({ callback: cb }) => {
				observerCallback = cb;
				return mockObserver;
			});

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback);

			const entry = { intersectionRatio: 0.5 };
			observerCallback([entry]);

			expect(callback).toHaveBeenCalledWith(entry);
		});

		it('should not call callback when element is not visible', () => {
			const callback = vi.fn();
			let observerCallback;

			observerUtils.createIntersectionObserver.mockImplementation(({ callback: cb }) => {
				observerCallback = cb;
				return mockObserver;
			});

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback);

			const entry = { intersectionRatio: 0 };
			observerCallback([entry]);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should handle multiple entries', () => {
			const callback = vi.fn();
			let observerCallback;

			observerUtils.createIntersectionObserver.mockImplementation(({ callback: cb }) => {
				observerCallback = cb;
				return mockObserver;
			});

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback);

			const entries = [
				{ intersectionRatio: 0.5 },
				{ intersectionRatio: 0 },
				{ intersectionRatio: 1 }
			];
			observerCallback(entries);

			expect(callback).toHaveBeenCalledTimes(2);
			expect(callback).toHaveBeenCalledWith(entries[0]);
			expect(callback).toHaveBeenCalledWith(entries[2]);
		});

		it('should call callback immediately if observer was not created', () => {
			const callback = vi.fn();
			observerUtils.createIntersectionObserver.mockReturnValue(null);

			delayUntilVisibleMixin.methods.delayUntilVisible.call(context, callback);

			expect(callback).toHaveBeenCalledWith();
			expect(context.delayUntilVisibleObserver).toBeNull();
		});
	});

	describe('beforeUnmount', () => {
		it('should disconnect observer if it exists', () => {
			context.delayUntilVisibleObserver = mockObserver;

			delayUntilVisibleMixin.beforeUnmount.call(context);

			expect(mockObserver.disconnect).toHaveBeenCalled();
		});

		it('should not throw error if observer does not exist', () => {
			context.delayUntilVisibleObserver = null;

			expect(() => {
				delayUntilVisibleMixin.beforeUnmount.call(context);
			}).not.toThrow();
		});
	});
});
