import { render } from '@testing-library/vue';
import LoanMatcher from '../../../../../src/components/Checkout/LoanMatcher';

describe('LoanMatcher', () => {
	const createComponent = (props = {}) => {
		return render(LoanMatcher, {
			props: {
				matchingText: 'John Doe',
				...props
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(LoanMatcher.name).toBe('LoanMatcher');
		});

		it('should render the matching text message', () => {
			const { container } = createComponent();
			const text = container.querySelector('.matching-text');
			expect(text).toBeTruthy();
			expect(text.textContent).toContain('Matched by John Doe');
		});

		it('should have correct styling classes', () => {
			const { container } = createComponent();
			const text = container.querySelector('p');
			expect(text.className).toContain('tw-text-small');
			expect(text.className).toContain('tw-text-secondary');
			expect(text.className).toContain('matching-text');
		});
	});

	describe('Props', () => {
		it('should accept matchingText prop', () => {
			const { container } = createComponent({ matchingText: 'Jane Smith' });
			expect(container.textContent).toContain('Matched by Jane Smith');
		});

		it('should handle empty matchingText', () => {
			const { container } = createComponent({ matchingText: '' });
			expect(container.textContent).toContain('Matched by');
		});

		it('should handle special characters in matchingText', () => {
			const { container } = createComponent({ matchingText: 'Smith & Co.' });
			expect(container.textContent).toContain('Matched by Smith & Co.');
		});

		it('should handle long matchingText', () => {
			const longText = 'A very long organization name that might wrap to multiple lines';
			const { container } = createComponent({ matchingText: longText });
			expect(container.textContent).toContain(`Matched by ${longText}`);
		});

		it('should handle numeric matchingText', () => {
			const { container } = createComponent({ matchingText: '12345' });
			expect(container.textContent).toContain('Matched by 12345');
		});
	});

	describe('Rendering', () => {
		it('should render as a paragraph element', () => {
			const { container } = createComponent();
			const paragraph = container.querySelector('p');
			expect(paragraph).toBeTruthy();
		});

		it('should display the complete message format', () => {
			const { container } = createComponent({ matchingText: 'Test Matcher' });
			const text = container.textContent.trim();
			expect(text).toBe('Matched by Test Matcher');
		});
	});
});
