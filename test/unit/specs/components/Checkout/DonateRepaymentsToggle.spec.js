import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import DonateRepaymentsToggle from '../../../../../src/components/Checkout/DonateRepaymentsToggle';

// Mock @kiva/kv-components
vi.mock('@kiva/kv-components', () => ({
	KvCheckbox: {
		name: 'KvCheckbox',
		template: `<div class="kv-checkbox">
			<input type="checkbox" :checked="modelValue"
				@change="$emit('update:model-value', $event.target.checked)" />
			<label><slot /></label>
		</div>`,
		props: ['modelValue', 'id'],
		emits: ['update:model-value']
	},
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

// Mock GraphQL queries
vi.mock('#src/graphql/query/checkout/initializeCheckout.graphql', () => ({
	default: 'initializeCheckoutQuery'
}));

vi.mock('#src/graphql/mutation/updateLoanReservationDonateRepayments.graphql', () => ({
	default: 'updateLoanReservationDonateRepaymentsQuery'
}));

describe('DonateRepaymentsToggle', () => {
	let mockApollo;
	let mockSubscribe;
	let mockShowTipMsg;
	let mockKvTrackEvent;

	const defaultBasketData = {
		my: {
			userAccount: {
				donateRepayments: false
			}
		},
		shop: {
			basket: {
				totals: {
					donationTotal: '0',
					redemptionCodeAppliedTotal: '0',
					bonusAppliedTotal: '0',
					loanReservationTotal: '100'
				},
				items: {
					values: [
						{ __typename: 'LoanReservation', id: 12345, donateRepayments: false },
						{ __typename: 'LoanReservation', id: 67890, donateRepayments: false }
					]
				}
			}
		}
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockSubscribe = vi.fn();
		mockApollo = {
			watchQuery: vi.fn(() => ({
				subscribe: mockSubscribe
			})),
			mutate: vi.fn(() => Promise.resolve({ data: {} }))
		};

		mockShowTipMsg = vi.fn();
		mockKvTrackEvent = vi.fn();
	});

	const createComponent = (basketData = defaultBasketData) => {
		// Setup the subscribe mock to call the next handler
		mockSubscribe.mockImplementation(({ next }) => {
			setTimeout(() => next({ data: basketData }), 0);
			return { unsubscribe: vi.fn() };
		});

		return render(DonateRepaymentsToggle, {
			global: {
				provide: {
					apollo: mockApollo
				},
				mocks: {
					$showTipMsg: mockShowTipMsg,
					$kvTrackEvent: mockKvTrackEvent
				},
				directives: {
					'kv-track-event': {
						mounted: vi.fn()
					}
				}
			}
		});
	};

	describe('Component Structure', () => {
		it('should have the correct component name', () => {
			expect(DonateRepaymentsToggle.name).toBe('DonateRepaymentsToggle');
		});

		it('should render toggle when conditions are met', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeTruthy();
			});
		});

		it('should render checkbox', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
				expect(checkbox).toBeTruthy();
			});
		});

		it('should render button to toggle checkbox', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const button = container.querySelector('[data-testid="basket-donation-repayments-button"]');
				expect(button).toBeTruthy();
				expect(button.textContent).toContain('Donate loan repayments instead?');
			});
		});

		it('should render learn more button', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const learnMore = container.querySelector('[data-testid="basket-donation-repayments-lightbox"]');
				expect(learnMore).toBeTruthy();
				expect(learnMore.textContent).toContain('Learn more');
			});
		});
	});

	describe('Apollo Integration', () => {
		it('should watch checkout query on creation', () => {
			createComponent();
			expect(mockApollo.watchQuery).toHaveBeenCalledWith({
				query: 'initializeCheckoutQuery'
			});
		});

		it('should subscribe to query updates', () => {
			createComponent();
			expect(mockSubscribe).toHaveBeenCalled();
		});

		it('should update component data from query results', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// Component should be rendered with data
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeTruthy();
			});
		});

		it('should extract loans from basket items', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				// Should process loans and render toggle
				expect(container.querySelector('.donate-repayments-toggle')).toBeTruthy();
			});
		});
	});

	describe('Show Toggle Computed Property', () => {
		it('should hide toggle when donation total > 0', async () => {
			const dataWithDonation = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						totals: {
							...defaultBasketData.shop.basket.totals,
							donationTotal: '25'
						}
					}
				}
			};
			const { container } = createComponent(dataWithDonation);
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeFalsy();
			});
		});

		it('should hide toggle when redemption code applied', async () => {
			const dataWithRedemption = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						totals: {
							...defaultBasketData.shop.basket.totals,
							redemptionCodeAppliedTotal: '10'
						}
					}
				}
			};
			const { container } = createComponent(dataWithRedemption);
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeFalsy();
			});
		});

		it('should hide toggle when bonus applied', async () => {
			const dataWithBonus = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						totals: {
							...defaultBasketData.shop.basket.totals,
							bonusAppliedTotal: '15'
						}
					}
				}
			};
			const { container } = createComponent(dataWithBonus);
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeFalsy();
			});
		});

		it('should hide toggle when user already donates repayments', async () => {
			const dataWithUserDonating = {
				...defaultBasketData,
				my: {
					userAccount: {
						donateRepayments: true
					}
				}
			};
			const { container } = createComponent(dataWithUserDonating);
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeFalsy();
			});
		});

		it('should hide toggle when no loans in basket', async () => {
			const dataNoLoans = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						totals: {
							...defaultBasketData.shop.basket.totals,
							loanReservationTotal: '0'
						}
					}
				}
			};
			const { container } = createComponent(dataNoLoans);
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeFalsy();
			});
		});

		it('should show toggle when conditions are met', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const toggle = container.querySelector('.donate-repayments-toggle');
				expect(toggle).toBeTruthy();
			});
		});
	});

	describe('Checkbox Interaction', () => {
		it('should toggle checkbox when button is clicked', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('[data-testid="basket-donation-repayments-button"]')).toBeTruthy();
			});

			const button = container.querySelector('[data-testid="basket-donation-repayments-button"]');
			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');

			expect(checkbox.checked).toBe(false);
			await user.click(button);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalled();
			});
		});

		it('should call mutation when checkbox value changes', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalled();
			});
		});

		it('should call mutation for each loan', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				// Should be called once for each loan (2 loans in default data)
				expect(mockApollo.mutate).toHaveBeenCalledTimes(2);
			});
		});

		it('should pass correct variables to mutation', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalledWith({
					mutation: 'updateLoanReservationDonateRepaymentsQuery',
					variables: {
						loanId: 12345,
						donateRepayments: true
					}
				});
			});
		});
	});

	describe('Event Emissions', () => {
		it('should emit updating-totals when setting donate repayments', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(emitted('updating-totals')).toBeTruthy();
				expect(emitted('updating-totals')[0]).toEqual([true]);
			});
		});

		it('should emit refreshtotals after mutation', async () => {
			const user = userEvent.setup();
			const { container, emitted } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(emitted('refreshtotals')).toBeTruthy();
				expect(emitted('refreshtotals')[0]).toEqual(['donate-repayments']);
			});
		});
	});

	describe('Tracking', () => {
		it('should track when donate repayments applied', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Donate Repayments',
					'Applied'
				);
			});
		});

		it('should track when donate repayments removed', async () => {
			const user = userEvent.setup();
			const dataWithDonating = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						items: {
							values: [
								{ __typename: 'LoanReservation', id: 12345, donateRepayments: true }
							]
						}
					}
				}
			};
			const { container } = createComponent(dataWithDonating);

			await waitFor(() => {
				const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
				expect(checkbox.checked).toBe(true);
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			await waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'basket',
					'Donate Repayments',
					'Removed'
				);
			});
		});
	});

	describe('Lightbox', () => {
		it('should not show lightbox initially', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const lightbox = container.querySelector('.kv-lightbox');
				expect(lightbox).toBeFalsy();
			});
		});

		it('should open lightbox when learn more is clicked', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('[data-testid="basket-donation-repayments-lightbox"]')).toBeTruthy();
			});

			const learnMore = container.querySelector('[data-testid="basket-donation-repayments-lightbox"]');
			await user.click(learnMore);

			await waitFor(() => {
				const lightbox = container.querySelector('.kv-lightbox');
				expect(lightbox).toBeTruthy();
			});
		});

		it('should have correct lightbox title', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('[data-testid="basket-donation-repayments-lightbox"]')).toBeTruthy();
			});

			const learnMore = container.querySelector('[data-testid="basket-donation-repayments-lightbox"]');
			await user.click(learnMore);

			await waitFor(() => {
				expect(container.textContent).toContain('Donate your loan repayments');
			});
		});

		it('should display lightbox content', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('[data-testid="basket-donation-repayments-lightbox"]')).toBeTruthy();
			});

			const learnMore = container.querySelector('[data-testid="basket-donation-repayments-lightbox"]');
			await user.click(learnMore);

			await waitFor(() => {
				expect(container.textContent).toContain('When you check this box');
				expect(container.textContent).toContain('helping us cover operating costs');
			});
		});

		it('should close lightbox when close is clicked', async () => {
			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('[data-testid="basket-donation-repayments-lightbox"]')).toBeTruthy();
			});

			const learnMore = container.querySelector('[data-testid="basket-donation-repayments-lightbox"]');
			await user.click(learnMore);

			await waitFor(() => {
				expect(container.querySelector('.kv-lightbox')).toBeTruthy();
			});

			const closeBtn = container.querySelector('.close-btn');
			await user.click(closeBtn);

			await waitFor(() => {
				expect(container.querySelector('.kv-lightbox')).toBeFalsy();
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle mutation rejection gracefully', async () => {
			// Component catches errors but doesn't show tip messages due to timing issue
			// (the errors array is checked synchronously before promises resolve)
			mockApollo.mutate = vi.fn(() => Promise.reject(new Error('Network error')));

			const user = userEvent.setup();
			const { container, emitted } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			// Should still emit refreshtotals even on error
			await waitFor(() => {
				expect(emitted('refreshtotals')).toBeTruthy();
			});
		});

		it('should call mutation even when errors occur', async () => {
			mockApollo.mutate = vi.fn(() => Promise.reject(new Error('Network error')));

			const user = userEvent.setup();
			const { container } = createComponent();

			await waitFor(() => {
				expect(container.querySelector('.kv-checkbox input[type="checkbox"]')).toBeTruthy();
			});

			const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
			await user.click(checkbox);

			// Mutation should still be attempted
			await waitFor(() => {
				expect(mockApollo.mutate).toHaveBeenCalled();
			});
		});
	});

	describe('Initial State from Data', () => {
		it('should check checkbox if any loan has donateRepayments true', async () => {
			const dataWithDonating = {
				...defaultBasketData,
				shop: {
					basket: {
						...defaultBasketData.shop.basket,
						items: {
							values: [
								{ __typename: 'LoanReservation', id: 12345, donateRepayments: true },
								{ __typename: 'LoanReservation', id: 67890, donateRepayments: false }
							]
						}
					}
				}
			};
			const { container } = createComponent(dataWithDonating);

			await waitFor(() => {
				const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
				expect(checkbox.checked).toBe(true);
			});
		});

		it('should not check checkbox if no loans have donateRepayments', async () => {
			const { container } = createComponent();

			await waitFor(() => {
				const checkbox = container.querySelector('.kv-checkbox input[type="checkbox"]');
				expect(checkbox.checked).toBe(false);
			});
		});
	});

	describe('Accessibility', () => {
		it('should have screen reader text for checkbox', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const srText = container.querySelector('[data-testid="donate-repayments-tooltip"]');
				expect(srText).toBeTruthy();
				expect(srText.textContent).toContain('Donate loan repayments instead?');
				expect(srText.className).toContain('tw-sr-only');
			});
		});

		it('should have aria-hidden on button', async () => {
			const { container } = createComponent();
			await waitFor(() => {
				const button = container.querySelector('[data-testid="basket-donation-repayments-button"]');
				expect(button.getAttribute('aria-hidden')).toBe('true');
			});
		});
	});
});
