import { render } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import MatchedLoansLightbox from '#src/components/Checkout/MatchedLoansLightbox';

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvLightbox: {
		name: 'KvLightbox',
		template: `<div v-if="visible" class="kv-lightbox">
			<h2>{{ title }}</h2>
			<button class="close-btn" @click="$emit('lightbox-closed')">Close</button>
			<div class="lightbox-content"><slot /></div>
		</div>`,
		props: ['visible', 'title'],
		emits: ['lightbox-closed']
	}
}));

describe('MatchedLoansLightbox', () => {
	let mockKvTrackEvent;

	beforeEach(() => {
		mockKvTrackEvent = vi.fn();
	});

	const createComponent = (props = {}) => {
		return render(MatchedLoansLightbox, {
			props: {
				showLightbox: true,
				closeLightbox: vi.fn(),
				...props
			},
			global: {
				mocks: {
					$kvTrackEvent: mockKvTrackEvent
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(MatchedLoansLightbox.name).toBe('MatchedLoansLightbox');
		});

		it('should render lightbox when showLightbox is true', () => {
			const { container } = createComponent({ showLightbox: true });
			const lightbox = container.querySelector('.kv-lightbox');
			expect(lightbox).toBeTruthy();
		});

		it('should not render lightbox when showLightbox is false', () => {
			const { container } = createComponent({ showLightbox: false });
			const lightbox = container.querySelector('.kv-lightbox');
			expect(lightbox).toBeFalsy();
		});

		it('should have correct title', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Matched lending');
		});
	});

	describe('Props', () => {
		it('should accept showLightbox prop', () => {
			const { container } = createComponent({ showLightbox: true });
			expect(container.querySelector('.kv-lightbox')).toBeTruthy();
		});

		it('should accept closeLightbox function prop', () => {
			const closeFn = vi.fn();
			createComponent({ closeLightbox: closeFn });
			expect(closeFn).not.toHaveBeenCalled();
		});

		it('should have default closeLightbox function', () => {
			const { container } = createComponent({ closeLightbox: undefined });
			expect(container).toBeTruthy();
		});
	});

	describe('Content', () => {
		it('should display first paragraph about matched lending', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Matching loans with new deposits');
			expect(container.textContent).toContain('responsibly use funds');
		});

		it('should mention matching partnerships', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('matching partnerships');
		});

		it('should mention support for borrowers', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('support of borrowers around the world');
		});

		it('should display second paragraph about payment requirements', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Loan matching only applies');
		});

		it('should mention full amount requirement', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('deposit the full amount');
		});

		it('should list accepted payment methods', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Card');
			expect(container.textContent).toContain('PayPal');
			expect(container.textContent).toContain('Google Pay');
			expect(container.textContent).toContain('ApplePay');
		});

		it('should mention Kiva Credit exclusion', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Kiva Credit');
			expect(container.textContent).toContain('do not qualify');
		});

		it('should mention Free Credit exclusion', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('Free Credit');
			expect(container.textContent).toContain('do not qualify');
		});

		it('should have proper paragraph structure', () => {
			const { container } = createComponent();
			const paragraphs = container.querySelectorAll('p');
			expect(paragraphs.length).toBe(2);
		});

		it('should have margin on first paragraph', () => {
			const { container } = createComponent();
			const firstP = container.querySelector('p');
			expect(firstP.className).toContain('tw-mb-2');
		});
	});

	describe('Lightbox Interaction', () => {
		it('should call closeLightbox when close button clicked', async () => {
			const user = userEvent.setup();
			const closeFn = vi.fn();
			const { container } = createComponent({ closeLightbox: closeFn });

			const closeBtn = container.querySelector('.close-btn');
			await user.click(closeBtn);

			expect(closeFn).toHaveBeenCalled();
		});
	});

	describe('Tracking', () => {
		it('should track event on mount', () => {
			createComponent();
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'Basket',
				'view-must-deposit-message-cta',
				''
			);
		});

		it('should track event only once', () => {
			createComponent();
			expect(mockKvTrackEvent).toHaveBeenCalledTimes(1);
		});
	});
});
