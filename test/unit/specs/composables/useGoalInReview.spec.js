import useGoalInReview, {
	getGoalInReviewTargetYear,
} from '#src/composables/useGoalInReview';

const getGoalSummary = vi.fn();

vi.mock('#src/composables/useGoalData', () => ({
	default: () => ({ getGoalSummary }),
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

// achievements-service reports the whole calendar year; the goal only started in October.
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

const makeApollo = ({ goalSummary = monolithExtras, achievements = [] } = {}) => ({
	query: vi.fn(({ query }) => {
		const name = query?.definitions?.[0]?.name?.value;
		if (name === 'goalInReviewSummary') {
			return Promise.resolve({ data: { my: { goalSummary } } });
		}
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
		getGoalSummary.mockResolvedValue(supportAllSummary);
	});

	it('defaults the target year from the provided date', () => {
		expect(getGoalInReviewTargetYear(new Date('2028-03-01T00:00:00Z'))).toBe(2028);
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
			goalSummary: null,
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

		it('counts the goal window rather than the calendar year achievements-service reports', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			// 2 of the 3 climate loans fall inside the goal window, against a target of 4
			expect(result.loanStats).toEqual({ totalLent: null, borrowers: 2, percentComplete: 50 });
		});

		it('takes the borrower photos from the matching achievement, within the goal window', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			expect(result.goalLoans.map(loan => loan.name)).toEqual(['Siti', 'Aminata']);
		});

		it('empties the support-all-only fields', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			expect(result.goalSummary.countries).toEqual([]);
			expect(result.goalSummary.loans).toEqual([]);
		});
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
