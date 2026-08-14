import { computed } from 'vue';
import userIdQuery from '#src/graphql/query/userId.graphql';
import useApolloQuery from '#src/composables/useApolloQuery';

const operation = { query: userIdQuery };

// Registered for prefetching by every component that imports this composable
export const preFetchOperations = [operation];

export default function useMyKivaHome() {
	const { result } = useApolloQuery(operation);

	const redirectToMyKivaHomepage = computed(() => !!result.value?.my?.id);

	const homePagePath = computed(() => {
		return redirectToMyKivaHomepage.value ? '/mykiva' : '/';
	});

	const portfolioPath = computed(() => {
		return redirectToMyKivaHomepage.value ? '/mykiva' : '/portfolio';
	});

	return {
		homePagePath,
		portfolioPath,
	};
}
