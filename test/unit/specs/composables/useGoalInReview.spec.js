import useGoalInReview, {
	getGoalInReviewTargetYear,
} from '#src/composables/useGoalInReview';

describe('useGoalInReview', () => {
	it('defaults the target year from the provided date', () => {
		expect(getGoalInReviewTargetYear(new Date('2028-03-01T00:00:00Z'))).toBe(2028);
	});

	it('returns placeholder slide data for the modal shell', async () => {
		const composable = useGoalInReview();

		const result = await composable.loadGoalInReview({ year: 2027 });

		expect(composable.isEligible.value).toBe(true);
		expect(composable.loading.value).toBe(false);
		expect(result.year).toBe(2027);
		expect(result.goalSummary).toEqual(expect.objectContaining({
			goalName: '2027 impact goal',
			status: 'completed',
		}));
		expect(result.loanStats).toEqual(expect.objectContaining({
			borrowers: 14,
			percentComplete: 100,
		}));
		expect(result.borrowerList).toHaveLength(1);
		expect(result.geography).toEqual(expect.objectContaining({
			bordersCrossed: 1,
		}));
		expect(result.sectors).toHaveLength(1);
		expect(result.goalInsights).toEqual(expect.objectContaining({
			setMonth: 'January',
			percentile: 95,
		}));
		expect(result.wrapUp).toEqual(expect.objectContaining({
			headline: 'Your goal changed everything.',
		}));
	});
});
