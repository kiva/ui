import useGoalInReview, {
	getGoalInReviewTargetYear,
} from '#src/composables/useGoalInReview';

describe('useGoalInReview', () => {
	it('defaults the target year from the provided date', () => {
		expect(getGoalInReviewTargetYear(new Date('2028-03-01T00:00:00Z'))).toBe(2028);
	});

	it('loads the recap payload for the requested year', async () => {
		const composable = useGoalInReview();

		const result = await composable.loadGoalInReview({ year: 2027 });

		expect(result.year).toBe(2027);
		expect(composable.goalInReviewData.value).toBe(result);
		expect(composable.isEligible.value).toBe(true);
		expect(composable.loading.value).toBe(false);
	});

	it('defaults to the current recap year', async () => {
		const { loadGoalInReview } = useGoalInReview();

		const result = await loadGoalInReview();

		expect(result.year).toBe(getGoalInReviewTargetYear());
	});
});
