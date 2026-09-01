// @vitest-environment node
import { createSSRApp, h, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import MyKivaFeaturedSlot from '#src/components/MyKiva/MyKivaFeaturedSlot';
import { GOAL_STATUS, GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import { ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';

vi.mock('vue-router', () => ({
	useRouter: () => ({}),
}));

vi.mock('#src/util/logReadQueryError', () => ({
	default: vi.fn(),
}));

vi.mock('#src/components/MyKiva/FeaturedGoalCard', () => ({
	default: {
		name: 'FeaturedGoalCard',
		props: ['state'],
		setup: props => () => h('div', { 'data-testid': 'featured-goal-card', 'data-state': props.state }),
	},
}));

vi.mock('@kiva/kv-components', () => ({
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		setup: () => () => h('div', { 'data-testid': 'loading-placeholder' }),
	},
}));

// MyKivaPage hydrates goal state from the prefetched Apollo cache in created(), so by the
// time this component renders on the server `loading` is already false and the watchers
// run in the server pass too. These tests pin what that pass is allowed to do.
const buildGoalData = ({ status = null, hasViewedCompletedGoal = false } = {}) => ({
	loading: ref(false),
	userGoal: ref(status ? { category: ID_US_ECONOMIC_EQUALITY, target: 5, status } : null),
	goalProgress: ref(5),
	goalProgressPercentage: ref(100),
	getGoalDisplayName: vi.fn(() => 'US entrepreneurs'),
	getCtaHref: vi.fn(() => '/lend'),
	hasViewedCompletedGoalForYear: vi.fn(() => hasViewedCompletedGoal),
	setViewedGoalCompletePreference: vi.fn(() => Promise.resolve()),
});

const renderSlot = async (goalData, trackEvent = vi.fn()) => {
	const app = createSSRApp({
		name: 'FeaturedSlotServerHost',
		render: () => h(MyKivaFeaturedSlot, { userFirstName: 'Ada' }),
	});
	app.provide('apollo', { query: vi.fn(), readQuery: vi.fn() });
	app.provide('goalData', goalData);
	app.provide('$kvTrackEvent', trackEvent);
	const html = await renderToString(app);
	return { html, goalData, trackEvent };
};

describe('MyKivaFeaturedSlot (server)', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('has no window to branch on', () => {
		// The isBrowser guard is only meaningful if this really is a server-like env.
		expect(typeof window).toBe('undefined');
	});

	it('omits the slot for a completed goal the lender has already seen', async () => {
		const { html } = await renderSlot(buildGoalData({
			status: GOAL_STATUS.COMPLETED,
			hasViewedCompletedGoal: true,
		}));

		// The client reaches this same verdict from its own immediate watcher. Rendering the
		// slot here and dropping it on hydration is the divergence this pins shut.
		expect(html).not.toContain('featured-goal-card');
	});

	it('renders the slot for a completed goal the lender has not seen yet', async () => {
		const { html } = await renderSlot(buildGoalData({
			status: GOAL_STATUS.COMPLETED,
			hasViewedCompletedGoal: false,
		}));

		expect(html).toContain('data-state="active-goal"');
	});

	it('takes the viewed snapshot without persisting it', async () => {
		const { goalData } = await renderSlot(buildGoalData({
			status: GOAL_STATUS.COMPLETED,
			hasViewedCompletedGoal: false,
		}));

		// Reading decides what renders and must happen here; writing is a mutation and
		// belongs to the browser pass.
		expect(goalData.hasViewedCompletedGoalForYear).toHaveBeenCalledWith(GOALS_CURRENT_YEAR);
		expect(goalData.setViewedGoalCompletePreference).not.toHaveBeenCalled();
	});

	it('sends no analytics from the server pass', async () => {
		const { trackEvent } = await renderSlot(buildGoalData({ status: null }));

		expect(trackEvent).not.toHaveBeenCalled();
	});
});
