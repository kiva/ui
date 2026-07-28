import { formatTransactionData, getTransactionAnalyticsData } from '#src/util/checkoutUtils';
import InContextCheckout from '#src/components/Checkout/InContext/InContextCheckout';

vi.mock('#src/util/checkoutUtils', () => ({
	formatTransactionData: vi.fn(),
	getTransactionAnalyticsData: vi.fn(),
}));

describe('InContextCheckout lifecycle analytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		formatTransactionData.mockReturnValue({
			itemTotal: '25.00',
			loans: [{ id: '1' }],
		});
	});

	it('passes the pre-transaction lifecycle request to transaction analytics', async () => {
		const lifecycleDataPromise = Promise.resolve({
			stage: 'idle90',
			daysSinceLastLoan: 100,
		});
		const context = {
			apollo: {},
			loans: [{ id: '1', price: '25.00' }],
			kivaCards: [],
			donations: [],
			totals: { itemTotal: '25.00' },
			lifecycleDataPromise,
			$kvTrackTransaction: vi.fn(),
			autoRedirectToThanks: false,
			$emit: vi.fn(),
		};
		getTransactionAnalyticsData.mockResolvedValue({
			isFTD: false,
			lifecycleStage: 'idle90',
			daysSinceLastLoan: 100,
			reEngagementEvent: 'idleLenderReEngaged',
		});

		InContextCheckout.methods.completeTransaction.call(context, '999');
		await Promise.resolve();

		expect(getTransactionAnalyticsData).toHaveBeenCalledWith(context.apollo, lifecycleDataPromise);
		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({
			lifecycleStage: 'idle90',
			reEngagementEvent: 'idleLenderReEngaged',
		}));
	});
});
