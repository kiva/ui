/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises, mount } from '@vue/test-utils';
import ExpressCheckoutModal from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutModal';

const {
	mockCreateBasket,
	mockExecuteOneTimeCheckout,
	mockFormatPreCheckoutValidationErrors,
	mockGetCheckoutTrackingData,
	mockGetClientToken,
	mockLogFormatter,
	mockPush,
	mockShowTipMsg,
	mockTrackFBTransaction,
	mockTrackTransactionEvent,
	mockValidatePreCheckoutBasket,
	mockWatchBasketTotals,
} = vi.hoisted(() => ({
	mockCreateBasket: vi.fn(),
	mockExecuteOneTimeCheckout: vi.fn(),
	mockFormatPreCheckoutValidationErrors: vi.fn(),
	mockGetCheckoutTrackingData: vi.fn(),
	mockGetClientToken: vi.fn(),
	mockLogFormatter: vi.fn(),
	mockPush: vi.fn(),
	mockShowTipMsg: vi.fn(),
	mockTrackFBTransaction: vi.fn(),
	mockTrackTransactionEvent: vi.fn(),
	mockValidatePreCheckoutBasket: vi.fn(),
	mockWatchBasketTotals: vi.fn(),
}));

vi.mock('@kiva/kv-analytics', () => ({
	trackFBTransaction: mockTrackFBTransaction,
}));

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		props: ['state'],
		template: '<button type="submit" :disabled="state === \'disabled\'"><slot /></button>',
	},
	KvLightbox: {
		props: ['preventClose', 'title', 'visible'],
		template: '<div v-if="visible" data-testid="lightbox" :data-prevent-close="preventClose"><slot /></div>',
	},
	KvLoadingPlaceholder: {
		template: '<div data-testid="loading-placeholder"></div>',
	},
}));

vi.mock('@kiva/kv-shop', () => ({
	basketTotalsQuery: 'basketTotalsQuery',
	createBasket: mockCreateBasket,
	executeOneTimeCheckout: mockExecuteOneTimeCheckout,
	getBasketID: vi.fn(() => 'basket-123'),
	getCheckoutTrackingData: mockGetCheckoutTrackingData,
	getClientToken: mockGetClientToken,
	KvPaymentSelect: { template: '<div data-testid="payment-select" />' },
	trackTransactionEvent: mockTrackTransactionEvent,
	useBraintreeDropIn: vi.fn(() => 'dropin-instance'),
	watchBasketTotals: mockWatchBasketTotals,
}));

vi.mock('#src/components/Thanks/ExpressCheckout/ExpressCheckoutTotals', () => ({
	default: { template: '<div data-testid="express-checkout-totals" />' },
}));

vi.mock('#src/composables/useTipMessage', () => ({
	default: () => ({ $showTipMsg: mockShowTipMsg }),
}));

vi.mock('#src/util/checkout/checkoutValidationUtils', () => ({
	formatPreCheckoutValidationErrors: mockFormatPreCheckoutValidationErrors,
	validatePreCheckoutBasket: mockValidatePreCheckoutBasket,
}));

vi.mock('#src/util/logFormatter', () => ({
	default: mockLogFormatter,
}));

describe('ExpressCheckoutModal', () => {
	let wrapper;
	let apollo;
	let totalsSubscription;

	const mountClosed = () => {
		totalsSubscription = { unsubscribe: vi.fn() };
		apollo = {
			query: vi.fn().mockResolvedValue({ data: {} }),
		};
		mockGetClientToken.mockResolvedValue('client-token');
		mockWatchBasketTotals.mockReturnValue({
			subscribe: vi.fn(({ next }) => {
				next({
					data: {
						shop: {
							basket: {
								totals: {
									creditAmountNeeded: '0.00',
								},
							},
						},
					},
				});
				return totalsSubscription;
			}),
		});

		wrapper = mount(ExpressCheckoutModal, {
			global: {
				provide: {
					apollo,
					$appConfig: {},
				},
			},
			props: {
				loan: { id: 123, name: 'Amina' },
			},
		});
	};

	const mountComponent = async () => {
		mountClosed();
		wrapper.vm.openLoading();
		await wrapper.vm.loadPaymentDetails();
		await flushPromises();
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		wrapper?.unmount();
	});

	it('redirects to the basket and does not checkout when pre-checkout validation fails', async () => {
		await mountComponent();
		const validationErrors = [{ error: 'ERROR_OWN_LOAN', value: 'Cannot buy own loan' }];
		mockValidatePreCheckoutBasket.mockResolvedValue(validationErrors);
		mockFormatPreCheckoutValidationErrors.mockReturnValue('Cannot buy own loan');

		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(mockValidatePreCheckoutBasket).toHaveBeenCalledWith({ apollo });
		expect(mockExecuteOneTimeCheckout).not.toHaveBeenCalled();
		expect(mockLogFormatter).toHaveBeenCalledWith(
			'ExpressCheckoutModal validation failed: Cannot buy own loan',
			'error',
		);
		expect(mockPush).toHaveBeenCalledWith('/basket');
		expect(wrapper.emitted('close')).toHaveLength(1);
	});

	it('continues checkout when pre-checkout validation passes', async () => {
		await mountComponent();
		mockValidatePreCheckoutBasket.mockResolvedValue(true);
		mockExecuteOneTimeCheckout.mockResolvedValue({
			data: {
				checkoutStatus: {
					status: 'COMPLETED',
					receipt: { checkoutId: '456' },
				},
			},
		});

		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(mockExecuteOneTimeCheckout).toHaveBeenCalledWith({
			apollo,
			deactivateRedirect: true,
		});
		expect(mockTrackTransactionEvent).toHaveBeenCalledWith({
			apollo,
			transactionId: 456,
		});
		expect(mockCreateBasket).toHaveBeenCalledWith(apollo);
		expect(wrapper.emitted('checkout-complete')?.[0][0]).toMatchObject({
			transactionId: '456',
			amount: '0.00',
		});
	});

	// executeOneTimeCheckout runs trackSuccess internally (kv-shop), which fires Meta Purchase + GA +
	// Optimizely for this checkoutId. Tracking again here would double-count the Purchase.
	it('does not track the transaction itself — kv-shop already did', async () => {
		await mountComponent();
		mockValidatePreCheckoutBasket.mockResolvedValue(true);
		mockExecuteOneTimeCheckout.mockResolvedValue({
			data: {
				checkoutStatus: {
					status: 'COMPLETED',
					receipt: { checkoutId: '456' },
				},
			},
		});

		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(mockExecuteOneTimeCheckout).toHaveBeenCalled();
		expect(mockTrackFBTransaction).not.toHaveBeenCalled();
		expect(mockGetCheckoutTrackingData).not.toHaveBeenCalled();
	});

	describe('loading state', () => {
		it('openLoading shows the lightbox with the skeleton and no form, synchronously', async () => {
			mountClosed();

			wrapper.vm.openLoading();
			await wrapper.vm.$nextTick();

			expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(true);
			expect(wrapper.find('[data-testid="express-checkout-loading"]').exists()).toBe(true);
			expect(wrapper.find('form').exists()).toBe(false);
			// No network calls were needed to show the skeleton
			expect(apollo.query).not.toHaveBeenCalled();
			expect(mockGetClientToken).not.toHaveBeenCalled();
		});

		it('loadPaymentDetails swaps the skeleton for the form and returns true', async () => {
			mountClosed();
			wrapper.vm.openLoading();

			const result = await wrapper.vm.loadPaymentDetails();
			await flushPromises();

			expect(result).toBe(true);
			expect(wrapper.find('form').exists()).toBe(true);
			expect(wrapper.find('[data-testid="express-checkout-loading"]').exists()).toBe(false);
		});

		it('prevents dismissing the skeleton while loading', async () => {
			mountClosed();
			wrapper.vm.openLoading();
			await wrapper.vm.$nextTick();

			expect(wrapper.find('[data-testid="lightbox"]').attributes('data-prevent-close')).toBe('true');
		});

		it('allows dismissing once the form is loaded', async () => {
			mountClosed();
			wrapper.vm.openLoading();
			await wrapper.vm.loadPaymentDetails();
			await flushPromises();

			expect(wrapper.find('[data-testid="lightbox"]').attributes('data-prevent-close')).toBe('false');
		});

		it('loadPaymentDetails shows a toast and returns false when the token fetch fails', async () => {
			mountClosed();
			wrapper.vm.openLoading();
			mockGetClientToken.mockRejectedValueOnce(new Error('token boom'));

			const result = await wrapper.vm.loadPaymentDetails();
			await flushPromises();

			expect(result).toBe(false);
			expect(mockShowTipMsg).toHaveBeenCalledWith('token boom', 'error');
			expect(wrapper.find('form').exists()).toBe(false);
		});

		it('does not reveal the form when the lightbox was closed while loading (reveal guard)', async () => {
			mountClosed();
			wrapper.vm.openLoading();

			// Hold the token fetch open so we can close mid-load
			let resolveToken;
			mockGetClientToken.mockImplementationOnce(
				() => new Promise(resolve => { resolveToken = resolve; }),
			);

			const loadPromise = wrapper.vm.loadPaymentDetails();
			await flushPromises();

			// User dismisses the skeleton while the token is in flight
			wrapper.vm.closeLightbox();
			resolveToken('client-token');

			const result = await loadPromise;
			await flushPromises();

			expect(result).toBe(false);
			expect(wrapper.find('form').exists()).toBe(false);
			expect(mockWatchBasketTotals).not.toHaveBeenCalled();
		});

		it('abortLightbox closes without emitting close; closeLightbox emits close', async () => {
			mountClosed();
			wrapper.vm.openLoading();
			await wrapper.vm.$nextTick();
			// isOpen lets the composable skip checkout work when the skeleton is gone
			expect(wrapper.vm.isOpen()).toBe(true);

			wrapper.vm.abortLightbox();
			await wrapper.vm.$nextTick();
			expect(wrapper.find('[data-testid="lightbox"]').exists()).toBe(false);
			expect(wrapper.vm.isOpen()).toBe(false);
			expect(wrapper.emitted('close')).toBeUndefined();

			wrapper.vm.openLoading();
			await wrapper.vm.$nextTick();
			wrapper.vm.closeLightbox();
			await wrapper.vm.$nextTick();
			expect(wrapper.emitted('close')).toHaveLength(1);
		});

		it('reopening after close starts back in the skeleton state', async () => {
			await mountComponent();
			expect(wrapper.find('form').exists()).toBe(true);

			wrapper.vm.closeLightbox();
			await wrapper.vm.$nextTick();

			wrapper.vm.openLoading();
			await wrapper.vm.$nextTick();

			expect(wrapper.find('[data-testid="express-checkout-loading"]').exists()).toBe(true);
			expect(wrapper.find('form').exists()).toBe(false);
		});
	});
});
