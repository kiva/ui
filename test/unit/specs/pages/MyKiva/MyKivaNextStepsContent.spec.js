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
		hideGoalCard: {
			type: Boolean,
			default: false,
		},
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

const buildGoalData = ({
	hideGoalCard = false,
	loading = false,
	userGoalAchieved = false,
} = {}) => ({
	checkCompletedGoal: vi.fn().mockResolvedValue(),
	goalProgress: ref(0),
	hideGoalCard: ref(hideGoalCard),
	loading: ref(loading),
	loadGoalData: vi.fn().mockResolvedValue(),
	loadPreferences: vi.fn().mockResolvedValue(),
	storeGoalPreferences: vi.fn().mockResolvedValue(),
	updateCurrentGoal: vi.fn().mockResolvedValue(),
	userGoal: ref(null),
	userGoalAchieved: ref(userGoalAchieved),
});

const createWrapper = ({
	goalLoading = false,
	hideGoalCard = false,
	cookieValue,
	query = {},
	props = {},
	userGoalAchieved = false,
} = {}) => {
	routeRef.value = { query };
	const cookieStore = {
		get: vi.fn(name => (name === POST_LENDING_NEXT_STEPS_COOKIE ? cookieValue : undefined)),
		remove: vi.fn(),
	};

	const goalData = buildGoalData({ hideGoalCard, loading: goalLoading, userGoalAchieved });

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
				MyKivaFeaturedSlot: defineComponent({
					name: 'MyKivaFeaturedSlot',
					props: {
						userFirstName: { type: String, default: '' },
					},
					template: '<div data-testid="featured-slot" />',
				}),
			},
		},
	});

	return {
		wrapper,
		cookieStore,
	};
};

const buildNonBadgeSlide = achievementKey => ({
	fields: {
		richText: {
			content: [
				{
					data: {
						target: {
							sys: { contentType: { sys: { id: 'uiSetting' } } },
							fields: {
								dataObject: {
									achievementKey,
									title: 'Invite friends',
									contentText: 'Share Kiva with someone new.',
								},
							},
						},
					},
				},
			],
		},
	},
});

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

	it('hides the goal card in next steps when the goal is achieved for this page view', () => {
		const { wrapper } = createWrapper({
			goalLoading: false,
			userGoalAchieved: true,
		});

		const carousels = wrapper.findAllComponents({ name: 'JourneyCardCarousel' });
		expect(carousels[0].props('hideGoalCard')).toBe(true);
	});

	describe('MyKivaFeaturedSlot integration', () => {
		it('does not mount the slot when goalsRowEnabled is false', () => {
			const { wrapper } = createWrapper({
				props: { goalsRowEnabled: false, shouldRenderFeaturedSlot: true },
			});
			expect(wrapper.find('[data-testid="featured-slot"]').exists()).toBe(false);
		});

		it('does not mount the slot when shouldRenderFeaturedSlot is false', () => {
			const { wrapper } = createWrapper({
				props: { goalsRowEnabled: true, shouldRenderFeaturedSlot: false },
			});
			expect(wrapper.find('[data-testid="featured-slot"]').exists()).toBe(false);
		});

		it('mounts the slot when both goalsRowEnabled and shouldRenderFeaturedSlot are true', () => {
			const { wrapper } = createWrapper({
				props: { goalsRowEnabled: true, shouldRenderFeaturedSlot: true },
			});
			expect(wrapper.find('[data-testid="featured-slot"]').exists()).toBe(true);
		});

		it('passes the lender first name from userInfo.userAccount.firstName', () => {
			const { wrapper } = createWrapper({
				props: {
					goalsRowEnabled: true,
					shouldRenderFeaturedSlot: true,
					userInfo: {
						userAccount: { firstName: 'Ada' },
						userPreferences: { preferences: '{}' },
						communicationSettings: { lenderNews: false, loanUpdates: false },
					},
				},
			});
			const slot = wrapper.findComponent({ name: 'MyKivaFeaturedSlot' });
			expect(slot.props('userFirstName')).toBe('Ada');
		});

		it('suppresses the in-carousel goal tile when goalsRowEnabled is true', () => {
			const { wrapper } = createWrapper({
				props: { goalsRowEnabled: true, shouldRenderFeaturedSlot: true },
			});
			const carousels = wrapper.findAllComponents({ name: 'JourneyCardCarousel' });
			expect(carousels[0].props('hideGoalCard')).toBe(true);
		});

		it('does not suppress the in-carousel goal tile when goalsRowEnabled is false', () => {
			const { wrapper } = createWrapper({
				props: { goalsRowEnabled: false, shouldRenderFeaturedSlot: true },
			});
			const carousels = wrapper.findAllComponents({ name: 'JourneyCardCarousel' });
			expect(carousels[0].props('hideGoalCard')).toBe(false);
		});
	});

	describe('build impact section', () => {
		it('hides the section when there are no Contentful slides and no other eligible cards', () => {
			const { wrapper } = createWrapper({
				cookieValue: 'true',
				props: { heroSlides: [], latestLoan: null },
			});

			expect(wrapper.text()).not.toContain('Build impact beyond your loan');
		});

		it('shows the section when a non-badge Contentful slide is available', () => {
			const { wrapper } = createWrapper({
				cookieValue: 'true',
				props: { heroSlides: [buildNonBadgeSlide('invite-friends')] },
			});

			expect(wrapper.text()).toContain('Build impact beyond your loan');
		});

		it('hides the section when an email card is eligible but no latest loan is available', () => {
			const { wrapper } = createWrapper({
				props: {
					heroSlides: [],
					latestLoan: null,
					loans: [{ id: 1 }],
					userInfo: {
						userPreferences: {
							preferences: JSON.stringify({ savedForms: [{ formName: 'mykiva-input-form' }] }),
						},
						communicationSettings: { lenderNews: false, loanUpdates: false },
					},
				},
			});

			expect(wrapper.text()).not.toContain('Build impact beyond your loan');
		});

		it('shows the section when a non-anonymous latest loan makes the latest-loan card eligible', () => {
			const { wrapper } = createWrapper({
				props: {
					heroSlides: [],
					latestLoan: { id: 42, anonymizationLevel: null },
					loans: [{ id: 42 }],
					userInfo: {
						userPreferences: {
							preferences: JSON.stringify({ savedForms: [{ formName: 'mykiva-input-form' }] }),
						},
						communicationSettings: { lenderNews: true, loanUpdates: true },
					},
				},
			});

			expect(wrapper.text()).toContain('Build impact beyond your loan');
		});
	});
});
