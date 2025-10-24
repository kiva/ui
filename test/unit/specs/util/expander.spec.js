import { expand, collapse } from '#src/util/expander';

describe('expander.js', () => {
	let mockElement;

	beforeEach(() => {
		// Mock element with style and event listeners
		mockElement = {
			style: {},
			offsetWidth: 100,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};

		// Mock window.getComputedStyle
		global.window = {
			getComputedStyle: vi.fn(() => ({
				getPropertyValue: vi.fn(property => {
					if (property === 'height') return '200px';
					if (property === 'width') return '300px';
					return '0px';
				}),
			})),
		};
	});

	describe('expand', () => {
		it('should set initial styles and animate expansion', () => {
			expand(mockElement, {});

			expect(mockElement.style.overflow).toBe('hidden');
			expect(mockElement.style.transition).toContain('height');
			expect(mockElement.style.transition).toContain('500ms');
			expect(mockElement.style.transition).toContain('ease');
		});

		it('should use custom property, delay, and easing', () => {
			expand(mockElement, {
				property: 'width',
				delay: 1000,
				easing: 'ease-in-out',
			});

			expect(mockElement.style.transition).toContain('width');
			expect(mockElement.style.transition).toContain('1000ms');
			expect(mockElement.style.transition).toContain('ease-in-out');
			expect(mockElement.style.width).toBe('300px');
		});

		it('should expand from custom starting value', () => {
			expand(mockElement, { from: '50px' });

			// Should first set to 'auto' to measure, then set to 'from' value
			expect(mockElement.style.height).toBe('200px');
		});

		it('should add transitionend listener and call done callback', () => {
			const doneSpy = vi.fn();
			expand(mockElement, { done: doneSpy });

			expect(mockElement.addEventListener).toHaveBeenCalledWith(
				'transitionend',
				expect.any(Function),
				true,
			);

			// Simulate transitionend event
			const listener = mockElement.addEventListener.mock.calls[0][1];
			listener();

			expect(doneSpy).toHaveBeenCalled();
			expect(mockElement.removeEventListener).toHaveBeenCalledWith(
				'transitionend',
				listener,
				true,
			);
		});

		it('should unset styles after transition', () => {
			const doneSpy = vi.fn();
			expand(mockElement, { done: doneSpy });

			// Simulate transitionend event
			const listener = mockElement.addEventListener.mock.calls[0][1];
			listener();

			expect(mockElement.style.height).toBeNull();
			expect(mockElement.style.overflow).toBeNull();
			expect(mockElement.style.transition).toBeNull();
		});
	});

	describe('collapse', () => {
		it('should set initial styles and animate collapse', () => {
			collapse(mockElement, {});

			expect(mockElement.style.overflow).toBe('hidden');
			expect(mockElement.style.transition).toContain('height');
			expect(mockElement.style.transition).toContain('500ms');
			expect(mockElement.style.transition).toContain('ease');
		});

		it('should use custom property, delay, and easing', () => {
			collapse(mockElement, {
				property: 'width',
				delay: 800,
				easing: 'ease-out',
			});

			expect(mockElement.style.transition).toContain('width');
			expect(mockElement.style.transition).toContain('800ms');
			expect(mockElement.style.transition).toContain('ease-out');
		});

		it('should collapse to custom ending value', () => {
			collapse(mockElement, { to: '25px' });

			// Should eventually set to 'to' value
			expect(mockElement.style.height).toBe('25px');
		});

		it('should collapse to 0 by default', () => {
			collapse(mockElement, {});

			expect(mockElement.style.height).toBe(0);
		});

		it('should add transitionend listener and call done callback', () => {
			const doneSpy = vi.fn();
			collapse(mockElement, { done: doneSpy });

			expect(mockElement.addEventListener).toHaveBeenCalledWith(
				'transitionend',
				expect.any(Function),
				true,
			);

			// Simulate transitionend event
			const listener = mockElement.addEventListener.mock.calls[0][1];
			listener();

			expect(doneSpy).toHaveBeenCalled();
			expect(mockElement.removeEventListener).toHaveBeenCalledWith(
				'transitionend',
				listener,
				true,
			);
		});

		it('should unset styles after transition', () => {
			const doneSpy = vi.fn();
			collapse(mockElement, { done: doneSpy });

			// Simulate transitionend event
			const listener = mockElement.addEventListener.mock.calls[0][1];
			listener();

			expect(mockElement.style.height).toBeNull();
			expect(mockElement.style.overflow).toBeNull();
			expect(mockElement.style.transition).toBeNull();
		});

		it('should unset custom property after transition', () => {
			collapse(mockElement, { property: 'width' });

			const listener = mockElement.addEventListener.mock.calls[0][1];
			listener();

			expect(mockElement.style.width).toBeNull();
		});
	});
});
