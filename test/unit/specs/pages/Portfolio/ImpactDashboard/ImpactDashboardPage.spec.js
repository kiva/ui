import ImpactDashboardPage from '#src/pages/Portfolio/ImpactDashboard/ImpactDashboardPage';

describe('ImpactDashboardPage', () => {
	describe('openGoalRecapIfDue', () => {
		const makeContext = overrides => ({
			goalInReviewEnable: true,
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

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({ enabled: true });
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

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({ enabled: false });
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
});
