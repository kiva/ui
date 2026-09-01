import useGoalInReview, {
	getGoalInReviewNow,
	getGoalInReviewTargetYear,
} from '#src/composables/useGoalInReview';

const getGoalSummary = vi.fn();

// Only the two categories the summaries below use; the real list has six.
const getCategories = vi.fn(() => [
	{ badgeId: 'support-all', name: 'Choose as I go' },
	{ badgeId: 'climate-action', name: 'Climate Action' },
]);

const getCtaHref = vi.fn(() => '/lend/filter?header=finish');

vi.mock('#src/composables/useGoalData', () => ({
	default: () => ({ getGoalSummary, getCategories, getCtaHref }),
}));

const supportAllSummary = {
	goalName: '2027 impact goal',
	category: 'support-all',
	status: 'completed',
	count: 14,
	borrowerCount: 14,
	amount: 1025,
	percent: 100,
};

const climateSummary = {
	goalName: '2027 climate goal',
	category: 'climate-action',
	status: 'in-progress',
	dateStarted: '2027-10-01',
	target: 4,
	count: 100,
	borrowerCount: 100,
	amount: null,
	percent: 100,
};

const monolithExtras = {
	transactionSessionCount: 6,
	sectors: [{ sector: { id: 1, name: 'Agriculture' }, loanCount: 8 }],
	countries: [{ id: 1, name: 'Kenya' }],
	loans: [{ id: 1, name: 'Aminata', image: { hash: 'hash-1' } }],
};

const makeApollo = ({ achievements = [] } = {}) => ({
	query: vi.fn(({ query }) => {
		const name = query?.definitions?.[0]?.name?.value;
		if (name === 'goalInReviewLender') {
			return Promise.resolve({
				data: { my: { userAccount: { firstName: 'Alexandra' }, lendingStats: { amountLentPercentile: 92 } } },
			});
		}
		return Promise.resolve({
			data: { userAchievementProgress: { tieredLendingAchievements: achievements } },
		});
	}),
});

describe('useGoalInReview', () => {
	beforeEach(() => {
		getGoalSummary.mockReset();
		getGoalSummary.mockResolvedValue({ ...supportAllSummary, ...monolithExtras });
	});

	it('defaults the target year from the provided date', () => {
		expect(getGoalInReviewTargetYear(new Date('2028-03-01T00:00:00Z'))).toBe(2028);
	});

	describe('recapDate override (getGoalInReviewNow)', () => {
		afterEach(() => {
			// Clear the recapDate so it never leaks into the other tests' "now".
			window.history.pushState({}, '', '/');
		});

		it('parses a bare recapDate as a local calendar day, not UTC (MP-3143)', () => {
			window.history.pushState({}, '', '/?recapDate=2027-04-01');
			// Local April 1 midnight. A UTC parse would land on Mar 31 evening in a
			// negative-offset zone and slip past the March-31 recap cutoff a day late.
			expect(getGoalInReviewNow().getTime()).toBe(new Date(2027, 3, 1).getTime());
		});

		it('keeps the year on a Jan 1 recapDate in any timezone (MP-3143)', () => {
			window.history.pushState({}, '', '/?recapDate=2027-01-01');
			expect(getGoalInReviewTargetYear()).toBe(2027);
		});

		it('leaves a recapDate with an explicit time unchanged', () => {
			window.history.pushState({}, '', '/?recapDate=2027-04-01T12:00:00Z');
			expect(getGoalInReviewNow().getTime()).toBe(new Date('2027-04-01T12:00:00Z').getTime());
		});
	});

	it('loads the recap payload for the requested year', async () => {
		const composable = useGoalInReview({ apollo: makeApollo() });

		const result = await composable.loadGoalInReview({ year: 2027 });

		expect(result.year).toBe(2027);
		expect(result.firstName).toBe('Alexandra');
		expect(result.lifetimePercentile).toBe(92);
		expect(composable.goalInReviewData.value).toBe(result);
		expect(composable.isEligible.value).toBe(true);
		expect(composable.loading.value).toBe(false);
	});

	it('defaults to the current recap year', async () => {
		const { loadGoalInReview } = useGoalInReview({ apollo: makeApollo() });

		const result = await loadGoalInReview();

		expect(result.year).toBe(getGoalInReviewTargetYear());
	});

	it('derives the slide 1 stats from the goal summary', async () => {
		const { loadGoalInReview } = useGoalInReview({ apollo: makeApollo() });

		const result = await loadGoalInReview({ year: 2027 });

		expect(result.loanStats).toEqual({ totalLent: 1025, borrowers: 14, percentComplete: 100 });
	});

	it('merges the monolith extras onto the summary for support-all goals', async () => {
		const { loadGoalInReview } = useGoalInReview({ apollo: makeApollo() });

		const result = await loadGoalInReview({ year: 2027 });

		expect(result.goalSummary.countries).toEqual(monolithExtras.countries);
		expect(result.goalSummary.sectors).toEqual(monolithExtras.sectors);
		expect(result.goalLoans).toEqual(monolithExtras.loans);
	});

	describe('category goals', () => {
		// The monolith only computes support-all, so my.goalSummary is null here and the
		// summary has to come from achievements-service via useGoalData.
		const apolloForCategoryGoal = () => makeApollo({
			achievements: [
				{
					id: 'womens-equality',
					loanPurchases: [{ purchaseTime: '2027-11-01T00:00:00Z', loan: { id: 99, name: 'Wrong goal' } }],
				},
				{
					id: 'climate-action',
					progressForYear: 100,
					loanPurchases: [
						{ purchaseTime: '2027-03-01T00:00:00Z', loan: { id: 1, name: 'Before the goal' } },
						{ purchaseTime: '2027-10-05T00:00:00Z', loan: { id: 2, name: 'Siti' } },
						{ purchaseTime: '2027-11-20T00:00:00Z', loan: { id: 3, name: 'Aminata' } },
					],
				},
			],
		});

		beforeEach(() => {
			getGoalSummary.mockResolvedValue(climateSummary);
		});

		it('is eligible for a climate-action goal even without a monolith summary', async () => {
			const composable = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await composable.loadGoalInReview({ year: 2027 });

			expect(result.isEligible).toBe(true);
			expect(result.goalSummary.category).toBe('climate-action');
		});

		it('fetches the achievements with no-cache so the badges cache is never clobbered (MP-3117)', async () => {
			const apollo = apolloForCategoryGoal();
			const { loadGoalInReview } = useGoalInReview({ apollo });

			await loadGoalInReview({ year: 2027 });

			const achievementsCall = apollo.query.mock.calls
				.map(([options]) => options)
				.find(({ query }) => query?.definitions?.[0]?.name?.value === 'goalInReviewAchievements');
			expect(achievementsCall).toBeDefined();
			expect(achievementsCall.fetchPolicy).toBe('no-cache');
		});

		it('caps the year count at the goal target', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			// progressForYear is 100 against a target of 4
			expect(result.loanStats).toEqual({ totalLent: null, borrowers: 4, percentComplete: 100 });
		});

		it('takes the borrower photos from the matching achievement, oldest first', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			// the March loan predates the goal but still counts toward it
			expect(result.goalLoans.map(loan => loan.name)).toEqual(['Before the goal', 'Siti', 'Aminata']);
		});

		it('empties the support-all-only fields', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			expect(result.goalSummary.countries).toEqual([]);
			expect(result.goalSummary.loans).toEqual([]);
		});

		it('builds the finish-goal href from the loaded recap via the goal cards\' getCtaHref', async () => {
			const router = { currentRoute: { value: { path: '/mykiva' } } };
			const { loadGoalInReview, getFinishGoalHref } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			await loadGoalInReview({ year: 2027 });

			expect(getFinishGoalHref(router)).toBe('/lend/filter?header=finish');
			expect(getCtaHref).toHaveBeenCalledWith(4, 'climate-action', router, expect.any(Number));
		});
	});

	it('skips the achievements query for support-all, which reads none of it', async () => {
		const apollo = makeApollo();
		const { loadGoalInReview } = useGoalInReview({ apollo });

		await loadGoalInReview({ year: 2027 });

		const queried = apollo.query.mock.calls
			.map(([{ query }]) => query?.definitions?.[0]?.name?.value);
		expect(queried).not.toContain('goalInReviewAchievements');
	});

	it('is not eligible without a goal', async () => {
		getGoalSummary.mockResolvedValue(null);
		const composable = useGoalInReview({ apollo: makeApollo() });

		const result = await composable.loadGoalInReview({ year: 2027 });

		expect(result.isEligible).toBe(false);
		expect(composable.isEligible.value).toBe(false);
	});

	it('settles loading and stays ineligible when the queries fail', async () => {
		getGoalSummary.mockRejectedValue(new Error('network'));
		const composable = useGoalInReview({ apollo: makeApollo() });

		const result = await composable.loadGoalInReview({ year: 2027 });

		expect(result.isEligible).toBe(false);
		expect(result.goalSummary).toBeNull();
		expect(composable.loading.value).toBe(false);
	});
});
