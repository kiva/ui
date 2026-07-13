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

vi.mock('#src/composables/useGoalSettingRecommendedLoan', () => ({
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO: 'portfolio',
	default: () => ({
		showRecommendLoanAfterGoalView: ref(false),
		hasRecommendedLoans: ref(false),
		isLoadingRecommendedLoan: ref(false),
		recommendLoanHeaderDetails: ref(''),
		recommendedLoan: ref(null),
		recommendLoanCardProps: ref({}),
		recommendLoanIsInBasket: ref(false),
		resetRecommendedLoanState: vi.fn(),
		enterRecommendedLoanStepAfterGoalSave: vi.fn(),
		onGoalSelectorSetGoal: vi.fn(),
		onGoalSelectorUpdateGoal: vi.fn(),
		handleExploreMoreLoans: vi.fn(),
		onAddToBasketError: vi.fn(),
		trackAddToBasketClick: vi.fn(),
		trackCheckoutClick: vi.fn(),
	}),
}));

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

function mountModal(props = {}) {
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
				apollo: {},
			},
			stubs: {
				GoalSelector: GoalSelectorStub,
				CategoryForm: true,
				NumberChoice: true,
				RecommendLoanForGoalContent: true,
				RecommendLoanForGoalFooter: true,
				RecommendLoanForGoalHeader: true,
			},
		},
	});
}

describe('GoalSettingModal', () => {
	afterEach(() => {
		vi.clearAllMocks();
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
});
