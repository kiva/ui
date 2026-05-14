/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import confetti from 'canvas-confetti';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import { COMPLETED_GOAL_THRESHOLD, GOAL_STATUS } from '#src/composables/useGoalData';
import { ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';

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

	it('shows confetti when mounted with a completed visible goal', () => {
		const { goalData } = mountCard();

		expect(confetti).toHaveBeenCalledTimes(1);
		expect(goalData.setHideGoalCardPreference).not.toHaveBeenCalled();
	});
});
