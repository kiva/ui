import {
	LIFECYCLE_STAGES,
	deriveLifecycleStage,
	getLifecycleData,
	getReEngagementEvent,
	RE_ENGAGEMENT_EVENTS,
} from '#src/util/lifecycleStage';

const NOW = new Date('2026-07-28T12:00:00Z');
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// A date exactly n whole days before NOW
const daysAgo = n => new Date(NOW.getTime() - (n * MS_PER_DAY)).toISOString();

const mockApollo = data => ({ query: vi.fn().mockResolvedValue({ data }) });

const lenderResponse = ({
	memberSince,
	totalCount,
	lastLoanPurchase,
	lastDeposit,
	lastDonation,
}) => ({
	my: {
		id: 1,
		lender: { id: 1, memberSince },
		transactions: {
			totalCount,
			values: lastLoanPurchase ? [{ effectiveTime: lastLoanPurchase }] : [],
		},
		lastDeposit: { values: lastDeposit ? [{ effectiveTime: lastDeposit }] : [] },
		lastDonation: { values: lastDonation ? [{ effectiveTime: lastDonation }] : [] },
	},
});

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

	describe('getReEngagementEvent', () => {
		it.each([
			LIFECYCLE_STAGES.IDLE_90,
			LIFECYCLE_STAGES.IDLE_180,
			LIFECYCLE_STAGES.IDLE_365,
		])('maps %s to the idle event', stage => {
			expect(getReEngagementEvent(stage)).toBe(RE_ENGAGEMENT_EVENTS.IDLE);
		});

		it('maps lapsedChurned to the lapsed event', () => {
			expect(getReEngagementEvent(LIFECYCLE_STAGES.LAPSED_CHURNED))
				.toBe(RE_ENGAGEMENT_EVENTS.LAPSED);
		});

		it.each([
			LIFECYCLE_STAGES.NEW,
			LIFECYCLE_STAGES.ENGAGED,
			LIFECYCLE_STAGES.REGISTERED,
			LIFECYCLE_STAGES.UNCONVERTED_90,
			LIFECYCLE_STAGES.UNCONVERTED_180,
		])('returns null for %s, which is not a re-engagement', stage => {
			expect(getReEngagementEvent(stage)).toBeNull();
		});

		it('returns null for guests, who have no stage', () => {
			expect(getReEngagementEvent(null)).toBeNull();
		});
	});

	describe('getLifecycleData', () => {
		it('returns the stage and days since the last loan purchase', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(1000),
				totalCount: 4,
				lastLoanPurchase: daysAgo(800),
			}));

			const result = await getLifecycleData(apollo, NOW);

			expect(result).toEqual({
				stage: LIFECYCLE_STAGES.LAPSED_CHURNED,
				daysSinceLastLoan: 800,
				alreadyReEngaged: false,
			});
		});

		it('reports null days for a lender who has never purchased', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(30),
				totalCount: 0,
				lastLoanPurchase: null,
			}));

			const result = await getLifecycleData(apollo, NOW);

			expect(result).toEqual({
				stage: LIFECYCLE_STAGES.REGISTERED,
				daysSinceLastLoan: null,
				alreadyReEngaged: false,
			});
		});

		it('falls back to createTime when effectiveTime is absent', async () => {
			const apollo = mockApollo({
				my: {
					id: 1,
					lender: { id: 1, memberSince: daysAgo(1000) },
					transactions: {
						totalCount: 4,
						values: [{ effectiveTime: null, createTime: daysAgo(800) }],
					},
				},
			});

			const result = await getLifecycleData(apollo, NOW);

			expect(result).toEqual({
				stage: LIFECYCLE_STAGES.LAPSED_CHURNED,
				daysSinceLastLoan: 800,
				alreadyReEngaged: false,
			});
		});

		// "re-engaged" marks the return itself. Only a loan purchase ends an inactive
		// period, so a deposit or donation after it began means we already reported them.
		describe('alreadyReEngaged', () => {
			// idle since day 90; a deposit on day 300 falls inside the inactive period
			it('is true when a deposit followed the start of the inactive period', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
					lastDeposit: daysAgo(300),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(true);
			});

			it('is true when a donation followed the start of the inactive period', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
					lastDonation: daysAgo(300),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(true);
			});

			// a deposit made alongside the last loan purchase predates the inactive period
			it('is false when the only deposit accompanied the last loan purchase', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
					lastDeposit: daysAgo(800),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(false);
			});

			it('is false when the lender has never deposited or donated', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(false);
			});

			// day 710 of an 800 day gap is the exact moment the inactive period began
			it('is false on the boundary day the inactive period started', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
					lastDeposit: daysAgo(710),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(false);
			});

			it('uses whichever of deposit or donation is more recent', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(1000),
					totalCount: 4,
					lastLoanPurchase: daysAgo(800),
					lastDeposit: daysAgo(780),
					lastDonation: daysAgo(100),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(true);
			});

			it('is false for a lender who has never purchased a loan', async () => {
				const apollo = mockApollo(lenderResponse({
					memberSince: daysAgo(30),
					totalCount: 0,
					lastLoanPurchase: null,
					lastDonation: daysAgo(5),
				}));

				const result = await getLifecycleData(apollo, NOW);

				expect(result.alreadyReEngaged).toBe(false);
			});
		});

		it('returns null for guests, who have no lender record', async () => {
			const apollo = mockApollo({ my: null });

			expect(await getLifecycleData(apollo, NOW)).toBeNull();
		});

		it('bypasses the apollo cache, since a stale stage would misclassify the lender', async () => {
			const apollo = mockApollo(lenderResponse({
				memberSince: daysAgo(100),
				totalCount: 1,
				lastLoanPurchase: daysAgo(10),
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
