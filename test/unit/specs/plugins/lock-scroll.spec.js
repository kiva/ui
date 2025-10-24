import lockScrollMixin from '#src/plugins/lock-scroll';

describe('lock-scroll.js', () => {
	let mockDocument;

	beforeEach(() => {
		// Mock document.body
		mockDocument = {
			body: {
				classList: {
					add: vi.fn(),
					remove: vi.fn(),
				},
			},
		};
		global.document = mockDocument;
		global.window = {};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('lockScroll', () => {
		it('should add overflow-hidden class to body', () => {
			lockScrollMixin.methods.lockScroll();
			expect(mockDocument.body.classList.add).toHaveBeenCalledWith('tw-overflow-hidden');
		});

		it('should not throw when window is undefined', () => {
			delete global.window;
			expect(() => lockScrollMixin.methods.lockScroll()).not.toThrow();
		});
	});

	describe('unlockScroll', () => {
		it('should remove overflow-hidden class from body', () => {
			lockScrollMixin.methods.unlockScroll();
			expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('tw-overflow-hidden');
		});

		it('should not throw when window is undefined', () => {
			delete global.window;
			expect(() => lockScrollMixin.methods.unlockScroll()).not.toThrow();
		});
	});

	describe('lockScrollSmallOnly', () => {
		it('should add overflow-hidden and md:overflow-auto classes to body', () => {
			lockScrollMixin.methods.lockScrollSmallOnly();
			expect(mockDocument.body.classList.add).toHaveBeenCalledWith(
				'tw-overflow-hidden',
				'md:tw-overflow-auto',
			);
		});

		it('should not throw when window is undefined', () => {
			delete global.window;
			expect(() => lockScrollMixin.methods.lockScrollSmallOnly()).not.toThrow();
		});
	});

	describe('unlockScrollSmallOnly', () => {
		it('should remove overflow-hidden and md:overflow-auto classes from body', () => {
			lockScrollMixin.methods.unlockScrollSmallOnly();
			expect(mockDocument.body.classList.remove).toHaveBeenCalledWith(
				'tw-overflow-hidden',
				'md:tw-overflow-auto',
			);
		});

		it('should not throw when window is undefined', () => {
			delete global.window;
			expect(() => lockScrollMixin.methods.unlockScrollSmallOnly()).not.toThrow();
		});
	});
});
