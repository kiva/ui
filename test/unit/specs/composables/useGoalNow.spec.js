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
	return {
		get: vi.fn(name => cookies.get(name)),
		has: vi.fn(name => cookies.has(name)),
		set: vi.fn((name, value) => cookies.set(name, value)),
		remove: vi.fn(name => cookies.delete(name)),
	};
};

describe('useGoalNow', () => {
	afterEach(() => {
		vi.useRealTimers();
		currentRoute.value = { query: {} };
	});

	const mountWith = (cookieStore, appConfig) => {
		let state;
		const app = createApp({
			name: 'GoalNowTest',
			setup() {
				state = useGoalNow();
				return () => h('div');
			},
		});
		if (cookieStore) app.provide('cookieStore', cookieStore);
		if (appConfig) app.provide('$appConfig', appConfig);
		app.mount(document.createElement('div'));
		return state;
	};

	it('ignores the param and the cookie in production', () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-11-05T12:00:00'));
		currentRoute.value = { query: { goalDate: '2030-01-05' } };
		const state = mountWith(
			createCookieStore({ [GOAL_DATE_COOKIE]: '2031-01-05' }),
			{ host: 'www.kiva.org' },
		);

		expect(state.goalDateOverride.value).toBeNull();
		expect(state.goalYear.value).toBe(2026);
		expect(state.getGoalNow().getFullYear()).toBe(2026);
	});

	it('deletes the cookie with ?goalDate=off outside production', () => {
		currentRoute.value = { query: { goalDate: 'off' } };
		const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
		const state = mountWith(cookieStore, { host: 'kiva-ui.local' });

		expect(cookieStore.remove).toHaveBeenCalledWith(GOAL_DATE_COOKIE, { path: '/' });
		expect(state.goalDateOverride.value).toBeNull();
	});

	it('saves ?goalDate to the cookie outside production', () => {
		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		const cookieStore = createCookieStore();
		mountWith(cookieStore, { host: 'kiva-ui.local' });

		expect(cookieStore.set).toHaveBeenCalledWith(GOAL_DATE_COOKIE, '2027-01-05', { path: '/' });
	});

	it('leaves the cookie alone in production', () => {
		currentRoute.value = { query: { goalDate: 'off' } };
		const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-01-05' });
		mountWith(cookieStore, { host: 'www.kiva.org' });

		expect(cookieStore.remove).not.toHaveBeenCalled();

		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		mountWith(cookieStore, { host: 'www.kiva.org' });
		expect(cookieStore.set).not.toHaveBeenCalled();
	});

	it('applies the override outside production', () => {
		currentRoute.value = { query: { goalDate: '2030-01-05' } };
		const state = mountWith(createCookieStore(), { host: 'www.staging.kiva.org' });

		expect(state.goalYear.value).toBe(2030);
	});

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
