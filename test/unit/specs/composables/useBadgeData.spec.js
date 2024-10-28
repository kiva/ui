import useBadgeData from '#src/composables/useBadgeData';
import { achievementData, contentfulData, combinedData } from '../../fixtures/useBadgeDataMock';

jest.mock('vue', () => ({
	onMounted: callback => callback(),
	ref: value => ({ value }),
	computed: callback => callback(),
}));

describe('useBadgeData.js', () => {
	describe('getTierPositions', () => {
		it('should call apollo for data', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};

			useBadgeData(apolloMock);

			expect(apolloMock.query).toHaveBeenCalledTimes(2);
		});

		it('should combine data like expected', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};

			const { combineBadgeData, getContentfulLevelData } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			);

			expect(badgeData).toEqual(combinedData);
		});
	});
});
