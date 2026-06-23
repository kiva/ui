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
	const createGoalData = () => ({
		getCtaHref: vi.fn(() => '/lend'),
		getGoalDisplayName: vi.fn(() => 'US entrepreneurs'),
		goalProgressPercentage: ref(COMPLETED_GOAL_THRESHOLD),
		setHideGoalCardPreference: vi.fn(),
	});

	const mountCard = ({ goalData = createGoalData(), props = {} } = {}) => {
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
					$kvTrackEvent: vi.fn(),
				},
				directives: {
					kvTrackEvent: () => ({}),
				},
				stubs: {
					GoalProgressRing: {
						template: '<div data-testid="goal-progress-ring" />',
					},
				},
			},
		});
		return { wrapper, goalData };
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

	it('uses date-based title copy even when the goal tile experiment is enabled', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-15T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 2,
				isGoalTileExperimentEnabled: true,
			},
		});

		expect(wrapper.text()).toContain('Last year, you helped 2 women shape their futures!');
		expect(wrapper.text()).not.toContain("You haven't set your goal yet!");
	});

	it('uses the loan question subtitle before April even when the goal tile experiment is enabled', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-03-31T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 30,
				isGoalTileExperimentEnabled: true,
			},
		});

		expect(wrapper.text()).toContain('Last year, you helped 30 women shape their futures!');
		expect(wrapper.text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		expect(wrapper.text()).not.toContain(goalCopy.CARD_HABIT_PROMPT_SINGLE_LINE);
	});

	it('uses the habit prompt subtitle starting April when the goal tile experiment is enabled', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-04-01T12:00:00'));

		const { wrapper } = mountCard({
			props: {
				userGoal: null,
				prevYearLoans: 30,
				isGoalTileExperimentEnabled: true,
			},
		});

		expect(wrapper.text()).toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		expect(wrapper.text()).toContain('Make helping others a habit.');
		expect(wrapper.text()).toContain("We'll help you make it happen.");
		expect(wrapper.text()).not.toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
	});
});
