import { ref, inject } from 'vue';
import multiMatchingQuery from '#src/graphql/query/multiMatchingEnabled.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import logReadQueryError from '#src/util/logReadQueryError';

const enableMultiMatching = ref(false);
let fetched = false;

export default function useMultiMatching() {
	const apollo = inject('apollo');
	if (apollo && !fetched) {
		fetched = true;
		apollo.query({ query: multiMatchingQuery }).then(({ data }) => {
			enableMultiMatching.value = readBoolSetting(data, 'general.multiMatchingEnabled.value') ?? false;
		}).catch(e => logReadQueryError(e, 'useMultiMatching multiMatchingEnabled'));
	}
	return { enableMultiMatching };
}
