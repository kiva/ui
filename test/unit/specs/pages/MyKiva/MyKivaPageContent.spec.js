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
			isGoalInReviewEligible: true,
			loadGoalInReview: vi.fn().mockResolvedValue({}),
			showGoalInReviewModal: false,
			smoothScrollTo: vi.fn(),
			...overrides,
		});

		it('opens the goal recap for eligible users', async () => {
			const context = makeContext();

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledTimes(1);
			expect(context.showGoalInReviewModal).toBe(true);
		});

		it('does not open the goal recap for ineligible users', async () => {
			const context = makeContext({ isGoalInReviewEligible: false });

			await MyKivaPageContent.methods.handleGoToDeepLink.call(context, 'goal-recap');

			expect(context.loadGoalInReview).toHaveBeenCalledTimes(1);
			expect(context.showGoalInReviewModal).toBe(false);
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
});
