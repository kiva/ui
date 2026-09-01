import { LIFECYCLE_STAGES } from '@kiva/kv-analytics';
import { deriveLifecycleStage, getLifecycleData } from '#src/util/lifecycleStage';

const NOW = new Date('2026-07-28T12:00:00Z');
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// A date exactly n whole days before NOW
const daysAgo = n => new Date(NOW.getTime() - (n * MS_PER_DAY)).toISOString();

// The query caps loanPurchases at two rows, which is all the stage distinguishes.
const lenderResponse = ({ memberSince, purchases = [] }) => ({
	my: {
		id: 1,
		lender: { id: 1, memberSince },
		loanPurchases: { values: purchases },
	},
});

const mockApollo = data => ({ query: vi.fn().mockResolvedValue({ data }) });

describe('lifecycleStage.js', () => {
	describe('deriveLifecycleStage', () => {
		describe('lenders who have never purchased a loan', () => {
			it('is registered before 90 days', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(89),
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.REGISTERED);
			});

			it('is unconverted90 on day 90', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(90),
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.UNCONVERTED_90);
			});

			it('is unconverted90 on day 179', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(179),
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.UNCONVERTED_90);
			});

			it('is unconverted180 on day 180', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(180),
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.UNCONVERTED_180);
			});

			it('stays unconverted180 indefinitely', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(2000),
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.UNCONVERTED_180);
			});
		});

		describe('active lenders', () => {
			it('is new after a single recent purchase', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(100),
					loanPurchaseCount: 1,
					lastLoanPurchase: daysAgo(10),
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.NEW);
			});

			it('is engaged after a second recent purchase', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(100),
					loanPurchaseCount: 2,
					lastLoanPurchase: daysAgo(10),
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.ENGAGED);
			});

			it('is still new on day 89 with one purchase', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(200),
					loanPurchaseCount: 1,
					lastLoanPurchase: daysAgo(89),
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.NEW);
			});
		});

		describe('idle and lapsed boundaries', () => {
			it.each([
				[89, LIFECYCLE_STAGES.ENGAGED],
				[90, LIFECYCLE_STAGES.IDLE_90],
				[179, LIFECYCLE_STAGES.IDLE_90],
				[180, LIFECYCLE_STAGES.IDLE_180],
				[364, LIFECYCLE_STAGES.IDLE_180],
				[365, LIFECYCLE_STAGES.IDLE_365],
				[729, LIFECYCLE_STAGES.IDLE_365],
				[730, LIFECYCLE_STAGES.LAPSED_CHURNED],
				[3000, LIFECYCLE_STAGES.LAPSED_CHURNED],
			])('is %s days since last purchase -> %s', (days, expected) => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(3650),
					loanPurchaseCount: 5,
					lastLoanPurchase: daysAgo(days),
				}, NOW);

				expect(stage).toBe(expected);
			});

			it('returns to engaged rather than new when an idle lender purchases again', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(3650),
					// the purchase that ended the idle period is their second
					loanPurchaseCount: 2,
					lastLoanPurchase: daysAgo(0),
				}, NOW);

				expect(stage).toBe(LIFECYCLE_STAGES.ENGAGED);
			});
		});

		describe('missing data', () => {
			it('returns null with no arguments', () => {
				expect(deriveLifecycleStage(undefined, NOW)).toBeNull();
			});

			it('returns null without a registration date and no purchases', () => {
				expect(deriveLifecycleStage({ loanPurchaseCount: 0 }, NOW)).toBeNull();
			});

			it('returns null when a purchase count has no purchase date', () => {
				const stage = deriveLifecycleStage({
					memberSince: daysAgo(100),
					loanPurchaseCount: 3,
					lastLoanPurchase: null,
				}, NOW);

				expect(stage).toBeNull();
			});

			it('returns null for an unparseable date', () => {
				const stage = deriveLifecycleStage({
					memberSince: 'not a date',
					loanPurchaseCount: 0,
				}, NOW);

				expect(stage).toBeNull();
			});
		});
	});

	describe('getLifecycleData', () => {
		it('returns the stage and days since the last loan purchase', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(1000),
				purchases: [{ effectiveTime: daysAgo(800) }, { effectiveTime: daysAgo(900) }],
			}));

			expect(await getLifecycleData(apollo, NOW)).toEqual({
				stage: LIFECYCLE_STAGES.LAPSED_CHURNED,
				daysSinceLastLoan: 800,
			});
		});

		it('reports null days for a lender who has never purchased', async () => {
			const apollo = mockApollo(lenderResponse({ memberSince: daysAgo(30), purchases: [] }));

			expect(await getLifecycleData(apollo, NOW)).toEqual({
				stage: LIFECYCLE_STAGES.REGISTERED,
				daysSinceLastLoan: null,
			});
		});

		// the query caps at two rows, so one row means exactly one lifetime purchase
		it('treats a single returned purchase as a new lender', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(100),
				purchases: [{ effectiveTime: daysAgo(10) }],
			}));

			expect((await getLifecycleData(apollo, NOW)).stage).toBe(LIFECYCLE_STAGES.NEW);
		});

		// two rows means two or more, which is all the stage needs to distinguish
		it('treats two returned purchases as an engaged lender', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(100),
				purchases: [{ effectiveTime: daysAgo(10) }, { effectiveTime: daysAgo(50) }],
			}));

			expect((await getLifecycleData(apollo, NOW)).stage).toBe(LIFECYCLE_STAGES.ENGAGED);
		});

		it('falls back to createTime when effectiveTime is absent', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(1000),
				purchases: [{ effectiveTime: null, createTime: daysAgo(800) }],
			}));

			const result = await getLifecycleData(apollo, NOW);

			expect(result.stage).toBe(LIFECYCLE_STAGES.LAPSED_CHURNED);
			expect(result.daysSinceLastLoan).toBe(800);
		});

		it('returns null for guests, who have no lender record', async () => {
			expect(await getLifecycleData(mockApollo({ my: null }), NOW)).toBeNull();
		});

		it('bypasses the apollo cache, since a stale stage would misclassify the lender', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(100),
				purchases: [{ effectiveTime: daysAgo(10) }],
			}));

			await getLifecycleData(apollo, NOW);

			expect(apollo.query).toHaveBeenCalledWith(
				expect.objectContaining({ fetchPolicy: 'network-only' })
			);
		});

		it('returns null rather than throwing when the query fails', async () => {
			const apollo = { query: vi.fn().mockRejectedValue(new Error('network')) };
			vi.spyOn(console, 'error').mockImplementation(() => {});

			expect(await getLifecycleData(apollo, NOW)).toBeNull();
		});
	});
});
