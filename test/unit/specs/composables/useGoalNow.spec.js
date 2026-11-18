import { createApp, h } from 'vue';
import useGoalNow from '#src/composables/useGoalNow';
import { GOAL_DATE_COOKIE } from '#src/util/goalDate';

const currentRoute = { value: { query: {} } };

vi.mock('vue-router', () => ({
	useRouter: () => ({ currentRoute }),
}));

const localDay = date => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

const createCookieStore = (initial = {}) => {
	const cookies = new Map(Object.entries(initial));
	return { get: vi.fn(name => cookies.get(name)) };
};

describe('useGoalNow', () => {
	afterEach(() => {
		vi.useRealTimers();
		currentRoute.value = { query: {} };
	});

	const mountWith = cookieStore => {
		let state;
		const app = createApp({
			name: 'GoalNowTest',
			setup() {
				state = useGoalNow();
				return () => h('div');
			},
		});
		if (cookieStore) app.provide('cookieStore', cookieStore);
		app.mount(document.createElement('div'));
		return state;
	};

	it('reads the override from the route', () => {
		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		const state = mountWith();
		expect(localDay(state.goalDateOverride.value)).toEqual([2027, 1, 5]);
		expect(localDay(state.goalNow.value)).toEqual([2027, 1, 5]);
		expect(localDay(state.getGoalNow())).toEqual([2027, 1, 5]);
		expect(state.goalYear.value).toBe(2027);
		expect(state.lastGoalYear.value).toBe(2026);
	});

	it('reads the override from the injected cookie store', () => {
		const state = mountWith(createCookieStore({ [GOAL_DATE_COOKIE]: '2027-04-02' }));
		expect(localDay(state.goalDateOverride.value)).toEqual([2027, 4, 2]);
		expect(state.goalYear.value).toBe(2027);
	});

	it('has no override without the param or cookie', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-11-05T12:00:00'));
		const state = mountWith(createCookieStore());
		expect(state.goalDateOverride.value).toBeNull();
		expect(state.goalYear.value).toBe(2026);
	});

	it('reads the latest route on each getGoalNow call', () => {
		const state = mountWith();
		currentRoute.value = { query: { goalDate: '2028-02-02' } };
		expect(state.getGoalNow().getFullYear()).toBe(2028);
	});

	it('reads the real date when called outside a component', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-11-05T12:00:00'));
		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		const state = useGoalNow();
		expect(state.goalDateOverride.value).toBeNull();
		expect(state.goalYear.value).toBe(2026);
	});
});
