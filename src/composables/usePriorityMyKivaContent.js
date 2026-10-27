import { computed, inject, watch } from 'vue';
import isPlainObject from 'lodash/isPlainObject';
import priorityMyKivaContentQuery from '#src/graphql/query/priorityMyKivaContent.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import useApolloQuery from '#src/composables/useApolloQuery';

// The browser's kvAuth0 has no user until its first authenticated request, so the login sync cookie stands in there
const isLoggedIn = kvAuth0 => !!kvAuth0?.getKivaId() || (!kvAuth0?.isServer && !!kvAuth0?.isNotedLoggedIn?.());

const operation = {
	query: priorityMyKivaContentQuery,
	shouldPreFetch: (_operation, { kvAuth0 }) => isLoggedIn(kvAuth0),
};

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

const readString = value => (typeof value === 'string' ? value : '');

const decodePriorityContent = raw => {
	if (typeof raw !== 'string') return undefined;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return undefined;
	}
	// The API stores preferences as PHP arrays, so a stored `{}` reads back as `[]`
	const value = parsed === true || (Array.isArray(parsed) && !parsed.length) ? {} : parsed;
	if (!isPlainObject(value)) return undefined;
	return {
		bdayCardName: readString(value.bdayCardName),
		bdayCardLinkOverride: readString(value.bdayCardLinkOverride),
		lendLinkOverride: readString(value.lendLinkOverride),
		impactLinkOverride: readString(value.impactLinkOverride),
		showNextStepsOverride: value.showNextStepsOverride === true,
		hideBdayCard: value.hideBdayCard === true,
	};
};

/**
 * The lender's staff-set `showPriorityMyKivaContent` preference, which puts the
 * "For your family" section on MyKiva. Visitors issue no request.
 *
 * @returns {{ priorityContent: import('vue').ComputedRef<{
 *   bdayCardName: string,
 *   bdayCardLinkOverride: string,
 *   lendLinkOverride: string,
 *   impactLinkOverride: string,
 *   showNextStepsOverride: boolean,
 *   hideBdayCard: boolean,
 * }|undefined> }} undefined when the preference is not set or invalid.
 */
export default function usePriorityMyKivaContent() {
	if (!isLoggedIn(inject('kvAuth0', null))) {
		return { priorityContent: computed(() => undefined) };
	}

	const { result, error } = useApolloQuery(operation);
	watch(error, e => {
		if (e) {
			logReadQueryError(e, 'usePriorityMyKivaContent PriorityMyKivaContent');
		}
	});

	const priorityContent = computed(() => decodePriorityContent(result.value?.my?.userPreference));
	return { priorityContent };
}
