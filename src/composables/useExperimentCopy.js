import { computed, inject } from 'vue';
import useApolloQuery from '#src/composables/useApolloQuery';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import experimentVersionFragment from '#src/graphql/fragments/experimentVersion.graphql';
import { getContentfulEntries } from '#src/util/contentfulUtils';
import { getExperimentCopy, selectActiveCopyRound } from '#src/util/experiment/experimentCopy';
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';

/**
 * Builds the query that loads a Contentful copy set.
 * Add it to your composable's preFetchOperations so the copy loads during server render.
 *
 * @param {string} contentKey The key of the uiSetting entry in Contentful
 * @returns {Object} The operation to pass to useExperimentCopy
 */
export function createExperimentCopyOperation(contentKey) {
	const variables = { contentType: 'uiSetting', contentKey };
	return {
		query: contentfulEntriesQuery,
		preFetchVariables: () => variables,
	};
}

/**
 * Reads the live round of a Contentful copy set and the visitor's experiment version.
 *
 * @param {Object} operation The operation from createExperimentCopyOperation
 * @param {string} experimentKey The experiment key in Kiva Admin
 */
export default function useExperimentCopy(operation, experimentKey) {
	const apollo = inject('apollo');
	const kvTrackEvent = inject('$kvTrackEvent', () => {});
	// The variables never change, so the browser uses the same ones as the server
	const { result, loading, error } = useApolloQuery(operation, operation.preFetchVariables());

	const activeRound = computed(() => selectActiveCopyRound(getContentfulEntries(result.value)?.[0]));
	const variants = computed(() => activeRound.value?.variants ?? null);
	const round = computed(() => activeRound.value?.key ?? null);

	// Read once, so the server and the browser show the same version
	const experiment = apollo?.readFragment({
		id: `Experiment:${experimentKey}`,
		fragment: experimentVersionFragment,
	});
	const assignedVersion = experiment?.version && experiment.version !== 'unassigned'
		? experiment.version
		: null;
	const version = computed(() => assignedVersion);

	/**
	 * Returns the visitor's text for a field, using the `a` block if their version has no block.
	 * Returns null when there is no text, so the caller can use its hardcoded text with `??`.
	 *
	 * @param {string} field The block field, e.g. 'headline'
	 * @param {Object} [replacements] Values for the `{key}` tokens, e.g. { loans: 'loans' }
	 * @returns {string|null} The text, or null
	 */
	function copy(field, replacements) {
		return getExperimentCopy(variants.value, version.value, field, replacements);
	}

	/**
	 * Sends the exposure event, but only if the visitor's version has copy.
	 * Sends the round key as the property, so results can be split by round.
	 *
	 * @param {string} category The tracking category, e.g. 'basket'
	 * @param {string} fallbackAction The action for rounds that set none, e.g. 'EXP-MP-1234-Oct2026'
	 * @returns {boolean} Whether the event was sent
	 */
	function trackExposure(category, fallbackAction) {
		if (!variants.value?.[version.value]) return false;
		const action = activeRound.value.trackingAction ?? fallbackAction;
		trackExperimentVersion(apollo, kvTrackEvent, category, experimentKey, action, round.value);
		return true;
	}

	return {
		variants,
		round,
		version,
		loading,
		error,
		copy,
		trackExposure,
	};
}
