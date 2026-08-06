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
	let mockKvTrackEvent;
	let mockLocationAssign;
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

	const makeModalMock = (overrides = {}) => ({
		openLoading: vi.fn(),
		loadPaymentDetails: vi.fn().mockResolvedValue(true),
		abortLightbox: vi.fn(),
		isOpen: vi.fn(() => true),
		...overrides,
	});

	const mountComposable = (overrides = {}) => {
		mockApollo = {
			mutate: vi.fn().mockResolvedValue({ data: {} }),
			query: vi.fn().mockResolvedValue({ data: {} }),
		};
		mockCookieStore = { get: vi.fn(() => 'basket-123') };
		mockAddToBasket = vi.fn();
		mockLoadInitialBasketItems = vi.fn(() => Promise.resolve());
		mockOnResetAdding = vi.fn();
		mockKvTrackEvent = vi.fn();
		basketItems = ref([]);

		const TestComponent = {
			setup() {
				composable = useExpressCheckoutModal({
					addToBasket: mockAddToBasket,
					loadInitialBasketItems: mockLoadInitialBasketItems,
					basketItems,
					onResetAdding: mockOnResetAdding,
					isExpressCheckoutEnabled: ref(true),
					kvTrackEvent: mockKvTrackEvent,
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
		mockLocationAssign = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
		mountComposable();
	});

	afterEach(() => {
		mockLocationAssign?.mockRestore();
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
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());
				const loan = { id: 999, name: 'Jacqueline' };

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
					loan,
				});

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
				await vi.waitFor(() => {
					expect(composable.expressCheckoutLoan.value).toEqual(loan);
					expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
				});
				expect(mockPush).not.toHaveBeenCalled();
			});

			it('initializes checkout before opening the modal', async () => {
				basketItems.value = [];
				const order = [];
				const modalMock = makeModalMock({
					loadPaymentDetails: vi.fn(async () => {
						order.push('open');
						return true;
					}),
				});
				composable.expressCheckoutModalRef.value = modalMock;
				mockApollo.query.mockImplementationOnce(async () => {
					order.push('initialize');
					return { data: {} };
				});
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				await vi.waitFor(() => {
					expect(order).toEqual(['initialize', 'open']);
				});
				expect(mockApollo.query).toHaveBeenCalledWith(expect.objectContaining({
					variables: { basketId: 'basket-123' },
					fetchPolicy: 'network-only',
				}));
			});

			it('resolves the addToBasket onSuccess callback once payment details load', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				let addToBasketOnSuccess;
				mockAddToBasket.mockImplementation(({ onSuccess }) => {
					addToBasketOnSuccess = onSuccess;
				});

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
					loan: { id: 999 },
				});

				await expect(addToBasketOnSuccess()).resolves.toBe(true);
				expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
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
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				await vi.waitFor(() => {
					expect(composable.expressCheckoutLoan.value).toBeNull();
					expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
				});
			});

			it('does not open the modal when checkout initialization fails', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockApollo.query.mockRejectedValueOnce(new Error('initialize failed'));
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				await new Promise(resolve => { setTimeout(resolve, 0); });
				expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
				expect(modalMock.abortLightbox).toHaveBeenCalled();
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
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

			it('redirects to /basket on addToBasket success and keeps the modal open', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 999,
					lendAmount: '25',
				});

				expect(mockPush).toHaveBeenCalledWith('/basket');
				expect(modalMock.abortLightbox).not.toHaveBeenCalled();
				expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
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
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
			});

			it('does not refresh basket items a second time after the failed clear', async () => {
				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
				expect(mockLoadInitialBasketItems).toHaveBeenCalledTimes(1);
			});
		});

		describe('re-entry via Checkout now', () => {
			it('reopens the modal without calling addToBasket when only the recommended loan remains', async () => {
				basketItems.value = [loanItem({ id: 'recommended' })];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				const loan = { id: 'recommended', name: 'Jacqueline' };

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 'recommended',
					lendAmount: '25',
					loan,
					recommendLoanIsInBasket: true,
				});

				await vi.waitFor(() => {
					expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
					expect(composable.expressCheckoutLoan.value).toEqual(loan);
				});
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
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 'recommended',
					lendAmount: '25',
					recommendLoanIsInBasket: true,
				});

				expect(mockAddToBasket).toHaveBeenCalledTimes(1);
				await vi.waitFor(() => {
					expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
				});
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

		describe('instant loading modal', () => {
			it('opens the loading modal synchronously before any basket work', async () => {
				basketItems.value = [];
				const order = [];
				const modalMock = makeModalMock({
					openLoading: vi.fn(() => order.push('openLoading')),
				});
				composable.expressCheckoutModalRef.value = modalMock;
				mockLoadInitialBasketItems.mockImplementation(async () => {
					order.push('loadBasket');
				});
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(order[0]).toBe('openLoading');
				expect(order).toContain('loadBasket');
			});

			it('does not open the loading modal when the payload is missing loanId', async () => {
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({ lendAmount: '25' });

				expect(modalMock.openLoading).not.toHaveBeenCalled();
				expect(mockLoadInitialBasketItems).not.toHaveBeenCalled();
				expect(mockAddToBasket).not.toHaveBeenCalled();
			});

			it('does not open the loading modal when the payload is missing lendAmount', async () => {
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1 });

				expect(modalMock.openLoading).not.toHaveBeenCalled();
				expect(mockAddToBasket).not.toHaveBeenCalled();
			});

			it('does not open the loading modal when the feature flag is off', async () => {
				app?.unmount();
				mountComposable({ isExpressCheckoutEnabled: ref(false) });
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(modalMock.openLoading).not.toHaveBeenCalled();
			});

			it('closes the loading modal when clearing the donation fails', async () => {
				mockLoadInitialBasketItems.mockImplementationOnce(async () => {
					basketItems.value = [donationItem()];
				});
				mockApollo.mutate.mockResolvedValueOnce({
					errors: [{ message: 'cannot clear' }],
				});
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(modalMock.openLoading).toHaveBeenCalledTimes(1);
				expect(modalMock.abortLightbox).toHaveBeenCalledTimes(1);
				expect(mockAddToBasket).not.toHaveBeenCalled();
			});

			it('closes the loading modal when addToBasket fails', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onError }) => onError?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				expect(modalMock.abortLightbox).toHaveBeenCalled();
				expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
			});

			it('closes the loading modal when payment details fail to load', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock({
					loadPaymentDetails: vi.fn().mockResolvedValue(false),
				});
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });

				await vi.waitFor(() => {
					expect(modalMock.abortLightbox).toHaveBeenCalled();
				});
			});

			// The user can dismiss the skeleton while the basket chain is still in flight.
			// addToBasket's onSuccess still fires — it must not initialize checkout, log a
			// modal-open after the close event, or fetch payment details for a hidden modal.
			it('skips checkout initialization when the skeleton was dismissed mid-load', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock({ isOpen: vi.fn(() => false) });
				composable.expressCheckoutModalRef.value = modalMock;
				let addToBasketOnSuccess;
				mockAddToBasket.mockImplementation(({ onSuccess }) => {
					addToBasketOnSuccess = onSuccess;
				});

				await composable.handleAddRecommendedLoanToBasket({
					loanId: 1,
					lendAmount: '25',
					loan: { id: 1 },
				});

				mockApollo.query.mockClear();
				await expect(addToBasketOnSuccess()).resolves.toBe(false);

				expect(mockApollo.query).not.toHaveBeenCalled();
				expect(mockKvTrackEvent).not.toHaveBeenCalledWith(
					'post-checkout',
					'open',
					'open-express-checkout',
				);
				expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
			});

			it('closes the loading modal and shows a tip when addToBasket throws synchronously', async () => {
				basketItems.value = [];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(() => {
					throw new Error('addToBasket boom');
				});

				await expect(
					composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' }),
				).resolves.toBeUndefined();

				expect(modalMock.abortLightbox).toHaveBeenCalledTimes(1);
				expect(mockApollo.mutate).toHaveBeenCalledWith(expect.objectContaining({
					variables: expect.objectContaining({
						message: 'Something went wrong. Please, refresh the page and try again.',
						type: 'error',
					}),
				}));
			});

			it('keeps the loading modal open while redirecting when the basket has other items', async () => {
				basketItems.value = [loanItem({ id: 'other' })];
				const modalMock = makeModalMock();
				composable.expressCheckoutModalRef.value = modalMock;
				mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

				await composable.handleAddRecommendedLoanToBasket({ loanId: 999, lendAmount: '25' });

				expect(modalMock.abortLightbox).not.toHaveBeenCalled();
				expect(mockPush).toHaveBeenCalledWith('/basket');
			});
		});
	});

	describe('handleExpressCheckoutComplete', () => {
		it('hard-navigates to /checkout/thanks with the transaction id', () => {
			composable.handleExpressCheckoutComplete({ transactionId: 'tx-789' });
			expect(mockLocationAssign).toHaveBeenCalledWith('/checkout/thanks?kiva_transaction_id=tx-789');
			expect(mockPush).not.toHaveBeenCalled();
		});

		it('is a no-op when transactionId is missing', () => {
			composable.handleExpressCheckoutComplete({});
			expect(mockLocationAssign).not.toHaveBeenCalled();
		});

		it('is a no-op when transactionId is falsy', () => {
			composable.handleExpressCheckoutComplete({ transactionId: 0 });
			expect(mockLocationAssign).not.toHaveBeenCalled();
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

	describe('feature flag disabled (isExpressCheckoutEnabled = false)', () => {
		beforeEach(() => {
			app?.unmount();
			mountComposable({ isExpressCheckoutEnabled: ref(false) });
		});

		it('skips loadInitialBasketItems entirely', async () => {
			await composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' });
			expect(mockLoadInitialBasketItems).not.toHaveBeenCalled();
		});

		it('sets isRedirecting=true before addToBasket runs', async () => {
			let observedIsRedirecting = null;
			mockAddToBasket.mockImplementation(() => {
				observedIsRedirecting = composable.isRedirecting.value;
			});

			await composable.handleAddRecommendedLoanToBasket({ loanId: 999, lendAmount: '25' });

			expect(observedIsRedirecting).toBe(true);
		});

		it('redirects to /basket on addToBasket success without opening the modal', async () => {
			mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());
			const modalMock = makeModalMock();
			composable.expressCheckoutModalRef.value = modalMock;

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 999,
				lendAmount: '25',
				loan: { id: 999 },
			});

			expect(mockPush).toHaveBeenCalledWith('/basket');
			expect(modalMock.loadPaymentDetails).not.toHaveBeenCalled();
			expect(composable.expressCheckoutLoan.value).toBeNull();
		});

		it('ignores recommendLoanIsInBasket re-entry and still redirects', async () => {
			basketItems.value = [loanItem({ id: 'recommended' })];
			mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 'recommended',
				lendAmount: '25',
				loan: { id: 'recommended' },
				recommendLoanIsInBasket: true,
			});

			expect(mockAddToBasket).toHaveBeenCalledTimes(1);
			expect(mockPush).toHaveBeenCalledWith('/basket');
		});

		it('resets isRedirecting and calls previous onError on failure', async () => {
			const previousOnError = vi.fn();
			mockAddToBasket.mockImplementation(({ onError }) => onError?.());

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 1,
				lendAmount: '25',
				onError: previousOnError,
			});

			expect(composable.isRedirecting.value).toBe(false);
			expect(previousOnError).toHaveBeenCalledTimes(1);
		});
	});

	describe('tracking events', () => {
		it("fires 'post-checkout / open / open-express-checkout' when the modal opens on empty basket", async () => {
			basketItems.value = [];
			const modalMock = makeModalMock();
			composable.expressCheckoutModalRef.value = modalMock;
			mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 1,
				lendAmount: '25',
				loan: { id: 1 },
			});

			await vi.waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'open',
					'open-express-checkout',
				);
			});
		});

		it("fires 'post-checkout / open / open-express-checkout' on Checkout now re-entry", async () => {
			basketItems.value = [loanItem({ id: 'recommended' })];
			const modalMock = makeModalMock();
			composable.expressCheckoutModalRef.value = modalMock;

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 'recommended',
				lendAmount: '25',
				loan: { id: 'recommended' },
				recommendLoanIsInBasket: true,
			});

			await vi.waitFor(() => {
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'open',
					'open-express-checkout',
				);
			});
		});

		it("fires 'post-checkout / close / close-express-checkout' on handleExpressCheckoutClose", () => {
			composable.handleExpressCheckoutClose();
			expect(mockKvTrackEvent).toHaveBeenCalledWith(
				'post-checkout',
				'close',
				'close-express-checkout',
			);
		});

		it('does not fire any tracking event in the non-empty redirect path', async () => {
			basketItems.value = [loanItem({ id: 'other' })];
			mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

			await composable.handleAddRecommendedLoanToBasket({
				loanId: 999,
				lendAmount: '25',
			});

			expect(mockKvTrackEvent).not.toHaveBeenCalled();
		});

		it('does not throw when kvTrackEvent is not provided (silently skips)', async () => {
			app?.unmount();
			mountComposable({ kvTrackEvent: undefined });
			basketItems.value = [];
			const modalMock = makeModalMock();
			composable.expressCheckoutModalRef.value = modalMock;
			mockAddToBasket.mockImplementation(({ onSuccess }) => onSuccess?.());

			await expect(
				composable.handleAddRecommendedLoanToBasket({ loanId: 1, lendAmount: '25' }),
			).resolves.not.toThrow();
			await vi.waitFor(() => {
				expect(modalMock.loadPaymentDetails).toHaveBeenCalledTimes(1);
			});
		});
	});
});
