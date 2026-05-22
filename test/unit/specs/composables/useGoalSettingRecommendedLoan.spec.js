/* eslint-disable import/no-extraneous-dependencies -- devDependency used only in tests */
import {
	createApp, reactive, ref, toRef,
} from 'vue';
import { flushPromises } from '@vue/test-utils';
import useGoalSettingRecommendedLoan from '#src/composables/useGoalSettingRecommendedLoan';

vi.mock('vue-router', () => ({
	useRouter: () => ({
		currentRoute: { value: { path: '/mykiva', name: 'my-kiva' } },
	}),
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

	const mountComposable = (propOverrides = {}) => {
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

		it('should clear recommendedLoan when modal closes without fetching again', async () => {
			props.goalRecommendedLoanEnable = true;
			composable.enterRecommendedLoanStepAfterGoalSave();
			getRecommendedLoans.mockResolvedValue([{ id: 42 }]);
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledTimes(1);
			expect(composable.recommendLoanCardProps.value.loanId).toBe(42);

			show.value = false;
			await flushPromises();
			expect(getRecommendedLoans).toHaveBeenCalledTimes(1);
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
});
