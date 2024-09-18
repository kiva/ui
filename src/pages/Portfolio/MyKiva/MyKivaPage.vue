<template>
	<www-page main-class="tw-bg-secondary">
		<MyKivaNavigation
			:visible="showNavigation"
			:user-balance="userBalance"
			@navigation-closed="showNavigation = false"
		/>
		<kv-page-container>
			<!-- My Kiva Page Content -->
			<div class="tw-min-h-screen">
				<button @click="showNavigation = true;">
					Show My Kiva Navigation
				</button>
			</div>
		</kv-page-container>
	</www-page>
</template>

<script>
import logReadQueryError from '@/util/logReadQueryError';
import userInfoQuery from '@/graphql/query/userInfo.graphql';
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import MyKivaNavigation from '@/components/MyKiva/MyKivaNavigation';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
		MyKivaNavigation,
	},
	data() {
		return {
			showNavigation: false,
			userInfo: {},
		};
	},
	computed: {
		userBalance() {
			return this.userInfo?.userAccount?.balance ?? '';
		},
	},
	async mounted() {
		try {
			const { data } = await this.apollo.query({
				query: userInfoQuery,
			});

			this.userInfo = data.my ?? {};
		} catch (e) {
			logReadQueryError(e, 'LenderSummary userIdQuery');
		}

		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'event-tracking',
			MY_KIVA_EXP_KEY,
			'EXP-MP-623-Sept2024'
		);
	},
};
</script>
