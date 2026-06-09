import { ref, inject } from 'vue';
import multiMatchingQuery from '#src/graphql/query/multiMatchingEnabled.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';

export default function useMultiMatching() {
	const apollo = inject('apollo');
	const enableMultiMatching = ref(false);
	if (apollo) {
		apollo.query({ query: multiMatchingQuery }).then(({ data }) => {
			enableMultiMatching.value = readBoolSetting(data, 'general.multiMatchingEnabled.value') ?? false;
		}).catch(e => logReadQueryError(e, 'useMultiMatching multiMatchingEnabled'));
	}
	return { enableMultiMatching };
}
