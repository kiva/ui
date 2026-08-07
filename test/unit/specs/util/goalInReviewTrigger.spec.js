import { shouldAutoOpenRecap } from '#src/util/goalInReviewTrigger';

const completed = {
	enabled: true,
	isEligible: true,
	goalStatus: 'completed',
	goalYear: 2026,
	currentGoalYear: 2026,
	hasViewedRecap: false,
	hasCompletionPending: true,
};

const inProgress = {
	...completed,
	goalStatus: 'in-progress',
	hasCompletionPending: false,
};

describe('goalInReviewTrigger.js', () => {
	describe('completed goals', () => {
		it('opens in the session after completion', () => {
			expect(shouldAutoOpenRecap(completed)).toBe(true);
		});

		it('waits on the visit where the completed goal is first seen', () => {
			expect(shouldAutoOpenRecap({ ...completed, hasCompletionPending: false })).toBe(false);
		});

		it('opens for someone who completed before release, on their second visit', () => {
			// back-fill: the first post-release visit arms it, the next one opens it
			expect(shouldAutoOpenRecap({ ...completed, hasCompletionPending: true })).toBe(true);
		});
	});

	describe('in-progress goals', () => {
		it('opens once the feature is live, with no separate date gate', () => {
			expect(shouldAutoOpenRecap(inProgress)).toBe(true);
		});

		it('does not require a pending completion', () => {
			expect(shouldAutoOpenRecap({ ...inProgress, hasCompletionPending: false })).toBe(true);
		});
	});

	describe('opens only once', () => {
		it('never reopens after the recap has been seen', () => {
			expect(shouldAutoOpenRecap({ ...completed, hasViewedRecap: true })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, hasViewedRecap: true })).toBe(false);
		});
	});

	describe('goals it must never open for', () => {
		it('a goal from a previous year', () => {
			expect(shouldAutoOpenRecap({ ...completed, goalYear: 2025 })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, goalYear: 2025 })).toBe(false);
		});

		it('an expired goal', () => {
			expect(shouldAutoOpenRecap({ ...completed, goalStatus: 'expired' })).toBe(false);
		});

		it('a lender with no goal or no loans toward it', () => {
			expect(shouldAutoOpenRecap({ ...completed, isEligible: false })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, isEligible: false })).toBe(false);
		});

		it('anyone, when the feature flag is off', () => {
			expect(shouldAutoOpenRecap({ ...completed, enabled: false })).toBe(false);
			expect(shouldAutoOpenRecap({ ...inProgress, enabled: false })).toBe(false);
		});

		it('a call with nothing passed at all', () => {
			expect(shouldAutoOpenRecap()).toBe(false);
		});
	});

	it('compares goal years loosely, since preferences store them as strings', () => {
		expect(shouldAutoOpenRecap({ ...completed, goalYear: '2026', currentGoalYear: 2026 })).toBe(true);
	});
});
