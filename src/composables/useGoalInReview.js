import {
	computed,
	ref,
} from 'vue';

export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

export function getGoalInReviewTargetYear(date = new Date()) {
	return date.getFullYear();
}

function buildSampleGoalInReviewData(year) {
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

export default function useGoalInReview() {
	const loading = ref(false);
	const goalInReviewData = ref(null);

	const isEligible = computed(() => Boolean(goalInReviewData.value?.isEligible));

	async function loadGoalInReview({
		year = getGoalInReviewTargetYear(),
	} = {}) {
		loading.value = true;
		try {
			// TODO: Replace this placeholder payload with the final backend-backed Goal In Review contract.
			goalInReviewData.value = buildSampleGoalInReviewData(year);
			return goalInReviewData.value;
		} finally {
			loading.value = false;
		}
	}

	return {
		GOAL_RECAP_DEEP_LINK,
		goalInReviewData,
		isEligible,
		loadGoalInReview,
		loading,
	};
}
