import {
	buildLatestLoanData,
	buildLenderData,
	buildRegionsData,
	buildContentfulData,
	buildAchievementsWithFreshProgress,
	checkAndClearPostLendingCookie,
} from '#src/composables/useMyKivaJourneyData';
import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';

vi.mock('#src/composables/useBadgeData', () => ({
	default: () => ({
		combineBadgeData: vi.fn((achievements, contentful) => [...achievements, ...contentful]),
		getAllCategoryLoanCounts: vi.fn(() => ({ women: 5, climate: 3 })),
	}),
	applyFreshProgressToAchievements: vi.fn(({ achievements }) => achievements),
	getContentfulLevelData: vi.fn(entry => ({ id: entry?.sys?.id, levelName: entry?.fields?.levelName })),
}));

vi.mock('#src/util/myKivaUtils', () => ({
	getRecentTransactionLoans: vi.fn(transactions => transactions?.slice(0, 5) ?? []),
	checkPostLendingCardCookie: vi.fn(),
	removePostLendingCardCookie: vi.fn(),
}));

describe('useMyKivaJourneyData', () => {
	describe('buildLatestLoanData', () => {
		it('returns null when no latestLoan values exist', () => {
			expect(buildLatestLoanData(null)).toBeNull();
			expect(buildLatestLoanData({})).toBeNull();
			expect(buildLatestLoanData({ latestLoan: {} })).toBeNull();
			expect(buildLatestLoanData({ latestLoan: { values: [] } })).toBeNull();
			expect(buildLatestLoanData({ latestLoan: { values: [{}] } })).toBeNull();
		});

		it('builds latestLoan data from single loan transaction', () => {
			const myData = {
				latestLoan: {
					values: [{
						loan: { id: 123, name: 'Test Loan' },
						amount: 25,
					}],
				},
			};

			const result = buildLatestLoanData(myData);

			expect(result).toEqual({
				id: 123,
				name: 'Test Loan',
				amount: 25,
			});
		});

		it('includes otherLoans when multiple loan transactions exist (promo credit split)', () => {
			const myData = {
				latestLoan: {
					values: [
						{ loan: { id: 123, name: 'Loan 1' }, amount: 25 },
						{ loan: { id: 456, name: 'Loan 2' }, amount: 10 },
						{ loan: { id: 789, name: 'Loan 3' }, amount: 5 },
					],
				},
			};

			const result = buildLatestLoanData(myData);

			expect(result.id).toBe(123);
			expect(result.amount).toBe(25);
			expect(result.otherLoans).toHaveLength(2);
			expect(result.otherLoans[0].loan.id).toBe(456);
			expect(result.otherLoans[1].loan.id).toBe(789);
		});
	});

	describe('buildLenderData', () => {
		it('returns empty object structure when myData is null', () => {
			const result = buildLenderData(null);

			expect(result).toEqual({
				public: false,
				inviterName: null,
			});
		});

		it('combines lender data with userAccount fields', () => {
			const myData = {
				lender: {
					id: 123,
					name: 'Test Lender',
					loanCount: 50,
				},
				userAccount: {
					public: true,
					inviterName: 'Referrer Name',
				},
			};

			const result = buildLenderData(myData);

			expect(result).toEqual({
				id: 123,
				name: 'Test Lender',
				loanCount: 50,
				public: true,
				inviterName: 'Referrer Name',
			});
		});

		it('defaults public to false and inviterName to null when userAccount missing', () => {
			const myData = {
				lender: { id: 123 },
			};

			const result = buildLenderData(myData);

			expect(result.public).toBe(false);
			expect(result.inviterName).toBeNull();
		});
	});

	describe('buildRegionsData', () => {
		it('returns empty regionsData when no countryFacets', () => {
			const { regionsData, userLentToAllRegions } = buildRegionsData({});

			expect(regionsData).toEqual([]);
			expect(userLentToAllRegions).toBe(false);
		});

		it('groups countries by region and counts loans', () => {
			const lendingStatsData = {
				lend: {
					countryFacets: [
						{ country: { region: 'Africa', isoCode: 'KE' }, count: 10 },
						{ country: { region: 'Africa', isoCode: 'UG' }, count: 5 },
						{ country: { region: 'Asia', isoCode: 'PH' }, count: 20 },
					],
				},
				my: {
					lendingStats: {
						countriesLentTo: [{ region: 'Africa' }],
					},
				},
			};

			const { regionsData, userLentToAllRegions } = buildRegionsData(lendingStatsData);

			expect(regionsData).toHaveLength(2);

			const africa = regionsData.find(r => r.name === 'Africa');
			expect(africa.count).toBe(15);
			expect(africa.hasLoans).toBe(true);
			expect(africa.countries).toContain('KE');
			expect(africa.countries).toContain('UG');

			const asia = regionsData.find(r => r.name === 'Asia');
			expect(asia.count).toBe(20);
			expect(asia.hasLoans).toBe(false);
			expect(asia.countries).toContain('PH');

			expect(userLentToAllRegions).toBe(false);
		});

		it('returns userLentToAllRegions true when user has lent to all regions', () => {
			const lendingStatsData = {
				lend: {
					countryFacets: [
						{ country: { region: 'Africa', isoCode: 'KE' }, count: 10 },
						{ country: { region: 'Asia', isoCode: 'PH' }, count: 20 },
					],
				},
				my: {
					lendingStats: {
						countriesLentTo: [{ region: 'Africa' }, { region: 'Asia' }],
					},
				},
			};

			const { userLentToAllRegions } = buildRegionsData(lendingStatsData);

			expect(userLentToAllRegions).toBe(true);
		});
	});

	describe('buildContentfulData', () => {
		it('returns empty arrays when no contentful data', () => {
			const { heroSlides, heroBadgeContentfulData } = buildContentfulData(null, null);

			expect(heroSlides).toEqual([]);
			expect(heroBadgeContentfulData).toEqual([]);
		});

		it('extracts heroSlides from slides result', () => {
			const slidesResult = {
				contentful: {
					entries: {
						items: [{
							fields: {
								slides: [
									{ id: 'slide1', title: 'Slide 1' },
									{ id: 'slide2', title: 'Slide 2' },
								],
							},
						}],
					},
				},
			};

			const { heroSlides } = buildContentfulData(slidesResult, null);

			expect(heroSlides).toHaveLength(2);
			expect(heroSlides[0].id).toBe('slide1');
		});

		it('maps contentful challenge entries to level data', () => {
			const contentfulChallengeResult = {
				contentful: {
					entries: {
						items: [
							{ sys: { id: 'badge1' }, fields: { levelName: 'Level 1' } },
							{ sys: { id: 'badge2' }, fields: { levelName: 'Level 2' } },
						],
					},
				},
			};

			const { heroBadgeContentfulData } = buildContentfulData(null, contentfulChallengeResult);

			expect(heroBadgeContentfulData).toHaveLength(2);
			expect(heroBadgeContentfulData[0]).toEqual({ id: 'badge1', levelName: 'Level 1' });
		});
	});

	describe('buildAchievementsWithFreshProgress', () => {
		it('returns empty arrays when no data provided', () => {
			const result = buildAchievementsWithFreshProgress(null, null, []);

			expect(result.heroTieredAchievements).toEqual([]);
			expect(result.currentYearTieredAchievements).toEqual([]);
			expect(result.recentTransactionLoans).toEqual([]);
		});

		it('extracts achievements from query results', () => {
			const lastYearResult = {
				userAchievementProgress: {
					tieredLendingAchievements: [
						{ id: 'women', progress: 5 },
						{ id: 'climate', progress: 3 },
					],
				},
			};

			const currentYearResult = {
				userAchievementProgress: {
					tieredLendingAchievements: [
						{ id: 'education', progress: 10 },
					],
				},
			};

			const transactions = [
				{ loanId: 1 },
				{ loanId: 2 },
			];

			const result = buildAchievementsWithFreshProgress(
				lastYearResult,
				currentYearResult,
				transactions
			);

			expect(result.heroTieredAchievements).toHaveLength(2);
			expect(result.currentYearTieredAchievements).toHaveLength(1);
			expect(result.recentTransactionLoans).toHaveLength(2);
		});
	});

	describe('checkAndClearPostLendingCookie', () => {
		beforeEach(() => {
			vi.clearAllMocks();
		});

		it('returns false and does not remove cookie when cookie not present', () => {
			checkPostLendingCardCookie.mockReturnValue(false);
			const mockCookieStore = {};

			const result = checkAndClearPostLendingCookie(mockCookieStore);

			expect(result).toBe(false);
			expect(removePostLendingCardCookie).not.toHaveBeenCalled();
		});

		it('returns true and removes cookie when cookie is present', () => {
			checkPostLendingCardCookie.mockReturnValue(true);
			const mockCookieStore = {};

			const result = checkAndClearPostLendingCookie(mockCookieStore);

			expect(result).toBe(true);
			expect(removePostLendingCardCookie).toHaveBeenCalledWith(mockCookieStore);
		});
	});
});
