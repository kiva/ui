import { isNonBadgeSlide } from '#src/util/achievementUtils';
import {
	getRichTextUiSettingsData,
	getSlidePrimaryCtaText,
	getSlideSecondaryCtaText,
} from '#src/util/myKiva/myKivaContentfulUtils';

export const MYKIVA_INPUT_FORM_KEY = 'mykiva-input-form';
export const REFER_FRIEND_MODAL_KEY = 'refer-friend';
export const JOURNEY_MODAL_KEY = 'journey';

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
 * Extracts URL params from a URL string
 * @param {string} url
 * @returns {string|undefined}
 */
export const getUrlParamsFromString = url => {
	const urlSplit = url.split('?');
	return urlSplit[1];
};

/**
 * Handles primary CTA click with optional modal support
 * @param {Object} params
 * @param {Object} params.slide - The slide object
 * @param {Function} params.trackEvent - Event tracking function ($kvTrackEvent)
 * @param {Function} params.navigate - Router navigation function (router.push)
 * @param {Object} [params.modalHandlers] - Optional modal handlers
 * @param {Function} [params.modalHandlers.openSharingModal] - Opens sharing modal
 */
export const handlePrimaryCtaClick = ({
	slide,
	trackEvent,
	navigate,
	modalHandlers = {},
}) => {
	const data = getRichTextUiSettingsData(slide);
	const primaryCtaUrl = data.primaryCtaUrl || '';
	const ctaLabel = `primary-cta-${getSlidePrimaryCtaText(slide)}`;
	trackEvent('portfolio', 'click', ctaLabel, data.achievementKey);

	const urlParams = getUrlParamsFromString(primaryCtaUrl);

	if (urlParams && urlParams.includes(REFER_FRIEND_MODAL_KEY) && modalHandlers.openSharingModal) {
		const paramsSplit = urlParams.split('=');
		if (paramsSplit && paramsSplit[1] === 'true') {
			modalHandlers.openSharingModal();
			return;
		}
	}
	navigate(primaryCtaUrl);
};

/**
 * Handles secondary CTA click with optional modal support
 * @param {Object} params
 * @param {Object} params.slide - The slide object
 * @param {Function} params.trackEvent - Event tracking function ($kvTrackEvent)
 * @param {Function} params.navigate - Router navigation function (router.push)
 * @param {Object} [params.modalHandlers] - Optional modal handlers
 * @param {Function} [params.modalHandlers.updateJourney] - Emits update-journey event
 */
export const handleSecondaryCtaClick = ({
	slide,
	trackEvent,
	navigate,
	modalHandlers = {},
}) => {
	const data = getRichTextUiSettingsData(slide);
	const secondaryCtaUrl = data.secondaryCtaUrl || '';
	const ctaLabel = `secondary-cta-${getSlideSecondaryCtaText(slide)}`;
	trackEvent('portfolio', 'click', ctaLabel, data.achievementKey);

	const urlParams = getUrlParamsFromString(secondaryCtaUrl);

	if (urlParams && urlParams.includes(JOURNEY_MODAL_KEY) && modalHandlers.updateJourney) {
		modalHandlers.updateJourney(data.achievementKey);
		return;
	}
	navigate(secondaryCtaUrl);
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
