import { computed } from 'vue';
import { useRoute } from 'vue-router';
import borrowerMessageQuery from '#src/graphql/query/portfolio/borrowerMessage.graphql';
import useApolloQuery from '#src/composables/useApolloQuery';

export const BORROWER_MESSAGES_LIST_PATH = '/portfolio/borrower-messages';

const MAX_INT = 2147483647;

/**
 * The update id from the route's id param, or null when it is not a valid positive integer.
 *
 * @param {object} route - Vue Router route
 * @returns {number|null}
 */
export const getMessageId = route => {
	const param = String(route?.params?.id ?? '');
	if (!/^[1-9]\d*$/.test(param)) {
		return null;
	}
	const id = Number(param);
	return id <= MAX_INT ? id : null;
};

const getErrorCodes = errors => (errors ?? []).map(error => error?.code ?? error?.extensions?.code);

const operation = {
	query: borrowerMessageQuery,
	preFetchVariables: ({ route }) => ({ id: getMessageId(route) }),
	preFetch(config, client, { route, kvAuth0 }) {
		const id = getMessageId(route);
		if (!id) {
			return Promise.reject({ path: BORROWER_MESSAGES_LIST_PATH });
		}
		return client.query({
			query: borrowerMessageQuery,
			variables: { id },
			fetchPolicy: 'network-only',
		}).then(({ data, errors }) => {
			if (getErrorCodes(errors).includes('api.notPrivileged')) {
				return Promise.reject(kvAuth0?.getKivaId()
					? { path: BORROWER_MESSAGES_LIST_PATH }
					: { path: '/ui-login', query: { doneUrl: route.fullPath } });
			}
			const update = data?.general?.update;
			if (!update) {
				return Promise.reject({ path: BORROWER_MESSAGES_LIST_PATH });
			}
			if (update.type === 'partner') {
				return Promise.reject({ path: `/blog/partner/${id}` });
			}
		});
	},
};

export const preFetchOperations = [operation];

/**
 * The borrower message (loan update) named by the route's id param.
 * Its prefetch redirects away when the update is missing, private to the viewer, or a partner update.
 *
 * @returns {{
 *   message: import('vue').ComputedRef<object|null>,
 *   loading: import('vue').Ref<boolean>,
 * }}
 */
export default function useBorrowerMessage() {
	const route = useRoute();
	const { result, loading } = useApolloQuery(operation, () => ({ id: getMessageId(route) }));

	return {
		message: computed(() => result.value?.general?.update ?? null),
		loading,
	};
}
