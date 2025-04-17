import {
	ref,
	onMounted,
} from 'vue';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import { readBoolSetting } from '#src/util/settingsUtils';
import logFormatter from '#src/util/logFormatter';
import myKivaForAllUsersQuery from '#src/graphql/query/shared/myKivaForAllUsers.graphql';

export default function useMyKivaHome(apollo, $kvTrackEvent) {
	const redirectToMyKivaHomepage = ref(false);
	const myKivaFlagEnabled = ref(false);
	const userData = ref(false);

	const fetchUserData = () => {
		apollo.readQuery({
			query: myKivaForAllUsersQuery,
		}).then(data => {
			userData.value = data?.my ?? null;
			myKivaFlagEnabled.value = readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY);
		}).catch(e => {
			logFormatter(e, 'useMyKivaHome composable');
		});
	};

	onMounted(() => {
		fetchUserData();

		redirectToMyKivaHomepage.value = userData.value?.id && getIsMyKivaEnabled(
			apollo,
			$kvTrackEvent,
			userData.value?.userPreferences,
			userData.value?.loans?.totalCount ?? 0,
			myKivaFlagEnabled.value,
		);
	});

	return {
		redirectToMyKivaHomepage,
	};
}
