import { render, fireEvent, waitFor } from '@testing-library/vue';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), withScope: vi.fn() }));

// Shared handles the KvPaymentSelect stub delegates to, so each test can control
// the client-token fetch, the drop-in readiness, and the payment-method request.
const shopMocks = vi.hoisted(() => ({
	getClientToken: vi.fn(),
	requestPaymentMethod: vi.fn(),
	transactionsEnabled: true,
}));

// Mock @kiva/kv-shop so we neither hit the real getClientToken query nor pull in
// the heavy KvPaymentSelect dependency graph. The stub mirrors the real component's
// contract: it emits transactions-enabled on mount and exposes requestPaymentMethod.
vi.mock('@kiva/kv-shop', () => ({
	getClientToken: shopMocks.getClientToken,
	KvPaymentSelect: {
		name: 'KvPaymentSelect',
		props: ['amount', 'authToken', 'dropInName', 'flow', 'paymentTypes'],
		emits: ['transactions-enabled', 'error'],
		methods: {
			requestPaymentMethod() {
				return shopMocks.requestPaymentMethod();
			},
		},
		mounted() {
			this.$emit('transactions-enabled', shopMocks.transactionsEnabled);
		},
		template: '<div data-testid="kv-payment-select" />',
	},
}));

// eslint-disable-next-line import/first
import DepositDropInPaymentWrapper from '#src/components/Deposit/DepositDropInPaymentWrapper';

const renderWrapper = ({
	amount = 50,
	disabled = false,
	mutateResult = { data: { my: { depositWithBraintreeNonce: 123 } } },
	mutate = null,
	paymentMethod = { nonce: 'fake-nonce', deviceData: 'dd', type: 'PayPalAccount' },
	clientToken = 'fake-token',
} = {}) => {
	shopMocks.getClientToken.mockResolvedValue(clientToken);
	shopMocks.requestPaymentMethod.mockResolvedValue(paymentMethod);

	const mutateFn = mutate ?? vi.fn().mockResolvedValue(mutateResult);
	const kvTrackEvent = vi.fn();
	const showTipMsg = vi.fn();

	return {
		mutate: mutateFn,
		kvTrackEvent,
		showTipMsg,
		requestPaymentMethod: shopMocks.requestPaymentMethod,
		...render(DepositDropInPaymentWrapper, {
			props: { amount, disabled },
			global: {
				provide: { apollo: { mutate: mutateFn } },
				mocks: { $kvTrackEvent: kvTrackEvent, $showTipMsg: showTipMsg },
				directives: { 'kv-track-event': {} },
				stubs: {
					KvButton: {
						props: ['state'],
						template: '<button :disabled="state === \'disabled\' || state === \'loading\'"'
							+ ' @click="$emit(\'click\')"><slot /></button>',
					},
					KvMaterialIcon: { props: ['icon'], template: '<i />' },
				},
			},
		}),
	};
};

describe('DepositDropInPaymentWrapper', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		shopMocks.transactionsEnabled = true;
	});

	it('charges, emits complete-transaction, and fires legacy + braintree analytics on success', async () => {
		const {
			getByTestId, emitted, mutate, kvTrackEvent,
		} = renderWrapper({ amount: 50 });

		// The submit button only appears once the client token resolves and the
		// drop-in reports it is ready.
		await waitFor(() => expect(getByTestId('deposit-submit').disabled).toBe(false));
		await fireEvent.click(getByTestId('deposit-submit'));

		await waitFor(() => {
			expect(emitted()['complete-transaction']).toBeTruthy();
		});
		// The confirmation carries the amount that was charged (snapshotted at submit).
		expect(emitted()['complete-transaction'][0][0]).toEqual(
			expect.objectContaining({ transactionId: 123, amount: 50 }),
		);
		// It signals processing on (submit) then off (settled) so the parent can lock the input.
		expect(emitted().processing).toEqual([[true], [false]]);
		expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
			variables: expect.objectContaining({ amount: '50.00', nonce: 'fake-nonce', deviceData: 'dd' }),
		}));
		// Add Credit event: category/action/label + deposit amount.
		expect(kvTrackEvent).toHaveBeenCalledWith('Lending', 'Add Credit', 'Add Credit Page', null, 50);
		// Braintree drop-in success event.
		expect(kvTrackEvent).toHaveBeenCalledWith(
			'portfolio',
			'PayPalAccount Braintree DropIn Deposit',
			'Success',
			123,
			123,
		);
	});

	it('surfaces the payment error and does not complete when the mutation fails', async () => {
		const {
			getByTestId, emitted, showTipMsg, kvTrackEvent,
		} = renderWrapper({
			mutateResult: { errors: [{ message: 'Card declined.' }] },
		});

		await waitFor(() => expect(getByTestId('deposit-submit').disabled).toBe(false));
		await fireEvent.click(getByTestId('deposit-submit'));

		await waitFor(() => {
			expect(showTipMsg).toHaveBeenCalled();
		});
		expect(kvTrackEvent).toHaveBeenCalledWith(
			'Deposit',
			'DropIn Payment Error',
			expect.stringContaining('Card declined.'),
		);
		expect(emitted()['complete-transaction']).toBeFalsy();
	});

	it('does not submit when disabled', async () => {
		const { getByTestId, mutate, requestPaymentMethod } = renderWrapper({ disabled: true });

		// Wait for the drop-in to render, then confirm the button stays disabled.
		await waitFor(() => expect(getByTestId('deposit-submit')).toBeTruthy());
		expect(getByTestId('deposit-submit').disabled).toBe(true);
		await fireEvent.click(getByTestId('deposit-submit'));

		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
	});

	it('locks the payment selection while a charge is in flight', async () => {
		// Keep the mutation pending so we can observe the in-flight (submitting) state.
		let resolveMutate;
		const mutate = vi.fn(() => new Promise(resolve => { resolveMutate = resolve; }));
		const { getByTestId } = renderWrapper({ mutate });

		await waitFor(() => expect(getByTestId('deposit-submit').disabled).toBe(false));
		await fireEvent.click(getByTestId('deposit-submit'));

		// While the charge is pending the payment selection is inert and dimmed.
		const wrap = getByTestId('deposit-payment-wrap');
		await waitFor(() => expect(wrap.hasAttribute('inert')).toBe(true));
		expect(wrap.classList.contains('tw-pointer-events-none')).toBe(true);
		// tw-opacity-low is the kv-tokens opacity utility (0.3); tw-opacity-50 is not generated.
		expect(wrap.classList.contains('tw-opacity-low')).toBe(true);

		// Once it settles the selection is interactive again.
		resolveMutate({ data: { my: { depositWithBraintreeNonce: 123 } } });
		await waitFor(() => expect(wrap.hasAttribute('inert')).toBe(false));
		expect(wrap.classList.contains('tw-pointer-events-none')).toBe(false);
		expect(wrap.classList.contains('tw-opacity-low')).toBe(false);
	});

	it('shows a retry state when the client token cannot be fetched', async () => {
		const { getByTestId, queryByTestId } = renderWrapper({ clientToken: '' });

		await waitFor(() => expect(getByTestId('deposit-payment-error')).toBeTruthy());
		expect(queryByTestId('deposit-submit')).toBeNull();
	});
});
