import {
	computed,
	ref,
} from 'vue';

import { buildSampleGoalInReviewData } from '../../.storybook/mock-data/goalInReviewSampleData';

// Open the Goal In Review recap from MyKiva with /mykiva?goTo=goal-recap.
export const GOAL_RECAP_DEEP_LINK = 'goal-recap';

/**
 * Returns the current date, applying the ?recapDate=YYYY-MM-DD URL override for dev/QA use only.
 * Once dev/QA testing is complete, this override will be removed.
 *
 * Example: /mykiva?goTo=goal-recap&recapDate=2027-01-01
 *
 * @returns {Date} The effective "now" for Goal In Review logic.
 */
export function getGoalInReviewNow() {
	if (typeof window !== 'undefined') {
		const param = new URLSearchParams(window.location.search).get('recapDate');
		if (param) {
			const override = new Date(param);
			if (!Number.isNaN(override.getTime())) {
				return override;
			}
		}
	}
	return new Date();
}

/**
 * Gets the recap year from the provided date.
 *
 * @param {Date} date Source date for determining the recap year.
 * @returns {number} Full year used for Goal In Review data.
 */
export function getGoalInReviewTargetYear(date = getGoalInReviewNow()) {
	return date.getFullYear();
}

/**
 * Returns the current year, honoring the ?recapDate dev/QA override via getGoalInReviewNow().
 *
 * @returns {number} The current year.
 */
export function getGoalInReviewCurrentYear() {
	return getGoalInReviewNow().getFullYear();
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
