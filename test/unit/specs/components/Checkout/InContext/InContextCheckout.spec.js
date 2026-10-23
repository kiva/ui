import InContextCheckout from '#src/components/Checkout/InContext/InContextCheckout';
import { getTransactionAnalyticsData } from '#src/util/checkoutUtils';

vi.mock('#src/util/checkoutUtils', async importOriginal => ({
	...await importOriginal(),
	getTransactionAnalyticsData: vi.fn(),
}));

describe('InContextCheckout completeTransaction', () => {
	const makeContext = (overrides = {}) => ({
		apollo: {},
		loans: [],
		kivaCards: [],
		donations: [],
		totals: { itemTotal: '25.00', creditAmountNeeded: '5.00' },
		autoRedirectToThanks: true,
		cookieStore: { get: vi.fn() },
		$kvTrackTransaction: vi.fn(),
		redirectToThanks: vi.fn(),
		$emit: vi.fn(),
		...overrides,
	});

	beforeEach(() => {
		getTransactionAnalyticsData.mockResolvedValue({ isFTD: true });
	});

	it('fires the transaction with the FTD status resolved from the cookies and deposit', async () => {
		const context = makeContext();

		await InContextCheckout.methods.completeTransaction.call(context, '12345');

		expect(getTransactionAnalyticsData).toHaveBeenCalledWith(context.apollo, null, {
			cookieStore: context.cookieStore,
			depositTotal: '5.00',
		});
		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({ isFTD: true }));
	});

	it('still fires the transaction and redirects when the FTD lookup fails', async () => {
		vi.useFakeTimers();
		const context = makeContext();
		getTransactionAnalyticsData.mockRejectedValue(new Error('network'));

		await InContextCheckout.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		vi.runAllTimers();
		expect(context.redirectToThanks).toHaveBeenCalledWith('12345');
		vi.useRealTimers();
	});
});
