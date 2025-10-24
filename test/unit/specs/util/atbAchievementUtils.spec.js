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

		it('should handle empty loan achievements array', () => {
			const { contributingLoanAchievements, nonContributingAchievements } = splitAchievements([], {});
			expect(contributingLoanAchievements).toEqual([]);
			expect(nonContributingAchievements).toEqual([]);
		});

		it('should handle empty tier table', () => {
			const loanAchievements = [
				{ achievementId: 1, preCheckoutTier: 1, postCheckoutTier: 2 },
				{ achievementId: 2, preCheckoutTier: 2, postCheckoutTier: 2 },
			];

			const result = splitAchievements(loanAchievements, {});

			expect(result.contributingLoanAchievements).toEqual([
				{ achievementId: 1, preCheckoutTier: 1, postCheckoutTier: 2 },
			]);
			expect(result.nonContributingAchievements).toEqual([
				{ achievementId: 2, preCheckoutTier: 2, postCheckoutTier: 2 },
			]);
		});

		it('should handle all achievements being contributing', () => {
			const loanAchievements = [
				{ achievementId: 1, preCheckoutTier: 1, postCheckoutTier: 2 },
				{ achievementId: 2, preCheckoutTier: 2, postCheckoutTier: 3 },
			];

			const result = splitAchievements(loanAchievements, {});

			expect(result.contributingLoanAchievements).toEqual(loanAchievements);
			expect(result.nonContributingAchievements).toEqual([]);
		});

		it('should handle all achievements being non-contributing', () => {
			const loanAchievements = [
				{ achievementId: 1, preCheckoutTier: 2, postCheckoutTier: 2 },
				{ achievementId: 2, preCheckoutTier: 3, postCheckoutTier: 3 },
			];

			const result = splitAchievements(loanAchievements, {});

			expect(result.contributingLoanAchievements).toEqual([]);
			expect(result.nonContributingAchievements).toEqual(loanAchievements);
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

		it('should handle empty non-contributing achievements array', () => {
			const badgeAchievementData = [
				{
					id: 101,
					tiers: [{ target: 10, completedDate: null }],
				},
			];

			const result = filterAchievementData([], badgeAchievementData);
			expect(result).toEqual([]);
		});

		it('should handle empty badge achievement data', () => {
			const nonContributing = [
				{ achievementId: 101 },
			];

			const result = filterAchievementData(nonContributing, []);
			// Function doesn't filter out undefined matches, just spreads them
			expect(result.length).toBe(1);
			expect(result[0]).toEqual({});
		});

		it('should handle achievements with all tiers completed', () => {
			const nonContributing = [
				{ achievementId: 101 },
			];

			const badgeAchievementData = [
				{
					id: 101,
					tiers: [
						{ target: 5, completedDate: '2024-01-01' },
						{ target: 10, completedDate: '2024-01-02' },
					],
				},
			];

			const result = filterAchievementData(nonContributing, badgeAchievementData);
			// Function spreads undefined activeTier when all are completed
			expect(result.length).toBe(1);
			expect(result[0].id).toBe(101);
			expect(result[0].target).toBeUndefined();
		});

		it('should handle achievement not found in badge achievement data', () => {
			const nonContributing = [
				{ achievementId: 999 },
			];

			const badgeAchievementData = [
				{
					id: 101,
					tiers: [{ target: 10, completedDate: null }],
				},
			];

			const result = filterAchievementData(nonContributing, badgeAchievementData);
			// Function doesn't filter out not found achievements
			expect(result.length).toBe(1);
			expect(result[0]).toEqual({});
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
				{ achievementId: 2, contributingLoanIds: ['101'] },
			];

			const addedLoanId = 101;

			const result = getOneLoanAwayAchievement(addedLoanId, filteredAchievementsData, loanAchievements);
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

			const addedLoanId = 101;

			const result = getOneLoanAwayAchievement(addedLoanId, filteredAchievementsData, loanAchievements);
			expect(result).toBeNull();
		});

		it('should handle empty filtered achievements data', () => {
			const loanAchievements = [
				{ achievementId: 1, contributingLoanIds: ['101'] },
			];

			const result = getOneLoanAwayAchievement(101, [], loanAchievements);
			expect(result).toBeNull();
		});

		it('should handle empty loan achievements', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 3,
					tiers: [{ target: 5 }],
				},
			];

			const result = getOneLoanAwayAchievement(101, filteredAchievementsData, []);
			expect(result).toBeNull();
		});

		it('should handle loan ID not in contributing loan IDs', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 3,
					tiers: [{ target: 5 }],
				},
			];

			const loanAchievements = [
				{ achievementId: 1, contributingLoanIds: ['200', '300'] },
			];

			const result = getOneLoanAwayAchievement(101, filteredAchievementsData, loanAchievements);
			expect(result).toBeNull();
		});

		it('should handle achievement with no matching tier target', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 2,
					tiers: [{ target: 10 }, { target: 20 }],
				},
			];

			const loanAchievements = [
				{ achievementId: 1, contributingLoanIds: ['101'] },
			];

			const result = getOneLoanAwayAchievement(101, filteredAchievementsData, loanAchievements);
			expect(result).toBeNull();
		});

		it('should handle achievement with no contributing loans', () => {
			const filteredAchievementsData = [
				{
					id: 1,
					totalProgressToAchievement: 3,
					tiers: [{ target: 5 }],
				},
			];

			const loanAchievements = [
				{ achievementId: 1, contributingLoanIds: [] },
			];

			const result = getOneLoanAwayAchievement(101, filteredAchievementsData, loanAchievements);
			expect(result).toBeNull();
		});
	});
});
