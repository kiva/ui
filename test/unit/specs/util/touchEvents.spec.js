import { onBodyTouchstart, offBodyTouchstart, isTargetElement } from '#src/util/touchEvents';

describe('touchEvents', () => {
	let originalBody;
	let mockChild1;
	let mockChild2;

	beforeEach(() => {
		// Save original document.body
		originalBody = global.document?.body;

		// Create mock children with addEventListener/removeEventListener
		mockChild1 = {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		};
		mockChild2 = {
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		};

		// Set up mock document.body
		global.document = {
			body: {
				children: [mockChild1, mockChild2]
			}
		};
	});

	afterEach(() => {
		if (originalBody) {
			global.document.body = originalBody;
		}
	});

	describe('onBodyTouchstart', () => {
		it('should attach touchstart handler to all body children', () => {
			const handler = vi.fn();

			onBodyTouchstart(handler);

			expect(mockChild1.addEventListener).toHaveBeenCalledWith('touchstart', handler);
			expect(mockChild2.addEventListener).toHaveBeenCalledWith('touchstart', handler);
		});

		it('should handle empty children array', () => {
			global.document.body.children = [];
			const handler = vi.fn();

			expect(() => onBodyTouchstart(handler)).not.toThrow();
		});
	});

	describe('offBodyTouchstart', () => {
		it('should remove touchstart handler from all body children', () => {
			const handler = vi.fn();

			offBodyTouchstart(handler);

			expect(mockChild1.removeEventListener).toHaveBeenCalledWith('touchstart', handler);
			expect(mockChild2.removeEventListener).toHaveBeenCalledWith('touchstart', handler);
		});

		it('should handle empty children array', () => {
			global.document.body.children = [];
			const handler = vi.fn();

			expect(() => offBodyTouchstart(handler)).not.toThrow();
		});
	});

	describe('isTargetElement', () => {
		it('should return true if event target matches the element', () => {
			const element = { id: 'test' };
			const event = { target: element };

			expect(isTargetElement(event, element)).toBe(true);
		});

		it('should return true if element contains the event target', () => {
			const target = { id: 'child' };
			const element = {
				id: 'parent',
				contains: vi.fn(() => true)
			};
			const event = { target };

			const result = isTargetElement(event, element);

			expect(result).toBe(true);
			expect(element.contains).toHaveBeenCalledWith(target);
		});

		it('should return false if target is not the element or contained by it', () => {
			const target = { id: 'child' };
			const element = {
				id: 'parent',
				contains: vi.fn(() => false)
			};
			const event = { target };

			expect(isTargetElement(event, element)).toBe(false);
		});

		it('should handle array of elements', () => {
			const target = { id: 'child' };
			const element1 = {
				id: 'parent1',
				contains: vi.fn(() => false)
			};
			const element2 = {
				id: 'parent2',
				contains: vi.fn(() => true)
			};
			const event = { target };

			expect(isTargetElement(event, [element1, element2])).toBe(true);
		});

		it('should return false if none of the elements match', () => {
			const target = { id: 'child' };
			const element1 = {
				id: 'parent1',
				contains: vi.fn(() => false)
			};
			const element2 = {
				id: 'parent2',
				contains: vi.fn(() => false)
			};
			const event = { target };

			expect(isTargetElement(event, [element1, element2])).toBe(false);
		});

		it('should handle single element as array', () => {
			const element = { id: 'test' };
			const event = { target: element };

			expect(isTargetElement(event, [element])).toBe(true);
		});
	});
});
