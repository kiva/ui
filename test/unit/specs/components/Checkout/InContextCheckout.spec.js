import InContextCheckout from '#src/components/Checkout/InContext/InContextCheckout';
import logFormatter from '#src/util/logFormatter';

vi.mock('#src/util/logFormatter', () => ({
	default: vi.fn(),
}));

describe('InContextCheckout donation credit default', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {
			mutate: vi.fn().mockResolvedValue({ data: {} }),
		},
		cookieStore: {
			get: vi.fn().mockReturnValue('basket-id'),
		},
		$route: {
			path: '/donate/supportus',
		},
		isLoggedIn: true,
		hasRequestedDonationCreditDefault: false,
		donations: [{
			id: '1',
			isTip: false,
		}],
		loans: [],
		kivaCards: [],
		setUpdatingTotals: vi.fn(),
		$emit: vi.fn(),
		shouldApplyDonationCreditDefault: InContextCheckout.methods.shouldApplyDonationCreditDefault,
		...overrides,
	});

	beforeEach(() => {
		logFormatter.mockReset();
	});

	it('requests the backend donation credit default for the supportus modal donation basket', async () => {
		const context = makeContext();

		await InContextCheckout.methods.applyDonationCreditDefault.call(context);

		expect(context.apollo.mutate).toHaveBeenCalledWith({
			mutation: expect.any(Object),
			variables: {
				basketId: 'basket-id',
				applyDonationCreditDefault: true,
			},
		});
		expect(context.hasRequestedDonationCreditDefault).toBe(true);
		expect(context.$emit).toHaveBeenCalledWith('refreshtotals');
		expect(context.setUpdatingTotals).toHaveBeenNthCalledWith(1, true);
		expect(context.setUpdatingTotals).toHaveBeenLastCalledWith(false);
	});

	it('does not request the default for supportusprocess basket checkout', async () => {
		const context = makeContext({
			$route: {
				path: '/donate/supportusprocess',
			},
		});

		await InContextCheckout.methods.applyDonationCreditDefault.call(context);

		expect(context.apollo.mutate).not.toHaveBeenCalled();
	});

	it('does not request the default for guests', async () => {
		const context = makeContext({
			isLoggedIn: false,
		});

		await InContextCheckout.methods.applyDonationCreditDefault.call(context);

		expect(context.apollo.mutate).not.toHaveBeenCalled();
	});

	it('does not request the default for non-donation-only baskets', async () => {
		const context = makeContext({
			loans: [{ id: 'loan-id' }],
		});

		await InContextCheckout.methods.applyDonationCreditDefault.call(context);

		expect(context.apollo.mutate).not.toHaveBeenCalled();
	});

	it('logs setup errors and clears the loading state', async () => {
		const error = new Error('setup failed');
		const context = makeContext({
			apollo: {
				mutate: vi.fn().mockRejectedValue(error),
			},
		});

		await InContextCheckout.methods.applyDonationCreditDefault.call(context);

		expect(logFormatter).toHaveBeenCalledWith(error, 'error');
		expect(context.setUpdatingTotals).toHaveBeenLastCalledWith(false);
	});
});
