/* eslint-disable max-len */
import useBadgeData, {
	applyFreshProgressToAchievements,
	calculateFreshProgressAdjustments,
	FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
	getContentfulLevelData,
	getTierCompletionLevel,
	getMissingLoans,
	getJourneysByLoan,
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
	isTieredAchievementComplete,
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

			const { combineBadgeData } = useBadgeData(apolloMock);
			const badgeData = combineBadgeData(
				achievementData.userAchievementProgress.tieredLendingAchievements,
				contentfulData.contentful.entries.items.map(entry => getContentfulLevelData(entry)),
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

	describe('tier completion reconciliation', () => {
		it('should resolve tier completion level from progress when completed dates are stale', () => {
			const achievement = {
				totalProgressToAchievement: 6,
				tiers: [
					{ target: 2, completedDate: null, level: 1 },
					{ target: 5, completedDate: null, level: 2 },
					{ target: 10, completedDate: null, level: 3 }
				]
			};

			expect(getTierCompletionLevel(achievement)).toBe(2);
			expect(isTieredAchievementComplete(achievement)).toBe(false);
		});

		it('should mark tiered achievement complete when total progress reaches final target', () => {
			const achievement = {
				totalProgressToAchievement: 10,
				tiers: [
					{ target: 2, completedDate: null, level: 1 },
					{ target: 5, completedDate: null, level: 2 },
					{ target: 10, completedDate: null, level: 3 }
				]
			};

			expect(getTierCompletionLevel(achievement)).toBe(3);
			expect(isTieredAchievementComplete(achievement)).toBe(true);
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

		it('should return completed badges from tiers', () => {
			const { getCompletedBadges } = useBadgeData();
			const badges = [
				{
					id: 'test-badge',
					challengeName: 'Test Badge',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-01-15T10:00:00Z', target: 1 },
							{ level: 2, completedDate: '2024-02-20T15:30:00Z', target: 5 },
							{ level: 3, completedDate: null, target: 10 }
						]
					}
				}
			];

			const result = getCompletedBadges(badges);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				id: 'test-badge',
				challengeName: 'Test Badge',
				achievementData: {
					tiers: [
						{ level: 1, completedDate: '2024-01-15T10:00:00Z', target: 1 },
						{ level: 2, completedDate: '2024-02-20T15:30:00Z', target: 5 },
						{ level: 3, completedDate: null, target: 10 }
					]
				},
				earnedAtDate: '2024-01-15T10:00:00Z',
				level: 1
			});
			expect(result[1].level).toBe(2);
		});

		it('should combine both tier and milestone badges', () => {
			const { getCompletedBadges } = useBadgeData();
			const badges = [
				{
					id: 'tier-badge',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-01-01T00:00:00Z', target: 1 }
						]
					}
				},
				{
					id: 'milestone-badge',
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-02-01T00:00:00Z' }
						]
					}
				}
			];

			const result = getCompletedBadges(badges);

			// Should have both tier badge and milestone badge
			expect(result).toHaveLength(2);
			expect(result[0].id).toBe('tier-badge');
			expect(result[0].level).toBe(1);
			expect(result[1].id).toBe('milestone-badge');
			expect(result[1].level).toBe(0);
		});
	});

	describe('completedBadges computed', () => {
		it('should return completed badges via the computed property', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			const { completedBadges } = useBadgeData(mockApollo);

			// Computed should be defined and reactive
			expect(completedBadges).toBeDefined();
			expect(completedBadges.value).toBeDefined();
			expect(Array.isArray(completedBadges.value)).toBe(true);
		});

		it('should handle empty badge data gracefully', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({
					data: {
						userAchievementProgress: {
							tieredLendingAchievements: [],
							lendingAchievements: []
						}
					}
				})
			};

			const { completedBadges } = useBadgeData(mockApollo);

			expect(completedBadges.value).toEqual([]);
		});

		it('should access completedBadges as a computed ref', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			const { completedBadges } = useBadgeData(mockApollo);

			expect(completedBadges).toHaveProperty('value');
			expect(Array.isArray(completedBadges.value)).toBe(true);
		});

		it('should call getCompletedBadges internally', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			const { completedBadges, getCompletedBadges } = useBadgeData(mockApollo);

			expect(getCompletedBadges).toBeDefined();
			expect(typeof getCompletedBadges).toBe('function');

			// Test that completedBadges returns array (even if empty)
			expect(completedBadges.value).toEqual([]);
		});

		it('should return sorted completed badges', () => {
			const mockApollo = {
				query: vi.fn().mockResolvedValue({ data: {} })
			};

			const { completedBadges } = useBadgeData(mockApollo);

			const result = completedBadges.value;
			expect(Array.isArray(result)).toBe(true);
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

	describe('getJourneysByLoan', () => {
		it('should return expected journey for us-economic-equality loans', () => {
			const loan = {
				id: 1,
				geocode: {
					country: {
						isoCode: 'US'
					}
				}
			};
			expect(getJourneysByLoan(loan)).toEqual([ID_US_ECONOMIC_EQUALITY]);

			const loan2 = {
				id: 1,
				geocode: {
					country: {
						isoCode: 'PR'
					}
				}
			};
			expect(getJourneysByLoan(loan2)).toEqual([ID_US_ECONOMIC_EQUALITY]);
		});

		it('should return expected journey for climate-action loans', () => {
			const loan = {
				id: 1,
				tags: [
					'#Eco-friendly'
				]
			};
			expect(getJourneysByLoan(loan)).toEqual([ID_CLIMATE_ACTION]);

			const loan2 = {
				id: 2,
				tags: [
					'#Sustainable Ag'
				]
			};
			expect(getJourneysByLoan(loan2)).toEqual([ID_CLIMATE_ACTION]);
		});

		it('should match climate-action with theme-only fallback', () => {
			const loan = {
				id: 1,
				themes: [
					'Clean Energy'
				]
			};

			expect(getJourneysByLoan(loan)).toEqual([ID_CLIMATE_ACTION]);
		});

		it('should return expected journey for womens-equality loan', () => {
			const loan = {
				id: 1,
				gender: 'female'
			};

			expect(getJourneysByLoan(loan)).toEqual([ID_WOMENS_EQUALITY]);
		});

		it('should return expected journey for refugee-equality loan', () => {
			const loan = {
				id: 1,
				themes: [
					'Refugees/Displaced'
				]
			};

			expect(getJourneysByLoan(loan)).toEqual([ID_REFUGEE_EQUALITY]);
		});

		it('should return expected filtered loans for basic-needs', () => {
			const loan = {
				id: 1,
				sector: {
					id: 6,
				}
			};
			expect(getJourneysByLoan(loan)).toEqual([ID_BASIC_NEEDS]);

			const loan2 = {
				id: 1,
				sector: {
					id: 6,
				}
			};
			expect(getJourneysByLoan(loan2)).toEqual([ID_BASIC_NEEDS]);
		});

		it('should match basic-needs with theme-only fallback', () => {
			const loan = {
				id: 3,
				themes: [
					'Water and Sanitation'
				]
			};
			expect(getJourneysByLoan(loan)).toEqual([ID_BASIC_NEEDS]);
		});

		it('should return an empty array when no match a filter', () => {
			const loan = {
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
			};

			expect(getJourneysByLoan(loan)).toEqual([]);
		});
	});

	describe('getBadgeHeadline', () => {
		it('should return expected headline for women-equality', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_WOMENS_EQUALITY)).toEqual('lending to women');
		});
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

		it('should return expected headline for default cases', () => {
			const { getTierBadgeHeadline } = useBadgeData();
			expect(getTierBadgeHeadline(ID_EQUITY)).toEqual('lending');
		});
	});

	describe('getAllCategoryLoanCounts', () => {
		it('should return an object with all category loan counts initialized to zero', () => {
			const { getAllCategoryLoanCounts } = useBadgeData();
			const expected = {
				[ID_WOMENS_EQUALITY]: 0,
				[ID_US_ECONOMIC_EQUALITY]: 0,
				[ID_CLIMATE_ACTION]: 0,
				[ID_REFUGEE_EQUALITY]: 0,
				[ID_BASIC_NEEDS]: 0
			};
			expect(getAllCategoryLoanCounts()).toEqual(expected);
		});

		it('should return an object with all category loan counts when categories are added', () => {
			const { getAllCategoryLoanCounts } = useBadgeData();
			const tieredLendingAchievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 2,
				},
				{
					id: ID_US_ECONOMIC_EQUALITY,
					totalProgressToAchievement: 0,
				},
				{
					id: ID_CLIMATE_ACTION,
					totalProgressToAchievement: 3,
				},
				{
					id: ID_REFUGEE_EQUALITY,
					totalProgressToAchievement: 0,
				},
				{
					id: ID_BASIC_NEEDS,
					totalProgressToAchievement: 1,
				}
			];

			const expected = {
				[ID_WOMENS_EQUALITY]: 2,
				[ID_US_ECONOMIC_EQUALITY]: 0,
				[ID_CLIMATE_ACTION]: 3,
				[ID_REFUGEE_EQUALITY]: 0,
				[ID_BASIC_NEEDS]: 1
			};
			expect(getAllCategoryLoanCounts(tieredLendingAchievements)).toEqual(expected);
		});
	});

	describe('allAchievementsCompleted', () => {
		const { allAchievementsCompleted } = useBadgeData();

		it('should return false if badges is undefined or empty', () => {
			expect(allAchievementsCompleted(undefined)).toBe(false);
			expect(allAchievementsCompleted([])).toBe(false);
		});

		it('should return true if all tiers in all badges are completed', () => {
			const badges = [
				{
					tiers: [
						{ completedDate: '2024-10-22T18:49:21Z' },
						{ completedDate: '2024-10-23T18:49:21Z' }
					]
				},
				{
					tiers: [
						{ completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			];
			expect(allAchievementsCompleted(badges)).toBe(true);
		});

		it('should return false if any tier in any badge is not completed', () => {
			const badges = [
				{
					tiers: [
						{ completedDate: '2024-10-22T18:49:21Z' },
						{ completedDate: null }
					]
				},
				{
					tiers: [
						{ completedDate: '2024-10-24T18:49:21Z' }
					]
				}
			];
			expect(allAchievementsCompleted(badges)).toBe(false);
		});

		it('should return true if badges have empty tiers array', () => {
			const badges = [
				{
					tiers: []
				}
			];
			// Empty tiers array passes .every() check, returning true
			expect(allAchievementsCompleted(badges)).toBe(true);
		});

		it('should filter out badges without tiers array', () => {
			const badges = [
				{
					tiers: [
						{ completedDate: '2024-10-22T18:49:21Z' }
					]
				},
				{
					// No tiers property
				}
			];
			expect(allAchievementsCompleted(badges)).toBe(true);
		});
	});

	describe('fetchAchievementData', () => {
		it('should fetch achievement data and set badgeAchievementData', async () => {
			const mockAchievementData = {
				userAchievementProgress: {
					lendingAchievements: [{ id: 'achievement1' }],
					tieredLendingAchievements: [{ id: 'achievement2' }]
				}
			};

			const apolloMock = {
				query: vi.fn().mockResolvedValue({ data: mockAchievementData })
			};

			const { fetchAchievementData, badgeAchievementData } = useBadgeData();

			await fetchAchievementData(apolloMock);

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { publicId: null },
				fetchPolicy: 'network-only'
			});

			await vi.waitFor(() => {
				expect(badgeAchievementData.value).toEqual([
					{ id: 'achievement1' },
					{ id: 'achievement2' }
				]);
			});
		});

		it('should fetch achievement data with publicId when provided', async () => {
			const mockAchievementData = {
				userAchievementProgress: {
					lendingAchievements: [],
					tieredLendingAchievements: []
				}
			};

			const apolloMock = {
				query: vi.fn().mockResolvedValue({ data: mockAchievementData })
			};

			const { fetchAchievementData } = useBadgeData();

			await fetchAchievementData(apolloMock, 'user123');

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { publicId: 'user123' },
				fetchPolicy: 'network-only'
			});
		});

		it('should pass loanPurchasesLimit when provided', async () => {
			const apolloMock = {
				query: vi.fn().mockResolvedValue({
					data: {
						userAchievementProgress: {
							lendingAchievements: [],
							tieredLendingAchievements: []
						}
					}
				})
			};

			const { fetchAchievementData } = useBadgeData();

			await fetchAchievementData(apolloMock, null, 20);

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: { publicId: null, loanPurchasesLimit: 20 },
				fetchPolicy: 'network-only'
			});
		});

		it('should handle errors when fetching achievement data', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
			const apolloMock = {
				query: vi.fn().mockRejectedValue(new Error('Network error'))
			};

			const { fetchAchievementData, badgeAchievementData } = useBadgeData();

			await fetchAchievementData(apolloMock);

			expect(badgeAchievementData.value).toBeUndefined();

			consoleErrorSpy.mockRestore();
		});
	});

	describe('fetchContentfulData', () => {
		it('should fetch contentful data and set badgeContentfulData', async () => {
			const mockContentfulData = {
				contentful: {
					entries: {
						items: [
							{
								fields: {
									key: 'basic-needs-level-1',
									levelName: '1',
									challengeName: 'Basic needs',
									badgeImage: {
										fields: {
											file: {
												url: '//images.ctfassets.net/test.svg'
											}
										}
									},
									shareFact: 'Test fact',
									shareFactFootnote: 'Test footnote',
									shareFactUrl: 'https://test.com'
								}
							}
						]
					}
				}
			};

			const apolloMock = {
				query: vi.fn().mockResolvedValue({ data: mockContentfulData })
			};

			const { fetchContentfulData, badgeContentfulData } = useBadgeData();

			await fetchContentfulData(apolloMock);

			expect(apolloMock.query).toHaveBeenCalledWith({
				query: expect.anything(),
				variables: {
					contentType: 'challenge',
					limit: 200
				}
			});

			await vi.waitFor(() => {
				expect(badgeContentfulData.value).toEqual([
					{
						id: 'basic-needs',
						level: 1,
						levelName: '1',
						challengeName: 'Basic needs',
						imageUrl: '//images.ctfassets.net/test.svg',
						shareFact: 'Test fact',
						shareFactFootnote: 'Test footnote',
						shareFactUrl: 'https://test.com'
					}
				]);
			});
		});

		it('should handle errors when fetching contentful data', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
			const apolloMock = {
				query: vi.fn().mockRejectedValue(new Error('Network error'))
			};

			const { fetchContentfulData, badgeContentfulData } = useBadgeData();

			await fetchContentfulData(apolloMock);

			expect(badgeContentfulData.value).toBeUndefined();

			consoleErrorSpy.mockRestore();
		});
	});

	describe('getContentfulLevelData', () => {
		it('should parse id by stripping the level suffix from the key', () => {
			const result = getContentfulLevelData({ fields: { key: 'womens-equality-level-3' } });
			expect(result.id).toBe('womens-equality');
			expect(result.level).toBe(3);
		});

		it('should extract all fields from a full contentful entry', () => {
			const entry = {
				fields: {
					key: 'climate-action-level-1',
					levelName: '1',
					challengeName: 'Climate Action',
					badgeImage: { fields: { file: { url: '/climate.svg' } } },
					shareFact: 'A fact',
					shareFactFootnote: 'A footnote',
					shareFactUrl: 'https://example.com',
				}
			};
			expect(getContentfulLevelData(entry)).toEqual({
				id: 'climate-action',
				level: 1,
				levelName: '1',
				challengeName: 'Climate Action',
				imageUrl: '/climate.svg',
				shareFact: 'A fact',
				shareFactFootnote: 'A footnote',
				shareFactUrl: 'https://example.com',
			});
		});

		it('should default all fields when entry is undefined', () => {
			expect(getContentfulLevelData(undefined)).toEqual({
				id: '',
				level: 0,
				levelName: '',
				challengeName: '',
				imageUrl: '',
				shareFact: '',
				shareFactFootnote: '',
				shareFactUrl: '',
			});
		});
	});

	describe('getLevelCaption', () => {
		const { getLevelCaption } = useBadgeData();

		it('should return "One" for level 1', () => {
			expect(getLevelCaption({ level: 1 })).toBe('One');
		});

		it('should return "Two" for level 2', () => {
			expect(getLevelCaption({ level: 2 })).toBe('Two');
		});

		it('should return "Three" for level 3', () => {
			expect(getLevelCaption({ level: 3 })).toBe('Three');
		});

		it('should return "Four" for level 4', () => {
			expect(getLevelCaption({ level: 4 })).toBe('Four');
		});

		it('should return "Five" for level 5', () => {
			expect(getLevelCaption({ level: 5 })).toBe('Five');
		});

		it('should return "Six" for level 6', () => {
			expect(getLevelCaption({ level: 6 })).toBe('Six');
		});

		it('should return "Seven" for level 7', () => {
			expect(getLevelCaption({ level: 7 })).toBe('Seven');
		});

		it('should return "Eight" for level 8', () => {
			expect(getLevelCaption({ level: 8 })).toBe('Eight');
		});

		it('should return "Nine" for level 9', () => {
			expect(getLevelCaption({ level: 9 })).toBe('Nine');
		});

		it('should return "Ten" for level 10', () => {
			expect(getLevelCaption({ level: 10 })).toBe('Ten');
		});

		it('should return the numeric level for levels beyond 10', () => {
			expect(getLevelCaption({ level: 11 })).toBe(11);
			expect(getLevelCaption({ level: 100 })).toBe(100);
		});

		it('should return undefined for missing level', () => {
			expect(getLevelCaption({})).toBeUndefined();
		});
	});

	describe('getCompletedBadges with tiers', () => {
		it('should return completed badges with tier data', () => {
			const { getCompletedBadges } = useBadgeData();
			const badges = [
				{
					id: 'badge1',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
							{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
							{ level: 3, completedDate: null }
						]
					}
				}
			];

			expect(getCompletedBadges(badges)).toEqual([
				{
					id: 'badge1',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
							{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
							{ level: 3, completedDate: null }
						]
					},
					earnedAtDate: '2024-10-22T18:49:21Z',
					level: 1
				},
				{
					id: 'badge1',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-10-22T18:49:21Z' },
							{ level: 2, completedDate: '2024-10-23T18:49:21Z' },
							{ level: 3, completedDate: null }
						]
					},
					earnedAtDate: '2024-10-23T18:49:21Z',
					level: 2
				}
			]);
		});

		it('should handle mixed badges with tiers and milestoneProgress', () => {
			const { getCompletedBadges } = useBadgeData();
			const badges = [
				{
					id: 'badge1',
					achievementData: {
						tiers: [
							{ level: 1, completedDate: '2024-10-22T18:49:21Z' }
						]
					}
				},
				{
					id: 'badge2',
					achievementData: {
						milestoneProgress: [
							{ earnedAtDate: '2024-10-23T18:49:21Z' }
						]
					}
				}
			];

			const result = getCompletedBadges(badges);
			expect(result).toHaveLength(2);
			expect(result[0].level).toBe(1);
			expect(result[1].level).toBe(0);
		});
	});

	describe('combineBadgeData', () => {
		it('should return empty array when achievement data is empty', () => {
			const { combineBadgeData } = useBadgeData();
			expect(combineBadgeData([], [{ id: 'test' }])).toEqual([]);
		});

		it('should return empty array when contentful data is empty', () => {
			const { combineBadgeData } = useBadgeData();
			expect(combineBadgeData([{ id: 'test' }], [])).toEqual([]);
		});

		it('should handle UTC date formatting in milestone progress', () => {
			const { combineBadgeData } = useBadgeData();
			const mockAchievementData = [{
				id: 'test',
				description: 'Test badge',
				totalProgressToAchievement: 1,
				tiers: [],
				milestoneProgress: [
					{ earnedAtDate: '2024-10-22T18:49:21Z[UTC]' }
				]
			}];
			const mockContentfulData = [{
				id: 'test',
				level: 1,
				challengeName: 'Test',
				levelName: '1'
			}];

			const result = combineBadgeData(mockAchievementData, mockContentfulData);
			expect(result[0].achievementData.milestoneProgress[0].earnedAtDate).toBe('2024-10-22T18:49:21Z');
		});

		it('should handle UTC date formatting in tier completed dates', () => {
			const { combineBadgeData } = useBadgeData();
			const mockAchievementData = [{
				id: 'test',
				description: 'Test badge',
				totalProgressToAchievement: 1,
				tiers: [
					{ target: 1, completedDate: '2024-10-22T18:49:21Z[UTC]' }
				]
			}];
			const mockContentfulData = [{
				id: 'test',
				level: 1,
				challengeName: 'Test',
				levelName: '1'
			}];

			const result = combineBadgeData(mockAchievementData, mockContentfulData);
			expect(result[0].achievementData.tiers[0].completedDate).toBe('2024-10-22T18:49:21Z');
		});
	});

	describe('combineBadgeData edge cases', () => {
		const { combineBadgeData } = useBadgeData();

		it('should return empty array when achievement data is empty', () => {
			const allContentfulData = [
				{ id: 'test-badge', challengeName: 'Test' }
			];
			expect(combineBadgeData([], allContentfulData)).toEqual([]);
		});

		it('should return empty array when contentful data is empty', () => {
			const allAchievementData = [
				{ id: 'test-badge', tiers: [] }
			];
			expect(combineBadgeData(allAchievementData, [])).toEqual([]);
		});

		it('should skip badges missing contentful data', () => {
			const allAchievementData = [
				{ id: 'badge-1', tiers: [{ target: 10 }] },
				{ id: 'badge-2', tiers: [{ target: 20 }] }
			];
			const allContentfulData = [
				{ id: 'badge-1', level: 1, challengeName: 'Badge 1' }
			];
			const result = combineBadgeData(allAchievementData, allContentfulData);
			expect(result.length).toBe(1);
			expect(result[0].id).toBe('badge-1');
		});

		it('should handle badges with milestoneProgress and strip [UTC] from dates', () => {
			const allAchievementData = [
				{
					id: 'test-badge',
					tiers: [{ level: 1, target: 10, completedDate: '2024-10-22T18:49:21Z[UTC]' }],
					milestoneProgress: [
						{ id: 1, earnedAtDate: '2024-10-22T18:49:21Z[UTC]' }
					],
					totalProgressToAchievement: 10
				}
			];
			const allContentfulData = [
				{ id: 'test-badge', level: 1, challengeName: 'Test Badge' }
			];
			const result = combineBadgeData(allAchievementData, allContentfulData);
			expect(result[0].achievementData.milestoneProgress[0].earnedAtDate).toBe('2024-10-22T18:49:21Z');
			expect(result[0].achievementData.tiers[0].completedDate).toBe('2024-10-22T18:49:21Z');
		});

		it('should handle badges with no hasStarted progress', () => {
			const allAchievementData = [
				{
					id: 'test-badge',
					tiers: [{ level: 1, target: 10, completedDate: null }],
					totalProgressToAchievement: 0
				}
			];
			const allContentfulData = [
				{ id: 'test-badge', level: 1, challengeName: 'Test Badge' }
			];
			const result = combineBadgeData(allAchievementData, allContentfulData);
			expect(result[0].hasStarted).toBe(false);
			expect(result[0].level).toBeUndefined();
		});
	});

	describe('getMissingLoans', () => {
		it('should return empty array when loans array is empty', () => {
			const result = getMissingLoans([], [{ id: 'achievement-1' }]);

			expect(result).toEqual([]);
		});

		it('should return empty array when tieredAchievements array is empty', () => {
			const result = getMissingLoans([{ id: 1 }], []);

			expect(result).toEqual([]);
		});

		it('should return empty array when all loans are already in achievement service', () => {
			const loans = [{ id: 1 }, { id: 2 }];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: [{ loan: { id: 1 } }, { loan: { id: 2 } }]
			}];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toEqual([]);
		});

		it('should return loans that are missing from achievement service', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: 2, gender: 'female' },
				{ id: 3, gender: 'male' }
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: [{ loan: { id: 1 } }]
			}];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(2);
			expect(result).toContainEqual({ id: 2, gender: 'female' });
			expect(result).toContainEqual({ id: 3, gender: 'male' });
		});

		it('should handle multiple achievements with different loan purchases', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: 2, gender: 'female' },
				{ id: 3, geocode: { country: { isoCode: 'US' } } }
			];
			const tieredAchievements = [
				{
					id: 'womens-equality',
					loanPurchases: [{ loan: { id: 1 } }]
				},
				{
					id: 'us-economic-equality',
					loanPurchases: [{ loan: { id: 3 } }]
				}
			];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(1);
			expect(result).toContainEqual({ id: 2, gender: 'female' });
		});

		it('should filter out loans without valid IDs', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: null, gender: 'female' },
				{ gender: 'male' }
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: []
			}];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(1);
		});

		it('should handle achievements with empty loanPurchases', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: 2, gender: 'female' }
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: []
			}];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(2);
		});

		it('should handle achievements with null or undefined loanPurchases', () => {
			const loans = [{ id: 1, gender: 'female' }];
			const tieredAchievements = [
				{ id: 'womens-equality', loanPurchases: null },
				{ id: 'us-economic-equality' }
			];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(1);
			expect(result[0].id).toBe(1);
		});

		it('should de-duplicate repeated loans by ID', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: 1, gender: 'female' },
				{ id: 2, gender: 'female' }
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: []
			}];

			const result = getMissingLoans(loans, tieredAchievements);

			expect(result).toHaveLength(2);
			expect(result).toContainEqual({ id: 1, gender: 'female' });
			expect(result).toContainEqual({ id: 2, gender: 'female' });
		});
	});

	describe('calculateFreshProgressAdjustments', () => {
		it('should return empty object when loans array is empty', () => {
			const result = calculateFreshProgressAdjustments([], [{ id: 'achievement-1' }]);

			expect(result).toEqual({});
		});

		it('should return empty object when tieredAchievements array is empty', () => {
			const result = calculateFreshProgressAdjustments([{ id: 1 }], []);

			expect(result).toEqual({});
		});

		it('should return empty object when all loans are already in achievement service', () => {
			const loans = [{ id: 1 }, { id: 2 }];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: [{ loan: { id: 1 } }, { loan: { id: 2 } }]
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result).toEqual({});
		});

		it('should calculate adjustments for missing loans that match womens-equality', () => {
			const loans = [
				{ id: 1, gender: 'female' },
				{ id: 2, gender: 'female' }
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: [{ loan: { id: 1 } }]
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['womens-equality']).toBe(1);
		});

		it('should calculate adjustments for missing loans that match us-economic-equality', () => {
			const loans = [
				{ id: 1, geocode: { country: { isoCode: 'US' } } },
				{ id: 2, geocode: { country: { isoCode: 'PR' } } }
			];
			const tieredAchievements = [{
				id: 'us-economic-equality',
				loanPurchases: []
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['us-economic-equality']).toBe(2);
		});

		it('should calculate adjustments for loans matching multiple categories', () => {
			const loans = [
				{
					id: 1,
					gender: 'female',
					geocode: { country: { isoCode: 'US' } }
				}
			];
			const tieredAchievements = [{
				id: 'womens-equality',
				loanPurchases: []
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['womens-equality']).toBe(1);
			expect(result['us-economic-equality']).toBe(1);
		});

		it('should handle loans with refugee theme', () => {
			const loans = [
				{ id: 1, themes: ['Refugees/Displaced'] }
			];
			const tieredAchievements = [{
				id: 'refugee-equality',
				loanPurchases: []
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['refugee-equality']).toBe(1);
		});

		it('should handle loans with basic needs sector', () => {
			const loans = [
				{ id: 1, sector: { id: 6 } }, // Health sector
				{ id: 2, sector: { id: 10 } } // Food sector
			];
			const tieredAchievements = [{
				id: 'basic-needs',
				loanPurchases: []
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['basic-needs']).toBe(2);
		});

		it('should handle loans with climate action tags', () => {
			const loans = [
				{ id: 1, tags: ['#Eco-friendly'] },
				{ id: 2, tags: ['#Sustainable Ag'] }
			];
			const tieredAchievements = [{
				id: 'climate-action',
				loanPurchases: []
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result['climate-action']).toBe(2);
		});

		it('should treat loan IDs with different primitive types as the same loan', () => {
			const loans = [{ id: '101', gender: 'female' }];
			const tieredAchievements = [{
				id: ID_WOMENS_EQUALITY,
				loanPurchases: [{ loan: { id: 101, gender: 'female' } }]
			}];

			const result = calculateFreshProgressAdjustments(loans, tieredAchievements);

			expect(result).toEqual({});
		});
	});

	describe('applyFreshProgressToAchievements', () => {
		it('calculates adjustments from achievements snapshot and fresh loans', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 4,
					loanPurchases: [{ loan: { id: 1, gender: 'female' } }]
				}
			];

			const result = applyFreshProgressToAchievements({
				achievements,
				// Loan already exists in achievement service snapshot.
				freshProgressLoans: [{ id: 1, gender: 'female' }],
			});

			expect(result[0].totalProgressToAchievement).toBe(4);
			expect(result[0].loanPurchases.map(purchase => purchase.loan.id)).toEqual([1]);
		});

		it('returns no effective adjustments when no fresh loans exist', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 4,
					loanPurchases: []
				}
			];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans: [],
			});

			expect(result[0].totalProgressToAchievement).toBe(4);
		});
	});

	describe('applyFreshProgressToAchievements loan purchase merging', () => {
		it('should apply total progress adjustments and merge fresh loan purchases without duplicates', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 5,
					loanPurchases: [{ loan: { id: 10, gender: 'female' } }]
				}
			];
			const freshProgressLoans = [
				{ id: 20, gender: 'female' },
				{ id: 10, gender: 'female' },
			];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result[0].totalProgressToAchievement).toBe(6);
			expect(result[0].loanPurchases.map(purchase => purchase.loan.id)).toEqual([20, 10]);
		});

		it('should prepend fresh loans without capping the merged array', () => {
			const existingLoanPurchases = Array.from({ length: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT }, (_, index) => ({
				loan: { id: index + 1, gender: 'female' }
			}));
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
					loanPurchases: existingLoanPurchases
				}
			];
			const freshProgressLoans = [{ id: 999, gender: 'female' }];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result[0].loanPurchases).toHaveLength(FRESH_PROGRESS_LOAN_PURCHASE_LIMIT + 1);
			expect(result[0].loanPurchases[0].loan.id).toBe(999);
		});

		it('should avoid duplicate merged loans when fresh and existing loan IDs differ only by type', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 1,
					loanPurchases: [{ loan: { id: 10, gender: 'female' } }]
				}
			];
			const freshProgressLoans = [{ id: '10', gender: 'female' }];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result[0].loanPurchases).toHaveLength(1);
			expect(result[0].loanPurchases[0].loan.id).toBe(10);
		});

		it('keeps progress and loanPurchases aligned when loan already exists in another journey', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 5,
					loanPurchases: [{ loan: { id: 10, gender: 'female' } }]
				},
				{
					id: ID_US_ECONOMIC_EQUALITY,
					totalProgressToAchievement: 2,
					loanPurchases: []
				}
			];
			const freshProgressLoans = [{
				id: 10,
				gender: 'female',
				geocode: { country: { isoCode: 'US' } }
			}];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});
			const womensAchievement = result.find(a => a.id === ID_WOMENS_EQUALITY);
			const usAchievement = result.find(a => a.id === ID_US_ECONOMIC_EQUALITY);

			expect(womensAchievement.totalProgressToAchievement).toBe(5);
			expect(womensAchievement.loanPurchases.map(purchase => purchase.loan.id)).toEqual([10]);
			expect(usAchievement.totalProgressToAchievement).toBe(2);
			expect(usAchievement.loanPurchases).toEqual([]);
		});

		it('should adjust progress and loanPurchases for a fresh loan matching multiple categories', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 3,
					loanPurchases: [],
					tiers: [{ target: 5, completedDate: null }]
				},
				{
					id: ID_US_ECONOMIC_EQUALITY,
					totalProgressToAchievement: 1,
					loanPurchases: [],
					tiers: [{ target: 5, completedDate: null }]
				}
			];
			const freshProgressLoans = [{
				id: 50,
				gender: 'female',
				geocode: { country: { isoCode: 'US' } }
			}];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});
			const womensAchievement = result.find(a => a.id === ID_WOMENS_EQUALITY);
			const usAchievement = result.find(a => a.id === ID_US_ECONOMIC_EQUALITY);

			expect(womensAchievement.totalProgressToAchievement).toBe(4);
			expect(womensAchievement.loanPurchases).toHaveLength(1);
			expect(womensAchievement.loanPurchases[0].loan.id).toBe(50);

			expect(usAchievement.totalProgressToAchievement).toBe(2);
			expect(usAchievement.loanPurchases).toHaveLength(1);
			expect(usAchievement.loanPurchases[0].loan.id).toBe(50);
		});

		it('should pass through non-tiered achievements unchanged', () => {
			const achievements = [
				{
					id: 'equity',
					description: 'First loan',
					milestoneProgress: [{ earnedAtDate: '2024-01-01T00:00:00Z' }]
				},
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 2,
					loanPurchases: [],
					tiers: [{ target: 5, completedDate: null }]
				}
			];
			const freshProgressLoans = [{ id: 99, gender: 'female' }];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result).toHaveLength(2);
			expect(result[0].id).toBe('equity');
			expect(result[0].totalProgressToAchievement).toBeUndefined();
			expect(result[0].milestoneProgress).toEqual([{ earnedAtDate: '2024-01-01T00:00:00Z' }]);
			expect(result[1].totalProgressToAchievement).toBe(3);
		});

		it('should be idempotent when called with its own output', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 5,
					loanPurchases: [],
					tiers: [{ target: 10, completedDate: null }]
				}
			];
			const freshProgressLoans = [{ id: 77, gender: 'female' }];

			const firstResult = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(firstResult[0].totalProgressToAchievement).toBe(6);
			expect(firstResult[0].loanPurchases).toHaveLength(1);

			const secondResult = applyFreshProgressToAchievements({
				achievements: firstResult,
				freshProgressLoans,
			});

			expect(secondResult[0].totalProgressToAchievement).toBe(6);
			expect(secondResult[0].loanPurchases).toHaveLength(1);
		});

		it('should not mutate original achievement objects', () => {
			const originalAchievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 5,
					loanPurchases: [{ loan: { id: 1, gender: 'female' } }],
					tiers: [{ target: 10, completedDate: null }]
				}
			];
			const freshProgressLoans = [{ id: 88, gender: 'female' }];

			const result = applyFreshProgressToAchievements({
				achievements: originalAchievements,
				freshProgressLoans,
			});

			expect(originalAchievements[0].totalProgressToAchievement).toBe(5);
			expect(originalAchievements[0].loanPurchases).toHaveLength(1);
			expect(originalAchievements[0].tiers[0].completedDate).toBeNull();
			expect(result[0].totalProgressToAchievement).toBe(6);
			expect(result[0].loanPurchases).toHaveLength(2);
		});

		it('should adjust progress from 0 when fresh loans are provided', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 0,
					loanPurchases: [],
					tiers: [{ target: 5, completedDate: null }]
				}
			];
			const freshProgressLoans = [{ id: 1, gender: 'female' }];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result[0].totalProgressToAchievement).toBe(1);
			expect(result[0].loanPurchases).toHaveLength(1);
		});

		it('should skip fresh loans that match no categories', () => {
			const achievements = [
				{
					id: ID_WOMENS_EQUALITY,
					totalProgressToAchievement: 3,
					loanPurchases: [],
					tiers: [{ target: 5, completedDate: null }]
				}
			];
			const freshProgressLoans = [{
				id: 42,
				gender: 'male',
				geocode: { country: { isoCode: 'PE' } },
				sector: { id: 2 }
			}];

			const result = applyFreshProgressToAchievements({
				achievements,
				freshProgressLoans,
			});

			expect(result[0].totalProgressToAchievement).toBe(3);
			expect(result[0].loanPurchases).toHaveLength(0);
		});

		it('should return empty array when achievements is empty', () => {
			const result = applyFreshProgressToAchievements({
				achievements: [],
				freshProgressLoans: [{ id: 1, gender: 'female' }],
			});

			expect(result).toEqual([]);
		});

		it('should return empty array when called with no arguments', () => {
			expect(applyFreshProgressToAchievements()).toEqual([]);
		});
	});
});
