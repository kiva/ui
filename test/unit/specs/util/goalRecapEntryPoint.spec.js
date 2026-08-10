import { getRecapEntryCutoff, shouldShowRecapEntryPoint } from '#src/util/goalRecapEntryPoint';

const GOAL_YEAR = 2026;
const NEXT_YEAR = 2027;

const currentYearComplete = {
	enabled: true,
	goalStatus: 'completed',
	goalYear: GOAL_YEAR,
	currentYear: GOAL_YEAR,
	now: new Date(GOAL_YEAR, 11, 20),
};

const nextYearComplete = {
	enabled: true,
	goalStatus: 'completed',
	goalYear: GOAL_YEAR,
	currentYear: NEXT_YEAR,
	hasCurrentYearGoal: false,
	now: new Date(NEXT_YEAR, 0, 15),
};

const nextYearUnfinished = {
	...nextYearComplete,
	goalStatus: 'expired',
	loansTowardGoal: 3,
};

describe('goalRecapEntryPoint.js', () => {
	describe('current goal year', () => {
		it('offers the recap on a completed goal', () => {
			expect(shouldShowRecapEntryPoint(currentYearComplete)).toBe(true);
		});

		it('stays completion-focused while the goal is in progress', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, goalStatus: 'in-progress' })).toBe(false);
		});

		it('offers nothing for an in-progress goal that already has loans', () => {
			expect(shouldShowRecapEntryPoint({
				...currentYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 4,
			})).toBe(false);
		});
	});

	describe('next goal year', () => {
		it('offers the recap on a completed past goal', () => {
			expect(shouldShowRecapEntryPoint(nextYearComplete)).toBe(true);
		});

		it('offers the recap on an unfinished past goal that got loans', () => {
			expect(shouldShowRecapEntryPoint(nextYearUnfinished)).toBe(true);
		});

		it('offers nothing on an unfinished past goal with no loans', () => {
			expect(shouldShowRecapEntryPoint({ ...nextYearUnfinished, loansTowardGoal: 0 })).toBe(false);
		});

		it('stops once this year\'s goal is set', () => {
			expect(shouldShowRecapEntryPoint({ ...nextYearComplete, hasCurrentYearGoal: true })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...nextYearUnfinished, hasCurrentYearGoal: true })).toBe(false);
		});
	});

	describe('a past goal that was never renewed', () => {
		// It stays on the current goal tile rather than moving to the history list, so it
		// arrives with an in-progress status and its progress as the loan count.
		it('offers the recap when it got loans', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 2,
			})).toBe(true);
		});

		it('offers nothing when it never got a loan', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalStatus: 'in-progress',
				loansTowardGoal: 0,
			})).toBe(false);
		});
	});

	describe('the March 31 cutoff', () => {
		it('still offers the recap on the last day', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				now: new Date(NEXT_YEAR, 2, 31, 23, 59, 59),
			})).toBe(true);
		});

		it('stops the day after', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				now: new Date(NEXT_YEAR, 3, 1),
			})).toBe(false);
			expect(shouldShowRecapEntryPoint({
				...nextYearUnfinished,
				now: new Date(NEXT_YEAR, 3, 1),
			})).toBe(false);
		});

		it('derives the cutoff from the goal year rather than a fixed year', () => {
			expect(getRecapEntryCutoff(2026).getFullYear()).toBe(2027);
			expect(getRecapEntryCutoff(2030).getFullYear()).toBe(2031);
			expect(getRecapEntryCutoff(2026).getMonth()).toBe(2);
			expect(getRecapEntryCutoff(2026).getDate()).toBe(31);
		});

		it('leaves an older goal out, since its own cutoff has long passed', () => {
			expect(shouldShowRecapEntryPoint({
				...nextYearComplete,
				goalYear: 2024,
				now: new Date(NEXT_YEAR, 0, 15),
			})).toBe(false);
		});
	});

	describe('offers nothing', () => {
		it('when the feature flag is off', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, enabled: false })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...nextYearComplete, enabled: false })).toBe(false);
		});

		it('for a goal year in the future', () => {
			expect(shouldShowRecapEntryPoint({
				...currentYearComplete,
				goalYear: NEXT_YEAR,
				currentYear: GOAL_YEAR,
			})).toBe(false);
		});

		it('when the year is unknown', () => {
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, goalYear: null })).toBe(false);
			expect(shouldShowRecapEntryPoint({ ...currentYearComplete, currentYear: null })).toBe(false);
		});

		it('for a call with nothing passed at all', () => {
			expect(shouldShowRecapEntryPoint()).toBe(false);
		});
	});
});
