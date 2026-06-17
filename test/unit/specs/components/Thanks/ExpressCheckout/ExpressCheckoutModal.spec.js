/* eslint-disable import/no-extraneous-dependencies -- @vue/test-utils devDependency */
import { flushPromises, mount } from '@vue/test-utils';
import ExpressCheckoutModal from '#src/components/Thanks/ExpressCheckout/ExpressCheckoutModal';

const {
	mockCreateBasket,
	mockExecuteOneTimeCheckout,
	mockFormatPreCheckoutValidationErrors,
	mockGetClientToken,
	mockLogFormatter,
	mockPush,
	mockShowTipMsg,
	mockTrackTransactionEvent,
	mockValidatePreCheckoutBasket,
	mockWatchBasketTotals,
} = vi.hoisted(() => ({
	mockCreateBasket: vi.fn(),
	mockExecuteOneTimeCheckout: vi.fn(),
	mockFormatPreCheckoutValidationErrors: vi.fn(),
	mockGetClientToken: vi.fn(),
	mockLogFormatter: vi.fn(),
	mockPush: vi.fn(),
	mockShowTipMsg: vi.fn(),
	mockTrackTransactionEvent: vi.fn(),
	mockValidatePreCheckoutBasket: vi.fn(),
	mockWatchBasketTotals: vi.fn(),
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
		template: '<div v-if="visible" data-testid="lightbox"><slot /></div>',
	},
}));

vi.mock('@kiva/kv-shop', () => ({
	basketTotalsQuery: 'basketTotalsQuery',
	createBasket: mockCreateBasket,
	executeOneTimeCheckout: mockExecuteOneTimeCheckout,
	getBasketID: vi.fn(() => 'basket-123'),
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

	const mountComponent = async () => {
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
		await wrapper.vm.openLightbox();
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
});
