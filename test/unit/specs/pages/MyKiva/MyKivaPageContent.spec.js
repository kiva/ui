import MyKivaPageContent from '#src/pages/MyKiva/MyKivaPageContent';
import {
	ID_WOMENS_EQUALITY,
	ID_US_ECONOMIC_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	isTieredAchievementComplete,
} from '#src/composables/useBadgeData';

const makeBadge = (id, totalProgress, tierTargets) => ({
	id,
	challengeName: id,
	achievementData: {
		id,
		totalProgressToAchievement: totalProgress,
		tiers: tierTargets.map((target, i) => ({
			level: i + 1,
			target,
			completedDate: totalProgress >= target ? '2025-01-01' : null,
		})),
	},
	hasStarted: totalProgress > 0,
	level: tierTargets.reduce((lvl, t, i) => (totalProgress >= t ? i + 1 : lvl), 0),
});

const IN_PROGRESS_RELEASE = new Date('2026-11-15T00:00:00Z');

describe('MyKivaPageContent', () => {
	describe('allBadgesCompleted', () => {
		const callComputed = heroBadgeData => {
			const context = {
				heroBadgeData,
				isTieredAchievementComplete,
			};
			return MyKivaPageContent.computed.allBadgesCompleted.call(context);
		};

		it('returns true when all 5 default badges have completed all tiers', () => {
			const badges = [
				makeBadge(ID_WOMENS_EQUALITY, 10, [5, 10]),
				makeBadge(ID_US_ECONOMIC_EQUALITY, 10, [5, 10]),
				makeBadge(ID_CLIMATE_ACTION, 10, [5, 10]),
				makeBadge(ID_REFUGEE_EQUALITY, 10, [5, 10]),
				makeBadge(ID_BASIC_NEEDS, 10, [5, 10]),
			];
			expect(callComputed(badges)).toBe(true);
		});

		it('returns false when at least one badge has incomplete tiers', () => {
			const badges = [
				makeBadge(ID_WOMENS_EQUALITY, 10, [5, 10]),
				makeBadge(ID_US_ECONOMIC_EQUALITY, 10, [5, 10]),
				makeBadge(ID_CLIMATE_ACTION, 3, [5, 10]), // incomplete
				makeBadge(ID_REFUGEE_EQUALITY, 10, [5, 10]),
				makeBadge(ID_BASIC_NEEDS, 10, [5, 10]),
			];
			expect(callComputed(badges)).toBe(false);
		});

		it('returns true when heroBadgeData is empty (vacuous truth from .every)', () => {
			expect(callComputed([])).toBe(true);
		});

		it('ignores non-default badge ids in heroBadgeData', () => {
			const badges = [
				makeBadge(ID_WOMENS_EQUALITY, 10, [5, 10]),
				makeBadge(ID_US_ECONOMIC_EQUALITY, 10, [5, 10]),
				makeBadge(ID_CLIMATE_ACTION, 10, [5, 10]),
				makeBadge(ID_REFUGEE_EQUALITY, 10, [5, 10]),
				makeBadge(ID_BASIC_NEEDS, 10, [5, 10]),
				makeBadge('custom-badge', 1, [5, 10]), // not in defaultBadges, incomplete but irrelevant
			];
			expect(callComputed(badges)).toBe(true);
		});

		it('returns undefined when heroBadgeData is undefined (optional chaining)', () => {
			expect(callComputed(undefined)).toBeUndefined();
		});
	});

	describe('addGoalRecommendedLoanToBasket', () => {
		it('forwards the payload to addToBasket with skipAddedToBasketModal: true', () => {
			const addToBasket = vi.fn();
			const context = { addToBasket };

			MyKivaPageContent.methods.addGoalRecommendedLoanToBasket.call(context, {
				loanId: 123,
				lendAmount: 25,
				loan: { id: 123 },
				onError: undefined,
			});

			expect(addToBasket).toHaveBeenCalledWith({
				loanId: 123,
				lendAmount: 25,
				loan: { id: 123 },
				onError: undefined,
				skipAddedToBasketModal: true,
			});
		});
	});

	describe('handleGoToDeepLink', () => {
		const makeContext = overrides => ({
			goalInReviewEnable: true,
			loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: true, year: 2026 }),
			loadGoalPreferences: vi.fn().mockResolvedValue({}),
			hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(false),
			showGoalInReviewModal: false,
			goalInReviewFeedbackSubmitted: false,
			smoothScrollTo: vi.fn(),
			...overrides,
		});

		it('opens the goal recap for eligible users', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledTimes(1);
			expect(context.loadGoalPreferences).toHaveBeenCalledWith('network-only');
			expect(context.hasSubmittedGoalFeedbackForYear).toHaveBeenCalledWith(2026);
			expect(context.goalInReviewFeedbackSubmitted).toBe(false);
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('snapshots the already-submitted flag when opening the recap', async () => {
			const context = makeContext({
				hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(true),
			});

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.goalInReviewFeedbackSubmitted).toBe(true);
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('does not open or fetch the goal recap when the flag is off', async () => {
			const context = makeContext({ goalInReviewEnable: false });

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).not.toHaveBeenCalled();
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('does not open the goal recap for ineligible users', async () => {
			const context = makeContext({
				loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: false }),
			});

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledTimes(1);
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('opens the year named by the link, so an email can point at a past recap', async () => {
			const context = makeContext({ $route: { query: { recapYear: '2026' } } });

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledWith({ year: 2026 });
		});

		it('falls back to the current recap year when the link names none', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledWith({});
		});

		it('ignores a recapYear that is not a number', async () => {
			const context = makeContext({ $route: { query: { recapYear: 'last-year' } } });

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledWith({});
		});

		it('keeps normal goTo section scrolling for non-recap deep links', async () => {
			const querySelector = vi.spyOn(document, 'querySelector').mockReturnValue({ offsetTop: 230 });
			const context = makeContext();

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'mykiva-achievements');

			expect(context.loadGoalInReview).not.toHaveBeenCalled();
			expect(querySelector).toHaveBeenCalledWith('#mykiva-achievements');
			expect(context.smoothScrollTo).toHaveBeenCalledWith({ yPosition: 200, millisecondsToAnimate: 750 });

			querySelector.mockRestore();
		});
	});

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

		it('opens the recap when the composable says it is due', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.openGoalRecapIfDue.call(context);

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({
				enabled: true,
				inProgressStartDate: IN_PROGRESS_RELEASE,
			});
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('stays shut when the composable declines', async () => {
			const context = makeContext({ loadAutoOpenRecap: vi.fn().mockResolvedValue(null) });

			await MyKivaPageContent.methods.openGoalRecapIfDue.call(context);

			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('passes the flag through, so the composable can decline before fetching', async () => {
			const context = makeContext({
				goalInReviewEnable: false,
				loadAutoOpenRecap: vi.fn().mockResolvedValue(null),
			});

			await MyKivaPageContent.methods.openGoalRecapIfDue.call(context);

			expect(context.loadAutoOpenRecap).toHaveBeenCalledWith({
				enabled: false,
				inProgressStartDate: IN_PROGRESS_RELEASE,
			});
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('snapshots the already-submitted feedback flag, without a second preferences fetch', async () => {
			const context = makeContext({ hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(true) });

			await MyKivaPageContent.methods.openGoalRecapIfDue.call(context);

			expect(context.loadGoalPreferences).not.toHaveBeenCalled();
			expect(context.goalInReviewFeedbackSubmitted).toBe(true);
		});
	});

	describe('openGoalRecapFromCard', () => {
		const makeContext = overrides => ({
			goalInReviewEnable: true,
			loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: true, year: 2026 }),
			loadGoalPreferences: vi.fn().mockResolvedValue({}),
			hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(false),
			setGoalRecapViewedPreference: vi.fn().mockResolvedValue(),
			$kvTrackEvent: vi.fn(),
			showGoalInReviewModal: false,
			goalInReviewFeedbackSubmitted: false,
			...overrides,
		});

		it('opens the recap for the year the card asked for', async () => {
			const context = makeContext({
				loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: true, year: 2026 }),
			});

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.loadGoalInReview).toHaveBeenCalledWith({ year: 2026 });
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('marks the recap seen, so the auto-open does not follow later', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.setGoalRecapViewedPreference).toHaveBeenCalledWith(2026);
		});

		it('snapshots the already-submitted feedback flag', async () => {
			const context = makeContext({ hasSubmittedGoalFeedbackForYear: vi.fn().mockReturnValue(true) });

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.goalInReviewFeedbackSubmitted).toBe(true);
		});

		it('does nothing when the flag is off', async () => {
			const context = makeContext({ goalInReviewEnable: false });

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.loadGoalInReview).not.toHaveBeenCalled();
			expect(context.setGoalRecapViewedPreference).not.toHaveBeenCalled();
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('tracks the click for both goal cards, from one place', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'view-goal-recap');
		});

		it('tracks a click that cannot open, so failures are visible', async () => {
			const context = makeContext({
				loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: false, year: 2026 }),
			});

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.$kvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'view-goal-recap');
			expect(context.showGoalInReviewModal).toBe(false);
		});

		it('does not open or mark seen for an ineligible goal', async () => {
			const context = makeContext({
				loadGoalInReview: vi.fn().mockResolvedValue({ isEligible: false, year: 2026 }),
			});

			await MyKivaPageContent.methods.openGoalRecapFromCard.call(context, 2026);

			expect(context.setGoalRecapViewedPreference).not.toHaveBeenCalled();
			expect(context.showGoalInReviewModal).toBe(false);
		});
	});

	describe('handleGoalInReviewFeedbackSubmitted', () => {
		it('persists the feedback-submitted preference for the recap year', async () => {
			const setGoalFeedbackSubmittedPreference = vi.fn().mockResolvedValue();
			const context = {
				goalInReviewData: { year: 2026 },
				setGoalFeedbackSubmittedPreference,
			};

			await MyKivaPageContent.methods.handleGoalInReviewFeedbackSubmitted.call(context);

			expect(setGoalFeedbackSubmittedPreference).toHaveBeenCalledWith(2026);
		});
	});
});
