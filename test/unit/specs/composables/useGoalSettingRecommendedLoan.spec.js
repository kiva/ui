/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import {
	createApp, reactive, ref, toRef,
} from 'vue';
import { flushPromises } from '@vue/test-utils';
import useGoalSettingRecommendedLoan, {
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO,
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT,
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE,
} from '#src/composables/useGoalSettingRecommendedLoan';
import { fetchAiLoanPills } from '#src/util/aiLoanPillsUtils';

vi.mock('vue-router', () => ({
	useRouter: () => ({
		currentRoute: { value: { path: '/mykiva', name: 'my-kiva' } },
	}),
}));

vi.mock('#src/util/aiLoanPillsUtils', () => ({
	fetchAiLoanPills: vi.fn(),
}));

describe('useGoalSettingRecommendedLoan', () => {
	let emit;
	let props;
	let selectedGoalNumber;
	let selectedCategory;
	let show;
	let goalProgress;
	let getRecommendedLoans;
	let getCtaHref;
	let userGoal;
	let mockKvTrackEvent;
	let mockApollo;
	let composable;
	let app;

	const mountComposable = (propOverrides = {}, options = {}) => {
		emit = vi.fn();
		mockApollo = { mutate: vi.fn().mockResolvedValue({}) };
		props = reactive({
			goalRecommendedLoanEnable: false,
			basketItems: [],
			...propOverrides,
		});
		selectedGoalNumber = ref(12);
		selectedCategory = ref({
			id: '1',
			name: 'Women',
			badgeId: 'women-badge',
		});
		show = ref(true);
		goalProgress = ref(0);
		getRecommendedLoans = vi.fn().mockResolvedValue([]);
		getCtaHref = vi.fn(() => '/lend/explore');
		userGoal = ref({ target: 10, category: 'women-badge' });

		const TestComponent = {
			setup() {
				composable = useGoalSettingRecommendedLoan({
					emit,
					goalRecommendedLoanEnable: toRef(props, 'goalRecommendedLoanEnable'),
					basketItems: toRef(props, 'basketItems'),
					selectedGoalNumber,
					selectedCategory,
					show,
					goalProgress,
					getRecommendedLoans,
					getCtaHref,
					userGoal,
					kvTrackEvent: mockKvTrackEvent,
					appConfig: { photoPath: 'https://example.com/img/' },
					apollo: mockApollo,
					...options,
				});
				return {};
			},
			template: '<div />',
		};

		app = createApp(TestComponent);
		app.mount(document.createElement('div'));
	};

	beforeEach(() => {
		mockKvTrackEvent = vi.fn();
		fetchAiLoanPills.mockReset();
		fetchAiLoanPills.mockResolvedValue([]);
		mountComposable();
	});

	afterEach(() => {
		app?.unmount();
	});

	describe('showRecommendLoanAfterGoalView', () => {
		it('should be false when goalRecommendedLoanEnable is false', () => {
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
			composable.enterRecommendedLoanStepAfterGoalSave();
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
		});

		it('should be true after enterRecommendedLoanStepAfterGoalSave when enabled', () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(true);
		});
	});

	describe('resetRecommendedLoanState', () => {
		it('should clear recommendation step and loan', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 101, name: 'Test Loan' }]);
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBe(101);

			composable.resetRecommendedLoanState();
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
			expect(composable.recommendLoanCardProps.value.loanId).toBeUndefined();
		});
	});

	describe('recommendLoanHeaderDetails', () => {
		it('should include goal target, category label, and plural progress', () => {
			selectedGoalNumber.value = 10;
			selectedCategory.value = { name: 'Climate Action', badgeId: 'c1' };
			goalProgress.value = 3;
			expect(composable.recommendLoanHeaderDetails.value).toEqual([
				'10 loan goal',
				'Climate Action',
				'3 loans completed',
			]);
		});

		it('should use singular loan when progress is 1', () => {
			goalProgress.value = 1;
			expect(composable.recommendLoanHeaderDetails.value).toContain('1 loan completed');
		});

		it('should omit progress segment when progress is 0', () => {
			goalProgress.value = 0;
			selectedGoalNumber.value = 5;
			selectedCategory.value = { name: 'Women', badgeId: 'w' };
			expect(composable.recommendLoanHeaderDetails.value).toEqual([
				'5 loan goal',
				'Women',
			]);
		});
	});

	describe('recommendLoanCardProps', () => {
		it('should expose base props and route without loan', () => {
			const card = composable.recommendLoanCardProps.value;
			expect(card.photoPath).toBe('https://example.com/img/');
			expect(card.showTags).toBe(true);
			expect(card.externalLinks).toBe(true);
			expect(card.customLoanDetails).toBe(true);
			expect(card.showLightView).toBe(true);
			expect(card.basketItems).toEqual([]);
			expect(card.route).toEqual({ path: '/mykiva', name: 'my-kiva' });
			expect(card.loan).toBeUndefined();
			expect(card.loanId).toBeUndefined();
		});

		it('should forward basketItems from props', () => {
			props.basketItems = [{ id: 1 }];
			expect(composable.recommendLoanCardProps.value.basketItems).toEqual([{ id: 1 }]);
		});

		it('should call $kvTrackEvent when kvTrackFunction is invoked', () => {
			composable.recommendLoanCardProps.value.kvTrackFunction('portfolio', 'click', 'x');
			expect(mockKvTrackEvent).toHaveBeenCalledWith('portfolio', 'click', 'x');
		});
	});

	describe('recommendLoanIsInBasket', () => {
		it('should be false when basket is empty', () => {
			expect(composable.recommendLoanIsInBasket.value).toBe(false);
		});

		it('should be true when a LoanReservation matches recommended loan id', async () => {
			props.goalRecommendedLoanEnable = true;
			props.basketItems = [{ __typename: 'LoanReservation', id: 555 }];
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 555, name: 'Match' }]);
			await flushPromises();
			expect(composable.recommendLoanIsInBasket.value).toBe(true);
		});
	});

	describe('onGoalSelectorSetGoal', () => {
		it('should emit set-goal and enter recommend step when enabled', () => {
			props.goalRecommendedLoanEnable = true;
			const payload = { goalName: 'g1', target: 8 };
			composable.onGoalSelectorSetGoal(payload);
			expect(emit).toHaveBeenCalledWith('set-goal', payload);
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(true);
		});

		it('should emit set-goal but not show recommend step when disabled', () => {
			const payload = { goalName: 'g1', target: 8 };
			composable.onGoalSelectorSetGoal(payload);
			expect(emit).toHaveBeenCalledWith('set-goal', payload);
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
		});
	});

	describe('onGoalSelectorUpdateGoal', () => {
		it('should emit set-goal and enter recommend step when enabled', () => {
			props.goalRecommendedLoanEnable = true;
			const payload = { goalName: 'g1', target: 9 };
			composable.onGoalSelectorUpdateGoal(payload);
			expect(emit).toHaveBeenCalledWith('set-goal', payload);
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(true);
		});

		it('should emit set-goal but not show recommend step when disabled', () => {
			const payload = { goalName: 'g1', target: 9 };
			composable.onGoalSelectorUpdateGoal(payload);
			expect(emit).toHaveBeenCalledWith('set-goal', payload);
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
		});
	});

	describe('handleExploreMoreLoans', () => {
		it('should set location href from getCtaHref(userGoal, router, goalProgress)', () => {
			getCtaHref.mockReturnValue('/lend/custom');
			userGoal.value = { target: 15, category: 'climate-action' };
			goalProgress.value = 3;
			const hrefSetter = vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {});

			composable.handleExploreMoreLoans();

			expect(getCtaHref).toHaveBeenCalledWith(15, 'climate-action', expect.any(Object), 3);
			expect(hrefSetter).toHaveBeenCalledWith('/lend/custom');
			hrefSetter.mockRestore();
		});

		it('should pass undefined goal fields when userGoal is null', () => {
			getCtaHref.mockReturnValue('/lend/fallback');
			userGoal.value = null;
			goalProgress.value = 0;
			const hrefSetter = vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {});

			composable.handleExploreMoreLoans();

			expect(getCtaHref).toHaveBeenCalledWith(undefined, undefined, expect.any(Object), 0);
			expect(hrefSetter).toHaveBeenCalledWith('/lend/fallback');
			hrefSetter.mockRestore();
		});
	});

	describe('watch show', () => {
		it('should reset recommend step when modal opens', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			await flushPromises();
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(true);

			show.value = false;
			await flushPromises();
			show.value = true;
			await flushPromises();
			expect(composable.showRecommendLoanAfterGoalView.value).toBe(false);
		});

		it('keeps recommendedLoan visible while the modal is closing and clears it on next open', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 42 }]);
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBe(42);

			show.value = false;
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBe(42);

			show.value = true;
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBeUndefined();
		});
	});

	describe('recommended loan fetch', () => {
		// eslint-disable-next-line max-len
		it('should call getRecommendedLoans with category badgeId and filtered loan ids, then set first loan', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([
				{ id: 1, name: 'First' },
				{ id: 2, name: 'Second' },
			]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledWith('women-badge', []);
			expect(composable.recommendLoanCardProps.value.loanId).toBe(1);
			expect(composable.recommendLoanCardProps.value.loan.name).toBe('First');
		});

		it('should pass basket item ids as filteredLoanIds to getRecommendedLoans', async () => {
			props.goalRecommendedLoanEnable = true;
			props.basketItems = [
				{ __typename: 'LoanReservation', id: 900 },
				{ __typename: 'LoanReservation', id: 901 },
			];
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 2, name: 'Next' }]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledWith('women-badge', [900, 901]);
			expect(composable.recommendLoanCardProps.value.loanId).toBe(2);
		});

		it('should merge additionalExcludedLoanIds with basket loan ids', async () => {
			const extras = ref([700, 701]);
			mountComposable(
				{
					goalRecommendedLoanEnable: true,
					basketItems: [{ __typename: 'LoanReservation', id: 900 }],
				},
				{ additionalExcludedLoanIds: extras },
			);
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 2, name: 'Next' }]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledWith('women-badge', [900, 700, 701]);
		});

		it('should dedupe ids that appear in both basket and additionalExcludedLoanIds', async () => {
			const extras = ref([900, 800]);
			mountComposable(
				{
					goalRecommendedLoanEnable: true,
					basketItems: [{ __typename: 'LoanReservation', id: 900 }],
				},
				{ additionalExcludedLoanIds: extras },
			);
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 3, name: 'Third' }]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledWith('women-badge', [900, 800]);
		});

		it('should exclude non-LoanReservation basket items from filteredLoanIds', async () => {
			props.goalRecommendedLoanEnable = true;
			props.basketItems = [
				{ __typename: 'LoanReservation', id: 900 },
				{ __typename: 'Donation', id: 901 },
			];
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 2, name: 'Next' }]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledWith('women-badge', [900]);
		});

		it('should set recommendedLoan to null when fetch returns empty', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([]);
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBeUndefined();
		});

		it('should set recommendedLoan to null when getRecommendedLoans rejects', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockRejectedValue(new Error('network'));
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.loanId).toBeUndefined();
		});

		it('should not fetch when recommend view is inactive', async () => {
			await flushPromises();
			expect(getRecommendedLoans).not.toHaveBeenCalled();
		});
	});

	describe('hasRecommendedLoans', () => {
		it('is false before any fetch resolves', () => {
			expect(composable.hasRecommendedLoans.value).toBe(false);
		});

		it('stays false after the fetch resolves with an empty array', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([]);
			await flushPromises();
			expect(composable.hasRecommendedLoans.value).toBe(false);
		});

		it('becomes true when the fetch returns at least one loan', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 7, name: 'Match' }]);
			await flushPromises();
			expect(composable.hasRecommendedLoans.value).toBe(true);
		});
	});

	describe('isLoadingRecommendedLoan', () => {
		it('is false initially', () => {
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});

		it('flips to true synchronously when entering the recommended-loan step', () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			// Set synchronously so the host's loading state covers the upcoming fetch.
			expect(composable.isLoadingRecommendedLoan.value).toBe(true);
		});

		it('stays false when the feature flag is off', () => {
			composable.enterRecommendedLoanStepAfterGoalSave();
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});

		it('clears once the fetch resolves with loans', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 1, name: 'A' }]);
			await flushPromises();
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});

		it('clears once the fetch resolves empty', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([]);
			await flushPromises();
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});

		it('clears even when the fetch rejects', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockRejectedValue(new Error('network'));
			await flushPromises();
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});
	});

	describe('tracking events', () => {
		describe('view event on entering recommended-loan step', () => {
			it('fires view+confirm-goal-set-recommended-loan with portfolio category', () => {
				mountComposable(
					{ goalRecommendedLoanEnable: true },
					{ entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO },
				);
				composable.enterRecommendedLoanStepAfterGoalSave();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'portfolio',
					'view',
					'confirm-goal-set-recommended-loan',
					null,
					null,
				);
			});

			it('fires with post-checkout category when entrypoint is POST_CHECKOUT', () => {
				mountComposable(
					{ goalRecommendedLoanEnable: true },
					{ entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT },
				);
				composable.enterRecommendedLoanStepAfterGoalSave();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'view',
					'confirm-goal-set-recommended-loan',
					null,
					null,
				);
			});

			it('fires with event-tracking category when entrypoint is GOALS_PAGE', () => {
				mountComposable(
					{ goalRecommendedLoanEnable: true },
					{ entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE },
				);
				composable.enterRecommendedLoanStepAfterGoalSave();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'event-tracking',
					'view',
					'confirm-goal-set-recommended-loan',
					null,
					null,
				);
			});

			it('does not fire when goalRecommendedLoanEnable is false', () => {
				mountComposable(
					{ goalRecommendedLoanEnable: false },
					{ entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO },
				);
				composable.enterRecommendedLoanStepAfterGoalSave();
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
			});

			it('does not fire when entrypoint is omitted', () => {
				mountComposable({ goalRecommendedLoanEnable: true });
				composable.enterRecommendedLoanStepAfterGoalSave();
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
			});
		});

		describe('explore-more click', () => {
			beforeEach(() => {
				vi.spyOn(window.location, 'href', 'set').mockImplementation(() => {});
			});

			it('fires click+explore-more-loans with portfolio category', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO });
				composable.handleExploreMoreLoans();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'portfolio',
					'click',
					'explore-more-loans',
					null,
					null,
				);
			});

			it('fires with event-tracking category for GOALS_PAGE entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE });
				composable.handleExploreMoreLoans();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'event-tracking',
					'click',
					'explore-more-loans',
					null,
					null,
				);
			});

			it('does not fire when entrypoint is omitted', () => {
				mountComposable();
				composable.handleExploreMoreLoans();
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
			});
		});

		describe('trackAddToBasketClick', () => {
			it('fires click+add-goal-confirmed-loan-to-basket with loanId and lendAmount', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO });
				composable.trackAddToBasketClick(789, 25);
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'portfolio',
					'click',
					'add-goal-confirmed-loan-to-basket',
					789,
					25,
				);
			});

			it('fires with post-checkout category for POST_CHECKOUT entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT });
				composable.trackAddToBasketClick(101, 50);
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'click',
					'add-goal-confirmed-loan-to-basket',
					101,
					50,
				);
			});

			it('fires with event-tracking category for GOALS_PAGE entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE });
				composable.trackAddToBasketClick(202, 75);
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'event-tracking',
					'click',
					'add-goal-confirmed-loan-to-basket',
					202,
					75,
				);
			});

			it('defaults loanId and lendAmount to null when caller does not provide them', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO });
				composable.trackAddToBasketClick();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'portfolio',
					'click',
					'add-goal-confirmed-loan-to-basket',
					null,
					null,
				);
			});

			it('does not fire when entrypoint is omitted', () => {
				mountComposable();
				composable.trackAddToBasketClick(789, 25);
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
			});
		});

		describe('trackCheckoutClick', () => {
			it('fires click+go-to-checkout for portfolio entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO });
				composable.trackCheckoutClick();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'portfolio',
					'click',
					'go-to-checkout',
					null,
					null,
				);
			});

			it('fires click+go-to-checkout for goals-page entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE });
				composable.trackCheckoutClick();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'event-tracking',
					'click',
					'go-to-checkout',
					null,
					null,
				);
			});

			it('fires click+complete-order for post-checkout entrypoint', () => {
				mountComposable({}, { entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_POST_CHECKOUT });
				composable.trackCheckoutClick();
				expect(mockKvTrackEvent).toHaveBeenCalledWith(
					'post-checkout',
					'click',
					'complete-order',
					null,
					null,
				);
			});

			it('does not fire when entrypoint is omitted', () => {
				mountComposable();
				composable.trackCheckoutClick();
				expect(mockKvTrackEvent).not.toHaveBeenCalled();
			});
		});
	});

	describe('AI loan pills', () => {
		const mountEnabledWithLoan = async (loan, pills) => {
			fetchAiLoanPills.mockResolvedValue(pills);
			mountComposable({ goalRecommendedLoanEnable: true });
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([loan]);
			await flushPromises();
		};

		it('does not fetch pills when the recommended-loan feature is disabled', async () => {
			// Default mount has goalRecommendedLoanEnable: false.
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 55, name: 'First' }]);
			await flushPromises();
			expect(fetchAiLoanPills).not.toHaveBeenCalled();
		});

		it('fetches pills for the recommended loan id', async () => {
			await mountEnabledWithLoan(
				{ id: 55, name: 'Pillable' },
				[{ loanId: 55, pills: ['AI pick'] }],
			);
			expect(fetchAiLoanPills).toHaveBeenCalledWith(mockApollo, [55]);
		});

		it('passes pills as customCallouts and blanks the loan-derived callout fields', async () => {
			await mountEnabledWithLoan(
				{
					id: 55,
					name: 'Pillable',
					activity: { id: 1, name: 'Farming' },
					sector: { id: 2, name: 'Agriculture' },
					tags: ['#Eco-friendly'],
					themes: ['Growing businesses'],
				},
				[{ loanId: 55, pills: ['Repaid on time', 'Woman-owned'] }],
			);
			const card = composable.recommendLoanCardProps.value;
			expect(card.customCallouts).toEqual(['Repaid on time', 'Woman-owned']);
			expect(card.loan.activity).toEqual({});
			expect(card.loan.sector).toEqual({});
			expect(card.loan.tags).toEqual([]);
			expect(card.loan.themes).toEqual([]);
			// Non-callout fields are preserved so the card still renders normally.
			expect(card.loan.name).toBe('Pillable');
			expect(card.loanId).toBe(55);
		});

		it('leaves loan callouts intact and sets no customCallouts when no pills are returned', async () => {
			await mountEnabledWithLoan(
				{
					id: 55,
					name: 'Pillable',
					activity: { id: 1, name: 'Farming' },
					tags: ['#Eco-friendly'],
				},
				[],
			);
			const card = composable.recommendLoanCardProps.value;
			expect(card.customCallouts).toBeUndefined();
			expect(card.loan.activity).toEqual({ id: 1, name: 'Farming' });
			expect(card.loan.tags).toEqual(['#Eco-friendly']);
		});

		it('falls back to loan callouts when the pills query errors (resolves undefined)', async () => {
			// fetchAiLoanPills swallows errors and resolves undefined.
			await mountEnabledWithLoan(
				{ id: 55, name: 'Pillable', tags: ['#Eco-friendly'] },
				undefined,
			);
			const card = composable.recommendLoanCardProps.value;
			expect(card.customCallouts).toBeUndefined();
			expect(card.loan.tags).toEqual(['#Eco-friendly']);
		});

		it('refetches pills when the recommended loan changes', async () => {
			await mountEnabledWithLoan({ id: 55, name: 'First' }, [{ loanId: 55, pills: ['P1'] }]);
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['P1']);

			fetchAiLoanPills.mockResolvedValue([{ loanId: 66, pills: ['P2'] }]);
			getRecommendedLoans.mockResolvedValue([{ id: 66, name: 'Second' }]);
			selectedCategory.value = { id: '2', name: 'Climate', badgeId: 'climate-badge' };
			await flushPromises();

			expect(fetchAiLoanPills).toHaveBeenLastCalledWith(mockApollo, [66]);
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['P2']);
		});

		it('clears pills and restores loan callouts when the next loan has none', async () => {
			await mountEnabledWithLoan(
				{ id: 55, name: 'First', tags: ['#Eco-friendly'] },
				[{ loanId: 55, pills: ['P1'] }],
			);
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['P1']);

			// Advance to a loan the backend returns no pills for.
			fetchAiLoanPills.mockResolvedValue([]);
			getRecommendedLoans.mockResolvedValue([{ id: 66, name: 'Second', tags: ['#Refugees'] }]);
			selectedCategory.value = { id: '2', name: 'Climate', badgeId: 'climate-badge' };
			await flushPromises();

			const card = composable.recommendLoanCardProps.value;
			expect(card.customCallouts).toBeUndefined();
			// Loan callouts are restored (not left blanked from the previous loan).
			expect(card.loan.tags).toEqual(['#Refugees']);
			expect(card.loanId).toBe(66);
		});

		it('ignores a stale pills response for a loan that is no longer recommended', async () => {
			let resolveStale;
			const stalePills = new Promise(resolve => { resolveStale = resolve; });
			fetchAiLoanPills.mockReturnValueOnce(stalePills);

			mountComposable({ goalRecommendedLoanEnable: true });
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 55, name: 'First' }]);
			await flushPromises();

			// Advance to a new loan whose pills resolve immediately.
			fetchAiLoanPills.mockResolvedValue([{ loanId: 66, pills: ['fresh'] }]);
			getRecommendedLoans.mockResolvedValue([{ id: 66, name: 'Second' }]);
			selectedCategory.value = { id: '2', name: 'Climate', badgeId: 'climate-badge' };
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['fresh']);

			// The slow response for loan 55 arrives late and must not overwrite loan 66's pills.
			resolveStale([{ loanId: 55, pills: ['stale'] }]);
			await flushPromises();
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['fresh']);
			expect(composable.recommendLoanCardProps.value.loanId).toBe(66);
			// The ignored stale response must not leave the skeleton stuck loading.
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
		});

		it('stays in the loading state until the pills query resolves', async () => {
			let resolvePills;
			const pendingPills = new Promise(resolve => { resolvePills = resolve; });
			fetchAiLoanPills.mockReturnValue(pendingPills);

			mountComposable({ goalRecommendedLoanEnable: true });
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 55, name: 'First' }]);
			await flushPromises();

			// Loan resolved but pills still in flight: keep the skeleton up so the
			// callouts do not pop from the loan's own tags to the AI pills.
			expect(composable.isLoadingRecommendedLoan.value).toBe(true);

			resolvePills([{ loanId: 55, pills: ['AI pick'] }]);
			await flushPromises();

			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
			expect(composable.recommendLoanCardProps.value.customCallouts).toEqual(['AI pick']);
		});

		it('exposes the raw recommended loan (not the blanked card loan) for domain actions', async () => {
			await mountEnabledWithLoan(
				{
					id: 55,
					name: 'Pillable',
					activity: { id: 1, name: 'Farming' },
					sector: { id: 2, name: 'Agriculture' },
					tags: ['#Eco-friendly'],
					themes: ['Growing businesses'],
				},
				[{ loanId: 55, pills: ['AI pick'] }],
			);
			// The card-facing loan is blanked for display...
			expect(composable.recommendLoanCardProps.value.loan.themes).toEqual([]);
			// ...but the exposed recommended loan keeps its real fields for add-to-basket.
			expect(composable.recommendedLoan.value).toMatchObject({
				activity: { id: 1, name: 'Farming' },
				sector: { id: 2, name: 'Agriculture' },
				tags: ['#Eco-friendly'],
				themes: ['Growing businesses'],
			});
		});

		it('clears the loading state when the pills query resolves with none', async () => {
			await mountEnabledWithLoan(
				{ id: 55, name: 'Pillable', tags: ['#Eco-friendly'] },
				[],
			);
			expect(composable.isLoadingRecommendedLoan.value).toBe(false);
			expect(composable.recommendLoanCardProps.value.customCallouts).toBeUndefined();
		});

		it('keeps the card-facing loan reference stable across basket changes', async () => {
			await mountEnabledWithLoan(
				{ id: 55, name: 'Pillable', tags: ['#Eco-friendly'] },
				[{ loanId: 55, pills: ['AI pick'] }],
			);
			const loanBefore = composable.recommendLoanCardProps.value.loan;

			props.basketItems = [{ __typename: 'LoanReservation', id: 1 }];
			await flushPromises();

			const cardAfter = composable.recommendLoanCardProps.value;
			// The props object recomputed (new basketItems)...
			expect(cardAfter.basketItems).toEqual([{ __typename: 'LoanReservation', id: 1 }]);
			// ...but the blanked loan is unchanged, so its reference must stay stable
			// to avoid re-rendering the card.
			expect(cardAfter.loan).toBe(loanBefore);
		});
	});
});
