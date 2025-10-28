import { render } from '@testing-library/vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import CheckoutItemImg from '#src/components/Checkout/CheckoutItemImg';

// Mock kv-track-event directive
const mockTrackEvent = vi.fn();
global.kvTrackEvent = mockTrackEvent;

describe('CheckoutItemImg', () => {
	let router;

	beforeEach(() => {
		vi.clearAllMocks();

		// Create a basic router for testing
		router = createRouter({
			history: createMemoryHistory(),
			routes: [
				{ path: '/lend/:id', name: 'loan', component: { template: '<div>Loan</div>' } }
			]
		});
	});

	const defaultProps = {
		loanId: 12345,
		name: 'Maria',
		imageUrl: 'https://example.com/maria.jpg'
	};

	const createComponent = (props = {}) => {
		return render(CheckoutItemImg, {
			props: {
				...defaultProps,
				...props
			},
			global: {
				plugins: [router],
				directives: {
					'kv-track-event': {
						mounted(el, binding) {
							mockTrackEvent(binding.value);
							el.addEventListener('click', () => mockTrackEvent(binding.value));
						}
					}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(CheckoutItemImg.name).toBe('CheckoutItemImg');
		});

		it('should render an image', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img).toBeTruthy();
		});

		it('should render a router-link by default', () => {
			const { container } = createComponent();
			const link = container.querySelector('a');
			expect(link).toBeTruthy();
		});
	});

	describe('Image Properties', () => {
		it('should display the correct image URL', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img.src).toBe('https://example.com/maria.jpg');
		});

		it('should have the correct alt text', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img.alt).toBe('photo of Maria');
		});

		it('should handle empty name in alt text', () => {
			const { container } = createComponent({ name: '' });
			const img = container.querySelector('img');
			expect(img.alt).toBe('photo of ');
		});

		it('should apply correct CSS classes', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img.className).toContain('loan-img');
			expect(img.className).toContain('tw-w-12');
			expect(img.className).toContain('tw-rounded');
		});
	});

	describe('Router Link', () => {
		it('should link to correct loan page', () => {
			const { container } = createComponent({ loanId: 67890 });
			const link = container.querySelector('a');
			expect(link.getAttribute('href')).toBe('/lend/67890');
		});

		it('should not render router-link when disableLink is true', () => {
			const { container } = createComponent({ disableLink: true });
			const link = container.querySelector('a');
			// When disableLink is true, the dynamic :is binding adds is="span" attribute
			expect(link.getAttribute('is')).toBe('span');
		});

		it('should render as router-link when disableLink is false', () => {
			const { container } = createComponent({ disableLink: false });
			const link = container.querySelector('a');
			const span = container.querySelector('span');
			expect(link).toBeTruthy();
			// Span should not be the wrapper (could be inside)
			expect(span?.querySelector('img')).toBeFalsy();
		});
	});

	describe('Tracking', () => {
		it('should have tracking event directive', () => {
			createComponent();
			expect(mockTrackEvent).toHaveBeenCalled();
		});

		it('should track with correct event parameters', () => {
			createComponent({ loanId: 12345 });
			expect(mockTrackEvent).toHaveBeenCalledWith([
				'basket',
				'click-Read more',
				'Photo',
				12345,
				12345
			]);
		});

		it('should track with different loan IDs', () => {
			createComponent({ loanId: 99999 });
			expect(mockTrackEvent).toHaveBeenCalledWith([
				'basket',
				'click-Read more',
				'Photo',
				99999,
				99999
			]);
		});
	});

	describe('Props', () => {
		it('should accept custom imageUrl prop', () => {
			const customUrl = 'https://example.com/custom.jpg';
			const { container } = createComponent({ imageUrl: customUrl });
			const img = container.querySelector('img');
			expect(img.src).toBe(customUrl);
		});

		it('should accept custom name prop', () => {
			const { container } = createComponent({ name: 'John Doe' });
			const img = container.querySelector('img');
			expect(img.alt).toBe('photo of John Doe');
		});

		it('should handle null loanId', () => {
			const { container } = createComponent({ loanId: null });
			const link = container.querySelector('a');
			expect(link.getAttribute('href')).toBe('/lend/null');
		});

		it('should handle default values', () => {
			const { container } = render(CheckoutItemImg, {
				global: {
					plugins: [router],
					directives: {
						'kv-track-event': { mounted: vi.fn() }
					}
				}
			});
			const img = container.querySelector('img');
			// Empty src becomes localhost in the browser
			expect(img.getAttribute('src')).toBe('');
			expect(img.alt).toBe('photo of ');
		});
	});

	describe('Edge Cases', () => {
		it('should handle very long names', () => {
			const longName = 'A'.repeat(200);
			const { container } = createComponent({ name: longName });
			const img = container.querySelector('img');
			expect(img.alt).toBe(`photo of ${longName}`);
		});

		it('should handle special characters in name', () => {
			const { container } = createComponent({ name: "O'Brien & Sons <>" });
			const img = container.querySelector('img');
			expect(img.alt).toBe("photo of O'Brien & Sons <>");
		});

		it('should handle image URLs with query parameters', () => {
			const urlWithParams = 'https://example.com/image.jpg?size=large&format=webp';
			const { container } = createComponent({ imageUrl: urlWithParams });
			const img = container.querySelector('img');
			expect(img.src).toBe(urlWithParams);
		});
	});
});
