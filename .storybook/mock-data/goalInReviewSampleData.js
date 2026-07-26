export function buildSampleGoalInReviewData(year) {
	return {
		year,
		isEligible: true,
		firstName: 'Alexandra',
		goalSummary: {
			goalName: `${year} impact goal`,
			category: 'womens-equality',
			target: 14,
			status: 'completed',
			setMonth: 'January',
			dateStarted: `${year}-01-15`,
			transactionSessionCount: 6,
		},
		// TODO: supplied by the parent page from its own percentile query once
		// integrated (kept separate from goalSummary). A value >= 80 activates the
		// GoalInReviewSlide4 "Top X%" habit variant; otherwise it falls back to
		// session-based copy.
		lifetimePercentile: null,
		loanStats: {
			totalLent: 1025,
			borrowers: 14,
			percentComplete: 100,
		},
		borrowerList: [
			{
				name: 'Sample borrower',
				country: 'Sample country',
				sector: 'Sample sector',
			},
		],
		geography: {
			countries: ['Sample country'],
			bordersCrossed: 1,
		},
		sectors: [
			{
				name: 'Sample sector',
				percentage: 100,
			},
		],
		goalInsights: {
			setMonth: 'January',
			percentile: 95,
		},
		wrapUp: {
			headline: 'Your goal changed everything.',
			shareUrl: null,
		},
	};
}
