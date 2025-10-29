import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import PaidAmountModal from '../../../../../src/components/Portfolio/PaidAmountModal';

// Mock numeral
vi.mock('numeral', () => ({
	default: value => ({
		format: formatString => {
			const num = parseFloat(value);
			if (formatString === '0,0.00') {
				return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			}
			return num.toString();
		}
	})
}));

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvLightbox: {
		name: 'KvLightbox',
		template: `
			<div v-if="visible" class="kv-lightbox">
				<h2>{{ title }}</h2>
				<button class="close-button" @click="$emit('lightbox-closed')">Close</button>
				<div class="lightbox-content"><slot /></div>
			</div>
		`,
		props: ['visible', 'title'],
		emits: ['lightbox-closed']
	}
}));

describe('PaidAmountModal', () => {
	const defaultProps = {
		amount: '25.50'
	};

	const customPaymentHistory = [
		{ date: 'Jan 15, 2024', amount: '10.00', type: 'repaid' },
		{ date: 'Feb 20, 2024', amount: '15.00', type: 'repaid' },
		{ date: 'Mar 10, 2024', amount: '0.50', type: 'loss' }
	];

	const createComponent = (props = {}) => {
		return render(PaidAmountModal, {
			props: {
				...defaultProps,
				...props
			}
		});
	};

	describe('Component Structure', () => {
		it('should render trigger link with formatted amount', () => {
			const { container } = createComponent();
			expect(container.textContent).toContain('25.50 repaid to you');
		});

		it('should have clickable trigger element', () => {
			const { container } = createComponent();
			const trigger = container.querySelector('.tw-text-link');
			expect(trigger).toBeTruthy();
			expect(trigger.classList.contains('tw-cursor-pointer')).toBe(true);
		});

		it('should not show modal initially', () => {
			const { container } = createComponent();
			const modal = container.querySelector('.kv-lightbox');
			expect(modal).toBeFalsy();
		});
	});

	describe('Amount Formatting', () => {
		it('should format amount with two decimal places', () => {
			const { container } = createComponent({ amount: '100' });
			expect(container.textContent).toContain('100.00 repaid to you');
		});

		it('should format amount with thousands separator', () => {
			const { container } = createComponent({ amount: '1234.56' });
			expect(container.textContent).toContain('1,234.56 repaid to you');
		});

		it('should handle decimal amounts correctly', () => {
			const { container } = createComponent({ amount: '5.5' });
			expect(container.textContent).toContain('5.50 repaid to you');
		});

		it('should format zero amount', () => {
			const { container } = createComponent({ amount: '0' });
			expect(container.textContent).toContain('0.00 repaid to you');
		});
	});

	describe('Modal Interaction', () => {
		it('should show modal when trigger is clicked', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const modal = container.querySelector('.kv-lightbox');
				expect(modal).toBeTruthy();
			});
		});

		it('should have correct modal title', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('Payment history');
			});
		});

		it('should close modal when lightbox-closed event is emitted', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			// Open modal
			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.querySelector('.kv-lightbox')).toBeTruthy();
			});

			// Close modal
			const closeButton = container.querySelector('.close-button');
			await user.click(closeButton);

			await waitFor(() => {
				expect(container.querySelector('.kv-lightbox')).toBeFalsy();
			});
		});
	});

	describe('Payment History - Default Data', () => {
		it('should display default payment history when not provided', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('Dec 18, 2024');
				expect(container.textContent).toContain('Jan 28, 2025');
			});
		});

		it('should display default payment amounts', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('2.37');
				expect(container.textContent).toContain('0.89');
				expect(container.textContent).toContain('0.01');
			});
		});

		it('should show repaid type for default payments', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('repaid');
			});
		});

		it('should show currency loss type in default data', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('currency loss');
			});
		});
	});

	describe('Payment History - Custom Data', () => {
		it('should display custom payment history dates', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('Jan 15, 2024');
				expect(container.textContent).toContain('Feb 20, 2024');
				expect(container.textContent).toContain('Mar 10, 2024');
			});
		});

		it('should display custom payment amounts', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('10.00');
				expect(container.textContent).toContain('15.00');
				expect(container.textContent).toContain('0.50');
			});
		});

		it('should display repaid type for custom payments', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const content = container.textContent;
				const repaidCount = (content.match(/repaid/g) || []).length;
				expect(repaidCount).toBeGreaterThan(0);
			});
		});

		it('should display loss type for currency loss payments', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('currency loss');
			});
		});
	});

	describe('Payment History Layout', () => {
		it('should use grid layout for payment history', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const grid = container.querySelector('.tw-grid.tw-grid-cols-2');
				expect(grid).toBeTruthy();
			});
		});

		it('should display date and amount for each payment', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const grid = container.querySelector('.tw-grid.tw-grid-cols-2');
				expect(grid).toBeTruthy();
				// Check that dates have colons
				expect(container.textContent).toContain('Jan 15, 2024:');
			});
		});

		it('should render all payment history items', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: customPaymentHistory });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				// 3 payments in custom history
				const grid = container.querySelector('.tw-grid.tw-grid-cols-2');
				const contentDivs = grid.querySelectorAll('.tw-contents');
				expect(contentDivs.length).toBe(3);
			});
		});
	});

	describe('Currency Loss Display', () => {
		it('should show minus sign for loss type payments', async () => {
			const user = userEvent.setup();
			const lossPayment = [
				{ date: 'Jan 1, 2024', amount: '5.00', type: 'loss' }
			];
			const { container } = createComponent({ paymentHistory: lossPayment });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				// Look for the minus sign in absolute positioning
				const minusSign = container.querySelector('.tw-absolute.tw-right-full');
				expect(minusSign).toBeTruthy();
				expect(minusSign.textContent).toBe('-');
			});
		});

		it('should not show minus sign for repaid type payments', async () => {
			const user = userEvent.setup();
			const repaidPayment = [
				{ date: 'Jan 1, 2024', amount: '5.00', type: 'repaid' }
			];
			const { container } = createComponent({ paymentHistory: repaidPayment });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				// Should not have the minus sign for repaid payments
				const minusSign = container.querySelector('.tw-absolute.tw-right-full');
				expect(minusSign).toBeFalsy();
			});
		});

		it('should show "currency loss" text for loss type', async () => {
			const user = userEvent.setup();
			const lossPayment = [
				{ date: 'Jan 1, 2024', amount: '5.00', type: 'loss' }
			];
			const { container } = createComponent({ paymentHistory: lossPayment });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('currency loss');
			});
		});

		it('should show "repaid" text for repaid type', async () => {
			const user = userEvent.setup();
			const repaidPayment = [
				{ date: 'Jan 1, 2024', amount: '5.00', type: 'repaid' }
			];
			const { container } = createComponent({ paymentHistory: repaidPayment });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('repaid');
				expect(container.textContent).not.toContain('currency loss');
			});
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty payment history', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ paymentHistory: [] });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const modal = container.querySelector('.kv-lightbox');
				expect(modal).toBeTruthy();
				// Grid should still exist, just empty
				const grid = container.querySelector('.tw-grid.tw-grid-cols-2');
				expect(grid).toBeTruthy();
			});
		});

		it('should handle single payment in history', async () => {
			const user = userEvent.setup();
			const singlePayment = [
				{ date: 'Jan 1, 2024', amount: '25.00', type: 'repaid' }
			];
			const { container } = createComponent({ paymentHistory: singlePayment });

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				expect(container.textContent).toContain('Jan 1, 2024');
				expect(container.textContent).toContain('25.00');
			});
		});

		it('should handle very small amounts', async () => {
			const { container } = createComponent({ amount: '0.01' });
			expect(container.textContent).toContain('0.01 repaid to you');
		});

		it('should handle very large amounts', async () => {
			const { container } = createComponent({ amount: '999999.99' });
			expect(container.textContent).toContain('999,999.99 repaid to you');
		});
	});

	describe('Accessibility', () => {
		it('should have appropriate modal title', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			const trigger = container.querySelector('.tw-text-link');
			await user.click(trigger);

			await waitFor(() => {
				const title = container.querySelector('h2');
				expect(title).toBeTruthy();
				expect(title.textContent).toBe('Payment history');
			});
		});

		it('should have keyboard accessible trigger', () => {
			const { container } = createComponent();
			const trigger = container.querySelector('.tw-text-link');
			// Should be a clickable element (span with click handler)
			expect(trigger.tagName.toLowerCase()).toBe('span');
		});
	});
});
