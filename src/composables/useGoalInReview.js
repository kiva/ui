import {
	computed,
	ref,
} from 'vue';

import { buildSampleGoalInReviewData } from '../../.storybook/mock-data/goalInReviewSampleData';

// Open the Goal In Review recap from MyKiva with /mykiva?goTo=goal-recap.
export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

/**
 * Gets the recap year from the provided date.
 *
 * @param {Date} date Source date for determining the recap year.
 * @returns {number} Full year used for Goal In Review data.
 */
export function getGoalInReviewTargetYear(date = new Date()) {
	return date.getFullYear();
}

/**
 * Provides Goal In Review modal state and loads the shared recap payload.
 *
 * @returns {object} Goal In Review state, eligibility, and loading function.
 */
export default function useGoalInReview() {
	const loading = ref(false);
	const goalInReviewData = ref(null);

	const isEligible = computed(() => Boolean(goalInReviewData.value?.isEligible));

	/**
	 * Loads the recap data used by the modal and its slides.
	 *
	 * @param {object} options Load options.
	 * @param {number} options.year Recap year to load.
	 * @returns {Promise<object>} Goal In Review data payload.
	 */
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
