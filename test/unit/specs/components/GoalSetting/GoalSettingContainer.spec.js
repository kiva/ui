/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { ref, isRef } from 'vue';
import GoalSettingContainer from '#src/components/GoalSetting/GoalSettingContainer';

// Spy on the recommended-loan composable so we can assert how the container wires it.
const { recommendedLoanSpy } = vi.hoisted(() => ({
	recommendedLoanSpy: vi.fn(),
}));

vi.mock('vue-router', () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('#src/composables/useGoalData', () => ({
	GOAL_STATUS: { COMPLETED: 'completed' },
	GOALS_CURRENT_YEAR: 2026,
	default: () => ({
		userGoal: ref(null),
		loadGoalData: vi.fn().mockResolvedValue(),
		storeGoalPreferences: vi.fn(),
		loading: ref(false),
		getCategories: vi.fn(() => [
			{
				id: 1, badgeId: 'women-equality', name: 'Women', eventProp: 'women',
			},
		]),
		getCtaHref: vi.fn(() => '/lend'),
		goalProgress: ref(0),
		getLoanStatsByYear: vi.fn(),
		userPreferences: ref(null),
		removeGoalFromPreferences: vi.fn(),
		updateCurrentGoal: vi.fn(),
		userGoalAchieved: ref(false),
		getRecommendedLoans: vi.fn(),
	}),
}));

vi.mock('#src/composables/useGoalSettingRecommendedLoan', () => ({
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE: 'event-tracking',
	default: recommendedLoanSpy,
}));

vi.mock('@kiva/kv-components', () => ({
	KvButton: { name: 'KvButton', template: '<button type="button"><slot /></button>' },
	KvLightbox: { name: 'KvLightbox', template: '<div><slot /></div>' },
	KvLoadingPlaceholder: { name: 'KvLoadingPlaceholder', template: '<div />' },
	KvMaterialIcon: { name: 'KvMaterialIcon', template: '<span />' },
	KvUtilityMenu: { name: 'KvUtilityMenu', template: '<div><slot /></div>' },
}));

// Stub that exposes getSelectedAmount, as the real component does, so the
// container's template ref can call it.
const RecommendLoanForGoalContainerStub = {
	name: 'RecommendLoanForGoalContainer',
	methods: {
		getSelectedAmount: () => 25,
	},
	template: '<div />',
};

function mountContainer(provide = {}) {
	return mount(GoalSettingContainer, {
		global: {
			provide: {
				$kvTrackEvent: vi.fn(),
				$appConfig: {},
				apollo: {},
				...provide,
			},
			stubs: {
				GoalSelector: true,
				RecommendLoanForGoalContainer: RecommendLoanForGoalContainerStub,
			},
		},
	});
}

describe('GoalSettingContainer', () => {
	beforeEach(() => {
		recommendedLoanSpy.mockReset();
		// Render the recommended-loan branch (which this composable feeds) so the
		// container's lazily-loaded category forms never mount during the smoke test.
		recommendedLoanSpy.mockReturnValue({
			showRecommendLoanAfterGoalView: ref(true),
			hasRecommendedLoans: ref(true),
			isLoadingRecommendedLoan: ref(false),
			recommendLoanHeaderDetails: ref([]),
			recommendedLoan: ref(null),
			recommendLoanCardProps: ref({}),
			recommendLoanIsInBasket: ref(false),
			enterRecommendedLoanStepAfterGoalSave: vi.fn(),
			handleExploreMoreLoans: vi.fn(),
			trackAddToBasketClick: vi.fn(),
			trackCheckoutClick: vi.fn(),
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	// Regression guard: the container injects apollo but previously forgot to forward it,
	// so pill fetches (and tip messages) inside the composable ran with an undefined client.
	it('forwards the injected apollo client into useGoalSettingRecommendedLoan', () => {
		const apollo = { query: vi.fn(), mutate: vi.fn() };
		mountContainer({ apollo });
		expect(recommendedLoanSpy).toHaveBeenCalledWith(
			expect.objectContaining({ apollo }),
		);
	});

	// The composable watches `show`; passing a bare boolean triggers a Vue
	// "Invalid watch source" warning, so it must be handed a reactive ref.
	it('passes a reactive show ref into useGoalSettingRecommendedLoan', () => {
		mountContainer();
		const options = recommendedLoanSpy.mock.calls[0][0];
		expect(isRef(options.show)).toBe(true);
		expect(options.show.value).toBe(true);
	});

	// The add-to-basket emit must carry the RAW recommended loan, not the card's
	// blanked copy (whose themes/tags are zeroed for the pill display) — the parent's
	// add-to-basket flow reads themes off it.
	it('emits the raw recommended loan (not the blanked card loan) on add-to-basket', async () => {
		const rawLoan = { id: 55, themes: ['Growing businesses'] };
		recommendedLoanSpy.mockReturnValue({
			showRecommendLoanAfterGoalView: ref(true),
			hasRecommendedLoans: ref(true),
			isLoadingRecommendedLoan: ref(false),
			recommendLoanHeaderDetails: ref([]),
			recommendedLoan: ref(rawLoan),
			recommendLoanCardProps: ref({ loanId: 55, loan: { id: 55, themes: [] } }),
			recommendLoanIsInBasket: ref(false),
			enterRecommendedLoanStepAfterGoalSave: vi.fn(),
			handleExploreMoreLoans: vi.fn(),
			trackAddToBasketClick: vi.fn(),
			trackCheckoutClick: vi.fn(),
		});

		const wrapper = mountContainer();
		await wrapper.findComponent({ name: 'RecommendLoanForGoalContainer' }).vm.$emit('primary-cta-click');

		const emitted = wrapper.emitted('add-to-basket');
		expect(emitted).toHaveLength(1);
		// The raw loan keeps its themes; the blanked card loan would have `themes: []`.
		expect(emitted[0][0].loan).toEqual(rawLoan);
		expect(emitted[0][0].loan.themes).toEqual(['Growing businesses']);
	});
});
