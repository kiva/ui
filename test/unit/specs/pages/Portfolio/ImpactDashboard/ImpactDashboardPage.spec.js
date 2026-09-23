import ImpactDashboardPage from '#src/pages/Portfolio/ImpactDashboard/ImpactDashboardPage';

const IN_PROGRESS_RELEASE = new Date('2026-11-15T00:00:00Z');

describe('ImpactDashboardPage', () => {
	describe('openGoalRecapIfDue', () => {
		const makeContext = overrides => ({
			goalInReviewEnable: true,
			goalInReviewInProgressStart: IN_PROGRESS_RELEASE,
			loadAutoOpenRecap: vi.fn().mockResolvedValue({ year: 2026 }),
			loadGoalPreferences: vi.fn().mockResolvedValue({}),
			hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(false),
			showGoalInReviewModal: false,
			goalInReviewFeedbackSubmitted: false,
			...overrides,
		});

		it('opens the recap on Portfolio when it is due', async () => {
			const context = makeContext();

			await ImpactDashboardPage.methods.openGoalRecapIfDue.call(context);

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({
				enabled: true,
				inProgressStartDate: IN_PROGRESS_RELEASE,
			});
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('stays shut when the composable declines, so it cannot pop on both pages', async () => {
			const context = makeContext({ loadAutoOpenRecap: vi.fn().mockResolvedValue(null) });

			await ImpactDashboardPage.methods.openGoalRecapIfDue.call(context);

			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('passes the flag through', async () => {
			const context = makeContext({
				goalInReviewEnable: false,
				loadAutoOpenRecap: vi.fn().mockResolvedValue(null),
			});

			await ImpactDashboardPage.methods.openGoalRecapIfDue.call(context);

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({
				enabled: false,
				inProgressStartDate: IN_PROGRESS_RELEASE,
			});
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('snapshots the already-submitted feedback flag, without a second preferences fetch', async () => {
			const context = makeContext({ hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(true) });

			await ImpactDashboardPage.methods.openGoalRecapIfDue.call(context);

			expect(context.loadGoalPreferences).not.toHaveBeenCalled();
			expect(context.goalInReviewFeedbackSubmitted).toBe(true);
		});
	});

	describe('handleGoalInReviewFeedbackSubmitted', () => {
		it('persists the feedback-submitted preference for the recap year', async () => {
			const setGoalFeedbackSubmittedPreference = vi.fn().mockResolvedValue();
			const context = {
				goalInReviewData: { year: 2026 },
				setGoalFeedbackSubmittedPreference,
			};

			await ImpactDashboardPage.methods.handleGoalInReviewFeedbackSubmitted.call(context);

			expect(setGoalFeedbackSubmittedPreference).toHaveBeenCalledWith(2026);
		});
	});

	describe('hideGoalSignup', () => {
		// This decides whether the goal entry point renders, on a server rendered page, so the
		// override has to come off the route. The server has no address bar, and would
		// otherwise answer with the real date and disagree with the hydrating client.
		const hideGoalSignupWith = recapDate => ImpactDashboardPage.computed.hideGoalSignup.call({
			goalInReviewInProgressStart: new Date('2026-12-01T00:00:00Z'),
			$route: { query: recapDate ? { recapDate } : {} },
		});

		it('hides the ask when the route override lands inside the window', () => {
			expect(hideGoalSignupWith('2026-12-05')).toBe(true);
		});

		it('leaves the ask up once the override passes the goal year', () => {
			expect(hideGoalSignupWith('2027-06-01')).toBe(false);
		});

		it('falls back to the clock with no override, the state every real lender is in', () => {
			// Pinned, because the real date answers differently once the calendar reaches the
			// window, which would make this pass or fail by the month it runs in.
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-06-15T12:00:00'));

			try {
				expect(hideGoalSignupWith(null)).toBe(false);
			} finally {
				vi.useRealTimers();
			}
		});
	});
});
