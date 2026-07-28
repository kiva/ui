import InContextCheckout from '#src/components/Checkout/InContext/InContextCheckout';

describe('InContextCheckout completeTransaction', () => {
	const makeContext = (overrides = {}) => ({
		apollo: { query: vi.fn().mockResolvedValue({ data: {} }) },
		loans: [],
		kivaCards: [],
		donations: [],
		totals: { itemTotal: '25.00' },
		autoRedirectToThanks: true,
		$kvTrackTransaction: vi.fn(),
		redirectToThanks: vi.fn(),
		$emit: vi.fn(),
		...overrides,
	});

	it('fires the transaction with the resolved FTD status on success', async () => {
		const context = makeContext({
			apollo: {
				query: vi.fn().mockResolvedValue({
					data: { my: { userAccount: { isFirstTimeDepositor: true } } },
				}),
			},
		});

		await InContextCheckout.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({ isFTD: true }));
	});

	it('still fires the transaction and redirects when the FTD lookup fails', async () => {
		vi.useFakeTimers();
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const context = makeContext({
			apollo: { query: vi.fn().mockRejectedValue(new Error('network')) },
		});

		await InContextCheckout.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledTimes(1);
		vi.runAllTimers();
		expect(context.redirectToThanks).toHaveBeenCalledWith('12345');
		vi.useRealTimers();
	});

	it('adds lifecycle data captured before the transaction', async () => {
		const context = makeContext({
			lifecycleDataPromise: Promise.resolve({
				stage: 'idle180',
				daysSinceLastLoan: 200,
				alreadyReEngaged: false,
			}),
		});

		await InContextCheckout.methods.completeTransaction.call(context, '12345');

		expect(context.$kvTrackTransaction).toHaveBeenCalledWith(expect.objectContaining({
			lifecycleStage: 'idle180',
			reEngagementEvent: 'idleLenderReEngaged',
		}));
	});
});
