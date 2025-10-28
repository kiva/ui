import { render } from '@testing-library/vue';
import FtdsMessage from '#src/components/Checkout/FtdsMessage';

// Mock the sparkle SVG import
vi.mock('#src/assets/images/checkout/ftds_sparkle.svg?url', () => ({
	default: '/mock-sparkle.svg'
}));

describe('FtdsMessage', () => {
	const createComponent = (props = {}) => {
		return render(FtdsMessage, {
			props: {
				ftdCreditAmount: '25',
				...props
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(FtdsMessage.name).toBe('FtdsMessage');
		});

		it('should render the message container', () => {
			const { container } = createComponent();
			const messageDiv = container.querySelector('div');
			expect(messageDiv).toBeTruthy();
		});

		it('should have correct styling classes', () => {
			const { container } = createComponent();
			const messageDiv = container.querySelector('div');
			expect(messageDiv.className).toContain('tw-bg-brand-100');
			expect(messageDiv.className).toContain('tw-rounded-xs');
			expect(messageDiv.className).toContain('tw-py-1');
			expect(messageDiv.className).toContain('tw-px-1.5');
			expect(messageDiv.className).toContain('tw-flex');
			expect(messageDiv.className).toContain('tw-justify-center');
			expect(messageDiv.className).toContain('tw-items-center');
		});

		it('should render sparkle image', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img).toBeTruthy();
		});

		it('should render message paragraph', () => {
			const { container } = createComponent();
			const paragraph = container.querySelector('p');
			expect(paragraph).toBeTruthy();
		});
	});

	describe('Sparkle Image', () => {
		it('should have correct src attribute', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img.getAttribute('src')).toBe('/mock-sparkle.svg');
		});

		it('should have alt text', () => {
			const { container } = createComponent();
			const img = container.querySelector('img');
			expect(img.alt).toBe('FTDs Sparkle');
		});
	});

	describe('Props', () => {
		it('should display ftdCreditAmount in message', () => {
			const { container } = createComponent({ ftdCreditAmount: '25' });
			expect(container.textContent).toContain('$25');
		});

		it('should handle different credit amounts', () => {
			const { container } = createComponent({ ftdCreditAmount: '50' });
			expect(container.textContent).toContain('$50');
		});

		it('should handle empty ftdCreditAmount', () => {
			const { container } = createComponent({ ftdCreditAmount: '' });
			expect(container.textContent).toContain('$');
		});

		it('should display credit amount in medium font weight', () => {
			const { container } = createComponent();
			const mediumText = container.querySelector('.tw-font-medium');
			expect(mediumText).toBeTruthy();
			expect(mediumText.textContent).toContain('in lending credits');
		});
	});

	describe('Message Content', () => {
		it('should mention earning credits', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('You');
			expect(container.textContent).toContain('ll earn');
		});

		it('should mention lending credits', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('in lending credits');
		});

		it('should mention after checkout', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('after checkout');
		});

		it('should mention supporting another borrower', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('help support another borrower');
		});

		it('should include superscript notation', () => {
			const { container } = createComponent();
			const sup = container.querySelector('sup');
			expect(sup).toBeTruthy();
			expect(sup.textContent).toBe('1');
		});
	});

	describe('Data', () => {
		it('should have sparkleUrl in data', () => {
			const { container } = createComponent();
			// Sparkle URL should be available and rendered
			const img = container.querySelector('img');
			expect(img.src).toContain('mock-sparkle');
		});
	});
});
