/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import useGoalInReview, {
	getGoalInReviewNow,
	getGoalInReviewTargetYear,
	useGoalRecapEntryPoint,
} from '#src/composables/useGoalInReview';

const getGoalSummary = vi.fn();

// Only the two categories the summaries below use; the real list has six.
const getCategories = vi.fn(() => [
	{ badgeId: 'support-all', name: 'Choose as I go' },
	{ badgeId: 'climate-action', name: 'Climate Action' },
]);

const getCtaHref = vi.fn(() => '/lend/filter?header=finish');

// Only the composable is stubbed; the recap decisions read the real GOAL_STATUS.
vi.mock('#src/composables/useGoalData', async importOriginal => ({
	...await importOriginal(),
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

const makeApollo = ({ goalInReview = null } = {}) => ({
	query: vi.fn(({ query }) => {
		const name = query?.definitions?.[0]?.name?.value;
		if (name === 'goalInReviewLender') {
			return Promise.resolve({
				data: { my: { userAccount: { firstName: 'Alexandra' }, lendingStats: { amountLentPercentile: 92 } } },
			});
		}
		return Promise.resolve({ data: { goalInReview } });
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
			goalInReview: {
				id: '1#climate-action#2027',
				count: 100,
				transactionSessionCount: 7,
				photos: [
					{ id: 1, name: 'Before the goal' },
					{ id: 2, name: 'Siti' },
					{ id: 3, name: 'Aminata' },
				],
				stats: [
					{ id: 1, sector: { id: 9, name: 'Agriculture' }, geocode: { country: { id: 1, name: 'Kenya' } } },
					{ id: 2, sector: { id: 9, name: 'Agriculture' }, geocode: { country: { id: 1, name: 'Kenya' } } },
					{ id: 3, sector: { id: 8, name: 'Retail' }, geocode: { country: { id: 2, name: 'Peru' } } },
				],
			},
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

		it('asks for the goal\'s own category and year', async () => {
			const apollo = apolloForCategoryGoal();
			const { loadGoalInReview } = useGoalInReview({ apollo });

			await loadGoalInReview({ year: 2027 });

			const call = apollo.query.mock.calls
				.map(([options]) => options)
				.find(({ query }) => query?.definitions?.[0]?.name?.value === 'goalInReview');
			expect(call).toBeDefined();
			expect(call.variables).toEqual({ achievementId: 'climate-action', year: 2027 });
		});

		it('reports the whole year rather than capping at the goal target', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			// 100 loans against a target of 4
			expect(result.loanStats).toEqual({ totalLent: null, borrowers: 100, percentComplete: 100 });
		});

		it('takes the borrower photos from the recap, oldest first', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			expect(result.goalLoans.map(loan => loan.name)).toEqual(['Before the goal', 'Siti', 'Aminata']);
		});

		it('derives the map and chart from the recap, and leaves the monolith loan list empty', async () => {
			const { loadGoalInReview } = useGoalInReview({ apollo: apolloForCategoryGoal() });

			const result = await loadGoalInReview({ year: 2027 });

			expect(result.goalSummary.countries).toEqual([{ id: 1, name: 'Kenya' }, { id: 2, name: 'Peru' }]);
			expect(result.goalSummary.sectors).toEqual([
				{ sector: { id: 9, name: 'Agriculture' }, loanCount: 2 },
				{ sector: { id: 8, name: 'Retail' }, loanCount: 1 },
			]);
			// my.goalSummary.loans is support-all only, so nothing fills it here
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
		expect(queried).not.toContain('goalInReview');
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

describe('useGoalRecapEntryPoint', () => {
	const CURRENT_YEAR = new Date().getFullYear();

	// `announced` is the hideGoalCard preference; false means this is the announcing visit.
	const setupEntryPoint = ({
		enabled = true,
		goalStatus = 'completed',
		goalYear = CURRENT_YEAR,
		loansTowardGoal = 5,
		announced = true,
		hasViewedRecap = false,
	} = {}) => {
		const goalStatusRef = ref(goalStatus);
		const announcedRef = ref(announced);
		const viewedRef = ref(hasViewedRecap);
		let entryPoint;
		mount({
			template: '<div />',
			setup() {
				entryPoint = useGoalRecapEntryPoint({
					enabled: ref(enabled),
					goalStatus: goalStatusRef,
					goalYear: ref(goalYear),
					loansTowardGoal: ref(loansTowardGoal),
					announced: announcedRef,
					hasViewedRecap: viewedRef,
				});
				return {};
			},
		});
		return {
			...entryPoint, goalStatusRef, announcedRef, viewedRef,
		};
	};

	describe('the visit that announces the completion', () => {
		it('offers no CTA, leaving the card to celebrate the win', () => {
			const { showRecapCta } = setupEntryPoint({ announced: false });

			expect(showRecapCta.value).toBe(false);
		});

		it('keeps the card on the page for the whole of that visit', () => {
			expect(setupEntryPoint({ announced: false }).keepGoalCardForRecap.value).toBe(true);
		});

		// Read live, the CTA would appear seconds after the confetti (MP-3175).
		it('does not offer the CTA when the preference is written mid-visit', async () => {
			const { announcedRef, showRecapCta } = setupEntryPoint({ announced: false });

			announcedRef.value = true;
			await nextTick();

			expect(showRecapCta.value).toBe(false);
		});
	});

	describe('the next visit', () => {
		it('offers the CTA and keeps the card that carries it', () => {
			const { keepGoalCardForRecap, showRecapCta } = setupEntryPoint();

			expect(showRecapCta.value).toBe(true);
			expect(keepGoalCardForRecap.value).toBe(true);
		});

		// Opening the recap marks it seen, which must not pull the card away underneath it.
		it('keeps the card when the recap is opened mid-visit', async () => {
			const entryPoint = setupEntryPoint();

			entryPoint.viewedRef.value = true;
			await nextTick();

			expect(entryPoint.keepGoalCardForRecap.value).toBe(true);
		});
	});

	describe('once the recap has been seen', () => {
		// The card has done its job. The Impact Progress row keeps a durable entry point.
		it('lets the card retire on the visit after', () => {
			const { keepGoalCardForRecap } = setupEntryPoint({ hasViewedRecap: true });

			expect(keepGoalCardForRecap.value).toBe(false);
		});

		it('still leaves the celebration alone on the announcing visit', () => {
			const entryPoint = setupEntryPoint({ announced: false, hasViewedRecap: true });

			expect(entryPoint.keepGoalCardForRecap.value).toBe(true);
		});
	});

	describe('with no recap to offer', () => {
		it('lets the card retire once the feature is off', () => {
			const { keepGoalCardForRecap, showRecapCta } = setupEntryPoint({ enabled: false });

			expect(showRecapCta.value).toBe(false);
			expect(keepGoalCardForRecap.value).toBe(false);
		});

		it('lets the card retire while the goal is still in progress', () => {
			expect(setupEntryPoint({ goalStatus: 'in-progress' }).keepGoalCardForRecap.value).toBe(false);
		});
	});

	describe('before the goal is known', () => {
		// A preference that has not arrived would read as mid-announcement for everyone.
		it('waits for the goal before deciding which visit this is', async () => {
			const entryPoint = setupEntryPoint({ goalStatus: null, announced: true });

			expect(entryPoint.announcedBeforeThisVisit.value).toBeNull();
			// The card holds its place rather than flickering out and back.
			expect(entryPoint.keepGoalCardForRecap.value).toBe(true);

			entryPoint.goalStatusRef.value = 'completed';
			await nextTick();

			expect(entryPoint.announcedBeforeThisVisit.value).toBe(true);
			expect(entryPoint.showRecapCta.value).toBe(true);
		});

		// The CTA is right as soon as the card can render it, not once the pop-up is ready.
		it('does not wait for the rest of the goal data', () => {
			expect(setupEntryPoint().showRecapCta.value).toBe(true);
		});
	});
});
