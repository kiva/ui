import { describe, it, expect } from 'vitest';
import { splitAchievements, filterAchievementData, getOneLoanAwayAchievement } from '#src/util/atbAchievementUtils';

vi.mock('#src/util/achievementUtils', () => ({ defaultBadges: [101, 102, 103] }));

describe('achievementUtils', () => {
	describe('splitAchievements', () => {
		it('should correctly split contributing and non-contributing achievements', () => {
			const loanAchievements = [
				{ achievementId: 1, preCheckoutTier: 1, postCheckoutTier: 2 },
				{ achievementId: 2, preCheckoutTier: 2, postCheckoutTier: 2 },
				{ achievementId: 3, preCheckoutTier: 2, postCheckoutTier: 3 },
				{ achievementId: 4, preCheckoutTier: 3, postCheckoutTier: 3 },
			];

			const tierTable = {
				2: 2,
				4: 3,
			};

			// eslint-disable-next-line max-len
			const { contributingLoanAchievements, nonContributingAchievements } = splitAchievements(loanAchievements, tierTable);

			expect(contributingLoanAchievements).toEqual([
				{ achievementId: 1, preCheckoutTier: 1, postCheckoutTier: 2 },
				{ achievementId: 3, preCheckoutTier: 2, postCheckoutTier: 3 },
			]);

			expect(nonContributingAchievements).toEqual([
				{ achievementId: 2, preCheckoutTier: 2, postCheckoutTier: 2 },
				{ achievementId: 4, preCheckoutTier: 3, postCheckoutTier: 3 },
			]);
		});
	});

	describe('filterAchievementData', () => {
		it('should return merged and sorted data by defaultBadges order', () => {
			const nonContributing = [
				{ achievementId: 101 },
				{ achievementId: 103 },
				{ achievementId: 102 },
			];

			const badgeAchievementData = [
				{
					id: 101,
					tiers: [{ target: 10, completedDate: null }],
				},
				{
					id: 102,
					tiers: [{ target: 5, completedDate: null }],
				},
				{
					id: 103,
					tiers: [{ target: 15, completedDate: null }],
				},
			];

			const result = filterAchievementData(nonContributing, badgeAchievementData);
			expect(result.map(a => a.id)).toEqual([101, 102, 103]);
			expect(result[0]).toHaveProperty('target', 10);
			expect(result[1]).toHaveProperty('target', 5);
			expect(result[2]).toHaveProperty('target', 15);
		});
	});

	describe('getOneLoanAwayAchievement', () => {
		it('should return the achievement that is one loan away from next tier', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 2,
					tiers: [{ target: 4 }, { target: 6 }],
				},
				{
					id: 2,
					totalProgressToAchievement: 3,
					tiers: [{ target: 5 }, { target: 10 }],
				},
			];

			const loanAchievements = [
				{ achievementId: 2, contributingLoanIds: [101] },
			];

			const result = getOneLoanAwayAchievement(filteredAchievementsData, loanAchievements);
			expect(result?.id).toBe(2);
		});

		it('should return undefined if no achievement is one loan away', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 2,
					tiers: [{ target: 4 }, { target: 6 }],
				},
			];

			const loanAchievements = [
				{ achievementId: 1, contributingLoanIds: [] },
			];

			const result = getOneLoanAwayAchievement(filteredAchievementsData, loanAchievements);
			expect(result).toBeUndefined();
		});
	});
});
