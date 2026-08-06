import {
	getCategoryName,
	getGoalLoans,
	mergeRecapExtras,
	getIsEligible,
	getLoanStats,
	scopeToGoalYear,
} from '#src/util/goalInReviewPayload';

const climateAchievements = [{
	id: 'climate-action',
	progressForYear: 100,
	loanPurchases: [
		{ purchaseTime: '2026-02-01T00:00:00Z', loan: { id: 1, name: 'Before the goal' } },
		{ purchaseTime: '2026-10-05T00:00:00Z', loan: { id: 2, name: 'Siti' } },
		{ purchaseTime: '2026-11-20T00:00:00Z', loan: { id: 3, name: 'Aminata' } },
	],
}];

const climateGoal = { category: 'climate-action', dateStarted: '2026-10-01', target: 4 };

describe('goalInReviewPayload.js', () => {
	describe('getGoalLoans', () => {
		const achievements = [
			{ id: 'climate-action', loanPurchases: [{ loan: { id: 9, name: 'Wrong goal' } }] },
			{
				id: 'womens-equality',
				loanPurchases: [{ loan: { id: 1, name: 'Aminata' } }, { loan: { id: 2, name: 'Siti' } }],
			},
		];

		it('reads the goal summary loans for support-all goals', () => {
			const loans = [{ id: 1, name: 'Aminata' }];
			expect(getGoalLoans({ category: 'support-all', loans }, achievements)).toBe(loans);
		});

		it('reads the matching achievement for category goals', () => {
			const loans = getGoalLoans({ category: 'womens-equality' }, achievements);
			expect(loans.map(loan => loan.name)).toEqual(['Aminata', 'Siti']);
		});

		it('shows exactly as many loans as the count claims, never more', () => {
			// progressForYear (100) capped at the target of 2
			const scoped = scopeToGoalYear({ ...climateGoal, target: 2 }, climateAchievements);
			expect(scoped.count).toBe(2);
			expect(getGoalLoans(scoped, climateAchievements)).toHaveLength(2);
		});

		it('does not pad the grid up to the target when fewer loans qualify', () => {
			const oneLoan = [{ id: 'climate-action', progressForYear: 1, loanPurchases: [{ loan: { id: 1 } }] }];
			const scoped = scopeToGoalYear({ ...climateGoal, target: 4 }, oneLoan);
			expect(getGoalLoans(scoped, oneLoan)).toHaveLength(1);
		});

		it('returns an empty list when no achievement matches the category', () => {
			expect(getGoalLoans({ category: 'basic-needs' }, achievements)).toEqual([]);
		});

		it('drops purchases with no loan', () => {
			const sparse = [{ id: 'basic-needs', loanPurchases: [{ loan: null }, {}, { loan: { id: 3 } }] }];
			expect(getGoalLoans({ category: 'basic-needs' }, sparse)).toEqual([{ id: 3 }]);
		});

		it('degrades to an empty list without a summary or achievements', () => {
			expect(getGoalLoans(null)).toEqual([]);
			expect(getGoalLoans({ category: 'support-all' })).toEqual([]);
		});
	});

	describe('getCategoryName', () => {
		const entries = [
			{ fields: { key: 'climate-action-level-1', challengeName: 'Climate Action' } },
			{ fields: { key: 'womens-equality-level-2', challengeName: "Women's Equality" } },
		];

		it('reads the written name from the Contentful challenge entries', () => {
			expect(getCategoryName('womens-equality', entries)).toBe("Women's Equality");
		});

		it('matches on the badge id regardless of the entry level', () => {
			expect(getCategoryName('climate-action', entries)).toBe('Climate Action');
		});

		it('falls back to the badge id when Contentful has no match', () => {
			expect(getCategoryName('basic-needs', entries)).toBe('basic-needs');
			expect(getCategoryName('basic-needs')).toBe('basic-needs');
		});

		it('returns an empty string without a category', () => {
			expect(getCategoryName(null, entries)).toBe('');
		});
	});

	describe('mergeRecapExtras', () => {
		it('fills the amount from the monolith for support-all, whose window is the goal', () => {
			const merged = mergeRecapExtras({ category: 'support-all', amount: null }, { amount: 275 });
			expect(merged.amount).toBe(275);
		});

		it('ignores the monolith amount for category goals, which it does not filter by category', () => {
			const merged = mergeRecapExtras({ category: 'climate-action', amount: null }, { amount: 9999 });
			expect(merged.amount).toBeNull();
		});

		it('keeps the summary amount when it already has one', () => {
			const merged = mergeRecapExtras({ category: 'support-all', amount: 1025 }, { amount: 999 });
			expect(merged.amount).toBe(1025);
		});

		it('empties the array fields rather than nulling them', () => {
			const merged = mergeRecapExtras({ category: 'climate-action' }, null);
			expect(merged.countries).toEqual([]);
			expect(merged.sectors).toEqual([]);
			expect(merged.loans).toEqual([]);
		});

		it('returns null without a summary', () => {
			expect(mergeRecapExtras(null, { amount: 5 })).toBeNull();
		});
	});

	describe('scopeToGoalYear', () => {
		it('counts the whole year, including loans made before the goal was set', () => {
			// dateStarted is October; the February loan still counts toward the goal
			const noYearTotal = [{ ...climateAchievements[0], progressForYear: null }];
			const scoped = scopeToGoalYear({ ...climateGoal, target: 10 }, noYearTotal);
			expect(scoped.count).toBe(3);
			expect(scoped.borrowerCount).toBe(3);
		});

		it('uses progressForYear over the retained purchases, which the window can trim', () => {
			// progressForYear is 100 while only 3 loanPurchases came back
			const scoped = scopeToGoalYear({ ...climateGoal, target: 200 }, climateAchievements);
			expect(scoped.count).toBe(100);
		});

		it('recomputes progress against the target from the year count', () => {
			const scoped = scopeToGoalYear({ ...climateGoal, target: 200 }, climateAchievements);
			expect(scoped.percent).toBe(50);
		});

		it('caps the count at the target when the goal is exceeded', () => {
			const scoped = scopeToGoalYear({ ...climateGoal, target: 1 }, climateAchievements);
			expect(scoped.count).toBe(1);
			expect(scoped.borrowerCount).toBe(1);
			expect(scoped.percent).toBe(100);
		});

		it('leaves support-all untouched, since the monolith already scopes it', () => {
			const supportAll = { category: 'support-all', count: 14, percent: 100 };
			expect(scopeToGoalYear(supportAll, climateAchievements)).toBe(supportAll);
		});

		it('keeps the existing percent when the goal has no target', () => {
			const scoped = scopeToGoalYear({ ...climateGoal, target: 0, percent: 42 }, climateAchievements);
			expect(scoped.percent).toBe(42);
		});

		it('sums Total Lent from the loan shares it counted', () => {
			const withShares = [{
				id: 'climate-action',
				loanPurchases: [
					{
						purchaseTime: '2026-02-01T00:00:00Z',
						loan: { id: 1, userProperties: { loanBalance: { totalAmountPurchased: 500 } } },
					},
					{
						purchaseTime: '2026-10-05T00:00:00Z',
						loan: { id: 2, userProperties: { loanBalance: { totalAmountPurchased: 25 } } },
					},
					{
						purchaseTime: '2026-11-20T00:00:00Z',
						loan: { id: 3, userProperties: { loanBalance: { totalAmountPurchased: 50 } } },
					},
				],
			}];
			// oldest first, capped at the target of 4, so all three count
			expect(scopeToGoalYear({ ...climateGoal, target: 4 }, withShares).amount).toBe(575);
		});

		it('sums only the loans it counted, so Total Lent matches the capped borrower count', () => {
			const withShares = [{
				id: 'climate-action',
				loanPurchases: [
					{
						purchaseTime: '2026-10-05T00:00:00Z',
						loan: { id: 1, userProperties: { loanBalance: { totalAmountPurchased: 25 } } },
					},
					{
						purchaseTime: '2026-11-20T00:00:00Z',
						loan: { id: 2, userProperties: { loanBalance: { totalAmountPurchased: 25 } } },
					},
				],
			}];
			const scoped = scopeToGoalYear({ ...climateGoal, target: 1 }, withShares);
			expect(scoped.count).toBe(1);
			expect(scoped.amount).toBe(25);
		});

		it('takes the most recent loans, in the order the service returns them', () => {
			// The rolling window retains only the most recent loans, so the true oldest are
			// unreachable for heavy lenders; we show the newest rather than pull the year.
			const newestFirst = [{
				id: 'climate-action',
				loanPurchases: [
					{ purchaseTime: '2026-12-01T00:00:00Z', loan: { id: 3, name: 'Newest' } },
					{ purchaseTime: '2026-10-20T00:00:00Z', loan: { id: 2, name: 'Middle' } },
					{ purchaseTime: '2026-10-05T00:00:00Z', loan: { id: 1, name: 'Oldest' } },
				],
			}];
			const scoped = scopeToGoalYear({ ...climateGoal, target: 2 }, newestFirst);

			expect(scoped.count).toBe(2);
			expect(getGoalLoans(scoped, newestFirst).map(loan => loan.name)).toEqual(['Newest', 'Middle']);
		});

		it('derives the session count from distinct purchase times', () => {
			const sameCheckout = [{
				id: 'climate-action',
				loanPurchases: [
					{ purchaseTime: '2026-10-05T10:00:00Z', loan: { id: 1 } },
					{ purchaseTime: '2026-10-05T10:00:00Z', loan: { id: 2 } },
					{ purchaseTime: '2026-11-20T09:00:00Z', loan: { id: 3 } },
				],
			}];
			expect(scopeToGoalYear(climateGoal, sameCheckout).transactionSessionCount).toBe(2);
		});

		it('keeps a session count the monolith supplied', () => {
			const summary = { ...climateGoal, transactionSessionCount: 9 };
			expect(scopeToGoalYear(summary, climateAchievements).transactionSessionCount).toBe(9);
		});

		it('leaves Total Lent null when no share amounts came back', () => {
			expect(scopeToGoalYear(climateGoal, climateAchievements).amount).toBeNull();
		});

		describe('slide 3 data derived from the goal loans', () => {
			const kenya = { id: 1, name: 'Kenya', isoCode: 'KE' };
			const peru = { id: 2, name: 'Peru', isoCode: 'PE' };
			const purchase = (id, sector, country) => ({
				purchaseTime: '2026-10-05T00:00:00Z',
				loan: { id, sector, geocode: { country } },
			});
			const achievements = [{
				id: 'climate-action',
				loanPurchases: [
					purchase(1, { id: 9, name: 'Agriculture' }, kenya),
					purchase(2, { id: 9, name: 'Agriculture' }, kenya),
					purchase(3, { id: 8, name: 'Retail' }, peru),
				],
			}];

			it('keeps countries that come back without an id', () => {
				const noId = [{
					id: 'climate-action',
					loanPurchases: [purchase(1, null, { name: 'Peru', isoCode: 'PE' })],
				}];
				expect(scopeToGoalYear(climateGoal, noId).countries).toEqual([{ name: 'Peru', isoCode: 'PE' }]);
			});

			it('derives the countries, de-duplicated', () => {
				expect(scopeToGoalYear(climateGoal, achievements).countries).toEqual([kenya, peru]);
			});

			it('derives the sectors, counted and ordered by loan count', () => {
				expect(scopeToGoalYear(climateGoal, achievements).sectors).toEqual([
					{ sector: { id: 9, name: 'Agriculture' }, loanCount: 2 },
					{ sector: { id: 8, name: 'Retail' }, loanCount: 1 },
				]);
			});

			it('prefers the monolith values when it supplied them', () => {
				const summary = { ...climateGoal, countries: [peru], sectors: [{ sector: peru, loanCount: 7 }] };
				const scoped = scopeToGoalYear(summary, achievements);
				expect(scoped.countries).toEqual([peru]);
				expect(scoped.sectors).toEqual([{ sector: peru, loanCount: 7 }]);
			});

			it('degrades to empty lists when the loans carry no sector or country', () => {
				const scoped = scopeToGoalYear(climateGoal, climateAchievements);
				expect(scoped.countries).toEqual([]);
				expect(scoped.sectors).toEqual([]);
			});
		});

		it('returns null without a summary', () => {
			expect(scopeToGoalYear(null, climateAchievements)).toBeNull();
		});
	});

	describe('getLoanStats', () => {
		it('maps the summary onto the slide 1 stats', () => {
			const summary = {
				amount: 1025, borrowerCount: 14, count: 12, percent: 100,
			};
			expect(getLoanStats(summary)).toEqual({ totalLent: 1025, borrowers: 14, percentComplete: 100 });
		});

		it('falls back to the loan count when borrowerCount is absent', () => {
			expect(getLoanStats({ count: 12 }).borrowers).toBe(12);
		});

		it('returns nulls rather than zeros for a missing summary', () => {
			expect(getLoanStats(null)).toEqual({ totalLent: null, borrowers: null, percentComplete: null });
		});
	});

	describe('getIsEligible', () => {
		it('is eligible for a goal with progress', () => {
			expect(getIsEligible({ goalName: '2026 impact goal', count: 3 })).toBe(true);
		});

		it('is not eligible for a goal with no loans yet', () => {
			expect(getIsEligible({ goalName: '2026 impact goal', count: 0 })).toBe(false);
		});

		it('is not eligible without a goal', () => {
			expect(getIsEligible(null)).toBe(false);
			expect(getIsEligible({ count: 5 })).toBe(false);
		});
	});
});
