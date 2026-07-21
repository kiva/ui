export function buildSampleGoalInReviewData(year) {
	return {
		year,
		isEligible: true,
		goalSummary: {
			goalName: `${year} impact goal`,
			category: 'women',
			target: 14,
			status: 'completed',
			setMonth: 'January',
		},
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
