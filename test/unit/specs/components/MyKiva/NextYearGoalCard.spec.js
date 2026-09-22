/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import confetti from 'canvas-confetti';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import { COMPLETED_GOAL_THRESHOLD, GOAL_STATUS } from '#src/composables/useGoalData';
import { ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';
import goalCopy from '#src/util/goalCopy';

vi.mock('canvas-confetti', () => ({
	default: vi.fn(),
}));

vi.mock('vue-router', () => ({
	useRouter: () => ({}),
}));

vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		template: '<button><slot /></button>',
	},
	KvLoadingPlaceholder: {
		template: '<div />',
	},
}));

describe('NextYearGoalCard', () => {
	const createGoalData = ({ hideGoalCard = false } = {}) => ({
		getCtaHref: vi.fn(() => '/lend'),
		getGoalDisplayName: vi.fn(() => 'US entrepreneurs'),
		goalProgressPercentage: ref(COMPLETED_GOAL_THRESHOLD),
		hideGoalCard: ref(hideGoalCard),
		setHideGoalCardPreference: vi.fn(),
	});

	const mountCard = ({ goalData = createGoalData(), props = {} } = {}) => {
		const trackEvent = vi.fn();
		const wrapper = mount(NextYearGoalCard, {
			props: {
				userGoal: {
					category: ID_US_ECONOMIC_EQUALITY,
					target: 5,
					status: GOAL_STATUS.COMPLETED,
				},
				goalProgress: 5,
				loading: false,
				hideGoalCard: false,
				...props,
			},
			global: {
				provide: {
					goalData,
					$kvTrackEvent: trackEvent,
				},
				directives: {
					kvTrackEvent: () => ({}),
				},
				stubs: {
					GoalProgressRing: {
						name: 'GoalProgressRing',
						props: ['showRecapCta', 'goalDateStarted'],
						template: '<div data-testid="goal-progress-ring" />',
					},
				},
			},
		});
		return { wrapper, goalData, trackEvent };
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows confetti when mounted with a completed visible goal', () => {
		const { goalData } = mountCard();

		expect(confetti).toHaveBeenCalledTimes(1);
		expect(goalData.setHideGoalCardPreference).not.toHaveBeenCalled();
	});

	// The card no longer unrenders after completion, so the preference is what stops this.
	it('does not repeat the confetti once the completion has been announced', () => {
		mountCard({ goalData: createGoalData({ hideGoalCard: true }) });

		expect(confetti).not.toHaveBeenCalled();
	});

	describe('goal recap entry point', () => {
		const GOAL_YEAR = 2026;
		const recapProps = {
			showRecapCta: true,
			userGoal: {
				category: ID_US_ECONOMIC_EQUALITY,
				target: 5,
				status: GOAL_STATUS.COMPLETED,
				dateStarted: `${GOAL_YEAR}-02-01`,
			},
		};

		it('offers the recap CTA to the progress ring', () => {
			const { wrapper } = mountCard({ props: recapProps });

			expect(wrapper.findComponent({ name: 'GoalProgressRing' }).props('showRecapCta')).toBe(true);
		});

		it('emits the goal year instead of navigating when the recap CTA is pressed', async () => {
			const { wrapper, goalData, trackEvent } = mountCard({ props: recapProps });

			await wrapper.findComponent({ name: 'GoalProgressRing' }).vm.$emit('button-click');

			expect(wrapper.emitted('view-goal-recap')).toEqual([[GOAL_YEAR]]);
			expect(goalData.getCtaHref).not.toHaveBeenCalled();
			expect(trackEvent).not.toHaveBeenCalled();
		});

		it('keeps the continue behavior when the recap is not offered', async () => {
			const { wrapper } = mountCard({
				props: { ...recapProps, showRecapCta: false },
			});

			await wrapper.findComponent({ name: 'GoalProgressRing' }).vm.$emit('button-click');

			expect(wrapper.emitted('view-goal-recap')).toBeUndefined();
		});
	});

	it('uses date-based title copy', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-15T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 2,
			},
		});

		expect(wrapper.text()).toContain('Last year, you helped 2 women shape their futures');
		expect(wrapper.text()).not.toContain("You haven't set your goal yet!");
	});

	it('uses the loan question subtitle before April', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-31T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 30,
			},
		});

		expect(wrapper.text()).toContain('Last year, you helped 30 women shape their futures');
		expect(wrapper.text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		expect(wrapper.text()).not.toContain('Make helping others a habit.');
	});

	it('uses the habit prompt subtitle starting April', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-01T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 30,
			},
		});

		expect(wrapper.text()).toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		expect(wrapper.text()).toContain('Make helping others a habit.');
		expect(wrapper.text()).toContain("We'll help you make it happen.");
		expect(wrapper.text()).not.toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
	});

	// The goal state hydrates from the Apollo cache during server render, so the card is
	// created with `loading` already false: tracking that waited for a loading->loaded
	// transition never fired (MP-3232).
	describe('impression tracking', () => {
		const inProgressGoal = {
			category: ID_US_ECONOMIC_EQUALITY,
			target: 5,
			status: GOAL_STATUS.IN_PROGRESS,
		};

		it('fires view/set-annual-goal for a no-goal lender with no loading transition', () => {
			const { trackEvent } = mountCard({ props: { userGoal: {} } });

			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'set-annual-goal');
		});

		it('fires show/goal-set with category and target for an in-progress goal', () => {
			const goalData = createGoalData();
			goalData.goalProgressPercentage.value = 40;

			const { trackEvent } = mountCard({ goalData, props: { userGoal: inProgressGoal, goalProgress: 2 } });

			expect(trackEvent).toHaveBeenCalledWith(
				'portfolio',
				'show',
				'goal-set',
				ID_US_ECONOMIC_EQUALITY,
				5,
			);
		});

		it('fires the impression only once', async () => {
			const { wrapper, trackEvent } = mountCard({ props: { userGoal: {} } });

			await wrapper.setProps({ hideGoalCard: true });
			await wrapper.setProps({ hideGoalCard: false });

			const impressions = trackEvent.mock.calls
				.filter(([, action, label]) => action === 'view' && label === 'set-annual-goal');
			expect(impressions).toHaveLength(1);
		});

		it('waits for the data when the card does start out loading', async () => {
			const { wrapper, trackEvent } = mountCard({ props: { userGoal: {}, loading: true } });

			expect(trackEvent).not.toHaveBeenCalled();

			await wrapper.setProps({ loading: false });

			expect(trackEvent).toHaveBeenCalledWith('portfolio', 'view', 'set-annual-goal');
		});

		it('stays quiet while the card is hidden', () => {
			const { trackEvent } = mountCard({ props: { userGoal: {}, hideGoalCard: true } });

			expect(trackEvent).not.toHaveBeenCalled();
		});

		it('stays quiet for a completed goal', () => {
			const { trackEvent } = mountCard();

			expect(trackEvent).not.toHaveBeenCalled();
		});
	});

	describe('days left countdown', () => {
		it('hands the goal start date to the ring, which resolves the countdown itself after mount', () => {
			const goalData = createGoalData();
			goalData.goalProgressPercentage.value = 40;
			const { wrapper } = mountCard({
				goalData,
				props: {
					userGoal: {
						category: ID_US_ECONOMIC_EQUALITY,
						target: 5,
						status: GOAL_STATUS.IN_PROGRESS,
						dateStarted: '2026-02-01T12:00:00.000Z',
					},
					goalProgress: 2,
				},
			});

			expect(wrapper.findComponent({ name: 'GoalProgressRing' }).props('goalDateStarted'))
				.toBe('2026-02-01T12:00:00.000Z');
		});
	});
});
