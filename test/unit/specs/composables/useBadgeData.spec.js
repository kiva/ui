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
import { defaultBadges } from '#src/util/achievementUtils';
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

	describe('getActiveTierData', () => {
		it('should get the current tier data', () => {
			const { getActiveTierData } = useBadgeData();

			expect(getActiveTierData(badgeNoProgress)).toEqual({
				id: 'basic-needs',
				level: 1,
				levelName: '1',
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
			const { getActiveTierData } = useBadgeData();

			expect(getActiveTierData(badgeLastTier)).toEqual({
				id: 'basic-needs',
				level: 7,
				levelName: '✨100✨',
				challengeName: 'Basic needs',
				imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/1LLL9K4PgaUZb3H0JLWEPU/4ed0ec9c5515fa25410b9e32d6a8e7cf/Basic_Needs_70.svg',
				__typename: 'Tier',
				target: 100,
				tierStatement: '',
				completedDate: undefined,
				learnMoreURL: ''
			});
		});

		it('should get the current last data when all completed', () => {
			const data = JSON.parse(JSON.stringify(badgeLastTier));
			data.level = 7;
			data.achievementData.tiers[6].completedDate = '2024-10-22T18:49:21Z';

			const { getActiveTierData } = useBadgeData();

			expect(getActiveTierData(data)).toEqual({
				id: 'basic-needs',
				level: 7,
				levelName: '✨100✨',
				challengeName: 'Basic needs',
				imageUrl: '//images.ctfassets.net/j0p9a6ql0rn7/1LLL9K4PgaUZb3H0JLWEPU/4ed0ec9c5515fa25410b9e32d6a8e7cf/Basic_Needs_70.svg',
				__typename: 'Tier',
				target: 100,
				tierStatement: '',
				completedDate: '2024-10-22T18:49:21Z',
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
				tierName: `${sampleBadge.contentfulData?.[tier - 1].challengeName} ${sampleBadge.contentfulData?.[tier - 1].levelName}`,
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

	describe('getBadgeWithVisibleTiers', () => {
		it('should return expected tiers for not started', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = undefined;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(3);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.achievementData.tiers.length).toBe(3);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
		});

		it('should return expected tiers for tier 1', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 1;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(3);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.achievementData.tiers.length).toBe(3);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
		});

		it('should return expected tiers for tier 2', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 2;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(3);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.achievementData.tiers.length).toBe(3);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
		});

		it('should return expected tiers for tier 3', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 3;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(5);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.contentfulData[3].level).toBe(4);
			expect(result.contentfulData[4].level).toBe(5);
			expect(result.achievementData.tiers.length).toBe(5);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
			expect(result.achievementData.tiers[3].level).toBe(4);
			expect(result.achievementData.tiers[4].level).toBe(5);
		});

		it('should return expected tiers for tier 4', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 4;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(5);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.contentfulData[3].level).toBe(4);
			expect(result.contentfulData[4].level).toBe(5);
			expect(result.achievementData.tiers.length).toBe(5);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
			expect(result.achievementData.tiers[3].level).toBe(4);
			expect(result.achievementData.tiers[4].level).toBe(5);
		});

		it('should return expected tiers for tier 5', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 5;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(7);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.contentfulData[3].level).toBe(4);
			expect(result.contentfulData[4].level).toBe(5);
			expect(result.contentfulData[5].level).toBe(6);
			expect(result.contentfulData[6].level).toBe(7);
			expect(result.achievementData.tiers.length).toBe(7);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
			expect(result.achievementData.tiers[3].level).toBe(4);
			expect(result.achievementData.tiers[4].level).toBe(5);
			expect(result.achievementData.tiers[5].level).toBe(6);
			expect(result.achievementData.tiers[6].level).toBe(7);
		});

		it('should return expected tiers for tier 6', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 6;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(7);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.contentfulData[3].level).toBe(4);
			expect(result.contentfulData[4].level).toBe(5);
			expect(result.contentfulData[5].level).toBe(6);
			expect(result.contentfulData[6].level).toBe(7);
			expect(result.achievementData.tiers.length).toBe(7);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
			expect(result.achievementData.tiers[3].level).toBe(4);
			expect(result.achievementData.tiers[4].level).toBe(5);
			expect(result.achievementData.tiers[5].level).toBe(6);
			expect(result.achievementData.tiers[6].level).toBe(7);
		});

		it('should return expected tiers for tier 7', () => {
			const apolloMock = {
				query: jest.fn()
					.mockReturnValueOnce(Promise.resolve({ data: achievementData }))
					.mockReturnValueOnce(Promise.resolve({ data: contentfulData }))
			};
			const { combineBadgeData, getContentfulLevelData, getBadgeWithVisibleTiers } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(getContentfulLevelData),
			)[0];
			badgeData.level = 7;

			const result = getBadgeWithVisibleTiers(badgeData);

			expect(result.contentfulData.length).toBe(7);
			expect(result.contentfulData[0].level).toBe(1);
			expect(result.contentfulData[1].level).toBe(2);
			expect(result.contentfulData[2].level).toBe(3);
			expect(result.contentfulData[3].level).toBe(4);
			expect(result.contentfulData[4].level).toBe(5);
			expect(result.contentfulData[5].level).toBe(6);
			expect(result.contentfulData[6].level).toBe(7);
			expect(result.achievementData.tiers.length).toBe(7);
			expect(result.achievementData.tiers[0].level).toBe(1);
			expect(result.achievementData.tiers[1].level).toBe(2);
			expect(result.achievementData.tiers[2].level).toBe(3);
			expect(result.achievementData.tiers[3].level).toBe(4);
			expect(result.achievementData.tiers[4].level).toBe(5);
			expect(result.achievementData.tiers[5].level).toBe(6);
			expect(result.achievementData.tiers[6].level).toBe(7);
		});
	});

	describe('isBadgeKeyValid', () => {
		it('should return true for valid women badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid(`social_share_badge_${defaultBadges[0]}`)).toBe(true);
		});
		it('should return true for valid us economic equality badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid(`social_share_badge_${defaultBadges[1]}`)).toBe(true);
		});
		it('should return true for valid climate action badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid(`social_share_badge_${defaultBadges[2]}`)).toBe(true);
		});
		it('should return true for valid refugee equality badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid(`social_share_badge_${defaultBadges[3]}`)).toBe(true);
		});
		it('should return true for valid basic needs badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid(`social_share_badge_${defaultBadges[4]}`)).toBe(true);
		});

		it('should return false for invalid badge key', () => {
			const { isBadgeKeyValid } = useBadgeData();
			expect(isBadgeKeyValid('invalid-key')).toBe(false);
		});
	});
});
