import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import goalCopy from '#src/util/goalCopy';

describe('goalCopy', () => {
	describe('titleNoHistoryWomensDefault', () => {
		it('uses eco-green-3 highlight by default', () => {
			const result = goalCopy.titleNoHistoryWomensDefault();
			expect(result).toContain('class="tw-text-eco-green-3"');
			expect(result).toContain('3 women');
			expect(result).toContain('a year!');
		});

		it('accepts a custom CSS class', () => {
			const result = goalCopy.titleNoHistoryWomensDefault('tw-text-action');
			expect(result).toContain('class="tw-text-action"');
			expect(result).not.toContain('tw-text-eco-green-3');
		});
	});

	describe('titleLastYearSingleWoman', () => {
		it('formats singular woman copy with count and default class', () => {
			const result = goalCopy.titleLastYearSingleWoman(1);
			expect(result).toContain('1 woman');
			expect(result).toContain('shape her future!');
			expect(result).toContain('class="tw-text-eco-green-3"');
		});

		it('accepts a custom CSS class', () => {
			const result = goalCopy.titleLastYearSingleWoman(1, 'tw-text-action');
			expect(result).toContain('class="tw-text-action"');
		});
	});

	describe('titleLastYearMultiplePeople', () => {
		it('formats plural copy with count, label, and default class', () => {
			const result = goalCopy.titleLastYearMultiplePeople(5, 'women');
			expect(result).toContain('5 women');
			expect(result).toContain('shape their futures!');
			expect(result).toContain('class="tw-text-eco-green-3"');
		});

		it('supports category labels like "people" and "U.S. entrepreneurs"', () => {
			expect(goalCopy.titleLastYearMultiplePeople(3, 'people')).toContain('3 people');
			expect(goalCopy.titleLastYearMultiplePeople(2, 'U.S. entrepreneurs')).toContain('2 U.S. entrepreneurs');
		});

		it('accepts a custom CSS class', () => {
			const result = goalCopy.titleLastYearMultiplePeople(4, 'women', 'tw-text-action');
			expect(result).toContain('class="tw-text-action"');
		});
	});

	describe('titleCategoryHowManyLoans', () => {
		it('wraps the category name in an eco-green span', () => {
			const result = goalCopy.titleCategoryHowManyLoans('refugees');
			expect(result).toContain('<span class="tw-text-eco-green-3">refugees</span>');
			expect(result).toContain('will you make this year?');
		});
	});

	describe('subtitleLoansAlreadyMade', () => {
		it('uses plural "loans" for counts above 1', () => {
			const result = goalCopy.subtitleLoansAlreadyMade(3);
			expect(result).toContain('3 loans');
			expect(result).toContain('that will count!');
		});

		it('uses singular "loan" for a count of 1', () => {
			const result = goalCopy.subtitleLoansAlreadyMade(1);
			expect(result).toContain('1 loan');
			expect(result).not.toContain('1 loans');
		});

		it('applies tw-font-medium when showBold is true (default)', () => {
			expect(goalCopy.subtitleLoansAlreadyMade(2)).toContain('class="tw-font-medium"');
		});

		it('omits tw-font-medium when showBold is false', () => {
			expect(goalCopy.subtitleLoansAlreadyMade(2, false)).not.toContain('tw-font-medium');
		});
	});

	describe('year-dependent constants', () => {
		it('BUTTON_SET_GOAL contains the current year', () => {
			expect(goalCopy.BUTTON_SET_GOAL).toContain(String(GOALS_CURRENT_YEAR));
			expect(goalCopy.BUTTON_SET_GOAL).toContain('goal');
		});

		it('BUTTON_UPDATE_GOAL contains the current year', () => {
			expect(goalCopy.BUTTON_UPDATE_GOAL).toContain(String(GOALS_CURRENT_YEAR));
		});

		it('RING_TITLE_SUPPORT_ALL_CARD contains the current year', () => {
			expect(goalCopy.RING_TITLE_SUPPORT_ALL_CARD).toContain(String(GOALS_CURRENT_YEAR));
		});

		it('RING_TITLE_US_ENTREPRENEURS_CARD contains the current year', () => {
			expect(goalCopy.RING_TITLE_US_ENTREPRENEURS_CARD).toContain(String(GOALS_CURRENT_YEAR));
		});
	});

	describe('ringTitleCategoryCard', () => {
		it('includes the year and the category name', () => {
			const result = goalCopy.ringTitleCategoryCard('basic needs');
			expect(result).toContain(String(GOALS_CURRENT_YEAR));
			expect(result).toContain('basic needs');
		});
	});

	describe('ringDescProgressCompleted', () => {
		it('includes the loan count and current year', () => {
			const result = goalCopy.ringDescProgressCompleted(10);
			expect(result).toContain('10 lives');
			expect(result).toContain(String(GOALS_CURRENT_YEAR));
		});
	});

	describe('customAmountBelowYearProgress', () => {
		it('includes the count and loan word in bold', () => {
			const result = goalCopy.customAmountBelowYearProgress(3, 'loans');
			expect(result).toContain('<strong>3 loans</strong>');
			expect(result).toContain('already made this year');
		});
	});

	describe('CUSTOM_AMOUNT_INVALID', () => {
		it('is a non-empty string', () => {
			expect(goalCopy.CUSTOM_AMOUNT_INVALID).toBeTruthy();
		});
	});

	describe('static copy values', () => {
		it('TITLE_HOW_MANY_LOANS_GENERIC is defined', () => {
			expect(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC).toBeTruthy();
		});

		it('TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS includes the category label', () => {
			expect(goalCopy.TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS).toContain('U.S. entrepreneurs');
		});

		it('experiment card copy is defined', () => {
			expect(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT).toBeTruthy();
			expect(goalCopy.CARD_HABIT_PROMPT_EXPERIMENT).toBeTruthy();
		});

		it('ring title modal states are distinct', () => {
			expect(goalCopy.RING_TITLE_GOAL_COMPLETED).not.toBe(goalCopy.RING_TITLE_GOAL_UPDATED);
			expect(goalCopy.RING_TITLE_GOAL_UPDATED).not.toBe(goalCopy.RING_TITLE_GOAL_SET);
		});

		it('ring progress descriptions are all distinct', () => {
			const descs = [
				goalCopy.RING_DESC_NOT_STARTED,
				goalCopy.RING_DESC_PROGRESS_BEGUN,
				goalCopy.RING_DESC_PROGRESS_HALFWAY,
				goalCopy.RING_DESC_PROGRESS_ALMOST_DONE,
			];
			expect(new Set(descs).size).toBe(descs.length);
		});

		it('ring button copy values are all distinct', () => {
			const buttons = [
				goalCopy.RING_BUTTON_GOAL_COMPLETED,
				goalCopy.RING_BUTTON_HAS_PROGRESS_ON_MYKIVA,
				goalCopy.RING_BUTTON_NEW_GOAL,
				goalCopy.RING_BUTTON_CARD_GOAL_COMPLETED,
				goalCopy.RING_BUTTON_CARD_IN_PROGRESS,
			];
			expect(new Set(buttons).size).toBe(buttons.length);
		});
	});
});
