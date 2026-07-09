import { render, fireEvent, waitFor } from '@testing-library/vue';
import WithdrawPage from '#src/pages/Withdraw/WithdrawPage';

const readModelResponse = ({
	canWithdraw = true,
	emailAllowed = true,
	withdrawableBalance = 100,
	pendingRequests = [],
	email = 'user@example.org',
} = {}) => ({
	my: {
		id: 'my-id',
		lender: { id: 1, name: 'Test Lender', image: { id: 2, url: 'photo.jpg' } },
		userAccount: {
			id: 3,
			email,
			balance: 150,
			withdrawal: {
				withdrawableBalance,
				maxWithdrawalAmount: 10000,
				canWithdraw,
				emailAllowed,
				pendingRequests,
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

const renderPage = ({ response = readModelResponse(), rejects = false } = {}) => {
	const query = rejects
		? vi.fn().mockRejectedValue(new Error('boom'))
		: vi.fn().mockResolvedValue({ data: response });
	const push = vi.fn();

	return {
		query,
		push,
		...render(WithdrawPage, {
			global: {
				provide: { apollo: { query }, cookieStore: {} },
				mocks: { $router: { push }, $kvTrackEvent: vi.fn() },
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: {
						props: ['to', 'state'],
						template: '<button :disabled="state === \'disabled\' || state === \'loading\'">'
							+ '<slot /></button>',
					},
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvTextInput: stubInput,
					KvCurrencyInput: stubInput,
				},
			},
		}),
	};
};

describe('WithdrawPage', () => {
	it('renders the available credit and form for an eligible account', async () => {
		const { getByTestId } = renderPage();
		await waitFor(() => {
			expect(getByTestId('withdraw-available-credit').textContent).toContain('$100.00');
		});
		expect(getByTestId('withdraw-continue')).toBeTruthy();
	});

	it('shows the non-withdrawable state when canWithdraw is false', async () => {
		const { getByTestId, queryByTestId } = renderPage({
			response: readModelResponse({ canWithdraw: false }),
		});
		await waitFor(() => {
			expect(getByTestId('withdraw-forbidden')).toBeTruthy();
		});
		expect(queryByTestId('withdraw-continue')).toBeNull();
	});

	it('shows the not-verified state when emailAllowed is false', async () => {
		const { getByTestId, queryByTestId } = renderPage({
			response: readModelResponse({ emailAllowed: false }),
		});
		await waitFor(() => {
			expect(getByTestId('withdraw-not-verified')).toBeTruthy();
		});
		expect(queryByTestId('withdraw-continue')).toBeNull();
	});

	it('prioritizes not-verified over forbidden when both flags fail (legacy precedence)', async () => {
		const { getByTestId, queryByTestId } = renderPage({
			response: readModelResponse({ emailAllowed: false, canWithdraw: false }),
		});
		await waitFor(() => {
			expect(getByTestId('withdraw-not-verified')).toBeTruthy();
		});
		expect(queryByTestId('withdraw-forbidden')).toBeNull();
	});

	it('lists withdrawals in review', async () => {
		const { getByTestId } = renderPage({
			response: readModelResponse({
				pendingRequests: [{
					id: 9, price: 25, requestedAt: '2026-01-03T16:05:00Z', status: 'requested'
				}],
			}),
		});
		await waitFor(() => {
			expect(getByTestId('withdraw-in-review').textContent).toContain('$25.00');
		});
	});

	it('shows an error state when the read model fails to load', async () => {
		const { getByTestId } = renderPage({ rejects: true });
		await waitFor(() => {
			expect(getByTestId('withdraw-load-error')).toBeTruthy();
		});
	});

	it('disables Continue until the form validates', async () => {
		const { getByLabelText, getByTestId } = renderPage();
		await waitFor(() => getByTestId('withdraw-continue'));

		// Disabled on first load, before the user has entered anything.
		expect(getByTestId('withdraw-continue').disabled).toBe(true);

		await fireEvent.update(getByLabelText('Amount to withdraw'), '50');
		await fireEvent.update(getByLabelText('Your PayPal account email'), 'a@example.org');
		await fireEvent.update(getByLabelText('Confirm PayPal account email'), 'a@example.org');

		await waitFor(() => {
			expect(getByTestId('withdraw-continue').disabled).toBe(false);
		});
	});

	it('does not advance when the confirm email does not match', async () => {
		const { getByLabelText, getByTestId, push } = renderPage();
		await waitFor(() => getByTestId('withdraw-continue'));

		await fireEvent.update(getByLabelText('Amount to withdraw'), '50');
		await fireEvent.update(getByLabelText('Your PayPal account email'), 'a@example.org');
		await fireEvent.update(getByLabelText('Confirm PayPal account email'), 'b@example.org');
		await fireEvent.click(getByTestId('withdraw-continue'));

		expect(push).not.toHaveBeenCalled();
	});

	it('advances to the confirm step with valid input', async () => {
		const { getByLabelText, getByTestId, push } = renderPage();
		await waitFor(() => getByTestId('withdraw-continue'));

		await fireEvent.update(getByLabelText('Amount to withdraw'), '50');
		await fireEvent.update(getByLabelText('Your PayPal account email'), 'a@example.org');
		await fireEvent.update(getByLabelText('Confirm PayPal account email'), 'a@example.org');
		await fireEvent.click(getByTestId('withdraw-continue'));

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith({
				path: '/withdraw-beta/confirm',
				state: { withdrawAmount: '50', withdrawPaypalEmail: 'a@example.org' },
			});
		});
	});
});
