import goalInReviewCopy, {
	MAX_BORROWER_CARDS,
	OTHER_SECTOR_LABEL,
	getBorrowerCards,
	getCategoryName,
	getGoalLoans,
	getIsEligible,
	getLoanStats,
	getNamedSectorCount,
	getRecapEntryCutoff,
	getSectorChartValues,
	mergeRecapExtras,
	scopeToGoalYear,
	shouldAutoOpenRecap,
	shouldHideGoalSignup,
	shouldShowRecapEntryPoint,
} from '#src/util/goalInReview';
import { completedGoalThisSession, markGoalCompletedThisSession } from '#src/util/goalRecapSession';

const makeCookieStore = (initial = {}) => {
	const jar = { ...initial };
	return {
		get: name => jar[name],
		set: (name, value) => { jar[name] = value; },
		jar,
	};
};

describe('goalRecapSession.js', () => {
	it('reports the completion session once it has been marked', () => {
		const cookieStore = makeCookieStore();

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(completedGoalThisSession(cookieStore, 2026)).toBe(true);
	});

	it('sets no expiry, so the mark dies with the browser session', () => {
		const cookieStore = { get: vi.fn(), set: vi.fn() };

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(cookieStore.set).toHaveBeenCalledWith('kv_goal_completed_this_session', '2026', { path: '/' });
	});

	it('does not carry a mark from one goal year to another', () => {
		const cookieStore = makeCookieStore();

		markGoalCompletedThisSession(cookieStore, 2026);

		expect(completedGoalThisSession(cookieStore, 2027)).toBe(false);
	});

	it('reports nothing for a session that never marked a completion', () => {
		expect(completedGoalThisSession(makeCookieStore(), 2026)).toBe(false);
	});

	it('survives a missing cookie store', () => {
		expect(completedGoalThisSession(null, 2026)).toBe(false);
		expect(() => markGoalCompletedThisSession(null, 2026)).not.toThrow();
	});

	it('ignores a missing year rather than marking a bare cookie', () => {
		const cookieStore = { get: vi.fn(), set: vi.fn() };

		markGoalCompletedThisSession(cookieStore, null);

		expect(cookieStore.set).not.toHaveBeenCalled();
	});
});

const completed = {
	enabled: true,
	isEligible: true,
	goalStatus: 'completed',
	goalYear: 2026,
	currentGoalYear: 2026,
	hasViewedRecap: false,
};

const IN_PROGRESS_RELEASE = new Date('2026-11-15T00:00:00Z');

const inProgress = {
	...completed,
	goalStatus: 'in-progress',
	inProgressStartDate: IN_PROGRESS_RELEASE,
	now: IN_PROGRESS_RELEASE,
};

describe('goalInReviewTrigger.js', () => {
	describe('completed goals', () => {
		// Goals complete at checkout, so the first visit to MyKiva or Portfolio is already
		// a later session and there is nothing to wait for.
		it('opens on the first visit after completion', () => {
			expect(shouldAutoOpenRecap(completed)).toBe(true);
		});
	});

	describe('in-progress goals', () => {
		it('opens on the configured release date', () => {
			expect(shouldAutoOpenRecap(inProgress)).toBe(true);
		});

		it('opens after the release date', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, now: new Date('2026-12-01T00:00:00Z') })).toBe(true);
		});

		it('stays shut before the release date, even with the flag on', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, now: new Date('2026-11-14T23:59:59Z') })).toBe(false);
		});

		it('accepts the date as a string, since settings come back serialized', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, inProgressStartDate: '2026-11-15T00:00:00Z' })).toBe(true);
		});

		it('stays shut when the release date is unset', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, inProgressStartDate: null })).toBe(false);
		});

		it('stays shut when the release date cannot be parsed', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, inProgressStartDate: 'not-a-date' })).toBe(false);
		});
	});

	describe('completed goals are not held back by the in-progress date', () => {
		it('opens before the in-progress release date', () => {
			expect(shouldAutoOpenRecap({
				...completed,
				inProgressStartDate: IN_PROGRESS_RELEASE,
				now: new Date('2026-11-01T00:00:00Z'),
			})).toBe(true);
		});

		it('opens with no in-progress release date configured at all', () => {
			expect(shouldAutoOpenRecap({ ...completed, inProgressStartDate: null })).toBe(true);
		});
	});

	describe('opens only once', () => {
		it('never reopens after the recap has been seen', () => {
			expect(shouldAutoOpenRecap({ ...completed, hasViewedRecap: true })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, hasViewedRecap: true })).toBe(false);
		});
	});

	describe('goals it must never open for', () => {
		it('a goal from a previous year', () => {
			expect(shouldAutoOpenRecap({ ...completed, goalYear: 2025 })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, goalYear: 2025 })).toBe(false);
		});

		it('an expired goal', () => {
			expect(shouldAutoOpenRecap({ ...completed, goalStatus: 'expired' })).toBe(false);
		});

		it('a lender with no goal or no loans toward it', () => {
			expect(shouldAutoOpenRecap({ ...completed, isEligible: false })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, isEligible: false })).toBe(false);
		});

		it('anyone, when the feature flag is off', () => {
			expect(shouldAutoOpenRecap({ ...completed, enabled: false })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, enabled: false })).toBe(false);
		});

		it('a call with nothing passed at all', () => {
			expect(shouldAutoOpenRecap()).toBe(false);
		});
	});

	it('compares goal years loosely, since preferences store them as strings', () => {
		expect(shouldAutoOpenRecap({ ...completed, goalYear: '2026', currentGoalYear: 2026 })).toBe(true);
	});
});

const GOAL_YEAR = 2026;
const NEXT_YEAR = 2027;

const currentYearComplete = {
	enabled: true,
	goalStatus: 'completed',
	goalYear: GOAL_YEAR,
	currentYear: GOAL_YEAR,
	now: new Date(GOAL_YEAR, 11, 20),
};

const nextYearComplete = {
	enabled: true,
	goalStatus: 'completed',
	goalYear: GOAL_YEAR,
	currentYear: NEXT_YEAR,
	now: new Date(NEXT_YEAR, 0, 15),
};

const nextYearUnfinished = {
	...nextYearComplete,
	goalStatus: 'expired',
	loansTowardGoal: 3,
};

describe('goalRecapEntryPoint.js', () => {
	describe('current goal year', () => {
		it('offers the recap on a completed goal', () => {
			expect(shouldShowRecapEntryPoint(currentYearComplete)).toBe(true);
		});

		it('stays completion-focused while the goal is in progress', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, goalStatus: 'in-progress' })).toBe(false);
		});

		it('offers nothing for an in-progress goal that already has loans', () => {
			expect(shouldShowRecapEntryPoint({
				...currentYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 4,
			})).toBe(false);
		});
	});

	describe('next goal year', () => {
		it('offers the recap on a completed past goal', () => {
			expect(shouldShowRecapEntryPoint(nextYearComplete)).toBe(true);
		});

		it('offers the recap on an unfinished past goal that got loans', () => {
			expect(shouldShowRecapEntryPoint(nextYearUnfinished)).toBe(true);
		});

		it('offers nothing on an unfinished past goal with no loans', () => {
			expect(shouldShowRecapEntryPoint({ ...nextYearUnfinished, loansTowardGoal: 0 })).toBe(false);
		});

		it('keeps going while last year\'s goal is still the one they have set', () => {
			expect(shouldShowRecapEntryPoint({ ...nextYearComplete, activeGoalYear: GOAL_YEAR })).toBe(true);
		});

		it('stops once this year\'s goal is set', () => {
			expect(shouldShowRecapEntryPoint({ ...nextYearComplete, activeGoalYear: NEXT_YEAR })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...nextYearUnfinished, activeGoalYear: NEXT_YEAR })).toBe(false);
		});
	});

	describe('a past goal that was never renewed', () => {
		// It stays on the current goal tile rather than moving to the history list, so it
		// arrives with an in-progress status and its progress as the loan count.
		it('offers the recap when it got loans', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 2,
			})).toBe(true);
		});

		it('offers nothing when it never got a loan', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 0,
			})).toBe(false);
		});
	});

	describe('the March 31 cutoff', () => {
		it('still offers the recap on the last day', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				now: new Date(NEXT_YEAR, 2, 31, 23, 59, 59),
			})).toBe(true);
		});

		it('stops the day after', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				now: new Date(NEXT_YEAR, 3, 1),
			})).toBe(false);
			expect(shouldShowRecapEntryPoint({
				...nextYearUnfinished,
				now: new Date(NEXT_YEAR, 3, 1),
			})).toBe(false);
		});

		it('derives the cutoff from the goal year rather than a fixed year', () => {
			expect(getRecapEntryCutoff(2026).getFullYear()).toBe(2027);
			expect(getRecapEntryCutoff(2030).getFullYear()).toBe(2031);
			expect(getRecapEntryCutoff(2026).getMonth()).toBe(2);
			expect(getRecapEntryCutoff(2026).getDate()).toBe(31);
		});

		it('leaves an older goal out, since its own cutoff has long passed', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalYear: 2024,
				now: new Date(NEXT_YEAR, 0, 15),
			})).toBe(false);
		});
	});

	describe('offers nothing', () => {
		it('when the feature flag is off', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, enabled: false })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...nextYearComplete, enabled: false })).toBe(false);
		});

		it('for a goal year in the future', () => {
			expect(shouldShowRecapEntryPoint({
				...currentYearComplete,
				goalYear: NEXT_YEAR,
				currentYear: GOAL_YEAR,
			})).toBe(false);
		});

		it('when the year is unknown', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, goalYear: null })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, currentYear: null })).toBe(false);
		});

		it('for a call with nothing passed at all', () => {
			expect(shouldShowRecapEntryPoint()).toBe(false);
		});
	});
});

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

		it('prefers the goal picker name, so the recap matches what the lender chose', () => {
			const categories = [
				{ badgeId: 'support-all', name: 'Choose as I go' },
				{ badgeId: 'us-economic-equality', name: 'U.S. Entrepreneurs' },
			];

			expect(getCategoryName('support-all', [], categories)).toBe('Choose as I go');
			expect(getCategoryName('us-economic-equality', [], categories)).toBe('U.S. Entrepreneurs');
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

		it('leaves out purchases from other years, which the service returns unfiltered', () => {
			const acrossYears = [{
				...climateAchievements[0],
				progressForYear: 2,
				loanPurchases: [
					{ purchaseTime: '2027-01-04T00:00:00Z', loan: { id: 9, name: 'Next year' } },
					...climateAchievements[0].loanPurchases.slice(0, 2),
				],
			}];

			const scoped = scopeToGoalYear({ ...climateGoal, target: 10 }, acrossYears, 2026);

			expect(scoped.count).toBe(2);
			expect(getGoalLoans(scoped, acrossYears, 2026).map(loan => loan.name))
				.toEqual(['Before the goal', 'Siti']);
		});

		it('shows nothing for a goal year the lender made no loans in', () => {
			const noneThisYear = [{ ...climateAchievements[0], progressForYear: 0 }];

			const scoped = scopeToGoalYear({ ...climateGoal, target: 63 }, noneThisYear, 2027);

			expect(scoped.count).toBe(0);
			expect(scoped.borrowerCount).toBe(0);
			expect(scoped.percent).toBe(0);
			expect(scoped.countries).toEqual([]);
			expect(scoped.sectors).toEqual([]);
			expect(getGoalLoans(scoped, noneThisYear, 2027)).toEqual([]);
		});

		it('reads purchase times in UTC, so new year purchases land in the right year', () => {
			// 23:00 UTC on Dec 31 is still the previous year west of Greenwich.
			const newYearEve = [{
				...climateAchievements[0],
				progressForYear: 1,
				loanPurchases: [{ purchaseTime: '2026-12-31T23:00:00Z', loan: { id: 7, name: 'Eve' } }],
			}];

			expect(getGoalLoans({ ...climateGoal, count: 1 }, newYearEve, 2026).map(loan => loan.name))
				.toEqual(['Eve']);
			expect(getGoalLoans({ ...climateGoal, count: 1 }, newYearEve, 2027)).toEqual([]);
		});

		it('counts the year from progressForYear, not the purchases left after filtering', () => {
			// A past year recap: 2027's purchase is served first and eats into the request, so
			// only 2 of 2026's come back even though the lender made 100 that year.
			const cappedByOtherYears = [{
				...climateAchievements[0],
				progressForYear: 100,
				loanPurchases: [
					{ purchaseTime: '2027-01-04T00:00:00Z', loan: { id: 9, name: 'Next year' } },
					...climateAchievements[0].loanPurchases.slice(0, 2),
				],
			}];

			const scoped = scopeToGoalYear({ ...climateGoal, target: 3 }, cappedByOtherYears, 2026);

			expect(scoped.count).toBe(3);
			expect(scoped.percent).toBe(100);
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

const buildLoans = (count, startId = 1) => Array.from({ length: count }, (_unused, i) => ({
	id: startId + i,
	name: `Borrower ${startId + i}`,
	image: { hash: `hash-${startId + i}` },
}));

describe('goalInReviewBorrowers', () => {
	describe('getBorrowerCards', () => {
		it('maps loans to cards with name and image hash', () => {
			const { cards } = getBorrowerCards(buildLoans(2), 2);
			expect(cards).toEqual([
				{ id: '1', name: 'Borrower 1', imageHash: 'hash-1' },
				{ id: '2', name: 'Borrower 2', imageHash: 'hash-2' },
			]);
		});

		it('de-duplicates loans repeated across achievements', () => {
			const [loan] = buildLoans(1);
			const { cards, moreCount } = getBorrowerCards([loan, { ...loan }, ...buildLoans(1, 2)], 2);
			expect(cards.map(card => card.id)).toEqual(['1', '2']);
			expect(moreCount).toBe(0);
		});

		it('skips loans with no id', () => {
			const { cards } = getBorrowerCards([{ name: 'No id' }, null, ...buildLoans(1)], 1);
			expect(cards.map(card => card.id)).toEqual(['1']);
		});

		it('falls back to empty strings for a missing name or image', () => {
			const { cards } = getBorrowerCards([{ id: 7 }], 1);
			expect(cards).toEqual([{ id: '7', name: '', imageHash: '' }]);
		});

		describe('overflow rule', () => {
			it('shows every card and no overflow at exactly the limit', () => {
				const { cards, moreCount } = getBorrowerCards(
					buildLoans(MAX_BORROWER_CARDS),
					MAX_BORROWER_CARDS,
				);
				expect(cards).toHaveLength(MAX_BORROWER_CARDS);
				expect(moreCount).toBe(0);
			});

			it('caps at the limit and rolls the remainder into "+n more" one over', () => {
				const total = MAX_BORROWER_CARDS + 1;
				const { cards, moreCount } = getBorrowerCards(buildLoans(total), total);
				expect(cards).toHaveLength(MAX_BORROWER_CARDS);
				expect(moreCount).toBe(1);
			});

			it('sums cards plus the overflow back to the borrower total', () => {
				const total = 48;
				const { cards, moreCount } = getBorrowerCards(buildLoans(total), total);
				expect(cards.length + moreCount).toBe(total);
			});

			it('counts the overflow against borrowers, not loans, for group loans', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(4), 20);
				expect(cards).toHaveLength(4);
				expect(moreCount).toBe(16);
			});

			it('never returns a negative overflow when the total lags the loans', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(5), 2);
				expect(cards).toHaveLength(5);
				expect(moreCount).toBe(0);
			});
		});

		describe('missing inputs', () => {
			it('hides the overflow when the total is absent', () => {
				const { cards, moreCount } = getBorrowerCards(buildLoans(3));
				expect(cards).toHaveLength(3);
				expect(moreCount).toBe(0);
			});

			it('hides the overflow when the total is not a number', () => {
				const { moreCount } = getBorrowerCards(buildLoans(3), 'not a number');
				expect(moreCount).toBe(0);
			});

			it('returns an empty grid with no loans', () => {
				expect(getBorrowerCards()).toEqual({ cards: [], moreCount: 0 });
				expect(getBorrowerCards(null, 5)).toEqual({ cards: [], moreCount: 5 });
			});
		});
	});
});

const valueFor = (values, label) => values.find(v => v.label === label)?.value;

describe('goalInReviewSectors.js', () => {
	describe('getSectorChartValues', () => {
		it('maps each sector stat to a labelled loan count', () => {
			const values = getSectorChartValues([
				{ sector: { id: 's1', name: 'Agriculture' }, loanCount: 2 },
				{ sector: { id: 's2', name: 'Food' }, loanCount: 1 },
			]);
			expect(valueFor(values, 'Agriculture')).toBe(2);
			expect(valueFor(values, 'Food')).toBe(1);
		});

		it('preserves the loan-count ordering the query returns', () => {
			const values = getSectorChartValues([
				{ sector: { name: 'Agriculture' }, loanCount: 8 },
				{ sector: { name: 'Food' }, loanCount: 3 },
				{ sector: { name: 'Retail' }, loanCount: 1 },
			]);
			expect(values.map(sector => sector.label)).toEqual(['Agriculture', 'Food', 'Retail']);
		});

		it('buckets entries with a null or missing sector into "Other", labelled with the count', () => {
			const values = getSectorChartValues([
				{ sector: null, loanCount: 1 },
				{ loanCount: 1 },
				{ sector: { name: 'Agriculture' }, loanCount: 1 },
			]);
			const other = values.find(sector => sector.isOther);
			expect(other).toMatchObject({ label: `${OTHER_SECTOR_LABEL} (2)`, value: 2 });
			expect(valueFor(values, 'Agriculture')).toBe(1);
		});

		it('appends the Other bucket last', () => {
			const values = getSectorChartValues([
				{ sector: null, loanCount: 1 },
				{ sector: { name: 'Agriculture' }, loanCount: 3 },
				{ sector: { name: 'Food' }, loanCount: 2 },
			]);
			expect(values[values.length - 1]).toEqual({ label: `${OTHER_SECTOR_LABEL} (1)`, value: 1, isOther: true });
		});

		it('omits the Other bucket entirely when every entry has a sector', () => {
			const values = getSectorChartValues([{ sector: { name: 'Agriculture' }, loanCount: 1 }]);
			expect(values.some(sector => sector.isOther)).toBe(false);
		});

		it('skips entries with no loan count', () => {
			const values = getSectorChartValues([
				{ sector: { name: 'Agriculture' }, loanCount: 0 },
				{ sector: { name: 'Retail' } },
				{ sector: { name: 'Food' }, loanCount: 1 },
			]);
			expect(values).toEqual([{ label: 'Food', value: 1 }]);
		});

		it('returns an empty array for empty, null, or undefined input', () => {
			expect(getSectorChartValues([])).toEqual([]);
			expect(getSectorChartValues(null)).toEqual([]);
			expect(getSectorChartValues(undefined)).toEqual([]);
		});
	});

	describe('getNamedSectorCount', () => {
		it('counts named sectors, excluding the "Other" bucket', () => {
			const values = [
				{ label: 'Agriculture', value: 3 },
				{ label: 'Food', value: 2 },
				{ label: `${OTHER_SECTOR_LABEL} (4)`, value: 4, isOther: true },
			];
			expect(getNamedSectorCount(values)).toBe(2);
		});

		it('returns 0 for empty or missing input', () => {
			expect(getNamedSectorCount([])).toBe(0);
			expect(getNamedSectorCount()).toBe(0);
		});
	});
});

// Avoid pulling the full badge composable (graphql, apollo, etc.) into the test.
// One module registry now that the specs share a file, so the mock has to serve every
// consumer in it, not just the copy tests.
vi.mock('#src/composables/useBadgeData', async importOriginal => ({
	...(await importOriginal()),
	ID_WOMENS_EQUALITY: 'womens-equality',
	ID_SUPPORT_ALL: 'support-all',
}));

// Mirrors the medium-weight <strong> emphasis the copy module wraps values in.
const strong = text => `<strong class="tw-font-medium">${text}</strong>`;

describe('goalInReviewCopy.js', () => {
	describe('getOriginStory', () => {
		it('returns the Jan–Mar variant with the month emphasized and capitalized', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-02-10');
			expect(title).toBe('The spark starters');
			expect(content).toContain(`You began in ${strong('February')}.`);
		});

		it('returns the Apr–Jun variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-04-01');
			expect(title).toBe('The bloom chasers');
			expect(content).toContain(`You began in ${strong('April')},`);
		});

		it('returns the Jul–Sep variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-09-30');
			expect(title).toBe('The sun chasers');
			expect(content).toContain(`You started in ${strong('September')},`);
		});

		it('returns the Oct–Dec variant', () => {
			const { title, content } = goalInReviewCopy.getOriginStory('2025-12-15');
			expect(title).toBe('The Reflectionist');
			expect(content).toContain(`You started in ${strong('December')},`);
		});

		it('falls back to the first variant with January when the date is missing or invalid', () => {
			expect(goalInReviewCopy.getOriginStory(undefined)).toEqual({
				title: 'The spark starters',
				content: expect.stringContaining(`You began in ${strong('January')}.`),
			});
			expect(goalInReviewCopy.getOriginStory('not-a-date').title).toBe('The spark starters');
		});
	});

	describe('getImpactIdentity', () => {
		it('matches the women’s equality badge id and emphasizes "women entrepreneurs"', () => {
			const { title, content } = goalInReviewCopy.getImpactIdentity('womens-equality');
			expect(title).toBe('Barrier Breaker');
			expect(content).toContain(`support ${strong('women entrepreneurs')},`);
		});

		it('matches the support-all badge id', () => {
			expect(goalInReviewCopy.getImpactIdentity('support-all').title).toBe('Opportunity Spotter');
		});

		it('falls back to the cause advocate for any other category', () => {
			expect(goalInReviewCopy.getImpactIdentity('basic-needs').title).toBe('Cause advocate');
			expect(goalInReviewCopy.getImpactIdentity(undefined).title).toBe('Cause advocate');
		});
	});

	describe('getImpactHabit', () => {
		it('reports the percentile as the top slice it represents, not the rank itself', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit({
				lifetimePercentile: 92,
				transactionSessionCount: 6,
			});
			expect(title).toBe('Top 8%');
			expect(content).toContain('top 8%');
		});

		it('treats the percentile threshold as inclusive', () => {
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 80 }).title).toBe('Top 20%');
		});

		it('floors the top slice at 1% so a 100th-percentile lender is not "Top 0%"', () => {
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 100 }).title).toBe('Top 1%');
		});

		it('prefers the percentile variant over sessions', () => {
			// A high session count would otherwise be "Kiva champion".
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 95, transactionSessionCount: 20 }).title)
				.toBe('Top 5%');
		});

		it('falls back to sessions when the percentile is below threshold, null, or absent', () => {
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: 79, transactionSessionCount: 6 }).title)
				.toBe('Kiva champion');
			expect(goalInReviewCopy.getImpactHabit({ lifetimePercentile: null, transactionSessionCount: 6 }).title)
				.toBe('Kiva champion');
			expect(goalInReviewCopy.getImpactHabit({ transactionSessionCount: 6 }).title).toBe('Kiva champion');
		});

		it('returns Kiva champion for 5 or more sessions with the count emphasized', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit({ transactionSessionCount: 6 });
			expect(title).toBe('Kiva champion');
			expect(content).toContain(`You showed up ${strong('6 times')} this year`);
		});

		it('returns Rising Kiva champion for 1–4 sessions', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit({ transactionSessionCount: 4 });
			expect(title).toBe('Rising Kiva champion');
			expect(content).toContain(`You showed up ${strong('4 times')} this year`);
		});

		it('pluralizes correctly for a single session', () => {
			expect(goalInReviewCopy.getImpactHabit({ transactionSessionCount: 1 }).content)
				.toContain(`You showed up ${strong('1 time')} this year`);
		});

		it('defaults to zero sessions when nothing is provided', () => {
			const { title, content } = goalInReviewCopy.getImpactHabit();
			expect(title).toBe('Rising Kiva champion');
			expect(content).toContain(`You showed up ${strong('0 times')} this year`);
		});
	});
});

describe('shouldHideGoalSignup', () => {
	const RECAP_START = new Date(2026, 10, 15);

	it('keeps asking well before the recap goes out', () => {
		expect(shouldHideGoalSignup({
			recapStartDate: RECAP_START,
			now: new Date(2026, 9, 31, 23, 59),
		})).toBe(false);
	});

	it('stops asking two weeks before, on November 1', () => {
		expect(shouldHideGoalSignup({
			recapStartDate: RECAP_START,
			now: new Date(2026, 10, 1),
		})).toBe(true);
	});

	it('stays hidden while the recap is out', () => {
		expect(shouldHideGoalSignup({
			recapStartDate: RECAP_START,
			now: new Date(2026, 11, 25),
		})).toBe(true);
	});

	it('asks again from January 1, for the year the lender can still finish', () => {
		expect(shouldHideGoalSignup({
			recapStartDate: RECAP_START,
			now: new Date(2027, 0, 1),
		})).toBe(false);
	});

	it('derives the window from the setting rather than a fixed month', () => {
		const decemberRecap = new Date(2026, 11, 10);
		expect(shouldHideGoalSignup({ recapStartDate: decemberRecap, now: new Date(2026, 10, 1) })).toBe(false);
		expect(shouldHideGoalSignup({ recapStartDate: decemberRecap, now: new Date(2026, 10, 26) })).toBe(true);
	});

	it('accepts the date as a string, since settings come back serialized', () => {
		expect(shouldHideGoalSignup({ recapStartDate: '2026-11-15', now: new Date(2026, 10, 5) })).toBe(true);
	});

	it('keeps asking when the setting is unset or unreadable', () => {
		expect(shouldHideGoalSignup({ recapStartDate: null, now: new Date(2026, 10, 5) })).toBe(false);
		expect(shouldHideGoalSignup({ recapStartDate: 'not-a-date', now: new Date(2026, 10, 5) })).toBe(false);
		expect(shouldHideGoalSignup()).toBe(false);
	});

	it('keeps asking once the setting is a year stale', () => {
		expect(shouldHideGoalSignup({ recapStartDate: RECAP_START, now: new Date(2027, 10, 5) })).toBe(false);
	});
});
