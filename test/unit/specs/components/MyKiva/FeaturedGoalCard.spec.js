/* eslint-disable import/no-extraneous-dependencies */
import { mount } from '@vue/test-utils';
import FeaturedGoalCard from '#src/components/MyKiva/FeaturedGoalCard';
import { GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import goalCopy from '#src/util/goalCopy';

const stripHtml = html => html.replace(/<[^>]*>/g, '');

vi.mock('#src/util/animation/confettiUtils', () => ({
	showConfetti: vi.fn(),
}));

// Stub the @kiva/kv-components primitives this spec touches so copy assertions
// don't drag in SVG rendering (KvProgressCircle) or menu interaction logic
// (KvUtilityMenu) that are irrelevant here — matches sibling MyKiva specs like
// NextYearGoalCard.
vi.mock('@kiva/kv-components', () => ({
	KvButton: {
		name: 'KvButton',
		template: '<button class="kv-button-stub"><slot /></button>',
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		template: '<div data-testid="loading-placeholder" />',
	},
	KvProgressCircle: {
		name: 'KvProgressCircle',
		props: ['value', 'max', 'rotate', 'color', 'strokeWidth'],
		template: '<div data-testid="progress-ring" :data-value="value" :data-max="max" />',
	},
	KvUtilityMenu: {
		name: 'KvUtilityMenu',
		template: '<div data-testid="utility-menu"><slot /></div>',
	},
}));

vi.mock('#src/components/Kv/KvIcon', () => ({
	default: {
		name: 'KvIcon',
		props: ['name'],
		template: '<i :data-icon="name" />',
	},
}));

const trackEventSpy = vi.fn();

const mountCard = (props = {}) => mount(FeaturedGoalCard, {
	props: {
		state: 'no-goal',
		loading: false,
		goalTarget: 0,
		goalProgress: 0,
		goalProgressPercentage: 0,
		categoryName: '',
		userName: '',
		suppressCompletionConfetti: false,
		...props,
	},
	global: {
		directives: {
			kvTrackEvent: () => ({}),
		},
		provide: {
			$kvTrackEvent: trackEventSpy,
		},
	},
});

describe('FeaturedGoalCard copy', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('loading state', () => {
		it('renders the loading placeholder when loading=true and no body content', () => {
			const wrapper = mountCard({ loading: true });
			expect(wrapper.find('[data-testid="loading-placeholder"]').exists()).toBe(true);
			expect(wrapper.text()).not.toContain('How many loans');
		});
	});

	describe('no-goal state', () => {
		const buildNoGoal = () => mountCard({ state: 'no-goal' });

		it('renders the original "3 women" title from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			const wrapper = buildNoGoal();
			expect(wrapper.text()).toContain(stripHtml(goalCopy.titleNoHistoryWomensDefault()));
			expect(wrapper.text()).not.toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
		});

		it('renders the no-goal-yet title and habit prompt starting April 1', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-04-01T12:00:00'));

			const wrapper = buildNoGoal();
			expect(wrapper.text()).toContain(goalCopy.CARD_NO_GOAL_YET_EXPERIMENT);
			expect(wrapper.text()).toContain(goalCopy.CARD_HABIT_PROMPT_SINGLE_LINE);
			expect(wrapper.html()).not.toContain('<br>');
			expect(wrapper.text()).not.toContain(stripHtml(goalCopy.titleNoHistoryWomensDefault()));
			expect(wrapper.text()).not.toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		});

		it('renders the generic loans-this-year subtitle from January 1 through March 31', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			expect(buildNoGoal().text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
		});

		it('renders the year-stamped Set Goal CTA', () => {
			expect(buildNoGoal().text()).toContain(`Set ${GOALS_CURRENT_YEAR} goal`);
		});

		it('does not render any active-goal copy', () => {
			const text = buildNoGoal().text();
			expect(text).not.toContain('Work toward your goal');
			expect(text).not.toContain('View your achievements');
			expect(text).not.toContain('Your ');
		});
	});

	describe('active-goal heading', () => {
		it('renders "Your {year} goal to support {category}"', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 2,
				goalProgressPercentage: 40,
				categoryName: 'US entrepreneurs',
			});
			expect(wrapper.text()).toContain(`Your ${GOALS_CURRENT_YEAR} goal to support US entrepreneurs`);
		});
	});

	describe('active-goal progress label', () => {
		it('shows visibleProgress / goalTarget and the "Loans" label', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 10,
				goalProgress: 3,
				goalProgressPercentage: 30,
			});
			expect(wrapper.text()).toContain('3');
			expect(wrapper.text()).toContain('/10');
			expect(wrapper.text()).toContain('Loans');
		});

		it('clamps visibleProgress to goalTarget when overshot', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 12,
				goalProgressPercentage: 100,
				userName: 'Ada',
			});
			// Visible progress should clamp at goalTarget, never showing the raw 12.
			expect(wrapper.text()).toContain('/5');
			expect(wrapper.text()).not.toContain('12');
		});
	});

	describe('activeGoalTitle by percentage', () => {
		const titleAt = pct => mountCard({
			state: 'active-goal',
			goalTarget: 4,
			goalProgress: Math.round((pct / 100) * 4),
			goalProgressPercentage: pct,
			userName: 'Ada',
		}).text();

		it('at 0%: "Start with your first loan"', () => {
			expect(titleAt(0)).toContain('Start with your first loan');
		});

		it('below 50%: "You\'ve started something powerful."', () => {
			expect(titleAt(25)).toContain('You\'ve started something powerful.');
		});

		it('exactly 50%: "You\'re half way there!"', () => {
			expect(titleAt(50)).toContain('You\'re half way there!');
		});

		it('between 50% and 100%: "You\'re close to the impact you imagined"', () => {
			expect(titleAt(75)).toContain('You\'re close to the impact you imagined');
		});

		it('at 100%: includes the user\'s name in the celebration', () => {
			expect(titleAt(100)).toContain('You did it, Ada! You made it happen');
		});

		it('at 100% with empty userName: still renders the rest of the celebration', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 4,
				goalProgress: 4,
				goalProgressPercentage: 100,
				userName: '',
			});
			expect(wrapper.text()).toContain('You did it');
			expect(wrapper.text()).toContain('You made it happen');
		});
	});

	describe('activeGoalDescription by percentage', () => {
		const descAt = (pct, extra = {}) => mountCard({
			state: 'active-goal',
			goalTarget: 4,
			goalProgress: Math.round((pct / 100) * 4),
			goalProgressPercentage: pct,
			userName: 'Ada',
			...extra,
		}).text();

		it('at 0%: "Turn your intention into consistent impact."', () => {
			expect(descAt(0)).toContain('Turn your intention into consistent impact.');
		});

		it('below 50%: "Let\'s keep it growing together."', () => {
			expect(descAt(25)).toContain('Let\'s keep it growing together.');
		});

		it('exactly 50%: "You\'ve made real progress and real impact. Keep it going."', () => {
			expect(descAt(50)).toContain('You\'ve made real progress and real impact. Keep it going.');
		});

		it('between 50% and 100%: "Continue creating opportunity for others. Finish strong!"', () => {
			expect(descAt(75)).toContain('Continue creating opportunity for others. Finish strong!');
		});

		it('at 100%: "Achieving your goal means you\'ve changed {target} lives this year"', () => {
			expect(descAt(100, { goalTarget: 7, goalProgress: 7 }))
				.toContain('Achieving your goal means you\'ve changed 7 lives this year');
		});
	});

	describe('activeGoalCta', () => {
		it('not completed: "Work toward your goal"', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 2,
				goalProgressPercentage: 40,
			});
			expect(wrapper.text()).toContain('Work toward your goal');
			expect(wrapper.text()).not.toContain('View your achievements');
		});

		it('completed: "View your achievements"', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 5,
				goalProgressPercentage: 100,
				userName: 'Ada',
			});
			expect(wrapper.text()).toContain('View your achievements');
			expect(wrapper.text()).not.toContain('Work toward your goal');
		});
	});

	describe('active-goal CTA tracking', () => {
		it('fires `continue-towards-goal` when CTA clicked while in progress', async () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 2,
				goalProgressPercentage: 40,
			});
			const ctaButton = wrapper.find('.featured-goal-card__cta--active-goal');
			await ctaButton.trigger('click');
			expect(trackEventSpy).toHaveBeenCalledWith('portfolio', 'click', 'continue-towards-goal');
		});

		it('fires `goal-complete-view-achievements` when CTA clicked after completion', async () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 5,
				goalProgressPercentage: 100,
				userName: 'Ada',
			});
			const ctaButton = wrapper.find('.featured-goal-card__cta--active-goal');
			await ctaButton.trigger('click');
			expect(trackEventSpy).toHaveBeenCalledWith(
				'portfolio',
				'click',
				'goal-complete-view-achievements',
			);
			expect(trackEventSpy).not.toHaveBeenCalledWith(
				'portfolio',
				'click',
				'continue-towards-goal',
			);
		});
	});

	describe('utility menu visibility and content', () => {
		it('renders the "Edit" action when goal is in progress', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 2,
				goalProgressPercentage: 40,
			});
			const menu = wrapper.find('[data-testid="utility-menu"]');
			expect(menu.exists()).toBe(true);
			expect(menu.html()).toContain('>Edit<');
		});

		it('hides the utility menu entirely when the goal is completed', () => {
			const wrapper = mountCard({
				state: 'active-goal',
				goalTarget: 5,
				goalProgress: 5,
				goalProgressPercentage: 100,
				userName: 'Ada',
			});
			expect(wrapper.find('[data-testid="utility-menu"]').exists()).toBe(false);
		});
	});

	describe('state validator fallback', () => {
		it('renders no-goal copy when an unrecognized state value is passed', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-03-31T12:00:00'));

			const wrapper = mountCard({ state: 'something-unsupported' });
			expect(wrapper.text()).toContain(goalCopy.TITLE_HOW_MANY_LOANS_GENERIC);
			expect(wrapper.text()).toContain(`Set ${GOALS_CURRENT_YEAR} goal`);
		});
	});
});
