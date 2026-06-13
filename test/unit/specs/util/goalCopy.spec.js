import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import goalCopy, {
	GOAL_SIGNUP_COPY_LAST_YEAR,
	GOAL_SIGNUP_COPY_NO_GOAL_YET,
} from '#src/util/goalCopy';
import {
	ID_SUPPORT_ALL,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
	ID_WOMENS_EQUALITY,
} from '#src/composables/useBadgeData';

const stripHtml = html => html.replace(/<[^>]*>/g, '');

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

	describe('titleNoGoalYetWomensDefault', () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		it('uses original no-history copy from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			const result = goalCopy.titleNoGoalYetWomensDefault();
			expect(result).toContain('Lenders like you help');
			expect(result).toContain('3 women');
		});

		it('uses no-goal-yet copy starting April 1', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-04-01T12:00:00'));

			expect(goalCopy.titleNoGoalYetWomensDefault()).toBe(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		});
	});

	describe('subtitleNoGoalYetEntrypoint', () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		it('uses the loan question from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			expect(goalCopy.subtitleNoGoalYetEntrypoint()).toBe(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		});

		it('uses the habit prompt starting April 1', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-04-01T12:00:00'));

			expect(goalCopy.subtitleNoGoalYetEntrypoint()).toBe(goalCopy.CARD_HABIT_PROMPT_SINGLE_LINE);
		});
	});

	describe('getGoalSignupCopyVariant', () => {
		it('uses last-year copy from January 1 through March 31', () => {
			expect(goalCopy.getGoalSignupCopyVariant(new Date('2026-01-01T12:00:00'))).toBe(GOAL_SIGNUP_COPY_LAST_YEAR);
			expect(goalCopy.getGoalSignupCopyVariant(new Date('2026-03-31T12:00:00'))).toBe(GOAL_SIGNUP_COPY_LAST_YEAR);
		});

		it('uses no-goal-yet copy starting April 1', () => {
			expect(goalCopy.getGoalSignupCopyVariant(new Date('2026-04-01T12:00:00')))
				.toBe(GOAL_SIGNUP_COPY_NO_GOAL_YET);
			expect(goalCopy.getGoalSignupCopyVariant(new Date('2026-12-31T12:00:00')))
				.toBe(GOAL_SIGNUP_COPY_NO_GOAL_YET);
		});
	});

	describe('titleGoalSignupWomensLastYear', () => {
		afterEach(() => {
			vi.useRealTimers();
		});

		it('uses last-year singular copy from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			expect(stripHtml(goalCopy.titleGoalSignupWomensLastYear(1))).toContain(
				'Last year, you helped 1 woman shape her future!'
			);
		});

		it('uses last-year plural copy from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			expect(stripHtml(goalCopy.titleGoalSignupWomensLastYear(2))).toContain(
				'Last year, you helped 2 women shape their futures!'
			);
		});

		it('uses no-goal-yet copy starting April 1 regardless of last-year loans', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-04-01T12:00:00'));

			expect(goalCopy.titleGoalSignupWomensLastYear(2)).toBe(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
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
			expect(result).toContain('<br>will you make this year?');
		});
	});

	describe('titleNoGoalYetSelectorEntrypoint', () => {
		it('combines the no-goal-yet title with the short habit prompt', () => {
			expect(stripHtml(goalCopy.titleNoGoalYetSelectorEntrypoint()))
				.toBe(`${goalCopy.CARD_NO_GOAL_YET_EXPERIMENT}${goalCopy.CARD_HABIT_PROMPT_SHORT}`);
		});

		it('can render a compact intro line', () => {
			const result = goalCopy.titleNoGoalYetSelectorEntrypoint({ compactIntro: true });

			expect(result).toContain(`>${goalCopy.CARD_NO_GOAL_YET_EXPERIMENT}</span>`);
			expect(result).toContain('tw-text-base');
			expect(result).toContain(goalCopy.CARD_HABIT_PROMPT_SHORT);
		});
	});

	describe('titleLoanQuestionForCategory', () => {
		it('uses generic copy for Support All', () => {
			expect(goalCopy.titleLoanQuestionForCategory(ID_SUPPORT_ALL, 'Choose as I go'))
				.toBe(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		});

		it('uses the U.S. Entrepreneurs copy for US Economic Equality', () => {
			expect(goalCopy.titleLoanQuestionForCategory(ID_US_ECONOMIC_EQUALITY, 'U.S. Entrepreneurs'))
				.toBe(goalCopy.TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS);
			expect(goalCopy.TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS).toContain('<br>will you make this year?');
		});

		it('uses category-specific copy for other categories', () => {
			expect(stripHtml(goalCopy.titleLoanQuestionForCategory(ID_WOMENS_EQUALITY, 'Women')))
				.toBe(stripHtml(goalCopy.titleCategoryHowManyLoans('women')));
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

	describe('modalDescriptionCompleted', () => {
		const cases = [
			[ID_WOMENS_EQUALITY, 'women'],
			[ID_SUPPORT_ALL, 'borrowers'],
			[ID_CLIMATE_ACTION, 'eco-friendly loans'],
			[ID_REFUGEE_EQUALITY, 'refugees'],
			[ID_BASIC_NEEDS, 'basic needs loans'],
			[ID_US_ECONOMIC_EQUALITY, 'U.S. entrepreneurs'],
		];

		it.each(cases)('includes correct noun for %s', (categoryId, noun) => {
			const result = stripHtml(goalCopy.modalDescriptionCompleted(5, categoryId));
			expect(result).toContain('5');
			expect(result).toContain(noun);
			expect(result).toContain('Thank you for supporting');
			expect(result).toContain('turning your commitment into impact');
		});

		it('wraps loans and noun in the given cssClass', () => {
			const result = goalCopy.modalDescriptionCompleted(3, ID_WOMENS_EQUALITY, 'tw-text-action');
			expect(result).toContain('class="tw-text-action"');
		});
	});

	describe('modalDescriptionInProgress', () => {
		it('support-all ends with loans count and no category noun', () => {
			const result = stripHtml(goalCopy.modalDescriptionInProgress(4, ID_SUPPORT_ALL));
			expect(result).toBe("You're already on your way to making 4 loans this year.");
		});

		it('climate action uses eco-friendly loans label', () => {
			const result = stripHtml(goalCopy.modalDescriptionInProgress(4, ID_CLIMATE_ACTION));
			expect(result).toBe("You're already on your way to making 4 eco-friendly loans this year.");
		});

		it('category-specific cases include "to [noun]"', () => {
			expect(stripHtml(goalCopy.modalDescriptionInProgress(4, ID_REFUGEE_EQUALITY))).toContain('to refugees');
			expect(stripHtml(goalCopy.modalDescriptionInProgress(4, ID_BASIC_NEEDS))).toContain('to basic needs');
			// eslint-disable-next-line max-len
			expect(stripHtml(goalCopy.modalDescriptionInProgress(4, ID_US_ECONOMIC_EQUALITY))).toContain('to U.S. entrepreneurs');
			expect(stripHtml(goalCopy.modalDescriptionInProgress(4, ID_WOMENS_EQUALITY))).toContain('to women');
		});

		it('wraps content in the given cssClass', () => {
			const result = goalCopy.modalDescriptionInProgress(3, ID_WOMENS_EQUALITY, 'tw-text-action');
			expect(result).toContain('class="tw-text-action"');
		});
	});

	describe('modalDescriptionJustSet', () => {
		it('support-all returns simple "begins here" without category', () => {
			const result = stripHtml(goalCopy.modalDescriptionJustSet(4, ID_SUPPORT_ALL, 'Choose as I go'));
			expect(result).toBe('Your support to 4 loans begins here.');
		});

		it('lowercases the category name for non-US-econ categories', () => {
			const result = stripHtml(goalCopy.modalDescriptionJustSet(4, ID_WOMENS_EQUALITY, 'Women'));
			expect(result).toBe('Your support to 4 loans for women begins here.');
		});

		it('preserves case for US economic equality', () => {
		// eslint-disable-next-line max-len
			const result = stripHtml(goalCopy.modalDescriptionJustSet(4, ID_US_ECONOMIC_EQUALITY, 'U.S. Entrepreneurs'));
			expect(result).toBe('Your support to 4 loans for U.S. Entrepreneurs begins here.');
		});

		it('wraps content in the given cssClass', () => {
			const result = goalCopy.modalDescriptionJustSet(3, ID_WOMENS_EQUALITY, 'Women', 'tw-text-action');
			expect(result).toContain('class="tw-text-action"');
		});
	});
});
