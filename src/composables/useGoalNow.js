import { computed, getCurrentInstance, inject } from 'vue';
import { useRouter } from 'vue-router';
import { getGoalDateOverride, isProductionHost, syncGoalDateCookie } from '#src/util/goalDate';

/**
 * The goal date for a component, from the route query or the cookie. Production always gets the real
 * date, as do callers without a router or cookie store (unit tests, for one).
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
	const isProduction = isProductionHost(inSetup ? inject('$appConfig', null)?.host : null);
	const getOverride = () => (isProduction
		? null
		: getGoalDateOverride(router?.currentRoute?.value?.query ?? {}, cookieStore));

	if (!isProduction) {
		syncGoalDateCookie(router?.currentRoute?.value?.query, cookieStore);
	}

	const goalDateOverride = computed(getOverride);
	const goalNow = computed(() => goalDateOverride.value ?? new Date());
	const goalYear = computed(() => goalNow.value.getFullYear());

	return {
		/** The override date, or null when the real date applies. */
		goalDateOverride,
		/** The effective date. Read this instead of calling new Date() in goal logic. */
		goalNow,
		/** A fresh effective date on each call, for code that runs long after setup. */
		getGoalNow: () => getOverride() ?? new Date(),
		goalYear,
		lastGoalYear: computed(() => goalYear.value - 1),
	};
}
