import { render, fireEvent, waitFor } from '@testing-library/vue';
import DepositDropInPaymentWrapper from '#src/components/Deposit/DepositDropInPaymentWrapper';

vi.mock('@sentry/vue', () => ({ captureException: vi.fn(), withScope: vi.fn() }));

// Stubs the Braintree Drop-in: emits transactions-enabled on mount and exposes the
// btDropinInstance the wrapper calls.
const dropInStub = requestPaymentMethod => ({
	name: 'BraintreeDropInInterface',
	emits: ['transactions-enabled'],
	data() {
		return {
			btDropinInstance: {
				requestPaymentMethod,
				clearSelectedPaymentMethod: vi.fn(),
			},
		};
	},
	mounted() {
		this.$emit('transactions-enabled', true);
	},
	template: '<div data-testid="braintree-dropin" />',
});

const renderWrapper = ({
	amount = 50,
	disabled = false,
	mutateResult = { data: { my: { depositWithBraintreeNonce: 123 } } },
	requestPaymentMethod = vi.fn().mockResolvedValue({ nonce: 'fake-nonce', deviceData: 'dd', type: 'PayPalAccount' }),
} = {}) => {
	const mutate = vi.fn().mockResolvedValue(mutateResult);
	const kvTrackEvent = vi.fn();
	const showTipMsg = vi.fn();

	return {
		mutate,
		kvTrackEvent,
		showTipMsg,
		requestPaymentMethod,
		...render(DepositDropInPaymentWrapper, {
			props: { amount, disabled },
			global: {
				provide: { apollo: { mutate } },
				mocks: { $kvTrackEvent: kvTrackEvent, $showTipMsg: showTipMsg },
				directives: { 'kv-track-event': {} },
				stubs: {
					BraintreeDropInInterface: dropInStub(requestPaymentMethod),
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
	it('charges, emits complete-transaction, and fires legacy + braintree analytics on success', async () => {
		const {
			getByTestId, emitted, mutate, kvTrackEvent,
		} = renderWrapper({ amount: 50 });

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
		// Legacy parity event: category/action/label + value in cents (50 * 100).
		expect(kvTrackEvent).toHaveBeenCalledWith('Lending', 'Add Credit', 'Add Credit Page', null, 5000);
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

		expect(getByTestId('deposit-submit').disabled).toBe(true);
		await fireEvent.click(getByTestId('deposit-submit'));

		expect(requestPaymentMethod).not.toHaveBeenCalled();
		expect(mutate).not.toHaveBeenCalled();
	});
});
