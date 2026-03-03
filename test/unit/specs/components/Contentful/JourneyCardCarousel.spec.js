/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';

vi.mock('vue-router', () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock('#src/composables/useBreakpoints', () => ({
	default: () => ({
		isMobile: ref(false),
		isMedium: ref(false),
		isLarge: ref(true),
	}),
}));

vi.mock('#src/composables/useOptIn', () => ({
	default: () => ({
		userHasMailUpdatesOptOut: () => false,
	}),
}));

vi.mock('#src/composables/useGoalData', () => ({
	default: () => ({
		getCategoryLoansLastYear: () => 0,
	}),
}));

vi.mock('#src/util/imageUtils', () => ({
	optimizeContentfulUrl: url => url,
}));

vi.mock('@kiva/kv-components', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		KvCarousel: defineComponent({
			name: 'KvCarousel',
			setup(_, { slots }) {
				return () => h(
					'div',
					{ class: 'kv-carousel-stub' },
					Object.keys(slots).sort().map(slotName => slots[slotName]?.())
				);
			},
		}),
		KvMaterialIcon: defineComponent({
			name: 'KvMaterialIcon',
			template: '<i />',
		}),
	};
});

describe('JourneyCardCarousel', () => {
	it('renders next-step achievement progress from parent-provided heroBadgeData', () => {
		const slide = {
			fields: {
				richText: {
					content: [{
						data: {
							target: {
								sys: {
									contentType: {
										sys: { id: 'uiSetting' },
									},
								},
								fields: {
									dataObject: {
										achievementKey: ID_WOMENS_EQUALITY,
									},
								},
							},
						},
					}]
				},
			},
		};

		const wrapper = mount(JourneyCardCarousel, {
			props: {
				inLendingStats: true,
				userGoalEnabled: false,
				slides: [slide],
				heroTieredAchievements: [
					{
						id: ID_WOMENS_EQUALITY,
						description: 'Women challenge',
						totalProgressToAchievement: 6,
						loanPurchases: [],
						tiers: [
							{ target: 5, completedDate: null, learnMoreURL: '' },
							{ target: 10, completedDate: null, learnMoreURL: '' },
						],
					},
				],
				heroBadgeData: [
					{
						id: ID_WOMENS_EQUALITY,
						challengeName: 'Women',
						contentfulData: [
							{
								id: ID_WOMENS_EQUALITY,
								level: 1,
								levelName: '1',
								challengeName: 'Women',
								imageUrl: '/badge.svg',
							},
							{
								id: ID_WOMENS_EQUALITY,
								level: 2,
								levelName: '2',
								challengeName: 'Women',
								imageUrl: '/badge-2.svg',
							},
						],
						achievementData: {
							id: ID_WOMENS_EQUALITY,
							description: 'Women challenge',
							totalProgressToAchievement: 6,
							tiers: [
								{
									level: 1,
									target: 5,
									completedDate: null,
									learnMoreURL: ''
								},
								{
									level: 2,
									target: 10,
									completedDate: null,
									learnMoreURL: ''
								},
							],
						},
						hasStarted: true,
						level: 1,
					},
				],
				userInfo: {
					userPreferences: {
						preferences: '{}',
					},
				},
			},
			global: {
				provide: {
					apollo: {},
					cookieStore: {},
					$kvTrackEvent: vi.fn(),
				},
				directives: {
					kvTrackEvent: () => ({}),
				},
				stubs: {
					MyKivaCard: {
						props: ['title'],
						template: '<div class="my-kiva-card-title">{{ title }}</div>',
					},
					MyKivaSharingModal: true,
					GoalCard: true,
					NextYearGoalCard: true,
					MyKivaEmailUpdatesCard: true,
					MyKivaLatestLoanCard: true,
					MyKivaSurveyCard: true,
					ThankYouCard: true,
				},
			},
		});

		expect(wrapper.find('.my-kiva-card-title').text()).toContain('Your progress: 6/10 loans');
	});

	it('renders gracefully when heroBadgeData is an empty array', () => {
		const slide = {
			fields: {
				richText: {
					content: [{
						data: {
							target: {
								sys: {
									contentType: {
										sys: { id: 'uiSetting' },
									},
								},
								fields: {
									dataObject: {
										achievementKey: ID_WOMENS_EQUALITY,
									},
								},
							},
						},
					}]
				},
			},
		};

		const wrapper = mount(JourneyCardCarousel, {
			props: {
				inLendingStats: true,
				userGoalEnabled: false,
				slides: [slide],
				heroTieredAchievements: [],
				heroBadgeData: [],
				userInfo: {
					userPreferences: {
						preferences: '{}',
					},
				},
			},
			global: {
				provide: {
					apollo: {},
					cookieStore: {},
					$kvTrackEvent: vi.fn(),
				},
				directives: {
					kvTrackEvent: () => ({}),
				},
				stubs: {
					MyKivaCard: {
						props: ['title'],
						template: '<div class="my-kiva-card-title">{{ title }}</div>',
					},
					MyKivaSharingModal: true,
					GoalCard: true,
					NextYearGoalCard: true,
					MyKivaEmailUpdatesCard: true,
					MyKivaLatestLoanCard: true,
					MyKivaSurveyCard: true,
					ThankYouCard: true,
				},
			},
		});

		// Should not crash; card does not render when no badge matches the slide
		expect(wrapper.find('.my-kiva-card-title').exists()).toBe(false);
	});
});
