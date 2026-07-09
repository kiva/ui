import { render, fireEvent, waitFor } from '@testing-library/vue';
import WithdrawConfirmPage from '#src/pages/Withdraw/WithdrawConfirmPage';

const summaryResponse = (withdrawableBalance = 100) => ({
	my: {
		id: 'my-id',
		lender: { id: 1, name: 'Test Lender', image: { id: 2, url: 'photo.jpg' } },
		userAccount: {
			id: 3,
			email: 'user@example.org',
			balance: 150,
			withdrawal: {
				withdrawableBalance,
				maxWithdrawalAmount: 10000,
				canWithdraw: true,
				emailAllowed: true,
				pendingRequests: [],
			},
		},
	},
});

const stubInput = {
	props: ['modelValue'],
	emits: ['input'],
	template: '<input :value="modelValue" @input="$emit(\'input\', Number($event.target.value))" />',
};

const renderConfirm = ({
	state = { withdrawAmount: 50, withdrawPaypalEmail: 'a@example.org' },
	mutateResult = { status: 'SUCCESS', message: null },
} = {}) => {
	// The request is carried in history state (not the URL) — set it before mount.
	window.history.replaceState(state, '');
	const query = vi.fn().mockResolvedValue({ data: summaryResponse() });
	const mutate = vi.fn().mockResolvedValue({
		data: { my: { requestPayPalWithdrawal: mutateResult } },
	});
	const push = vi.fn();
	const replace = vi.fn();

	return {
		query,
		mutate,
		push,
		replace,
		...render(WithdrawConfirmPage, {
			global: {
				provide: { apollo: { query, mutate }, cookieStore: {} },
				mocks: { $router: { push, replace }, $kvTrackEvent: vi.fn() },
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: {
						props: ['to', 'state'],
						template: '<button :disabled="state === \'disabled\' || state === \'loading\'">'
							+ '<slot /></button>',
					},
					KvLoadingPlaceholder: { template: '<div data-testid="loading" />' },
					KvMaterialIcon: { template: '<i />' },
					KvUserAvatar: { template: '<div />' },
					PaypalIcon: { template: '<span />' },
					KvCurrencyInput: stubInput,
					KvCheckbox: {
						props: ['modelValue'],
						emits: ['update:modelValue'],
						template: '<input type="checkbox" :checked="modelValue"'
							+ ' @change="$emit(\'update:modelValue\', $event.target.checked)" />',
					},
				},
			},
		}),
	};
};

describe('WithdrawConfirmPage', () => {
	it('redirects back to the form when arrived without an amount', () => {
		const { replace } = renderConfirm({ state: {} });
		expect(replace).toHaveBeenCalledWith({ path: '/withdraw-beta' });
	});

	it('renders the request summary', async () => {
		const { getByTestId } = renderConfirm();
		await waitFor(() => {
			expect(getByTestId('withdraw-confirm-amount').textContent).toContain('$50.00');
			expect(getByTestId('withdraw-confirm-email').textContent).toContain('a@example.org');
		});
	});

	it('shows success after a SUCCESS submit', async () => {
		const { getByTestId } = renderConfirm();
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));
		await waitFor(() => {
			expect(getByTestId('withdraw-success').textContent).toContain('has been received');
		});
	});

	it('routes to check-inbox on AUTHORIZATION_REQUIRED', async () => {
		const { getByTestId, push } = renderConfirm({
			mutateResult: { status: 'AUTHORIZATION_REQUIRED', message: null },
		});
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));
		await waitFor(() => {
			expect(push).toHaveBeenCalledWith({
				path: '/withdraw-beta/check-inbox',
				state: { withdrawEmail: 'a@example.org' },
			});
		});
	});

	it('shows the blocked state on BLOCKED', async () => {
		const { getByTestId } = renderConfirm({
			mutateResult: {
				status: 'BLOCKED',
				message: 'This withdrawal request requires review before it can be processed.',
			},
		});
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));
		await waitFor(() => {
			expect(getByTestId('withdraw-blocked').textContent).toContain('requires review');
		});
	});

	it('shows the error message on ERROR', async () => {
		const { getByTestId } = renderConfirm({
			mutateResult: { status: 'ERROR', message: 'Denylisted accounts cannot withdraw funds.' },
		});
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));
		await waitFor(() => {
			expect(getByTestId('withdraw-error').textContent).toContain('Denylisted');
		});
	});

	it('renders links in the outcome error message as HTML', async () => {
		const { getByTestId } = renderConfirm({
			mutateResult: {
				status: 'ERROR',
				message: 'Your email could not be verified. '
					+ '<a href="https://www.paypal.com/verify">Verify your PayPal account</a> and try again.',
			},
		});
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));
		await waitFor(() => {
			const link = getByTestId('withdraw-error').querySelector('a');
			expect(link).toBeTruthy();
			expect(link.getAttribute('href')).toBe('https://www.paypal.com/verify');
			expect(link.textContent).toContain('Verify your PayPal account');
		});
	});

	it('does not show the donation error until the field is edited', async () => {
		const { getByTestId, findByLabelText, queryByText } = renderConfirm();
		await waitFor(() => getByTestId('withdraw-add-donation'));

		// Enabling the donation shows the field with a default of 0 — no premature error.
		await fireEvent.click(getByTestId('withdraw-add-donation'));
		await findByLabelText('Donation amount');
		expect(queryByText(/Please enter a valid donation amount/)).toBeNull();

		// Editing to an invalid value surfaces the error.
		await fireEvent.update(await findByLabelText('Donation amount'), '50');
		await waitFor(() => {
			expect(queryByText(/cannot be greater or equal/)).toBeTruthy();
		});
	});

	it('blocks submit when the donation is greater or equal to the amount', async () => {
		const { getByTestId, findByLabelText, mutate } = renderConfirm();
		await waitFor(() => getByTestId('withdraw-add-donation'));

		await fireEvent.click(getByTestId('withdraw-add-donation'));
		await fireEvent.update(await findByLabelText('Donation amount'), '50');
		await fireEvent.click(getByTestId('withdraw-submit'));

		expect(mutate).not.toHaveBeenCalled();
	});
});
