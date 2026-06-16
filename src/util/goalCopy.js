import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import getGoalSignupCopyVariant, {
	GOAL_SIGNUP_COPY_VARIANT,
} from '#src/util/goalSignupCopyVariant';
import {
	ID_SUPPORT_ALL,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
} from '#src/composables/useBadgeData';

const highlight = (text, cssClass) => `<span class="${cssClass}">${text}</span>`;
const bold = (text, cssClass) => `<strong class="${cssClass}">${text}</strong>`;
const ecoGreen = text => highlight(text, 'tw-text-eco-green-3');

export const GOAL_SIGNUP_COPY_LAST_YEAR = GOAL_SIGNUP_COPY_VARIANT.LAST_YEAR;
export const GOAL_SIGNUP_COPY_NO_GOAL_YET = GOAL_SIGNUP_COPY_VARIANT.NO_GOAL_YET;

const goalCopy = {
	// ─── Shared title copy (GoalEntrypoint, NextYearGoalCard, GoalSelector) ────

	/**
	 * Jan 1 through Mar 31 uses prior-year impact copy; Apr 1 onward uses
	 * the direct no-goal-yet copy for the new annual goal cycle.
	 */
	getGoalSignupCopyVariant(date) {
		return getGoalSignupCopyVariant(date ? { now: date } : undefined);
	},

	/** No lending history and default womens category */
	// eslint-disable-next-line max-len
	titleNoHistoryWomensDefault: (cssClass = 'tw-text-eco-green-3') => `Lenders like you help ${highlight('3 women', cssClass)} a year!`,

	/** Date-aware no-goal title for default womens category */
	titleNoGoalYetWomensDefault(cssClass = 'tw-text-eco-green-3') {
		if (this.getGoalSignupCopyVariant() === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
			return this.CARD_NO_GOAL_YET_EXPERIMENT;
		}
		return this.titleNoHistoryWomensDefault(cssClass);
	},

	/** Date-aware no-goal subtitle for goal card entrypoints */
	subtitleNoGoalYetEntrypoint() {
		if (this.getGoalSignupCopyVariant() === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
			return this.CARD_HABIT_PROMPT_SINGLE_LINE;
		}
		return this.TITLE_HOW_MANY_LOANS_GENERIC;
	},

	/** User helped exactly 1 woman last year */
	// eslint-disable-next-line max-len
	titleLastYearSingleWoman: (count, cssClass = 'tw-text-eco-green-3') => `Last year, you helped ${highlight(`${count} woman`, cssClass)} shape her future!`,

	/** User helped multiple people last year (any category) */
	// eslint-disable-next-line max-len
	titleLastYearMultiplePeople: (count, categoryLabel, cssClass = 'tw-text-eco-green-3') => `Last year, you helped ${highlight(`${count} ${categoryLabel}`, cssClass)} shape their futures!`,

	/** Date-aware title for the womens category using last-year lending history when available */
	titleGoalSignupWomensLastYear(loansLastYear = 0, cssClass = 'tw-text-eco-green-3') {
		if (this.getGoalSignupCopyVariant() === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
			return this.CARD_NO_GOAL_YET_EXPERIMENT;
		}
		if (loansLastYear === 1) {
			return this.titleLastYearSingleWoman(loansLastYear, cssClass);
		}
		if (loansLastYear > 1) {
			return this.titleLastYearMultiplePeople(loansLastYear, 'women', cssClass);
		}
		return this.titleNoHistoryWomensDefault(cssClass);
	},

	/** User helped loans last year — resolves the per-category noun and delegates to titleLastYearMultiplePeople */
	titleLastYearForCategory(loans, categoryId, categoryName, cssClass = 'tw-text-eco-green-3') {
		const labels = {
			[ID_SUPPORT_ALL]: 'people',
			[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
		};
		const label = labels[categoryId] ?? categoryName?.toLowerCase() ?? '';
		return this.titleLastYearMultiplePeople(loans, label, cssClass);
	},

	// ─── Goal selector title copy ──────────────────────────────────────────────

	/** No category-specific lending history — generic loan count question */
	TITLE_HOW_MANY_LOANS_GENERIC: 'How many loans will you make this year?',

	/** US Economic Equality category */
	// eslint-disable-next-line max-len
	TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS: `How many loans to ${ecoGreen('U.S. entrepreneurs')} will you make this year?`,

	/** Specific named category */
	titleCategoryHowManyLoans(categoryName, { splitQuestion = false } = {}) {
		const separator = splitQuestion ? '<br>' : ' ';
		return `How many loans to ${ecoGreen(categoryName)}${separator}will you make this year?`;
	},

	/** Direct no-goal-yet title used by selector entrypoints */
	titleNoGoalYetSelectorEntrypoint({ compactIntro = false } = {}) {
		const intro = compactIntro
			? `<span class="tw-text-base tw-font-book">${this.CARD_NO_GOAL_YET_EXPERIMENT}</span>`
			: this.CARD_NO_GOAL_YET_EXPERIMENT;
		return `${intro}<br>${this.CARD_HABIT_PROMPT_SHORT}`;
	},

	/** Generic category question used by direct goal-selector flows */
	titleLoanQuestionForCategory(categoryId, categoryName, options = {}) {
		if (categoryId === ID_SUPPORT_ALL) {
			return this.TITLE_HOW_MANY_LOANS_GENERIC;
		}
		if (categoryId === ID_US_ECONOMIC_EQUALITY) {
			if (options.splitQuestion) {
				return this.titleCategoryHowManyLoans('U.S. entrepreneurs', options);
			}
			return this.TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS;
		}
		return this.titleCategoryHowManyLoans(categoryName?.toLowerCase(), options);
	},

	// ─── Goal selector subtitle ────────────────────────────────────────────────

	/** User already has loan progress toward the goal this year */
	subtitleLoansAlreadyMade(count, showBold = true) {
		const loanWord = count === 1 ? 'loan' : 'loans';
		const attr = showBold ? 'class="tw-font-medium"' : '';
		return `You’ve already made <span ${attr}>${count} ${loanWord}</span> that will count!`;
	},

	// ─── Goal selector custom amount validation errors ────────────────────────

	/** Custom amount is less than loans already made this year */
	// eslint-disable-next-line max-len
	customAmountBelowYearProgress: (count, loanWord) => `Enter a number higher than the <strong>${count} ${loanWord}</strong> you've already made this year`,

	/** Custom amount is not a valid number above 1 */
	CUSTOM_AMOUNT_INVALID: 'Your goal must be a valid number above 1 loan',

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

	/** Single-line habit prompt used where the subtitle should not force a line break */
	CARD_HABIT_PROMPT_SINGLE_LINE: "Make helping others a habit. We'll help you make it happen.",

	/** Short habit prompt used inside the goal selector title */
	CARD_HABIT_PROMPT_SHORT: 'Make helping others a habit.',

	// ─── GoalProgressRing — modal description text ───────────────────────────────

	/** Modal: goal completed — "Thank you for supporting X [category]..." */
	modalDescriptionCompleted(loans, categoryId, cssClass = 'tw-text-brand') {
		const loansTag = highlight(loans, cssClass);
		const suffix = 'and turning your commitment into impact.';
		const nouns = {
			[ID_SUPPORT_ALL]: 'borrowers',
			[ID_CLIMATE_ACTION]: 'eco-friendly loans',
			[ID_REFUGEE_EQUALITY]: 'refugees',
			[ID_BASIC_NEEDS]: 'basic needs loans',
			[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
		};
		const noun = nouns[categoryId] ?? 'women';
		return `Thank you for supporting ${loansTag} ${highlight(noun, cssClass)} ${suffix}`;
	},

	/** Modal: loans in progress — "You’re already on your way to making X loans..." */
	modalDescriptionInProgress(loans, categoryId, cssClass = 'tw-text-brand') {
		const prefix = "You're already on your way to making";
		const loansTag = bold(`${loans} loans`, cssClass);
		if (categoryId === ID_SUPPORT_ALL) return `${prefix} ${loansTag} this year.`;
		// eslint-disable-next-line max-len
		if (categoryId === ID_CLIMATE_ACTION) return `${prefix} ${bold(`${loans} eco-friendly loans`, cssClass)} this year.`;
		const categoryNouns = {
			[ID_REFUGEE_EQUALITY]: 'refugees',
			[ID_BASIC_NEEDS]: 'basic needs',
			[ID_US_ECONOMIC_EQUALITY]: 'U.S. entrepreneurs',
		};
		const noun = categoryNouns[categoryId] ?? 'women';
		return `${prefix} ${loansTag} to ${bold(noun, cssClass)} this year.`;
	},

	/** Modal: goal just set, no progress — "Your support to X loans begins here." */
	modalDescriptionJustSet(loans, categoryId, categoryName, cssClass = 'tw-text-brand') {
		const loansTag = highlight(`${loans} loans`, cssClass);
		if (categoryId === ID_SUPPORT_ALL) return `Your support to ${loansTag} begins here.`;
		const formattedCategory = categoryId === ID_US_ECONOMIC_EQUALITY
			? categoryName
			: categoryName?.toLowerCase() || '';
		return `Your support to ${loansTag} for ${highlight(formattedCategory, cssClass)} begins here.`;
	},

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
