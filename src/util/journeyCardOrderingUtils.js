import { isNonBadgeSlide } from '#src/util/achievementUtils';

export const MYKIVA_INPUT_FORM_KEY = 'mykiva-input-form';

/**
 * Checks if a loan is fully anonymous
 * @param {Object|null} loan
 * @returns {boolean}
 */
export const isLoanAnonymous = loan => loan?.anonymizationLevel === 'full';

/**
 * Core visibility check for the email marketing card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {boolean} params.postLendingNextStepsEnable
 * @param {Object|null} params.latestLoan
 * @param {boolean} params.hasMailUpdatesOptOut - result of userHasMailUpdatesOptOut()
 * @param {number} params.loansCount
 * @returns {boolean}
 */
export const checkShouldShowEmailMarketing = ({
	showPostLendingNextStepsCards,
	postLendingNextStepsEnable,
	latestLoan,
	hasMailUpdatesOptOut,
	loansCount,
}) => {
	return showPostLendingNextStepsCards && postLendingNextStepsEnable
		&& !isLoanAnonymous(latestLoan)
		&& hasMailUpdatesOptOut && (loansCount > 0 || latestLoan !== null);
};

/**
 * Core visibility check for the latest loan card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {boolean} params.postLendingNextStepsEnable
 * @param {Object|null} params.latestLoan
 * @returns {boolean}
 */
export const checkShowLatestLoan = ({
	showPostLendingNextStepsCards,
	postLendingNextStepsEnable,
	latestLoan,
}) => {
	return !!showPostLendingNextStepsCards && !!postLendingNextStepsEnable
		&& !!latestLoan && !isLoanAnonymous(latestLoan);
};

/**
 * Core visibility check for the survey card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {boolean} params.postLendingNextStepsEnable
 * @param {Object} params.userInfo
 * @returns {boolean}
 */
export const checkShowSurveyCard = ({
	showPostLendingNextStepsCards,
	postLendingNextStepsEnable,
	userInfo,
}) => {
	const userPreferences = userInfo?.userPreferences || {};
	const parsedPrefs = JSON.parse(userPreferences.preferences || '{}');
	const isFormSubmitted = (parsedPrefs.savedForms || []).some(
		form => form.formName === MYKIVA_INPUT_FORM_KEY
	);
	return showPostLendingNextStepsCards && !isFormSubmitted && postLendingNextStepsEnable;
};

/**
 * Filters slides to only include non-badge slides
 * @param {Array} slides
 * @returns {Array}
 */
export const filterNonBadgesSlides = slides => {
	return (slides || []).filter(slide => isNonBadgeSlide(slide));
};

/**
* Builds the universal ordered sequence for journey cards
* @param {Object} params
* @param {Array} params.achievementSlides - Pre-filtered achievement slides
* @param {boolean} params.shouldShowGoalCard - Goal card
* @param {boolean} params.shouldShowEmailMarketingCard - Email marketing card
* @param {boolean} params.showLatestLoan - Latest loan card
* @param {boolean} params.showSurveyCard - Survey card
* @param {Array} params.nonBadgesSlides - Pre-filtered non-badges slides
* @param {number|null} params.slidesNumber - Max slides to return (null = no limit)
* @returns {Array} Ordered sequence of slide objects
*/

export const buildUniversalOrderedSlides = ({
	achievementSlides,
	nonBadgesSlides, // friend-referral, lending teams, and kiva cards
	shouldShowGoalCard,
	shouldShowEmailMarketingCard,
	showLatestLoan,
	showSurveyCard,
	slidesNumber = null,
}) => {
	const universalSequence = [];

	// Goal card
	if (shouldShowGoalCard) {
		universalSequence.push({ isGoalCard: true });
	}

	// Achievement cards
	universalSequence.push(...achievementSlides.slice(0, 5));

	// Email marketing or latest loan (if user isn't opted in yet if so, only show latest loan)
	if (shouldShowEmailMarketingCard) {
		universalSequence.push({ isEmailUpdates: true });
	} else if (showLatestLoan) {
		universalSequence.push({ isLatestLoan: true });
	}

	// Both are shown (if user isn't opted and has a recent lent loan)
	if (shouldShowEmailMarketingCard && showLatestLoan) {
		universalSequence.push({ isLatestLoan: true });
	}

	// Survey card
	if (showSurveyCard) {
		universalSequence.push({ isSurveyCard: true });
	}

	// Non-badges slides
	if (nonBadgesSlides?.length > 0) {
		universalSequence.push(...nonBadgesSlides);
	}

	// Apply slide limit if specified
	if (slidesNumber) {
		return universalSequence.slice(0, slidesNumber);
	}

	return universalSequence;
};
