import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';

const highlight = (text, cssClass) => `<span class="${cssClass}">${text}</span>`;
const ecoGreen = text => highlight(text, 'tw-text-eco-green-3');

const goalCopy = {
	// ─── Shared title copy (GoalEntrypoint, NextYearGoalCard, GoalSelector) ────

	/** No lending history and default womens category */
	// eslint-disable-next-line max-len
	titleNoHistoryWomensDefault: (cssClass = 'tw-text-eco-green-3') => `Lenders like you help ${highlight('3 women', cssClass)} a year!`,

	/** User helped exactly 1 woman last year */
	// eslint-disable-next-line max-len
	titleLastYearSingleWoman: (count, cssClass = 'tw-text-eco-green-3') => `Last year, you helped ${highlight(`${count} woman`, cssClass)} shape her future!`,

	/** User helped multiple people last year (any category) */
	// eslint-disable-next-line max-len
	titleLastYearMultiplePeople: (count, categoryLabel, cssClass = 'tw-text-eco-green-3') => `Last year, you helped ${highlight(`${count} ${categoryLabel}`, cssClass)} shape their futures!`,

	// ─── Goal selector title copy ──────────────────────────────────────────────

	/** No category-specific lending history — generic loan count question */
	TITLE_HOW_MANY_LOANS_GENERIC: 'How many loans will you make this year?',

	/** US Economic Equality category */
	// eslint-disable-next-line max-len
	TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS: `How many loans to ${ecoGreen('U.S. entrepreneurs')} will you make this year?`,

	/** Specific named category */
	titleCategoryHowManyLoans: categoryName => `How many loans to ${ecoGreen(categoryName)} will you make this year?`,

	// ─── Goal selector subtitle ────────────────────────────────────────────────

	/** User already has loan progress toward the goal this year */
	subtitleLoansAlreadyMade(count, showBold = true) {
		const loanWord = count === 1 ? 'loan' : 'loans';
		const attr = showBold ? 'class="tw-font-medium"' : '';
		return `You’ve already made <span ${attr}>${count} ${loanWord}</span> that will count!`;
	},

	// ─── Goal selector / NextYearGoalCard buttons ──────────────────────────────

	/** Primary CTA to confirm setting a new goal */
	BUTTON_SET_GOAL: `Set ${GOALS_CURRENT_YEAR} goal`,

	/** Primary CTA to confirm updating an existing goal */
	BUTTON_UPDATE_GOAL: `Update ${GOALS_CURRENT_YEAR} goal`,

	/** Secondary action: go back to change the goal category (from settings or after editing) */
	BUTTON_EDIT_GOAL_CATEGORY: 'Edit goal category',

	/** Secondary action: edit the goal from a non-settings context */
	BUTTON_EDIT_GOAL: 'Edit goal',

	// ─── NextYearGoalCard experiment copy ──────────────────────────────────────

	/** Experiment: user has not set a goal yet */
	CARD_NO_GOAL_YET_EXPERIMENT: "You haven't set your goal yet!",

	/** Experiment: motivational subtitle in the empty goal tile */
	CARD_HABIT_PROMPT_EXPERIMENT: "Make helping others a habit.<br>We'll help you make it happen.",

	// ─── GoalProgressRing — titles ─────────────────────────────────────────────

	/** Modal: user completed their annual goal */
	RING_TITLE_GOAL_COMPLETED: 'You did it! You reached your annual goal',

	/** Modal: user just updated an existing goal */
	RING_TITLE_GOAL_UPDATED: 'Goal updated!',

	/** Modal: user just set a new goal */
	RING_TITLE_GOAL_SET: 'Goal set!',

	/** Card: Support All category — no specific group mentioned */
	RING_TITLE_SUPPORT_ALL_CARD: `Your ${GOALS_CURRENT_YEAR} goal`,

	/** Card: US Economic Equality category */
	RING_TITLE_US_ENTREPRENEURS_CARD: `Your ${GOALS_CURRENT_YEAR} goal to U.S entrepreneurs`,

	/** Card: specific named category */
	ringTitleCategoryCard: categoryName => `Your ${GOALS_CURRENT_YEAR} goal to ${categoryName}`,

	// ─── GoalProgressRing — card progress descriptions ─────────────────────────

	/** Progress at 0%: no loans made yet */
	RING_DESC_NOT_STARTED: 'Get started by making a loan!',

	/** Progress between 0% and 50%: early momentum */
	RING_DESC_PROGRESS_BEGUN: "You've started something powerful.<br>Let's keep it growing together.",

	/** Progress exactly at 50%: halfway milestone */
	RING_DESC_PROGRESS_HALFWAY: 'Halfway to your goal!<br>Every loan fuels a dream.',

	/** Progress above 50% but not yet complete: final stretch */
	RING_DESC_PROGRESS_ALMOST_DONE: "You've brought so many dreams<br>within reach. Finish strong!",

	/** Progress at 100%: goal completed */
	// eslint-disable-next-line max-len
	ringDescProgressCompleted: loans => `Incredible! You reached your ${GOALS_CURRENT_YEAR} <br>goal and changed ${loans} lives!`,

	// ─── GoalProgressRing — buttons ────────────────────────────────────────────

	/** Modal: goal is completed — encourage continued lending */
	RING_BUTTON_GOAL_COMPLETED: 'Continue my impact',

	/** Modal: user already has progress and is viewing from MyKiva */
	RING_BUTTON_HAS_PROGRESS_ON_MYKIVA: 'Track my progress',

	/** Modal: new goal with no existing progress */
	RING_BUTTON_NEW_GOAL: "Let's do this",

	/** Card: goal is 100% complete */
	RING_BUTTON_CARD_GOAL_COMPLETED: 'View impact progress',

	/** Card: goal is in progress */
	RING_BUTTON_CARD_IN_PROGRESS: 'Work towards your goal',
};

export default goalCopy;
