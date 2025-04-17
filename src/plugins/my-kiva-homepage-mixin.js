import myKivaForAllUsersQuery from '#src/graphql/query/shared/myKivaForAllUsers.graphql';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import { readBoolSetting } from '#src/util/settingsUtils';

export default {
	data() {
		return {
			redirectToMyKivaHomepage: false,
		};
	},
	created() {
		const myKivaData = this.apollo.readQuery({
			query: myKivaForAllUsersQuery,
		});

		const userData = myKivaData?.my ?? null;
		const myKivaFlagEnabled = readBoolSetting(myKivaData, MY_KIVA_FOR_ALL_USERS_KEY);

		this.redirectToMyKivaHomepage = userData?.id && getIsMyKivaEnabled(
			this.apollo,
			this.$kvTrackEvent,
			userData?.userPreferences,
			userData?.loans?.totalCount ?? 0,
			myKivaFlagEnabled,
		);
	}
};
