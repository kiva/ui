import { isNonBadgeSlide, defaultBadges } from '#src/util/achievementUtils';
import {
	getRichTextUiSettingsData,
	getSlidePrimaryCtaText,
	getSlideSecondaryCtaText,
} from '#src/util/myKiva/myKivaContentfulUtils';

export const MYKIVA_INPUT_FORM_KEY = 'mykiva-input-form';
export const REFER_FRIEND_MODAL_KEY = 'refer-friend';
export const JOURNEY_MODAL_KEY = 'journey';

// Post-lending card slot keys used by topRowPriorityCards
export const PRIORITY_CARD_GOAL = 'goal';
export const PRIORITY_CARD_EMAIL = 'email';
export const PRIORITY_CARD_LATEST_LOAN = 'latestLoan';
export const PRIORITY_CARD_SURVEY = 'survey';

/**
 * Checks if a loan is fully anonymous
 * @param {Object|null} loan
 * @returns {boolean}
 */
export const isLoanAnonymous = loan => loan?.anonymizationLevel?.toLowerCase() === 'full';

/**
 * Core visibility check for the email marketing card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {Object|null} params.latestLoan
 * @param {boolean|null} params.hasMailUpdatesOptOut
 * @param {number} params.loansCount
 * @returns {boolean}
 */
export const checkShouldShowEmailMarketing = ({
	showPostLendingNextStepsCards,
	latestLoan,
	hasMailUpdatesOptOut,
	loansCount,
}) => {
	return showPostLendingNextStepsCards
		&& !isLoanAnonymous(latestLoan)
		&& hasMailUpdatesOptOut !== false && (loansCount > 0 || latestLoan !== null);
};

/**
 * Core visibility check for the latest loan card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {Object|null} params.latestLoan
 * @returns {boolean}
 */
export const checkShowLatestLoan = ({
	showPostLendingNextStepsCards,
	latestLoan,
}) => {
	return !!showPostLendingNextStepsCards
		&& !!latestLoan && !isLoanAnonymous(latestLoan);
};

/**
 * Core visibility check for the survey card
 * @param {Object} params
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {Object} params.userInfo
 * @returns {boolean}
 */
export const checkShowSurveyCard = ({
	showPostLendingNextStepsCards,
	userInfo,
}) => {
	const userPreferences = userInfo?.userPreferences || {};
	const parsedPrefs = JSON.parse(userPreferences.preferences || '{}');
	const isFormSubmitted = (parsedPrefs.savedForms || []).some(
		form => form.formName === MYKIVA_INPUT_FORM_KEY
	);
	return showPostLendingNextStepsCards && !isFormSubmitted;
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
	return urlSplit[1] ?? undefined;
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
 * Determines which post-lending cards occupy the top row carousel slots.
 * Returns a Set of slot keys (e.g. 'goal', 'email', 'latestLoan', 'survey').
 *
 * @param {Object} params
 * @param {boolean} params.showRegionExperienceInFirstRow - Whether region experience is in the first row
 * @param {boolean} params.showPostLendingNextStepsCards - Whether post-lending cards are active
 * @param {boolean} params.hideCompletedGoalCard - Whether the completed goal card is hidden
 * @param {boolean} params.shouldShowEmailMarketingCard - Email marketing card visibility
 * @param {boolean} params.showLatestLoan - Latest loan card visibility
 * @param {boolean} params.showSurveyCard - Survey card visibility
 * @returns {Set<string>}
 */
export const getTopRowPriorityCards = ({
	showRegionExperienceInFirstRow,
	showPostLendingNextStepsCards,
	hideCompletedGoalCard,
	shouldShowEmailMarketingCard,
	showLatestLoan,
	showSurveyCard,
}) => {
	if (showRegionExperienceInFirstRow) return new Set();
	if (!showPostLendingNextStepsCards) return new Set();
	const topRowSlidesCount = 3;
	const goalCardVisible = !hideCompletedGoalCard;
	const slots = [];
	if (goalCardVisible) slots.push(PRIORITY_CARD_GOAL);
	if (shouldShowEmailMarketingCard) {
		slots.push(PRIORITY_CARD_EMAIL);
	} else if (showLatestLoan) {
		slots.push(PRIORITY_CARD_LATEST_LOAN);
	}
	if (shouldShowEmailMarketingCard && showLatestLoan) {
		slots.push(PRIORITY_CARD_LATEST_LOAN);
	}
	if (showSurveyCard && (!goalCardVisible || !shouldShowEmailMarketingCard)) {
		slots.push(PRIORITY_CARD_SURVEY);
	}
	return new Set(slots.slice(0, topRowSlidesCount));
};

/**
 * Determines which achievement badge keys appear in the top row carousel
 * so they can be excluded from the bottom row.
 *
 * @param {Object} params
 * @param {boolean} params.showRegionExperienceInFirstRow
 * @param {boolean} params.showPostLendingNextStepsCards
 * @param {boolean} params.hideCompletedGoalCard
 * @param {Set<string>} params.topRowPriorityCards - Result of getTopRowPriorityCards
 * @param {Array} params.sortedAchievementSlides - Achievement slides sorted by milestoneDiff
 * @returns {Set<string>}
 */
export const getTopRowAchievementKeys = ({
	showRegionExperienceInFirstRow,
	showPostLendingNextStepsCards,
	hideCompletedGoalCard,
	topRowPriorityCards,
	sortedAchievementSlides,
}) => {
	if (showRegionExperienceInFirstRow) {
		// When region is in first row with completed goal, 1 achievement fills the goal card slot
		const achievementSlots = hideCompletedGoalCard ? 1 : 0;
		return new Set(sortedAchievementSlides.slice(0, achievementSlots).map(s => s.badgeKey));
	}

	const topRowSlidesCount = 3;

	const goalSlot = !showPostLendingNextStepsCards && !hideCompletedGoalCard ? 1 : 0;
	const achievementSlotsInTopRow = Math.max(
		topRowSlidesCount - goalSlot - topRowPriorityCards.size,
		0
	);
	return new Set(sortedAchievementSlides.slice(0, achievementSlotsInTopRow).map(s => s.badgeKey));
};

/**
 * Build achievement slides from badge data and contentful slides
 *
 * @param {Object} options
 * @param {Array} options.badgesData - Combined badge + contentful data (from combineBadgeData)
 * @param {Array} options.slides - Contentful carousel slides
 * @param {Boolean} options.includeMilestoneDiff - Whether to include milestoneDiff
 * @param {Function} options.isTieredAchievementComplete - From useBadgeData
 * @param {Function} options.getActiveTierData - From useBadgeData
 * @param {String} options.userGoalCategory - User's goal category ID (optional)
 * @returns {Array} Achievement slide objects
 */
export const buildAchievementSlides = ({
	badgesData,
	slides,
	getActiveTierData,
	isTieredAchievementComplete,
	includeMilestoneDiff = false,
	sortByMilestoneDiff = false,
	userGoalCategory = null,
}) => {
	const achievementSlides = [];
	defaultBadges.forEach(badgeKey => {
		const achievementContent = (badgesData ?? []).find(achievement => badgeKey === achievement.id);
		if (!achievementContent) return;
		if (isTieredAchievementComplete(achievementContent.achievementData)) return;

		const tier = getActiveTierData(achievementContent);
		if (!tier?.target) return;

		const contentfulData = achievementContent.contentfulData.find(cData => cData.level === tier.level);
		const slideData = slides.find(slide => {
			return getRichTextUiSettingsData(slide)?.achievementKey === badgeKey;
		});

		if (slideData) {
			achievementSlides.push({
				...slideData,
				...(includeMilestoneDiff && {
					milestoneDiff: Math.max(
						tier.target - (achievementContent.achievementData?.totalProgressToAchievement ?? 0),
						0
					),
				}),
				target: tier.target,
				totalProgressToAchievement: achievementContent.achievementData?.totalProgressToAchievement,
				badgeImgUrl: contentfulData?.imageUrl,
				badgeKey,
			});
		}
	});

	if (sortByMilestoneDiff) {
		achievementSlides.sort((a, b) => a.milestoneDiff - b.milestoneDiff);
	}

	// If user has a goal set, move the goal category achievement to the end
	if (userGoalCategory) {
		const goalAchievementIndex = achievementSlides.findIndex(slide => slide.badgeKey === userGoalCategory);
		if (goalAchievementIndex > -1) {
			const [goalAchievement] = achievementSlides.splice(goalAchievementIndex, 1);
			achievementSlides.push(goalAchievement);
		}
	}

	return achievementSlides;
};
