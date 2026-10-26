import { computed, inject, watch } from 'vue';
import priorityMyKivaContentQuery from '#src/graphql/query/priorityMyKivaContent.graphql';
import logReadQueryError from '#src/util/logReadQueryError';
import useApolloQuery from '#src/composables/useApolloQuery';

const isLoggedIn = kvAuth0 => !!kvAuth0?.getKivaId();

const operation = {
	query: priorityMyKivaContentQuery,
	shouldPreFetch: (_operation, { kvAuth0 }) => isLoggedIn(kvAuth0),
};

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

const readString = value => (typeof value === 'string' ? value : '');

const isPlainObject = value => !!value && typeof value === 'object' && !Array.isArray(value);

// The API stores preferences as PHP arrays, so a stored `{}` reads back as `[]`
const isEmptyList = value => Array.isArray(value) && value.length === 0;

const decodePriorityContent = raw => {
	if (typeof raw !== 'string') return undefined;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return undefined;
	}
	if (parsed !== true && !isEmptyList(parsed) && !isPlainObject(parsed)) return undefined;
	const value = isPlainObject(parsed) ? parsed : {};
	return {
		bdayCardName: readString(value.bdayCardName),
		bdayCardLinkOverride: readString(value.bdayCardLinkOverride),
		lendLinkOverride: readString(value.lendLinkOverride),
		impactLinkOverride: readString(value.impactLinkOverride),
		showNextStepsOverride: value.showNextStepsOverride === true,
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
