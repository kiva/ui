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
