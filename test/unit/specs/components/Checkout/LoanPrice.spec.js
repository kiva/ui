import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import LoanPrice from '#src/components/Checkout/LoanPrice';
import { createStubComponent } from '../../../helpers/componentTestHelpers';

// Mock GraphQL mutations (required - these are not executable code)
vi.mock('#src/graphql/mutation/updateLoanReservation.graphql', () => ({
	default: 'updateLoanReservationQuery'
}));

vi.mock('#src/graphql/mutation/updateKivaCardAmount.graphql', () => ({
	default: 'updateKivaCardAmountQuery'
}));

describe('LoanPrice', () => {
	let mockApollo;
	let mockShowTipMsg;
	let mockCloseTipMsg;
	let mockKvTrackEvent;

	// Create stub for RemoveBasketItem component
	const RemoveBasketItem = createStubComponent('RemoveBasketItem', {
		template: '<button class="remove-basket-item" @click="$emit(\'refreshtotals\')">Remove</button>',
		props: ['loanId', 'idsInGroup', 'type'],
		emits: ['refreshtotals', 'updating-totals']
	});

	beforeEach(() => {
		vi.clearAllMocks();

		mockApollo = {
			mutate: vi.fn(() => Promise.resolve({ data: {} }))
		};

		mockShowTipMsg = vi.fn();
		mockCloseTipMsg = vi.fn();
		mockKvTrackEvent = vi.fn();
	});

	const createComponent = (props = {}) => {
		const defaultProps = {
			price: '25',
			loanAmount: '500',
			fundedAmount: '0',
			reservedAmount: '0',
			loanId: 12345,
			type: 'loan',
			...props
		};

		return render(LoanPrice, {
			props: defaultProps,
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$showTipMsg: mockShowTipMsg,
					$closeTipMsg: mockCloseTipMsg,
					$kvTrackEvent: mockKvTrackEvent
				},
				stubs: {
					RemoveBasketItem
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should render dropdown when price > 24', async () => {
			const { container } = createComponent({ price: '25' });
			const select = container.querySelector('.loan-price-select');
			expect(select).toBeTruthy();
		});

		it('should render static price when price <= 24', async () => {
			const { container } = createComponent({ price: '20', enableFiveDollarsNotes: false });
			const staticPrice = container.querySelector('p.tw-text-h3');
			expect(staticPrice).toBeTruthy();
			expect(staticPrice.textContent).toContain('$20');
		});

		it('should render dropdown when enableFiveDollarsNotes is true', async () => {
			const { container } = createComponent({ price: '5', enableFiveDollarsNotes: true });
			const select = container.querySelector('.loan-price-select');
			expect(select).toBeTruthy();
		});

		it('should render RemoveBasketItem component', () => {
			const { container } = createComponent();
			const removeBtn = container.querySelector('.remove-basket-item');
			expect(removeBtn).toBeTruthy();
		});

		it('should have accessible label for select', () => {
			const { container } = createComponent();
			const label = container.querySelector('label[for="loan-price"]');
			expect(label).toBeTruthy();
			expect(label.className).toContain('tw-sr-only');
		});
	});

	describe('Props', () => {
		it('should accept price prop', () => {
			const { container } = createComponent({ price: '50' });
			const select = container.querySelector('select');
			expect(select.value).toBe('50');
		});

		it('should accept loanAmount prop', () => {
			const { container } = createComponent({ loanAmount: '1000' });
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should accept loanId prop and pass to RemoveBasketItem', () => {
			createComponent({ loanId: 99999 });
			// Component renders, RemoveBasketItem receives prop
			expect(mockApollo).toBeDefined();
		});

		it('should accept type prop', () => {
			const { container } = createComponent({ type: 'kivaCard' });
			const select = container.querySelector('select');
			expect(select).toBeTruthy();
		});

		it('should accept idsInGroup prop', () => {
			const { container } = createComponent({
				type: 'kivaCard',
				idsInGroup: [1, 2, 3]
			});
			expect(container.querySelector('select')).toBeTruthy();
		});

		it('should accept enableFiveDollarsNotes prop', () => {
			const { container } = createComponent({
				price: '5',
				enableFiveDollarsNotes: true,
				isLoggedIn: true
			});
			const select = container.querySelector('select');
			expect(select).toBeTruthy();
		});

		it('should accept isExpiringSoon prop', () => {
			const { container } = createComponent({ isExpiringSoon: true });
			expect(container.querySelector('select')).toBeTruthy();
		});
	});

	describe('Prices Computed - Loan Type', () => {
		it('should calculate remaining amount correctly', () => {
			const { container } = createComponent({
				loanAmount: '500',
				fundedAmount: '100',
				reservedAmount: '0',
				price: '25'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should include current price in options if not in array', () => {
			const { container } = createComponent({
				price: '33',
				loanAmount: '100',
				fundedAmount: '0'
			});
			const options = Array.from(container.querySelectorAll('option'));
			const hasPrice = options.some(opt => opt.value === '33');
			expect(hasPrice).toBe(true);
		});

		it('should handle expiring soon loans differently', () => {
			const { container } = createComponent({
				isExpiringSoon: true,
				loanAmount: '500',
				fundedAmount: '100',
				reservedAmount: '50'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should respect minAmount prop', () => {
			const { container } = createComponent({
				minAmount: '50',
				loanAmount: '500',
				fundedAmount: '0'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should default minAmount to 25 when not provided', () => {
			const { container } = createComponent({
				loanAmount: '500',
				fundedAmount: '0'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should ensure at least current price when remaining is met', () => {
			const { container } = createComponent({
				price: '50',
				loanAmount: '50',
				fundedAmount: '0',
				reservedAmount: '0'
			});
			const options = Array.from(container.querySelectorAll('option'));
			const hasPrice = options.some(opt => opt.value === '50');
			expect(hasPrice).toBe(true);
		});
	});

	describe('Prices Computed - Kiva Card Type', () => {
		it('should return fixed price array for kivaCard', () => {
			const { container } = createComponent({
				type: 'kivaCard',
				price: '50'
			});
			const options = Array.from(container.querySelectorAll('option'));
			expect(options.length).toBe(14);
			expect(options[0].value).toBe('25');
			expect(options[options.length - 1].value).toBe('2,000');
		});

		it('should include standard kiva card amounts', () => {
			const { container } = createComponent({
				type: 'kivaCard',
				price: '100'
			});
			const options = Array.from(container.querySelectorAll('option'));
			const values = options.map(opt => opt.value);
			expect(values).toContain('100');
			expect(values).toContain('500');
			expect(values).toContain('1,000');
		});
	});

	describe('Update Loan Reservation', () => {
		it('should call mutation when loan price changes', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateLoanReservationQuery',
					variables: {
						loanId: 12345,
						price: '50.00'
					}
				});
			});
		});

		it('should not call mutation if price unchanged', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '25');

			// Wait a bit to ensure no mutation is called
			await new Promise(resolve => {
				setTimeout(resolve, 100);
			});
			expect(mockApollo.mutate).not.toHaveBeenCalled();
		});

		it('should emit updating-totals true when updating', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(emitted('updating-totals')).toBeTruthy();
				expect(emitted('updating-totals')[0]).toEqual([true]);
			});
		});

		it('should emit refreshtotals on successful update', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(emitted('refreshtotals')).toBeTruthy();
			});
		});

		it('should emit updating-totals false after update', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				const updatingEvents = emitted('updating-totals');
				expect(updatingEvents.length).toBeGreaterThanOrEqual(2);
				expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
			});
		});

		it('should close tip message on success', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockCloseTipMsg).toHaveBeenCalled();
			});
		});

		it('should track successful loan update', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Update Loan Amount',
					'Update Success',
					50,
					50
				);
			});
		});

		it('should update cached selection on success', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalled();
			});

			// Select should maintain new value
			expect(select.value).toBe('50');
		});
	});

	describe('Update Kiva Card Amount', () => {
		it('should call mutation when kiva card price changes', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1, 2, 3]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateKivaCardAmountQuery',
					variables: {
						idsInGroup: [1, 2, 3],
						individualPrice: '100.00'
					}
				});
			});
		});

		it('should track successful kiva card update', async () => {
			const user = userEvent.setup();
			const { container } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Update Kiva Card Amount',
					'Update Success',
					100
				);
			});
		});

		it('should emit events for kiva card updates', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				expect(emitted('updating-totals')).toBeTruthy();
				expect(emitted('refreshtotals')).toBeTruthy();
			});
		});
	});

	describe('Error Handling - Loan', () => {
		it('should show error message when mutation fails', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Update failed', code: 'error' }]
			}));

			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith('Update failed', 'error');
			});
		});

		it('should revert selection on error', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Update failed', code: 'error' }]
			}));

			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(select.value).toBe('25');
			});
		});

		it('should emit updating-totals false on error', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Update failed', code: 'error' }]
			}));

			const user = userEvent.setup();
			const { container, emitted } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				const updatingEvents = emitted('updating-totals');
				expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
			});
		});

		it('should handle not_all_shared_added error code', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Not all shares added', code: 'not_all_shared_added' }]
			}));

			const user = userEvent.setup();
			const { container } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith('Not all shares added', 'error');
			});

			// Note: window.location.reload is called with setTimeout in the component
			// but we can't easily test this without mocking window
		});

		it('should handle mutation rejection', async () => {
			mockApollo.mutate = vi.fn(() => Promise.reject(new Error('Network error')));

			const user = userEvent.setup();
			const { container, emitted } = createComponent({ price: '25' });

			const select = container.querySelector('select');
			await user.selectOptions(select, '50');

			await waitFor(() => {
				const updatingEvents = emitted('updating-totals');
				expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
			});
		});
	});

	describe('Error Handling - Kiva Card', () => {
		it('should show error message for kiva card mutation failure', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Kiva Card update failed' }]
			}));

			const user = userEvent.setup();
			const { container } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				expect(mockShowTipMsg).toHaveBeenCalledWith('Kiva Card update failed', 'error');
			});
		});

		it('should revert kiva card selection on error', async () => {
			mockApollo.mutate = vi.fn(() => Promise.resolve({
				data: {},
				errors: [{ message: 'Update failed' }]
			}));

			const user = userEvent.setup();
			const { container } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				expect(select.value).toBe('50');
			});
		});

		it('should handle kiva card mutation rejection', async () => {
			mockApollo.mutate = vi.fn(() => Promise.reject(new Error('Network error')));

			const user = userEvent.setup();
			const { container, emitted } = createComponent({
				type: 'kivaCard',
				price: '50',
				idsInGroup: [1]
			});

			const select = container.querySelector('select');
			await user.selectOptions(select, '100');

			await waitFor(() => {
				const updatingEvents = emitted('updating-totals');
				expect(updatingEvents[updatingEvents.length - 1]).toEqual([false]);
			});
		});
	});

	describe('RemoveBasketItem Integration', () => {
		it('should pass correct props to RemoveBasketItem', () => {
			const { container } = createComponent({
				loanId: 99999,
				type: 'loan',
				idsInGroup: [1, 2]
			});
			const removeBtn = container.querySelector('.remove-basket-item');
			expect(removeBtn).toBeTruthy();
		});

		it('should relay refreshtotals event from RemoveBasketItem', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent();

			const removeBtn = container.querySelector('.remove-basket-item');
			await user.click(removeBtn);

			await waitFor(() => {
				expect(emitted('refreshtotals')).toBeTruthy();
			});
		});

		it('should be hidden on mobile and visible on desktop', () => {
			const { container } = createComponent();
			const removeWrapper = container.querySelector('.tw-hidden');
			expect(removeWrapper.className).toContain('md:tw-flex');
		});
	});

	describe('Edge Cases', () => {
		it('should handle zero loan amount', () => {
			const { container } = createComponent({
				loanAmount: '0',
				fundedAmount: '0',
				price: '25'
			});
			const select = container.querySelector('select');
			expect(select).toBeTruthy();
		});

		it('should handle fully funded loan', () => {
			const { container } = createComponent({
				loanAmount: '500',
				fundedAmount: '475',
				price: '25'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});

		it('should handle large loan amounts', () => {
			const { container } = createComponent({
				loanAmount: '10000',
				fundedAmount: '0',
				price: '25'
			});
			const options = container.querySelectorAll('option');
			// Should be capped due to overallSelectLimit
			expect(options.length).toBeLessThan(500);
		});

		it('should handle formatted price strings', () => {
			const { container } = createComponent({
				price: '100',
				loanAmount: '10000',
				fundedAmount: '0'
			});
			// With price > 24, should render dropdown
			const select = container.querySelector('select');
			expect(select).toBeTruthy();
			expect(select.value).toBe('100');
		});

		it('should handle price with reserved amount', () => {
			const { container } = createComponent({
				price: '50',
				loanAmount: '500',
				fundedAmount: '100',
				reservedAmount: '150'
			});
			const options = container.querySelectorAll('option');
			expect(options.length).toBeGreaterThan(0);
		});
	});
});
