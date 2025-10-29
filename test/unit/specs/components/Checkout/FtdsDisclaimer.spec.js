import { render } from '@testing-library/vue';
import FtdsDisclaimer from '../../../../../src/components/Checkout/FtdsDisclaimer';

describe('FtdsDisclaimer', () => {
	const createComponent = (props = {}) => {
		return render(FtdsDisclaimer, {
			props: {
				ftdCreditAmount: '25',
				ftdValidDate: 'December 31, 2025',
				...props
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(FtdsDisclaimer.name).toBe('FtdsDisclaimer');
		});

		it('should render disclaimer text', () => {
			const { container } = createComponent();
			const disclaimer = container.querySelector('p');
			expect(disclaimer).toBeTruthy();
			expect(disclaimer.textContent).toContain('Disclaimer:');
		});

		it('should have correct styling classes', () => {
			const { container } = createComponent();
			const disclaimer = container.querySelector('p');
			expect(disclaimer.className).toContain('tw-text-small');
			expect(disclaimer.className).toContain('tw-text-black');
		});
	});

	describe('Props', () => {
		it('should display ftdCreditAmount in disclaimer', () => {
			const { container } = createComponent({ ftdCreditAmount: '25' });
			expect(container.textContent).toContain('$25');
		});

		it('should display ftdValidDate in disclaimer', () => {
			const { container } = createComponent({ ftdValidDate: 'December 31, 2025' });
			expect(container.textContent).toContain('December 31, 2025');
		});

		it('should handle different credit amounts', () => {
			const { container } = createComponent({ ftdCreditAmount: '50' });
			expect(container.textContent).toContain('$50');
		});

		it('should handle different valid dates', () => {
			const { container } = createComponent({ ftdValidDate: 'January 15, 2026' });
			expect(container.textContent).toContain('January 15, 2026');
		});

		it('should handle empty ftdCreditAmount', () => {
			const { container } = createComponent({ ftdCreditAmount: '' });
			expect(container.textContent).toContain('$');
		});

		it('should handle empty ftdValidDate', () => {
			const { container } = createComponent({ ftdValidDate: '' });
			const disclaimer = container.querySelector('p');
			expect(disclaimer).toBeTruthy();
		});
	});

	describe('Disclaimer Content', () => {
		it('should mention free credit application', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('free credit will be applied');
		});

		it('should mention first loan requirement', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('first loan');
		});

		it('should mention notification email', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('notification email');
		});

		it('should mention 14 day expiration', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('14 days');
		});

		it('should mention no cash value', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('no cash value');
		});

		it('should mention repayments return to Kiva', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('repayments will return to Kiva');
		});

		it('should mention funds lasting', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('While funds last');
		});
	});
});
