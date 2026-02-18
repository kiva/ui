import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';
import { fireHotJarEvent } from '#src/util/hotJarUtils';

vi.mock('#src/util/hotJarUtils', () => ({
	fireHotJarEvent: vi.fn(),
}));

describe('MyKivaPageContent', () => {
	const flushPromises = () => new Promise(resolve => {
		setTimeout(resolve, 0);
	});
	const getTimestampMinutesAgo = minutesAgo => {
		const date = new Date();
		date.setTime(date.getTime() - (minutesAgo * 60 * 1000));
		return date.toISOString();
	};

	describe('getLatestLoanPurchaseLoans', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('returns all loans from transactions in the last 15 minutes', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: '2026-02-01T11:50:00Z',
						loan: { id: 101, tags: ['#Eco-friendly'] }
					},
					{
						type: 'loan_purchase',
						effectiveTime: '2026-02-01T11:46:00Z',
						loan: { id: 102, tags: ['#Sustainable Ag'] }
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: '2026-02-01T11:44:00Z',
						loan: { id: 103 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result.map(loan => loan.id)).toEqual([101, 102]);
		});

		it('includes transactions exactly at the 15-minute boundary', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: '2026-02-01T11:45:00Z',
						loan: { id: 301 }
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: '2026-02-01T11:44:59Z',
						loan: { id: 302 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result).toEqual([{ id: 301 }]);
		});

		it('uses createTime when effectiveTime is missing', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: '2026-02-01T11:40:00Z',
						loan: { id: 401 }
					},
					{
						type: 'loan_purchase',
						createTime: '2026-02-01T11:52:00Z',
						loan: { id: 402 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result).toEqual([{ id: 402 }]);
		});

		it('falls back to createTime when effectiveTime is invalid', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: '2026-01-01T00:00:00Z',
						loan: { id: 501 }
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: 'not-a-date',
						createTime: '2026-02-01T11:53:00Z',
						loan: { id: 502 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result).toEqual([{ id: 502 }]);
		});

		it('returns an empty array when there are no transactions in the last 15 minutes', () => {
			const context = {
				transactions: [
					{
						type: 'loan_repayment',
						effectiveTime: '2026-02-01T11:40:00Z',
						loan: { id: 601 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result).toEqual([]);
		});

		it('returns an empty array when all transactions are older than 15 minutes', () => {
			const context = {
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: '2026-02-01T11:44:59Z',
						loan: { id: 901 }
					}
				]
			};

			const result = MyKivaPageContent.methods.getLatestLoanPurchaseLoans.call(context);

			expect(result).toEqual([]);
		});
	});

	describe('mounted', () => {
		it('updates fresh progress using all loans from transactions in the last 15 minutes', async () => {
			const context = {
				clientRendered: false,
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				apollo: {},
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(20),
						loan: { id: 101 }
					},
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(12),
						loan: { id: 102 }
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: getTimestampMinutesAgo(2),
						loan: { id: 201 }
					}
				],
				heroTieredAchievements: [{ id: 'climate-action' }],
				smoothScrollTo: vi.fn(),
				fetchBlogCards: vi.fn(),
				fetchContentfulData: vi.fn(),
				fetchAchievementData: vi.fn().mockResolvedValue(),
				updateBadgeDataWithFreshProgress: vi.fn(),
				fetchRecommendedLoans: vi.fn(),
				fetchMoreWaysToHelpData: vi.fn(),
				loadInitialBasketItems: vi.fn(),
				getLatestLoanPurchaseLoans: MyKivaPageContent.methods.getLatestLoanPurchaseLoans,
			};

			MyKivaPageContent.mounted.call(context);
			await flushPromises();

			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledTimes(1);
			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledWith(
				[{ id: 102 }, { id: 201 }],
				context.heroTieredAchievements
			);
			expect(context.clientRendered).toBe(true);
			expect(fireHotJarEvent).toHaveBeenCalledWith('my_kiva_viewed');
		});

		it('updates fresh progress with all loans when multiple transactions are in the 15-minute window', async () => {
			const recentTimestamp = getTimestampMinutesAgo(5);
			const context = {
				clientRendered: false,
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				apollo: {},
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: recentTimestamp,
						loan: { id: 801 }
					},
					{
						type: 'direct_loan_purchase',
						effectiveTime: recentTimestamp,
						loan: { id: 802 }
					},
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(18),
						loan: { id: 803 }
					}
				],
				heroTieredAchievements: [{ id: 'climate-action' }],
				smoothScrollTo: vi.fn(),
				fetchBlogCards: vi.fn(),
				fetchContentfulData: vi.fn(),
				fetchAchievementData: vi.fn().mockResolvedValue(),
				updateBadgeDataWithFreshProgress: vi.fn(),
				fetchRecommendedLoans: vi.fn(),
				fetchMoreWaysToHelpData: vi.fn(),
				loadInitialBasketItems: vi.fn(),
				getLatestLoanPurchaseLoans: MyKivaPageContent.methods.getLatestLoanPurchaseLoans,
			};

			MyKivaPageContent.mounted.call(context);
			await flushPromises();

			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledTimes(1);
			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledWith(
				[{ id: 801 }, { id: 802 }],
				context.heroTieredAchievements
			);
		});

		it('passes empty fresh-progress loans when there are no transactions', async () => {
			const context = {
				clientRendered: false,
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				apollo: {},
				transactions: [],
				heroTieredAchievements: [{ id: 'climate-action' }],
				smoothScrollTo: vi.fn(),
				fetchBlogCards: vi.fn(),
				fetchContentfulData: vi.fn(),
				fetchAchievementData: vi.fn().mockResolvedValue(),
				updateBadgeDataWithFreshProgress: vi.fn(),
				fetchRecommendedLoans: vi.fn(),
				fetchMoreWaysToHelpData: vi.fn(),
				loadInitialBasketItems: vi.fn(),
				getLatestLoanPurchaseLoans: MyKivaPageContent.methods.getLatestLoanPurchaseLoans,
			};

			MyKivaPageContent.mounted.call(context);
			await flushPromises();

			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledTimes(1);
			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledWith(
				[],
				context.heroTieredAchievements
			);
		});

		it('passes empty fresh-progress loans when transactions are older than 15 minutes', async () => {
			const context = {
				clientRendered: false,
				$route: { query: {} },
				$kvTrackEvent: vi.fn(),
				apollo: {},
				transactions: [
					{
						type: 'loan_purchase',
						effectiveTime: getTimestampMinutesAgo(16),
						loan: { id: 1001, tags: ['#Eco-friendly'] }
					}
				],
				heroTieredAchievements: [{ id: 'climate-action' }],
				smoothScrollTo: vi.fn(),
				fetchBlogCards: vi.fn(),
				fetchContentfulData: vi.fn(),
				fetchAchievementData: vi.fn().mockResolvedValue(),
				updateBadgeDataWithFreshProgress: vi.fn(),
				fetchRecommendedLoans: vi.fn(),
				fetchMoreWaysToHelpData: vi.fn(),
				loadInitialBasketItems: vi.fn(),
				getLatestLoanPurchaseLoans: MyKivaPageContent.methods.getLatestLoanPurchaseLoans,
			};

			MyKivaPageContent.mounted.call(context);
			await flushPromises();

			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledTimes(1);
			expect(context.updateBadgeDataWithFreshProgress).toHaveBeenCalledWith(
				[],
				context.heroTieredAchievements
			);
		});
	});
});
