import myKivaForAllUsersQuery from '#src/graphql/query/shared/myKivaForAllUsers.graphql';
import { getIsMyKivaEnabled, MY_KIVA_FOR_ALL_USERS_KEY } from '#src/util/myKivaUtils';
import { readBoolSetting } from '#src/util/settingsUtils';

export default {
	data() {
		return {
			redirectToMyKivaHomepage: false,
		};
	},
	computed: {
		homePagePath() {
			return this.redirectToMyKivaHomepage ? '/mykiva' : '/';
		},
		portfolioPath() {
			return this.redirectToMyKivaHomepage ? '/mykiva' : '/portfolio';
		}
	},
	async mounted() {
		const { data } = await this.apollo.query({
			query: myKivaForAllUsersQuery,
		});

		const userData = data?.my ?? null;
		const myKivaFlagEnabled = readBoolSetting(data, MY_KIVA_FOR_ALL_USERS_KEY);

		if (myKivaFlagEnabled) {
			this.redirectToMyKivaHomepage = getIsMyKivaEnabled(
				this.apollo,
				this.$kvTrackEvent,
				userData?.userPreferences,
				userData?.loans?.totalCount ?? 0,
				myKivaFlagEnabled,
				this.cookieStore,
			) && userData?.id;
		}
	}
};
