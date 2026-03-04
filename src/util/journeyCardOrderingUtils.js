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
		universalSequence.push({});
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
