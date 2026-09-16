/* eslint-disable import/no-extraneous-dependencies */
import { flushPromises, mount } from '@vue/test-utils';
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
						props: ['showRecapCta', 'daysLeft'],
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

	describe('days left countdown', () => {
		const inProgressGoal = {
			category: ID_US_ECONOMIC_EQUALITY,
			target: 5,
			status: GOAL_STATUS.IN_PROGRESS,
			// February is far from any year boundary, so the goal year is 2026 in every timezone.
			dateStarted: '2026-02-01T12:00:00.000Z',
		};

		afterEach(() => {
			// Clear the recapDate so it never leaks into other tests' "now".
			window.history.pushState({}, '', '/');
		});

		it('passes the days left to the ring after mount, honoring the recapDate override', async () => {
			window.history.pushState({}, '', '/?recapDate=2026-11-15');
			const goalData = createGoalData();
			goalData.goalProgressPercentage.value = 40;
			const { wrapper } = mountCard({ goalData, props: { userGoal: inProgressGoal, goalProgress: 2 } });

			await flushPromises();

			expect(wrapper.findComponent({ name: 'GoalProgressRing' }).props('daysLeft')).toBe(47);
		});

		it('passes null once the goal is complete, even inside the window', async () => {
			window.history.pushState({}, '', '/?recapDate=2026-11-15');
			// createGoalData() defaults goalProgressPercentage to COMPLETED_GOAL_THRESHOLD.
			const { wrapper } = mountCard({
				props: { userGoal: { ...inProgressGoal, status: GOAL_STATUS.COMPLETED }, goalProgress: 5 },
			});

			await flushPromises();

			expect(wrapper.findComponent({ name: 'GoalProgressRing' }).props('daysLeft')).toBeNull();
		});

		it('passes null outside the 90-day window', async () => {
			window.history.pushState({}, '', '/?recapDate=2026-06-15');
			const goalData = createGoalData();
			goalData.goalProgressPercentage.value = 40;
			const { wrapper } = mountCard({ goalData, props: { userGoal: inProgressGoal, goalProgress: 2 } });

			await flushPromises();

			expect(wrapper.findComponent({ name: 'GoalProgressRing' }).props('daysLeft')).toBeNull();
		});
	});
});
