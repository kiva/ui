import { render, fireEvent, waitFor } from '@testing-library/vue';
import DepositPage from '#src/pages/Deposit/DepositPage';

const readModelResponse = ({
	canDeposit = true,
	maxDepositAmount = 10000,
	balance = 150,
} = {}) => ({
	my: {
		id: 'my-id',
		userAccount: {
			id: 3,
			balance,
			deposit: {
				canDeposit,
				maxDepositAmount,
			},
		},
	},
});

const stubInput = {
	props: ['modelValue'],
	emits: ['input', 'update:modelValue'],
	template: `<input
		:value="modelValue"
		@input="$emit('input', $event.target.value); $emit('update:modelValue', $event.target.value)"
	/>`,
};

// Stubs the drop-in wrapper: exposes the amount/disabled props and lets a test drive the
// complete-transaction event the page listens for.
const wrapperStub = {
	name: 'DepositDropInPaymentWrapper',
	props: ['amount', 'disabled'],
	emits: ['complete-transaction', 'processing'],
	template: `<div>
		<button
			data-testid="deposit-submit"
			:disabled="disabled"
			@click="$emit('complete-transaction', { transactionId: 123, paymentType: 'PayPalAccount', amount })"
		>Add credit</button>
		<button data-testid="stub-start-processing" @click="$emit('processing', true)">processing</button>
	</div>`,
};

const renderPage = ({ response = readModelResponse(), rejects = false } = {}) => {
	const query = rejects
		? vi.fn().mockRejectedValue(new Error('boom'))
		: vi.fn().mockResolvedValue({ data: response });
	const kvTrackEvent = vi.fn();

	return {
		query,
		kvTrackEvent,
		...render(DepositPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: { $router: { push: vi.fn() }, $kvTrackEvent: kvTrackEvent },
				directives: { 'kv-track-event': {} },
				stubs: {
					RouterLink: { props: ['to'], template: '<a><slot /></a>' },
					PortfolioShell: { template: '<div><slot /></div>' },
					DepositDropInPaymentWrapper: wrapperStub,
					KvButton: {
						props: ['to', 'state'],
						template: '<button :disabled="state === \'disabled\' || state === \'loading\'">'
							+ '<slot /></button>',
					},
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvCurrencyInput: stubInput,
				},
			},
		}),
	};
};

describe('DepositPage', () => {
	it('renders the current balance and form for an eligible lender', async () => {
		const { getByTestId } = renderPage();
		await waitFor(() => {
			expect(getByTestId('deposit-current-balance').textContent).toContain('$150.00');
		});
		expect(getByTestId('deposit-submit')).toBeTruthy();
	});

	it('shows the not-eligible state when canDeposit is false', async () => {
		const { getByTestId, queryByTestId } = renderPage({
			response: readModelResponse({ canDeposit: false }),
		});
		await waitFor(() => {
			expect(getByTestId('deposit-forbidden')).toBeTruthy();
		});
		expect(queryByTestId('deposit-submit')).toBeNull();
	});

	it('shows an error state when the read model fails to load', async () => {
		const { getByTestId } = renderPage({ rejects: true });
		await waitFor(() => {
			expect(getByTestId('deposit-load-error')).toBeTruthy();
		});
	});

	it('keeps the confirm button disabled until a valid amount is entered', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => getByTestId('deposit-submit'));

		// Disabled on first load (amount 0 fails the minimum).
		expect(getByTestId('deposit-submit').disabled).toBe(true);

		await fireEvent.update(getByLabelText('Amount to deposit'), '50');

		await waitFor(() => {
			expect(getByTestId('deposit-submit').disabled).toBe(false);
		});
	});

	it('keeps the confirm button disabled when the amount exceeds the max', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => getByTestId('deposit-submit'));

		await fireEvent.update(getByLabelText('Amount to deposit'), '20000');

		await waitFor(() => {
			expect(getByTestId('deposit-submit').disabled).toBe(true);
		});
	});

	it('shows the thanks state with the deposited amount on completion', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => getByTestId('deposit-submit'));

		await fireEvent.update(getByLabelText('Amount to deposit'), '50');
		await waitFor(() => expect(getByTestId('deposit-submit').disabled).toBe(false));
		await fireEvent.click(getByTestId('deposit-submit'));

		await waitFor(() => {
			expect(getByTestId('deposit-thanks')).toBeTruthy();
		});
		expect(getByTestId('deposit-amount-paid').textContent).toContain('$50.00');
	});

	it('tracks the amount field on each focus', async () => {
		const { getByLabelText, getByTestId, kvTrackEvent } = renderPage();
		await waitFor(() => getByTestId('deposit-submit'));

		const amountField = getByLabelText('Amount to deposit');
		await fireEvent.focusIn(amountField);
		await fireEvent.focusIn(amountField);

		const amountFieldCalls = kvTrackEvent.mock.calls.filter(
			(call) => call[0] === 'portfolio' && call[1] === 'click' && call[2] === 'Deposit amount field',
		);
		expect(amountFieldCalls).toHaveLength(2);
	});

	it('disables the amount input while a deposit is processing', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => getByTestId('deposit-submit'));

		expect(getByLabelText('Amount to deposit').disabled).toBe(false);

		await fireEvent.click(getByTestId('stub-start-processing'));

		await waitFor(() => {
			expect(getByLabelText('Amount to deposit').disabled).toBe(true);
		});
	});
});
