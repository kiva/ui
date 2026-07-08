import { render, waitFor } from '@testing-library/vue';
import WithdrawAuthorizePage from '#src/pages/Withdraw/WithdrawAuthorizePage';

const renderAuthorize = ({
	token = 'good-token',
	result = { status: 'SUCCESS', message: null },
} = {}) => {
	const mutate = vi.fn().mockResolvedValue({
		data: { my: { authorizePayPalWithdrawal: result } },
	});

	return {
		mutate,
		...render(WithdrawAuthorizePage, {
			props: { token },
			global: {
				provide: { apollo: { mutate }, cookieStore: {} },
				directives: { 'kv-track-event': {} },
				stubs: {
					PortfolioShell: { template: '<div><slot /></div>' },
					KvButton: { props: ['to'], template: '<button><slot /></button>' },
					KvLoadingSpinner: { template: '<div />' },
				},
			},
		}),
	};
};

describe('WithdrawAuthorizePage', () => {
	it('shows a generic confirmation with no PII', async () => {
		const { getByTestId } = renderAuthorize();
		await waitFor(() => {
			const text = getByTestId('withdraw-authorize-success').textContent;
			expect(text).toContain('your PayPal account');
			expect(text).toContain('has been received');
			// No PII (PayPal email) is ever echoed in the confirmation.
			expect(text).not.toContain('@');
		});
	});

	it('shows the generic error message on a bad token', async () => {
		const { getByTestId } = renderAuthorize({
			result: { status: 'ERROR', message: null },
		});
		await waitFor(() => {
			expect(getByTestId('withdraw-authorize-error').textContent).toContain('invalid or has expired');
		});
	});

	it('does not call the mutation when there is no token', async () => {
		const { getByTestId, mutate } = renderAuthorize({ token: '' });
		await waitFor(() => getByTestId('withdraw-authorize-error'));
		expect(mutate).not.toHaveBeenCalled();
	});
});
