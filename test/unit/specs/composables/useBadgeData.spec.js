/* eslint-disable max-len */
import useBadgeData, {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_EQUITY,
	ID_WORLD_REFUGEE_DAY_24,
	ID_EARTH_DAY_24,
	ID_IWD_24,
	ID_CLIMATE,
	ID_ROAD_3BB,
	ID_2BB,
	FILTERS,
	CATEGORIES,
} from '#src/composables/useBadgeData';
import { defaultBadges } from '#src/util/achievementUtils';
import {
	achievementData,
	contentfulData,
	combinedData,
	badgeNoProgress,
	badgeLastTier,
} from '../../fixtures/useBadgeDataMock';

describe('useBadgeData.js', () => {
	describe('getTierPositions', () => {
		it('should combine data like expected', () => {
			const apolloMock = {
				query: vi.fn()
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
		it('should return the correct badge data for a given tier level with numeric level name', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const badge = {
				id: 'basic-needs',
				challengeName: 'Basic needs',
				contentfulData: [
					{ level: 1, challengeName: 'Basic needs', levelName: '1' },
					{ level: 2, challengeName: 'Basic needs', levelName: '2' },
					{ level: 3, challengeName: 'Basic needs', levelName: '3' }
				],
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
						{ level: 3, completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			};
			const level = 2;

			expect(getTierBadgeDataByLevel(badge, level)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[1],
				achievementData: badge.achievementData.tiers[1],
				tierName: 'Basic needs (level 2)'
			});
		});

		it('should return the correct badge data for a given tier level with string level name', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const badge = {
				id: 'basic-needs',
				challengeName: 'Basic needs',
				contentfulData: [
					{ level: 1, challengeName: 'Basic needs', levelName: '1' },
					{ level: 2, challengeName: 'Basic needs', levelName: '✨50✨' },
					{ level: 3, challengeName: 'Basic needs', levelName: '3' }
				],
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
						{ level: 3, completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			};
			const level = 2;

			expect(getTierBadgeDataByLevel(badge, level)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[1],
				achievementData: badge.achievementData.tiers[1],
				tierName: 'Basic needs (level ✨50✨)'
			});
		});

		it('should return the correct badge data for a tier level with no level name', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const badge = {
				id: 'basic-needs',
				challengeName: 'Basic needs',
				contentfulData: [
					{ level: 1, challengeName: 'Basic needs' },
					{ level: 2, challengeName: 'Basic needs' },
					{ level: 3, challengeName: 'Basic needs' }
				],
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
						{ level: 3, completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			};
			const level = 2;

			expect(getTierBadgeDataByLevel(badge, level)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[1],
				achievementData: badge.achievementData.tiers[1],
				tierName: 'Basic needs'
			});
		});

		it('should return the correct badge data for a tier level with missing contentful data', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const badge = {
				id: 'basic-needs',
				challengeName: 'Basic needs',
				contentfulData: [
					{ level: 1, challengeName: 'Basic needs', levelName: '1' },
					{ level: 2, challengeName: 'Basic needs', levelName: '2' }
				],
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
						{ level: 3, completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			};
			const level = 3;

			expect(getTierBadgeDataByLevel(badge, level)).toEqual({
				...badge,
				contentfulData: undefined,
				achievementData: badge.achievementData.tiers[2],
				tierName: 'Basic needs'
			});
		});

		it('should return the correct badge data for a tier level with no contentful data', () => {
			const { getTierBadgeDataByLevel } = useBadgeData();
			const badge = {
				id: 'basic-needs',
				challengeName: 'Basic needs',
			};
			const level = 3;

			expect(getTierBadgeDataByLevel(badge, level)).toEqual({
				...badge,
				contentfulData: undefined,
				achievementData: undefined,
				tierName: 'Basic needs'
			});
		});
	});

	describe('getLoanFindingUrl', () => {
		const { getLoanFindingUrl } = useBadgeData();

		Object.keys(FILTERS).forEach(badgeId => {
			const categoryPath = `/lend-by-category/${CATEGORIES[badgeId]}`;
			const filterParams = FILTERS[badgeId];
			const filterString = new URLSearchParams(filterParams).toString();
			const filterPath = `/lend/filter?${filterString}`;

			it(`should return undefined if the current route matches the category page for ${badgeId}`, () => {
				const currentRoute = { path: categoryPath };

				const result = getLoanFindingUrl(badgeId, currentRoute);

				expect(result).toBeUndefined();
			});

			it(`should return the correct filtered URL if the current route matches the filter page for ${badgeId}`, () => {
				const currentRoute = {
					path: '/lend/filter',
					query: {},
				};

				const result = getLoanFindingUrl(badgeId, currentRoute);

				expect(result).toBe(filterPath);
			});

			it(`should return the category page URL if the current route does not match the filter or category page for ${badgeId}`, () => {
				const currentRoute = { path: '/some-other-page' };

				const result = getLoanFindingUrl(badgeId, currentRoute);

				expect(result).toBe(categoryPath);
			});

			it(`should handle an empty query object gracefully for ${badgeId}`, () => {
				const currentRoute = {
					path: '/lend/filter',
					query: {},
				};

				const result = getLoanFindingUrl(badgeId, currentRoute);

				expect(result).toBe(filterPath);
			});

			it(`should handle existing query parameters for ${badgeId}`, () => {
				const currentRoute = {
					path: '/lend/filter',
					query: { existingFilter: 'value' },
				};

				const result = getLoanFindingUrl(badgeId, currentRoute);

				const expectedPath = `/lend/filter?existingFilter=value&${filterString}`;
				expect(result).toBe(expectedPath);
			});

			it(`should handle updating query parameters for ${badgeId}`, () => {
				const currentRoute = {
					path: '/lend/filter',
					query: { [Object.keys(filterParams)[0]]: ['value'] },
				};

				const result = getLoanFindingUrl(badgeId, currentRoute);

				const expectedPath = `/lend/filter?${filterString}`;
				expect(result).toBe(expectedPath);
			});
		});
	});

	describe('getBadgeWithVisibleTiers', () => {
		it('should return expected tiers for not started', () => {
			const apolloMock = {
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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
				query: vi.fn()
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

	describe('getLastCompletedBadgeLevelData', () => {
		it('should handle missed data', () => {
			const { getLastCompletedBadgeLevelData } = useBadgeData();

			expect(getLastCompletedBadgeLevelData(undefined)).toEqual({});

			expect(getLastCompletedBadgeLevelData({})).toEqual({});
		});

		it('should return the last completed badge level data when milestoneProgress is available', () => {
			const { getLastCompletedBadgeLevelData } = useBadgeData();
			const badge = {
				achievementData: {
					milestoneProgress: [
						{ earnedAtDate: '2024-10-22T18:49:21Z' }
					]
				},
				contentfulData: [
					{ challengeName: 'Basic needs' }
				]
			};

			expect(getLastCompletedBadgeLevelData(badge)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[0],
				levelName: 'Basic needs'
			});
		});

		it('should return the last completed badge level data when tiers are available', () => {
			const { getLastCompletedBadgeLevelData } = useBadgeData();
			const badge = {
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-23T18:49:21Z' }
					]
				},
				contentfulData: [
					{ challengeName: 'Basic needs', levelName: '1' },
					{ challengeName: 'Basic needs', levelName: '2' }
				]
			};

			expect(getLastCompletedBadgeLevelData(badge)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[1],
				achievementData: badge.achievementData.tiers[1],
				levelName: 'Basic needs (level 2)'
			});
		});

		it('should return the last completed badge level data when tiers have same completed date', () => {
			const { getLastCompletedBadgeLevelData } = useBadgeData();
			const badge = {
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
						{ level: 2, completedDate: '2024-10-22T18:49:21Z' }
					]
				},
				contentfulData: [
					{ challengeName: 'Basic needs', levelName: '1' },
					{ challengeName: 'Basic needs', levelName: '2' }
				]
			};

			expect(getLastCompletedBadgeLevelData(badge)).toEqual({
				...badge,
				contentfulData: badge.contentfulData[1],
				achievementData: badge.achievementData.tiers[1],
				levelName: 'Basic needs (level 2)'
			});
		});

		it('should return an empty object when no milestoneProgress or tiers are available', () => {
			const { getLastCompletedBadgeLevelData } = useBadgeData();
			const badge = {
				achievementData: {},
				contentfulData: []
			};

			expect(getLastCompletedBadgeLevelData(badge)).toEqual({});
		});
	});

	describe('getHighestPriorityDisplayBadge', () => {
		it('should handle undefined', () => {
			const { getHighestPriorityDisplayBadge } = useBadgeData();

			expect(getHighestPriorityDisplayBadge(undefined)).toEqual({});
		});

		it('should return the highest priority badge based on predefined order', () => {
			const { getHighestPriorityDisplayBadge } = useBadgeData();
			const badges = [
				{ id: ID_BASIC_NEEDS, level: 1 },
				{ id: ID_CLIMATE_ACTION, level: 1 },
				{ id: ID_WOMENS_EQUALITY, level: 1 }
			];

			expect(getHighestPriorityDisplayBadge(badges)).toEqual({ id: ID_WOMENS_EQUALITY, level: 1 });
		});

		it('should return an empty object if no badges are provided', () => {
			const { getHighestPriorityDisplayBadge } = useBadgeData();
			const badges = [];

			expect(getHighestPriorityDisplayBadge(badges)).toEqual({});
		});

		it('should return the highest priority badge even if levels are undefined', () => {
			const { getHighestPriorityDisplayBadge } = useBadgeData();
			const badges = [
				{ id: ID_BASIC_NEEDS },
				{ id: ID_CLIMATE_ACTION },
				{ id: ID_WOMENS_EQUALITY }
			];

			expect(getHighestPriorityDisplayBadge(badges)).toEqual({ id: ID_WOMENS_EQUALITY });
		});

		it('should return the highest priority badge based on level', () => {
			const { getHighestPriorityDisplayBadge } = useBadgeData();
			const badges = [
				{ id: ID_BASIC_NEEDS, level: 1 },
				{ id: ID_CLIMATE_ACTION, level: 3 },
				{ id: ID_WOMENS_EQUALITY, level: 2 }
			];

			expect(getHighestPriorityDisplayBadge(badges)).toEqual({ id: ID_CLIMATE_ACTION, level: 3 });
		});
	});

	describe('getCompletedBadges', () => {
		it('should return the completed badges', () => {
			const { getCompletedBadges } = useBadgeData();
			const badges = [
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-10-22T18:49:21Z' }
						]
					},
				},
				{
					achievementData: {
						milestoneProgress: []
					},
				},
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-10-23T18:49:21Z' }
						]
					},
				},
			];

			expect(getCompletedBadges(badges)).toEqual([
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-10-22T18:49:21Z' }
						]
					},
					earnedAtDate: '2024-10-22T18:49:21Z',
					level: 0,
				},
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-10-23T18:49:21Z' }
						]
					},
					earnedAtDate: '2024-10-23T18:49:21Z',
					level: 0,
				}
			]);
		});
		it('should return empty array when not badges', () => {
			const { getCompletedBadges } = useBadgeData();
			expect(getCompletedBadges(null)).toEqual([]);
		});
		it('should return empty array when badges are not well formatted', () => {
			const { getCompletedBadges } = useBadgeData();
			expect(getCompletedBadges([
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: null }
						]
					},
				},
				{
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: undefined }
						]
					},
				}
			])).toEqual([]);
		});
	});

	describe('getLevelName', () => {
		it('should return the challenge name with level name when level name is present', () => {
			const { getLevelName } = useBadgeData();
			const data = {
				challengeName: 'Basic needs',
				levelName: '1'
			};
			expect(getLevelName(data)).toEqual('Basic needs (level 1)');
		});

		it('should return only the challenge name when level name is not present', () => {
			const { getLevelName } = useBadgeData();
			const data = {
				challengeName: 'Basic needs'
			};
			expect(getLevelName(data)).toEqual('Basic needs');
		});

		it('should return an empty string when contentfulData is undefined', () => {
			const { getLevelName } = useBadgeData();
			expect(getLevelName(undefined)).toEqual('');
		});

		it('should return an empty string when contentfulData is null', () => {
			const { getLevelName } = useBadgeData();
			expect(getLevelName(null)).toEqual('');
		});
	});

	describe('getEarnedExplanation', () => {
		const target = 3;
		it('should return expected explanation for us-economic-equality', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_US_ECONOMIC_EQUALITY, target)).toEqual(`for helping ${target} people in the United States or Puerto Rico`);
		});

		it('should return expected explanationfor climate-action', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_CLIMATE_ACTION, target)).toEqual(`for helping ${target} climate stewards with eco-friendly projects`);
		});
		it('should return expected explanation for womens-equality', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_WOMENS_EQUALITY, target)).toEqual(`for helping ${target} women`);
		});

		it('should return expected explanation for refugee-equality', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_REFUGEE_EQUALITY, target)).toEqual(`for helping ${target} refugees or displaced people`);
		});

		it('should return expected explanation for basic-needs', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_BASIC_NEEDS, target)).toEqual(`for helping ${target} people in need of housing, healthcare, clean water or sanitation`);
		});

		it('should return expected explanation for equity', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_EQUITY, target)).toEqual('for helping your first person on kiva');
		});

		it('should return expected explanation for world refugee day', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_WORLD_REFUGEE_DAY_24, target)).toEqual('for helping a refugee on world refugee day');
		});

		it('should return expected explanation for earth day', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_EARTH_DAY_24, target)).toEqual('for contributing to a climate project on earth day');
		});

		it('should return expected explanation for internationa womens day', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_IWD_24, target)).toEqual('for helping a woman on international women’s day');
		});

		it('should return expected explanation for climate change', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_CLIMATE, target)).toEqual('for contributing to 3 eco-friendly projects');
		});

		it('should return expected explanation for 3BB Road', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_ROAD_3BB, target)).toEqual('for helping us kickstart our goal to reach $3b in total impact');
		});

		it('should return expected explanation for 2BB thanks', () => {
			const { getEarnedBadgeExplanation } = useBadgeData();
			expect(getEarnedBadgeExplanation(ID_2BB, target)).toEqual('for helping us reach $2b in total impact');
		});
	});

	describe('getFilteredLoansByJourney', () => {
		it('should return expected filtered loans for us-economic-equality', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					geocode: {
						country: {
							isoCode: 'US'
						}
					}
				},
				{
					id: 2,
					geocode: {
						country: {
							isoCode: 'PR'
						}
					}
				},
				{
					id: 3,
					geocode: {
						country: {
							isoCode: 'PE'
						}
					}
				},
			];
			expect(getFilteredLoansByJourney({ id: ID_US_ECONOMIC_EQUALITY }, loans)).toEqual([
				{
					id: 1,
					geocode: {
						country: {
							isoCode: 'US'
						}
					}
				},
				{
					id: 2,
					geocode: {
						country: {
							isoCode: 'PR'
						}
					}
				}
			]);
		});

		it('should return expected filtered loans for climate-action', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					tags: [
						'Test'
					]
				},
				{
					id: 2,
					tags: [
						'#Eco-friendly'
					]
				},
				{
					id: 3,
					tags: [
						'Agriculture'
					]
				},
				{
					id: 3,
					themes: [
						'Clean Energy'
					]
				}
			];
			expect(getFilteredLoansByJourney({ id: ID_CLIMATE_ACTION }, loans)).toEqual([
				{
					id: 2,
					tags: [
						'#Eco-friendly'
					]
				},
				{
					id: 3,
					themes: [
						'Clean Energy'
					]
				}
			]);
		});

		it('should return expected filtered loans for womens-equality', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					gender: 'female'
				}, {
					id: 2,
					gender: 'male'
				}
			];

			expect(getFilteredLoansByJourney({ id: ID_WOMENS_EQUALITY }, loans)).toEqual([
				{
					id: 1,
					gender: 'female'
				}
			]);
		});

		it('should return expected filtered loans for refugee-equality', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					themes: [
						'Refugees/Displaced'
					]
				},
				{
					id: 2,
					themes: [
						'Education'
					]
				}
			];

			expect(getFilteredLoansByJourney({ id: ID_REFUGEE_EQUALITY }, loans)).toEqual([
				{
					id: 1,
					themes: [
						'Refugees/Displaced'
					]
				}
			]);
		});

		it('should return expected filtered loans for basic-needs', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					sector: {
						id: 6,
					}
				},
				{
					id: 2,
					sector: {
						id: 7,
					}
				},
				{
					id: 3,
					themes: [
						'Water and Sanitation'
					]
				}
			];

			expect(getFilteredLoansByJourney({ id: ID_BASIC_NEEDS }, loans)).toEqual([
				{
					id: 1,
					sector: {
						id: 6,
					}
				},
				{
					id: 3,
					themes: [
						'Water and Sanitation'
					]
				}
			]);
		});

		it('should return an empty array when no loans match a filter', () => {
			const { getFilteredLoansByJourney } = useBadgeData();

			const loans = [
				{
					id: 1,
					gender: 'male',
					geocode: {
						country: {
							isoCode: 'PE'
						}
					},
					sector: {
						id: 2
					},
					themes: [
						'Education'
					],
					tags: [
						'#Agriculture'
					]
				},
			];

			expect(getFilteredLoansByJourney({ id: ID_WOMENS_EQUALITY }, loans)).toEqual([]);
		});
	});

	describe('getBadgeHeadline', () => {
		it('should return expected headline for women-equality', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_WOMENS_EQUALITY)).toEqual('lending to women');
		});
		// Repeat for each badge
		it('should return expected headline for us-economic-equality', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_US_ECONOMIC_EQUALITY)).toEqual('lending to U.S entrepreneurs');
		});
		it('should return expected headline for climate-action', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_CLIMATE_ACTION)).toEqual('supporting climate solutions');
		});
		it('should return expected headline for refugee-equality', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_REFUGEE_EQUALITY)).toEqual('lending to refugees');
		});
		it('should return expected headline for basic-needs', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_BASIC_NEEDS)).toEqual('supporting basic needs');
		});
	});
});
