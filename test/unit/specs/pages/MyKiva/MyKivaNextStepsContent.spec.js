/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import MyKivaNextStepsContent from '#src/pages/MyKiva/MyKivaNextStepsContent';
import { POST_LENDING_NEXT_STEPS_COOKIE } from '#src/util/myKivaUtils';

const mockPush = vi.fn();
const routeRef = ref({ query: {} });

vi.mock('vue-router', () => ({
	useRouter: () => ({
		push: mockPush,
		currentRoute: routeRef,
	}),
}));

vi.mock('#src/composables/useBreakpoints', () => ({
	default: () => ({
		isMobile: ref(false),
	}),
}));

const MyKivaContainerStub = defineComponent({
	name: 'MyKivaContainer',
	setup(_, { slots }) {
		return () => h('div', slots.default?.());
	},
});

const JourneyCardCarouselStub = defineComponent({
	name: 'JourneyCardCarousel',
	props: {
		showLendingNextStepsCards: {
			type: Boolean,
			default: false,
		},
	},
	template: '<div class="journey-card-carousel-stub" />',
});

const KvLoadingPlaceholderStub = defineComponent({
	name: 'KvLoadingPlaceholder',
	template: '<div class="kv-loading-placeholder-stub" />',
});

const buildGoalData = ({ loading = false } = {}) => ({
	checkCompletedGoal: vi.fn().mockResolvedValue(),
	goalProgress: ref(0),
	hideGoalCard: ref(false),
	loading: ref(loading),
	loadGoalData: vi.fn().mockResolvedValue(),
	loadPreferences: vi.fn().mockResolvedValue(),
	storeGoalPreferences: vi.fn().mockResolvedValue(),
	updateCurrentGoal: vi.fn().mockResolvedValue(),
	userGoal: ref(null),
	userGoalAchieved: ref(false),
});

const createWrapper = ({
	goalLoading = false,
	cookieValue,
	query = {},
	props = {},
} = {}) => {
	routeRef.value = { query };
	const cookieStore = {
		get: vi.fn(name => (name === POST_LENDING_NEXT_STEPS_COOKIE ? cookieValue : undefined)),
		remove: vi.fn(),
	};

	const goalData = buildGoalData({ loading: goalLoading });

	const wrapper = mount(MyKivaNextStepsContent, {
		props: {
			lendingNextStepsVariant: 'b',
			userInfo: {
				userPreferences: {
					preferences: '{}',
				},
				communicationSettings: {
					lenderNews: false,
					loanUpdates: false,
				},
			},
			...props,
		},
		global: {
			provide: {
				cookieStore,
				$kvTrackEvent: vi.fn(),
				goalData,
			},
			stubs: {
				MyKivaContainer: MyKivaContainerStub,
				JourneyCardCarousel: JourneyCardCarouselStub,
				MyKivaRegionExperience: true,
				GoalSettingModal: true,
				MyKivaImpactInsightModal: true,
				MyKivaSharingModal: true,
				MyKivaCard: true,
				MyKivaEmailUpdatesTransition: true,
				MyKivaLatestLoanCard: true,
				MyKivaSurveyCard: true,
				KvMaterialIcon: true,
				KvButton: true,
				KvLoadingPlaceholder: KvLoadingPlaceholderStub,
			},
		},
	});

	return {
		wrapper,
		cookieStore,
	};
};

describe('MyKivaNextStepsContent', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		routeRef.value = { query: {} };
	});

	it('shows loading placeholders instead of lending-focused carousel while goal data is loading', () => {
		const { wrapper } = createWrapper({ goalLoading: true });

		expect(wrapper.findAll('.journey-card-carousel-stub')).toHaveLength(0);
	});

	it('initializes post-lending mode before first render when post-lending cookie exists', async () => {
		const { wrapper, cookieStore } = createWrapper({
			cookieValue: 'true',
			goalLoading: false,
		});
		await flushPromises();

		const carousels = wrapper.findAllComponents({ name: 'JourneyCardCarousel' });
		expect(carousels).toHaveLength(1);
		expect(carousels[0].props('showLendingNextStepsCards')).toBe(false);
		expect(cookieStore.remove).toHaveBeenCalledWith(POST_LENDING_NEXT_STEPS_COOKIE);
	});
});
