import { computed, getCurrentInstance, inject } from 'vue';
import { useRouter } from 'vue-router';
import { getGoalDateOverride, getGoalNow, saveGoalDateCookie } from '#src/util/goalDate';

/**
 * The goal date for a component, from the route query or the cookie. Callers without a router or
 * cookie store (unit tests, for one) get the real date.
 *
 * Call it in setup. The computed values follow the route query, which in-app navigation can
 * change without remounting the page.
 *
 * @returns {object} The override, the effective date and goal years.
 */
export default function useGoalNow() {
	const inSetup = Boolean(getCurrentInstance());
	const router = inSetup ? useRouter() : null;
	const cookieStore = inSetup ? inject('cookieStore', null) : null;
	const getQuery = () => router?.currentRoute?.value?.query ?? {};

	const goalDateOverride = computed(() => getGoalDateOverride(getQuery(), cookieStore));
	const goalNow = computed(() => goalDateOverride.value ?? new Date());
	const goalYear = computed(() => goalNow.value.getFullYear());

	return {
		/** The override date, or null when the real date applies. */
		goalDateOverride,
		/** The effective date. Read this instead of calling new Date() in goal logic. */
		goalNow,
		/** A fresh effective date on each call, for code that runs long after setup. */
		getGoalNow: () => getGoalNow(getQuery(), cookieStore),
		goalYear,
		lastGoalYear: computed(() => goalYear.value - 1),
		/** The current route query, for watching navigation. */
		routeQuery: computed(getQuery),
		/** Saves the current route's goal date param to the session cookie. Browser only. */
		saveGoalDate: () => saveGoalDateCookie(getQuery(), cookieStore),
	};
}
