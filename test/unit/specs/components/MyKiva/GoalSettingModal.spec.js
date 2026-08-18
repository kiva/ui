/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';

vi.mock('vue-router', () => ({
	useRouter: () => ({}),
}));

vi.mock('#src/composables/useBreakpoints', () => ({
	default: () => ({
		isMobile: ref(false),
		isLarge: ref(true),
	}),
}));

vi.mock('#src/composables/useGoalData', () => ({
	GOALS_CURRENT_YEAR: 2026,
	default: () => ({
		getCtaHref: vi.fn(() => '/lend'),
		getCategories: vi.fn(() => [
			{
				id: 1,
				badgeId: ID_WOMENS_EQUALITY,
				name: 'Women',
				eventProp: 'women',
			},
		]),
		goalProgress: ref(0),
		goalProgressPercentage: ref(0),
		userGoal: ref(null),
		loadGoalData: vi.fn(),
		getRecommendedLoans: vi.fn(),
	}),
}));

const recommendedLoan = vi.hoisted(() => ({ state: null }));

vi.mock('#src/composables/useGoalSettingRecommendedLoan', () => {
	recommendedLoan.state = {
		showRecommendLoanAfterGoalView: ref(false),
		hasRecommendedLoans: ref(false),
		isLoadingRecommendedLoan: ref(false),
		recommendLoanHeaderDetails: ref([]),
		recommendedLoan: ref(null),
		recommendLoanCardProps: ref({}),
		recommendLoanIsInBasket: ref(false),
	};

	return {
		GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO: 'portfolio',
		default: () => ({
			...recommendedLoan.state,
			resetRecommendedLoanState: vi.fn(),
			enterRecommendedLoanStepAfterGoalSave: vi.fn(),
			onGoalSelectorSetGoal: vi.fn(),
			onGoalSelectorUpdateGoal: vi.fn(),
			handleExploreMoreLoans: vi.fn(),
			onAddToBasketError: vi.fn(),
			trackAddToBasketClick: vi.fn(),
			trackCheckoutClick: vi.fn(),
		}),
	};
});

vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		template: '<button type="button"><slot></slot></button>',
	},
	KvLightbox: {
		name: 'KvLightbox',
		template: `
			<div>
				<slot name="header"></slot>
				<slot></slot>
				<slot name="controls"></slot>
			</div>
		`,
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div></div>',
	},
	KvMaterialIcon: {
		name: 'KvMaterialIcon',
		template: '<span></span>',
	},
}));

const RecommendLoanForGoalContentStub = {
	name: 'RecommendLoanForGoalContent',
	methods: {
		getSelectedAmount() {
			return '25';
		},
	},
	template: '<div data-testid="recommend-loan-content"></div>',
};

const RecommendLoanForGoalFooterStub = {
	name: 'RecommendLoanForGoalFooter',
	emits: ['primary-cta-click'],
	template: '<button data-testid="footer-cta" @click="$emit(\'primary-cta-click\')"></button>',
};

const GoalSelectorStub = {
	name: 'GoalSelector',
	props: {
		compactLayout: {
			type: Boolean,
			default: false,
		},
		progressSubtitleBeforeOptions: {
			type: Boolean,
			default: false,
		},
	},
	template: '<div data-testid="goal-selector"></div>',
};

function mountModal(props = {}, extraStubs = {}) {
	return mount(GoalSettingModal, {
		props: {
			show: true,
			showGoalSelector: true,
			tieredAchievements: [],
			...props,
		},
		global: {
			provide: {
				$kvTrackEvent: vi.fn(),
				$appConfig: {},
				apollo: {
					query: () => Promise.resolve({}),
					readQuery: () => null,
					watchQuery: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }),
				},
			},
			stubs: {
				GoalSelector: GoalSelectorStub,
				CategoryForm: true,
				NumberChoice: true,
				RecommendLoanForGoalContent: true,
				RecommendLoanForGoalFooter: true,
				RecommendLoanForGoalHeader: true,
				...extraStubs,
			},
		},
	});
}

describe('GoalSettingModal', () => {
	afterEach(() => {
		vi.clearAllMocks();
		recommendedLoan.state.showRecommendLoanAfterGoalView.value = false;
		recommendedLoan.state.hasRecommendedLoans.value = false;
		recommendedLoan.state.recommendLoanCardProps.value = {};
		recommendedLoan.state.recommendedLoan.value = null;
	});

	it('does not render the removed green goal tile value-props panel', () => {
		const wrapper = mountModal();
		const selector = wrapper.findComponent(GoalSelectorStub);

		expect(selector.exists()).toBe(true);
		expect(wrapper.text()).not.toContain('Set your annual goal');
		expect(wrapper.text()).not.toContain('Build a habit of helping others');
		expect(wrapper.text()).not.toContain('Track your impact as it grows');
		expect(wrapper.text()).not.toContain('Stay consistent with reminders');
	});

	it('passes compact-layout to GoalSelector in the standard selector state', () => {
		const wrapper = mountModal({
			showRecommendLoanArea: false,
			isThanksPage: false,
		});

		expect(wrapper.findComponent(GoalSelectorStub).props('compactLayout')).toBe(true);
	});

	it('places the progress subtitle before options in the standard selector state', () => {
		const wrapper = mountModal({
			showRecommendLoanArea: false,
			isThanksPage: false,
		});

		expect(wrapper.findComponent(GoalSelectorStub).props('progressSubtitleBeforeOptions')).toBe(true);
	});

	it('does not pass compact-layout when on the thanks page', () => {
		const wrapper = mountModal({ isThanksPage: true });

		expect(wrapper.findComponent(GoalSelectorStub).props('compactLayout')).toBe(false);
	});

	it('keeps the progress subtitle below options on the thanks page', () => {
		const wrapper = mountModal({ isThanksPage: true });

		expect(wrapper.findComponent(GoalSelectorStub).props('progressSubtitleBeforeOptions')).toBe(false);
	});

	describe('add-to-basket from the recommended loan footer', () => {
		function mountRecommendedLoanStep({ show, loanId }) {
			recommendedLoan.state.showRecommendLoanAfterGoalView.value = true;
			recommendedLoan.state.hasRecommendedLoans.value = true;
			recommendedLoan.state.recommendLoanCardProps.value = { loanId };
			recommendedLoan.state.recommendedLoan.value = { id: loanId };

			return mountModal({ show }, {
				RecommendLoanForGoalContent: RecommendLoanForGoalContentStub,
				RecommendLoanForGoalFooter: RecommendLoanForGoalFooterStub,
			});
		}

		it('carries the amount the content component has selected', async () => {
			const wrapper = mountRecommendedLoanStep({ show: true, loanId: 12345 });

			await wrapper.find('[data-testid="footer-cta"]').trigger('click');

			const [payload] = wrapper.emitted('add-to-basket')[0];
			expect(payload.loanId).toBe(12345);
			expect(payload.lendAmount).toBe('25');
		});

		it('emits the loan without an amount when the modal is closed', async () => {
			const wrapper = mountRecommendedLoanStep({ show: false, loanId: 12345 });

			expect(wrapper.find('[data-testid="recommend-loan-content"]').exists()).toBe(false);

			await wrapper.find('[data-testid="footer-cta"]').trigger('click');

			const [payload] = wrapper.emitted('add-to-basket')[0];
			expect(payload.loanId).toBe(12345);
			expect(payload.lendAmount).toBeUndefined();
		});
	});
});
