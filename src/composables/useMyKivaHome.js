import {
	ref,
	computed,
	onMounted,
} from 'vue';
import logFormatter from '#src/util/logFormatter';
import userIdQuery from '#src/graphql/query/userId.graphql';

export default function useMyKivaHome(apollo) {
	const redirectToMyKivaHomepage = ref(false);
	const userData = ref(false);

	const fetchUserData = async () => {
		await apollo.query({
			query: userIdQuery,
		}).then(({ data }) => {
			userData.value = data?.my ?? null;
		}).catch(e => {
			logFormatter(e, 'useMyKivaHome composable');
		});
	};

	const homePagePath = computed(() => {
		return redirectToMyKivaHomepage.value ? '/mykiva' : '/';
	});

	const portfolioPath = computed(() => {
		return redirectToMyKivaHomepage.value ? '/mykiva' : '/portfolio';
	});

	onMounted(async () => {
		await fetchUserData();

		redirectToMyKivaHomepage.value = userData.value?.id || false;
	});

	return {
		homePagePath,
		portfolioPath,
	};
}
