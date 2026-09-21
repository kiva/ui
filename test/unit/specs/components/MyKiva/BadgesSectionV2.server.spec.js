// @vitest-environment node
import { createSSRApp, h, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import BadgesSectionV2 from '#src/components/MyKiva/BadgesSectionV2';
import { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';

const currentRoute = { value: { path: '/mykiva', query: {} } };

vi.mock('vue-router', () => ({
	useRouter: () => ({ currentRoute }),
}));

vi.mock('@kiva/kv-components', () => ({
	KvCarousel: {
		name: 'KvCarousel',
		setup: (props, { slots }) => () => h('div', Object.keys(slots).map(name => slots[name]())),
	},
	KvLoadingPlaceholder: {
		name: 'KvLoadingPlaceholder',
		setup: () => () => h('div', { 'data-testid': 'loading-placeholder' }),
	},
}));

vi.mock('#src/components/MyKiva/MyKivaProgressCard', () => ({
	default: {
		name: 'MyKivaProgressCard',
		props: ['goal', 'isAnnualGoal'],
		setup: props => () => h('div', { 'data-testid': 'progress-card' }, props.goal?.name),
	},
}));

vi.mock('#src/composables/useBadgeData', async importOriginal => {
	const actual = await importOriginal();
	return {
		...actual,
		default: () => ({
			getActiveTierData: badge => ({ target: badge?.achievementData?.tiers?.[0]?.target ?? 0, level: 1 }),
		}),
	};
});

const badgeData = [{
	id: ID_WOMENS_EQUALITY,
	challengeName: 'Womens equality challenge',
	level: 1,
	achievementData: {
		id: ID_WOMENS_EQUALITY,
		totalProgressToAchievement: 5,
		tiers: [{ target: 10, level: 1, completedDate: null }],
	},
}];

const renderRow = async userGoal => {
	const app = createSSRApp({
		name: 'BadgesSectionServerHost',
		render: () => h(BadgesSectionV2, { badgeData }),
	});
	app.provide('goalData', {
		getCtaHref: vi.fn(() => '/lend'),
		goalProgress: ref(10),
		goalProgressPercentage: ref(100),
		loading: ref(false),
		userGoal: ref(userGoal),
		userGoalAchieved: ref(true),
		completedGoalsHistory: ref([]),
	});
	app.provide('$kvTrackEvent', vi.fn());
	return renderToString(app);
};

const completedGoal = {
	target: 10,
	name: 'Your 2026 goal',
	category: ID_WOMENS_EQUALITY,
	dateStarted: '2026-06-15T12:00:00.000Z',
};

const tileOrder = html => ({
	goal: html.indexOf('Your 2026 goal'),
	badge: html.indexOf('equality challenge'),
});

describe('BadgesSectionV2 (server)', () => {
	afterEach(() => {
		currentRoute.value.query = {};
	});

	it('has no window to branch on', () => {
		// The row reads the override off the route because there is no address bar here. This
		// checks that this environment really has none.
		expect(typeof window).toBe('undefined');
	});

	it('places an achieved goal ahead of the badges while its year runs', async () => {
		currentRoute.value.query = { recapDate: '2026-12-31' };

		const { goal, badge } = tileOrder(await renderRow(completedGoal));

		expect(goal).toBeGreaterThan(-1);
		expect(badge).toBeGreaterThan(-1);
		expect(goal).toBeLessThan(badge);
	});

	it('honors the recapDate override so the client hydrates the same order', async () => {
		// The client has to hydrate against whatever order the server picks. If the override
		// reached only the browser, the two would disagree on Jan 1 and the moved tile's icon
		// would throw on a detached node.
		currentRoute.value.query = { recapDate: '2027-01-01' };

		const { goal, badge } = tileOrder(await renderRow(completedGoal));

		expect(goal).toBeGreaterThan(-1);
		expect(badge).toBeGreaterThan(-1);
		expect(goal).toBeGreaterThan(badge);
	});
});
