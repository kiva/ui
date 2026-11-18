import { nextTick, ref } from 'vue';
import { render } from '@testing-library/vue';
import GoalDateOverride from '#src/components/GoalSetting/GoalDateOverride';
import { GOAL_DATE_COOKIE } from '#src/util/goalDate';

const { currentRoute } = vi.hoisted(() => ({ currentRoute: { value: null } }));

vi.mock('vue-router', () => ({
	useRouter: () => ({ currentRoute }),
}));

const createCookieStore = (initial = {}) => {
	const cookies = new Map(Object.entries(initial));
	return {
		cookies,
		get: vi.fn(name => cookies.get(name)),
		has: vi.fn(name => cookies.has(name)),
		set: vi.fn((name, value) => cookies.set(name, value)),
		remove: vi.fn(name => cookies.delete(name)),
	};
};

const renderWith = cookieStore => render(GoalDateOverride, {
	global: { provide: { cookieStore } },
});

describe('GoalDateOverride', () => {
	let route;

	beforeEach(() => {
		// A ref, so in-app navigation can be simulated after mount.
		route = ref({ query: {} });
		Object.defineProperty(currentRoute, 'value', {
			configurable: true,
			get: () => route.value,
			set: value => { route.value = value; },
		});
	});

	it('saves ?goalDate to the cookie and shows the date', async () => {
		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		const cookieStore = createCookieStore();
		const { getByTestId } = renderWith(cookieStore);
		await nextTick();

		expect(cookieStore.cookies.get(GOAL_DATE_COOKIE)).toBe('2027-01-05');
		expect(getByTestId('goal-date-override-badge').textContent).toContain('2027-01-05');
	});

	it('shows the date saved in the cookie on a page without the param', async () => {
		const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-04-02' });
		const { getByTestId } = renderWith(cookieStore);
		await nextTick();

		expect(getByTestId('goal-date-override-badge').textContent).toContain('2027-04-02');
		expect(cookieStore.set).not.toHaveBeenCalled();
	});

	it('clears the cookie and hides the badge with ?goalDate=off', async () => {
		currentRoute.value = { query: { goalDate: 'off' } };
		const cookieStore = createCookieStore({ [GOAL_DATE_COOKIE]: '2027-04-02' });
		const { queryByTestId } = renderWith(cookieStore);
		await nextTick();

		expect(cookieStore.cookies.has(GOAL_DATE_COOKIE)).toBe(false);
		expect(queryByTestId('goal-date-override-badge')).toBeNull();
	});

	it('renders nothing without an override', async () => {
		const { queryByTestId } = renderWith(createCookieStore());
		await nextTick();
		expect(queryByTestId('goal-date-override-badge')).toBeNull();
	});

	it('saves the cookie from the page load only, not from in-app navigation', async () => {
		const cookieStore = createCookieStore();
		const { queryByTestId } = renderWith(cookieStore);
		await nextTick();
		expect(queryByTestId('goal-date-override-badge')).toBeNull();

		currentRoute.value = { query: { goalDate: '2027-01-05' } };
		await nextTick();
		await nextTick();
		expect(queryByTestId('goal-date-override-badge').textContent).toContain('2027-01-05');
		expect(cookieStore.set).not.toHaveBeenCalled();
	});

	it('links to this page with ?goalDate=off, keeping the other params', async () => {
		currentRoute.value = { query: { loanId: '1', goalDate: '2027-01-05' } };
		const { getByTestId } = renderWith(createCookieStore());
		await nextTick();

		const href = getByTestId('goal-date-override-clear').getAttribute('href');
		expect(href).toBe(`${window.location.pathname}?loanId=1&goalDate=off`);
	});
});
