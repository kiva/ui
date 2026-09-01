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
				},
			},
		}),
	};
};

describe('WithdrawConfirmPage', () => {
	it('redirects back to the form when arrived without an amount', () => {
		const { replace } = renderConfirm({ state: {} });
		expect(replace).toHaveBeenCalledWith({ path: '/withdraw' });
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
				path: '/withdraw/check-inbox',
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

	it('submits only the amount and paypal email, without a donation', async () => {
		const {
			getByTestId, mutate,
		} = renderConfirm();
		await waitFor(() => getByTestId('withdraw-submit'));
		await fireEvent.click(getByTestId('withdraw-submit'));

		await waitFor(() => {
			expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
				variables: { amount: 50, paypalEmail: 'a@example.org' },
			}));
		});
	});
});
