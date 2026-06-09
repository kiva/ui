import multiMatchingQuery from '#src/graphql/query/multiMatchingEnabled.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';

export default {
	data() {
		return { enableMultiMatching: false };
	},
	created() {
		this.apollo.query({ query: multiMatchingQuery }).then(({ data }) => {
			this.enableMultiMatching = readBoolSetting(data, 'general.multiMatchingEnabled.value') ?? false;
		});
	},
};
