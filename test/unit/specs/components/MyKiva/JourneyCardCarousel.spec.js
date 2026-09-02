/* eslint-disable import/no-extraneous-dependencies, vue/one-component-per-file */
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import CookieStore from '#src/util/cookieStore';
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

vi.mock('#src/composables/useGoalData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			getCategoryLoansLastYear: () => 0,
			hasGoal: goal => !!goal && Object.keys(goal).length > 0,
		}),
		GOALS_CURRENT_YEAR: new Date().getFullYear(),
	};
});

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
		const wrapper = mount(JourneyCardCarousel, {
			props: {
				inLendingStats: true,
				slides: [{
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
				}],
				slidesNumber: 3,
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
					cookieStore: new CookieStore({}),
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
		const wrapper = mount(JourneyCardCarousel, {
			props: {
				inLendingStats: true,
				slides: [{
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
				}],
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
					cookieStore: new CookieStore({}),
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

	const mountForAlmostFunded = showLendingNextStepsCards => mount(JourneyCardCarousel, {
		props: {
			inLendingStats: true,
			showLendingNextStepsCards,
			slidesNumber: 3,
			slides: [],
			heroTieredAchievements: [],
			heroBadgeData: [],
			userInfo: { userPreferences: { preferences: '{}' } },
		},
		global: {
			provide: { apollo: {}, cookieStore: new CookieStore({}), $kvTrackEvent: vi.fn() },
			directives: { kvTrackEvent: () => ({}) },
			stubs: {
				MyKivaCard: true,
				MyKivaSharingModal: true,
				NextYearGoalCard: true,
				MyKivaEmailUpdatesTransition: true,
				MyKivaLatestLoanCard: true,
				MyKivaSurveyCard: true,
				AlmostFundedNextStep: true,
			},
		},
	});

	it('injects and renders the Almost Funded next step when showLendingNextStepsCards is true', () => {
		const wrapper = mountForAlmostFunded(true);
		expect(wrapper.findComponent({ name: 'AlmostFundedNextStep' }).exists()).toBe(true);
	});

	it('does not render the Almost Funded next step when showLendingNextStepsCards is false', () => {
		const wrapper = mountForAlmostFunded(false);
		expect(wrapper.findComponent({ name: 'AlmostFundedNextStep' }).exists()).toBe(false);
	});

	describe('Colombia recovery fund next step', () => {
		const mountForCoRecoveryFund = props => mount(JourneyCardCarousel, {
			props: {
				inLendingStats: true,
				slidesNumber: 3,
				slides: [],
				heroTieredAchievements: [],
				heroBadgeData: [],
				userInfo: { userPreferences: { preferences: '{}' } },
				...props,
			},
			global: {
				provide: { apollo: {}, cookieStore: new CookieStore({}), $kvTrackEvent: vi.fn() },
				directives: { kvTrackEvent: () => ({}) },
				stubs: {
					MyKivaCard: true,
					MyKivaSharingModal: true,
					NextYearGoalCard: true,
					MyKivaEmailUpdatesTransition: true,
					MyKivaLatestLoanCard: true,
					MyKivaSurveyCard: true,
					AlmostFundedNextStep: true,
					ColombiaReliefNextStep: true,
				},
			},
		});

		const slotOrder = wrapper => wrapper.findAll('.kv-carousel-stub > *')
			.map(el => el.element.tagName.toLowerCase());

		it('does not render when showCoRecoveryFundCard is false', () => {
			const wrapper = mountForCoRecoveryFund({ showCoRecoveryFundCard: false });
			expect(wrapper.findComponent({ name: 'ColombiaReliefNextStep' }).exists()).toBe(false);
		});

		it('renders when showCoRecoveryFundCard is true', () => {
			const wrapper = mountForCoRecoveryFund({ showCoRecoveryFundCard: true });
			expect(wrapper.findComponent({ name: 'ColombiaReliefNextStep' }).exists()).toBe(true);
		});

		it('takes the slot ahead of Almost Funded, which is only preceded by the goal tile', () => {
			const wrapper = mountForCoRecoveryFund({
				showCoRecoveryFundCard: true,
				showLendingNextStepsCards: true,
				userGoal: { category: ID_WOMENS_EQUALITY, target: 5 },
				goalProgressLoading: false,
			});

			expect(slotOrder(wrapper)).toEqual([
				'next-year-goal-card-stub',
				'colombia-relief-next-step-stub',
				'almost-funded-next-step-stub',
			]);
		});

		it('trails the post-lending next steps rather than displacing them', () => {
			const wrapper = mountForCoRecoveryFund({
				showCoRecoveryFundCard: true,
				showPostLendingNextStepsCards: true,
				hideGoalCard: true,
				latestLoan: { id: 1 },
				userInfo: {
					userPreferences: { preferences: '{}' },
					communicationSettings: { lenderNews: true, loanUpdates: true },
				},
			});

			const order = slotOrder(wrapper);
			expect(order.indexOf('my-kiva-latest-loan-card-stub')).toBeLessThan(
				order.indexOf('colombia-relief-next-step-stub')
			);
		});
	});

	describe('goal recap entry point', () => {
		const GOAL_YEAR = new Date().getFullYear();

		const mountWithGoal = ({
			goalInReviewEnable = true,
			status = 'completed',
			showRecapCta = true,
		} = {}) => mount(
			JourneyCardCarousel,
			{
				props: {
					inLendingStats: true,
					goalInReviewEnable,
					showRecapCta,
					goalProgress: 5,
					goalProgressLoading: false,
					userGoal: {
						category: ID_WOMENS_EQUALITY,
						target: 5,
						status,
						dateStarted: `${GOAL_YEAR}-02-01`,
					},
					slidesNumber: 3,
					slides: [],
					heroTieredAchievements: [],
					heroBadgeData: [],
					userInfo: { userPreferences: { preferences: '{}' } },
				},
				global: {
					provide: { apollo: {}, cookieStore: new CookieStore({}), $kvTrackEvent: vi.fn() },
					directives: { kvTrackEvent: () => ({}) },
					stubs: {
						MyKivaCard: true,
						MyKivaSharingModal: true,
						NextYearGoalCard: {
							name: 'NextYearGoalCard',
							props: ['showRecapCta'],
							template: '<div />',
						},
						MyKivaEmailUpdatesTransition: true,
						MyKivaLatestLoanCard: true,
						MyKivaSurveyCard: true,
						AlmostFundedNextStep: true,
					},
				},
			},
		);

		it('offers the recap on the goal tile for a completed goal this year', () => {
			const wrapper = mountWithGoal();
			expect(wrapper.findComponent({ name: 'NextYearGoalCard' }).props('showRecapCta')).toBe(true);
		});

		// LendingStats owns the decision (see useGoalRecapEntryPoint); the tile relays it.
		it('leaves the goal tile alone when the page says there is no recap to offer', () => {
			const wrapper = mountWithGoal({ showRecapCta: false });
			expect(wrapper.findComponent({ name: 'NextYearGoalCard' }).props('showRecapCta')).toBe(false);
		});

		it('passes the requested recap year up to the page', async () => {
			const wrapper = mountWithGoal();

			await wrapper.findComponent({ name: 'NextYearGoalCard' }).vm.$emit('view-goal-recap', GOAL_YEAR);

			expect(wrapper.emitted('view-goal-recap')).toEqual([[GOAL_YEAR]]);
		});
	});
});
