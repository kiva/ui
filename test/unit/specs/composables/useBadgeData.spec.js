/* eslint-disable max-len */
import useBadgeData, {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	US_ECONOMIC_EQUALITY_FILTER,
	WOMENS_EQUALITY_FILTER,
	CLIMATE_ACTION_FILTER,
	REFUGEE_EQUALITY_FILTER,
	BASIC_NEEDS_FILTER,
} from '#src/composables/useBadgeData';
import {
	achievementData,
	contentfulData,
	combinedData,
	badgeNoProgress,
	badgeLastTier,
} from '../../fixtures/useBadgeDataMock';

jest.mock('vue', () => ({
	onMounted: callback => callback(),
	ref: value => ({ value }),
	computed: callback => callback(),
}));

describe('useBadgeData.js', () => {
	describe('getTierPositions', () => {
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

	describe('getCurrentTierData', () => {
		it('should get the current tier data', () => {
			const { getCurrentTierData } = useBadgeData();

			expect(getCurrentTierData(badgeNoProgress)).toEqual({
				id: 'basic-needs',
				level: 1,
				levelName: 'Basic needs',
				challengeName: 'Basic needs',
				imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/694uSymh8om0MxbiCjWZxl/b55c8cb3f3743efdd56b56beea8dfb42/Basic_Needs_10.svg',
				__typename: 'Tier',
				target: 2,
				tierStatement: '',
				completedDate: undefined,
				learnMoreURL: ''
			});
		});

		it('should get the current last data (with emoji)', () => {
			const { getCurrentTierData } = useBadgeData();

			expect(getCurrentTierData(badgeLastTier)).toEqual({
				id: 'basic-needs',
				level: 7,
				levelName: 'Basic needs✨100✨',
				challengeName: 'Basic needs',
				imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/1LLL9K4PgaUZb3H0JLWEPU/4ed0ec9c5515fa25410b9e32d6a8e7cf/Basic_Needs_70.svg',
				__typename: 'Tier',
				target: 100,
				tierStatement: '',
				completedDate: undefined,
				learnMoreURL: ''
			});
		});
	});

	describe('getTierBadgeDataByLevel', () => {
		it('should get the badge data by id and tier', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const tier = 7;
			const sampleBadge = combinedData[0];

			expect(getTierBadgeDataByLevel(sampleBadge, tier)).toEqual({
				...sampleBadge,
				contentfulData: sampleBadge.contentfulData?.[tier - 1],
				achievementData: sampleBadge.achievementData?.tiers?.[tier - 1],
			});
		});
	});

	describe('getFilteredUrl', () => {
		it('should return expected filtered url for womens-equality', () => {
			const { getFilteredUrl } = useBadgeData();
			expect(getFilteredUrl({ id: ID_WOMENS_EQUALITY })).toEqual(WOMENS_EQUALITY_FILTER);
		});

		it('should return expected filtered url for us-economic-equality', () => {
			const { getFilteredUrl } = useBadgeData();
			expect(getFilteredUrl({ id: ID_US_ECONOMIC_EQUALITY })).toEqual(US_ECONOMIC_EQUALITY_FILTER);
		});

		it('should return expected filtered url for climate-action', () => {
			const { getFilteredUrl } = useBadgeData();
			expect(getFilteredUrl({ id: ID_CLIMATE_ACTION })).toEqual(CLIMATE_ACTION_FILTER);
		});

		it('should return expected filtered url for refugee-equality', () => {
			const { getFilteredUrl } = useBadgeData();
			expect(getFilteredUrl({ id: ID_REFUGEE_EQUALITY })).toEqual(REFUGEE_EQUALITY_FILTER);
		});

		it('should return expected filtered url for basic-needs', () => {
			const { getFilteredUrl } = useBadgeData();
			expect(getFilteredUrl({ id: ID_BASIC_NEEDS })).toEqual(BASIC_NEEDS_FILTER);
		});
	});
});
