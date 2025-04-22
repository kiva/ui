import {
	ref,
	computed,
	onMounted,
} from 'vue';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import logFormatter from '#src/util/logFormatter';
import myKivaForAllUsersQuery from '#src/graphql/query/shared/myKivaForAllUsers.graphql';

export default function useMyKivaHome(apollo, $kvTrackEvent, cookieStore) {
	const redirectToMyKivaHomepage = ref(false);
	const myKivaFlagEnabled = ref(false);
	const userData = ref(false);

	const fetchUserData = async () => {
		await apollo.query({
			query: myKivaForAllUsersQuery,
		}).then(({ data }) => {
			userData.value = data?.my ?? null;
			myKivaFlagEnabled.value = readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY);
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

		if (myKivaFlagEnabled.value) {
			redirectToMyKivaHomepage.value = getIsMyKivaEnabled(
				apollo,
				$kvTrackEvent,
				userData.value?.userPreferences,
				userData.value?.loans?.totalCount ?? 0,
				myKivaFlagEnabled.value,
				cookieStore,
			) && userData.value?.id;
		}
	});

	return {
		homePagePath,
		portfolioPath,
	};
}
