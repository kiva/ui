/* eslint-disable import/no-extraneous-dependencies */
import { flushPromises, mount } from '@vue/test-utils';
import GoalEntrypoint from '#src/pages/Portfolio/ImpactDashboard/GoalEntrypoint';
import { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import goalCopy from '#src/util/goalCopy';

const routerPush = vi.fn();

vi.mock('vue-router', () => ({
	useRouter: () => ({
		push: routerPush,
	}),
}));

vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		template: '<button type="button"><slot></slot></button>',
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div data-testid="loading-placeholder"></div>',
	},
}));

const AsyncPortfolioSectionStub = {
	name: 'AsyncPortfolioSection',
	emits: ['visible'],
	mounted() {
		this.$emit('visible');
	},
	template: '<section><slot></slot></section>',
};

function mountComponent({
	now = new Date('2026-03-15T12:00:00'),
	womenLoansLastYear = 0,
} = {}) {
	vi.useFakeTimers();
	vi.setSystemTime(now);

	const apollo = {
		query: vi.fn().mockResolvedValue({
			data: {
				userAchievementProgress: {
					tieredLendingAchievements: [
						{
							id: ID_WOMENS_EQUALITY,
							progressForYear: womenLoansLastYear,
						},
					],
				},
			},
		}),
	};

	const wrapper = mount(GoalEntrypoint, {
		global: {
			provide: {
				apollo,
				$kvTrackEvent: vi.fn(),
			},
			stubs: {
				AsyncPortfolioSection: AsyncPortfolioSectionStub,
			},
		},
	});

	return { apollo, wrapper };
}

describe('Portfolio GoalEntrypoint', () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('renders the no-history last-year copy from January 1 through March 31', async () => {
		const { wrapper } = mountComponent({
			now: new Date('2026-03-31T12:00:00'),
			womenLoansLastYear: 0,
		});

		await flushPromises();

		expect(wrapper.text()).toContain('Lenders like you help 3 women a year!');
		expect(wrapper.text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		expect(wrapper.text()).toContain(goalCopy.BUTTON_SET_GOAL);
		expect(wrapper.text()).not.toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
	});

	it('renders the lender-history last-year copy from January 1 through March 31', async () => {
		const { wrapper } = mountComponent({
			now: new Date('2026-03-31T12:00:00'),
			womenLoansLastYear: 2,
		});

		await flushPromises();

		expect(wrapper.text()).toContain('Last year, you helped 2 women shape their futures!');
		expect(wrapper.text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		expect(wrapper.text()).toContain(goalCopy.BUTTON_SET_GOAL);
		expect(wrapper.text()).not.toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
	});

	it('renders the no-goal-yet copy starting April 1', async () => {
		const { wrapper } = mountComponent({
			now: new Date('2026-04-01T12:00:00'),
			womenLoansLastYear: 2,
		});

		await flushPromises();

		expect(wrapper.text()).toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		expect(wrapper.text()).toContain(goalCopy.CARD_HABIT_PROMPT_SINGLE_LINE);
		expect(wrapper.text()).toContain(goalCopy.BUTTON_SET_GOAL);
		expect(wrapper.text()).not.toContain('Last year, you helped');
		expect(wrapper.text()).not.toContain('Lenders like you');
		expect(wrapper.text()).not.toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
	});
});
