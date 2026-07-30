const { mockRecordTransactorSignals, mockSetHotJarUserAttributes } = vi.hoisted(() => ({
	mockRecordTransactorSignals: vi.fn(),
	mockSetHotJarUserAttributes: vi.fn(),
}));

vi.mock('#src/util/optimizelyUserMetrics', async importOriginal => ({
	...(await importOriginal()),
	recordTransactorSignals: mockRecordTransactorSignals,
}));

vi.mock('#src/util/hotJarUtils', async importOriginal => ({
	...(await importOriginal()),
	setHotJarUserAttributes: mockSetHotJarUserAttributes,
}));

const ThanksPage = (await import('#src/pages/Thanks/ThanksPage')).default;
const thanksPageReceiptQuery = (await import('#src/graphql/query/thanksPageReceipt.graphql')).default;

// Both thanks views are the only place a completed transaction feeds back into the lifetime
// transactor cookies that drive the Meta `user_type` segment. Neither has a component spec, so
// this covers the one call each makes — a silent regression here mislabels every later pageview.
describe('transactor signals recorded on the thanks views', () => {
	beforeEach(() => {
		mockRecordTransactorSignals.mockReset();
		mockRecordTransactorSignals.mockReturnValue({ hasLentBefore: true, hasDepositBefore: false });
		mockSetHotJarUserAttributes.mockClear();
	});

	describe('ThanksPage', () => {
		const cookieStore = { get: vi.fn(), set: vi.fn() };

		// created() derives loans/receipt from the receipt readQuery, so drive it from there
		// rather than presetting the fields — presetting them gets clobbered before the call.
		const context = receipt => ({
			apollo: {
				readQuery: vi.fn(({ query }) => (query === thanksPageReceiptQuery ? { shop: { receipt } } : {})),
				readFragment: vi.fn().mockReturnValue(null),
			},
			cookieStore,
			loans: [],
			receipt: {},
			$route: { query: { kiva_transaction_id: '456' } },
			achievements: [],
			achievementsCompleted: false,
			allAchievementsCompleted: () => false,
			loadInitialBasketItems: vi.fn(),
			$kvTrackEvent: vi.fn(),
			$showTipMsg: vi.fn(),
		});

		it('reports loans and deposit from the receipt', () => {
			ThanksPage.created.call(context({
				items: { values: [{ basketItemType: 'loan_reservation', loan: { id: 1 } }] },
				totals: { depositTotals: { depositTotal: '25.00' } },
			}));

			expect(mockRecordTransactorSignals).toHaveBeenCalledWith(
				cookieStore,
				{ hasLoans: true, hasDeposit: true },
			);
		});

		it('reports a credit-funded donation-only receipt as proving neither', () => {
			ThanksPage.created.call(context({
				items: { values: [{ basketItemType: 'donation' }] },
				totals: { depositTotals: { depositTotal: '0.00' } },
			}));

			expect(mockRecordTransactorSignals).toHaveBeenCalledWith(
				cookieStore,
				{ hasLoans: false, hasDeposit: false },
			);
		});

		it('passes the merged flags on to Hotjar rather than the raw receipt signals', () => {
			ThanksPage.created.call(context({ items: { values: [] }, totals: {} }));

			expect(mockSetHotJarUserAttributes).toHaveBeenCalledWith(expect.objectContaining({
				hasLentBefore: true,
				hasDepositBefore: false,
			}));
		});
	});
});
