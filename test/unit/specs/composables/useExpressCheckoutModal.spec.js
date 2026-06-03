import { createApp, ref } from 'vue';
import useExpressCheckoutModal from '#src/composables/useExpressCheckoutModal';

const { mockPush } = vi.hoisted(() => ({
	mockPush: vi.fn(),
}));

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: mockPush }),
}));

describe('useExpressCheckoutModal', () => {
	let mockApollo;
	let mockCookieStore;
	let mockAddToBasket;
	let mockLoadInitialBasketItems;
	let mockOnResetAdding;
	let basketItems;
	let composable;
	let app;

	const donationItem = (overrides = {}) => ({
		id: 'd-1',
		__typename: 'Donation',
		isTip: true,
		...overrides,
	});

	const loanItem = (overrides = {}) => ({
		id: 'l-1',
		__typename: 'LoanReservation',
		...overrides,
	});

	const mountComposable = (overrides = {}) => {
		mockApollo = { mutate: vi.fn().mockResolvedValue({ data: {} }) };
		mockCookieStore = { get: vi.fn(() => 'basket-123') };
		mockAddToBasket = vi.fn();
		mockLoadInitialBasketItems = vi.fn(() => Promise.resolve());
		mockOnResetAdding = vi.fn();
		basketItems = ref([]);

		const TestComponent = {
			setup() {
				composable = useExpressCheckoutModal({
					addToBasket: mockAddToBasket,
					loadInitialBasketItems: mockLoadInitialBasketItems,
					basketItems,
					onResetAdding: mockOnResetAdding,
					...overrides,
				});
				return {};
			},
			template: '<div />',
		};

		app = createApp(TestComponent);
		app.provide('apollo', mockApollo);
		app.provide('cookieStore', mockCookieStore);
		app.mount(document.createElement('div'));
	};

	beforeEach(() => {
		mockPush.mockClear();
		mountComposable();
	});

	afterEach(() => {
		app?.unmount();
	});

	describe('initial state', () => {
		it('exposes empty refs', () => {
			expect(composable.expressCheckoutModalRef.value).toBeNull();
			expect(composable.expressCheckoutLoan.value).toBeNull();
			expect(composable.isRedirecting.value).toBe(false);
		});

		it('exposes the three handlers', () => {
			expect(typeof composable.handleAddRecommendedLoanToBasket).toBe('function');
			expect(typeof composable.handleExpressCheckoutComplete).toBe('function');
			expect(typeof composable.handleExpressCheckoutClose).toBe('function');
		});
	});

	describe('handleAddRecommendedLoanToBasket', () => {
		it('refreshes basket items at the start', async () => {
			await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
			expect(mockLoadInitialBasketItems).toHaveBeenCalled();
		});

		describe('empty basket → open modal', () => {
			it('calls addToBasket and opens the modal on success', async () => {
				basketItems.value = [];
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());
				const loan = { id: 999, name: 'Jacqueline' };

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
					loan,
				});

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
				expect(composable.expressCheckoutLoan.value).toEqual(loan);
				expect(modalMock.openLightbox).toHaveBeenCalledTimes(1);
				expect(mockPush).not.toHaveBeenCalled();
			});

			it('does not flip isRedirecting in the empty path', async () => {
				basketItems.value = [];
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(composable.isRedirecting.value).toBe(false);
			});

			it('sets expressCheckoutLoan to null when payload has no loan', async () => {
				basketItems.value = [];
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(composable.expressCheckoutLoan.value).toBeNull();
				expect(modalMock.openLightbox).toHaveBeenCalledTimes(1);
			});
		});

		describe('basket with other items → redirect', () => {
			it('sets isRedirecting=true before addToBasket runs', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				let observedIsRedirecting = null;
				mockAddToBasket.mockImplementation(() => {
					observedIsRedirecting = composable.isRedirecting.value;
				});

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
				});

				expect(observedIsRedirecting).toBe(true);
			});

			it('redirects to /basket on addToBasket success', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
				});

				expect(mockPush).toHaveBeenCalledWith('/basket');
				expect(modalMock.openLightbox).not.toHaveBeenCalled();
			});
		});

		describe('only-donation basket → clear donation then continue', () => {
			beforeEach(() => {
				mockLoadInitialBasketItems
					.mockImplementationOnce(async () => { basketItems.value = [donationItem()]; })
					.mockImplementationOnce(async () => { basketItems.value = []; });
			});

			it('calls clearBasketDonation with price 0 and the donation isTip flag', async () => {
				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(mockApollo.mutate).toHaveBeenCalled();
				const mutateArgs = mockApollo.mutate.mock.calls[0][0];
				expect(mutateArgs.variables).toMatchObject({
					price: '0.00',
					isTip: true,
					basketId: 'basket-123',
				});
			});

			it('refreshes basket items a second time after the donation is cleared', async () => {
				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
				expect(mockLoadInitialBasketItems).toHaveBeenCalledTimes(2);
			});

			it('proceeds to addToBasket once the basket is empty', async () => {
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
			});

			it('uses the non-tip flag when the donation is not a tip', async () => {
				mockLoadInitialBasketItems
					.mockReset()
					.mockImplementationOnce(async () => {
						basketItems.value = [donationItem({ isTip: false })];
					})
					.mockImplementationOnce(async () => { basketItems.value = []; });

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(mockApollo.mutate.mock.calls[0][0].variables.isTip).toBe(false);
			});
		});

		describe('only-donation basket → clear donation fails', () => {
			beforeEach(() => {
				mockLoadInitialBasketItems.mockImplementationOnce(async () => {
					basketItems.value = [donationItem()];
				});
				// First mutate (clearBasketDonation) returns GraphQL errors; later
				// mutate calls ($showTipMsg) keep the default success resolution.
				mockApollo.mutate.mockResolvedValueOnce({
					errors: [{ message: 'cannot clear' }],
				});
			});

			it('aborts the flow: addToBasket is not called', async () => {
				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
				expect(mockAddToBasket).not.toHaveBeenCalled();
			});

			it('aborts the flow: the modal is not opened', async () => {
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(modalMock.openLightbox).not.toHaveBeenCalled();
			});

			it('does not refresh basket items a second time after the failed clear', async () => {
				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
				expect(mockLoadInitialBasketItems).toHaveBeenCalledTimes(1);
			});
		});

		describe('re-entry via Checkout now', () => {
			it('reopens the modal without calling addToBasket when only the recommended loan remains', async () => {
				basketItems.value = [loanItem({ id: 'recommended' })];
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;
				const loan = { id: 'recommended', name: 'Jacqueline' };

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 'recommended',
					lendAmount: '25',
					loan,
					recommendLoanIsInBasket: true,
				});

				expect(modalMock.openLightbox).toHaveBeenCalledTimes(1);
				expect(composable.expressCheckoutLoan.value).toEqual(loan);
				expect(mockAddToBasket).not.toHaveBeenCalled();
			});

			it('redirects to /basket when basket has other items besides the recommended loan', async () => {
				basketItems.value = [
					loanItem({ id: 'recommended' }),
					loanItem({ id: 'other' }),
				];
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 'recommended',
					lendAmount: '25',
					recommendLoanIsInBasket: true,
				});

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
				expect(mockPush).toHaveBeenCalledWith('/basket');
			});

			it('ignores recommendLoanIsInBasket when the basket is empty (falls back to add-and-open)', async () => {
				basketItems.value = [];
				const modalMock = { openLightbox: vi.fn() };
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 'recommended',
					lendAmount: '25',
					recommendLoanIsInBasket: true,
				});

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
				expect(modalMock.openLightbox).toHaveBeenCalledTimes(1);
			});
		});

		describe('onError chaining', () => {
			it('resets isRedirecting and calls the previous onError', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				const previousOnError = vi.fn();
				mockAddToBasket.mockImplementation(({ onError }) => onError?.());

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
					onError: previousOnError,
				});

				expect(composable.isRedirecting.value).toBe(false);
				expect(previousOnError).toHaveBeenCalledTimes(1);
			});

			it('handles a missing previous onError without throwing', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				mockAddToBasket.mockImplementation(({ onError }) => onError?.());

				await expect(
					composable.handleAddRecommendedLoanToBasket({ loanId: 999, lendAmount: '25' }),
				).resolves.not.toThrow();
				expect(composable.isRedirecting.value).toBe(false);
			});
		});
	});

	describe('handleExpressCheckoutComplete', () => {
		it('redirects to /thanks with the transaction id', () => {
			composable.handleExpressCheckoutComplete({ transactionId: 'tx-789' });
			expect(mockPush).toHaveBeenCalledWith('/thanks?kiva_transaction_id=tx-789');
		});

		it('is a no-op when transactionId is missing', () => {
			composable.handleExpressCheckoutComplete({});
			expect(mockPush).not.toHaveBeenCalled();
		});

		it('is a no-op when transactionId is falsy', () => {
			composable.handleExpressCheckoutComplete({ transactionId: 0 });
			expect(mockPush).not.toHaveBeenCalled();
		});
	});

	describe('handleExpressCheckoutClose', () => {
		it('calls onResetAdding when provided', () => {
			composable.handleExpressCheckoutClose();
			expect(mockOnResetAdding).toHaveBeenCalledTimes(1);
		});

		it('does not throw when onResetAdding is not provided', () => {
			app?.unmount();
			mountComposable({ onResetAdding: undefined });

			expect(() => composable.handleExpressCheckoutClose()).not.toThrow();
		});
	});
});
