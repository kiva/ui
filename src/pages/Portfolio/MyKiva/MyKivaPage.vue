<template>
	<www-page main-class="tw-bg-secondary">
		<MyKivaNavigation
			:visible="showNavigation"
			:user-balance="userBalance"
			@navigation-closed="showNavigation = false"
		/>
		<MyKivaHero
			@show-navigation="handleShowNavigation"
		/>
		<MyKivaProfile :lender="lender" />
	</www-page>
</template>

<script>
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		MyKivaNavigation,
		WwwPage,
		MyKivaHero,
		MyKivaProfile
	},
	data() {
		return {
			lender: null,
			showNavigation: false,
			userInfo: {},
		};
	},
	apollo: {
		query: myKivaQuery,
		preFetch: true,
		result(result) {
			this.userInfo = result.data?.my ?? {};
			this.lender = result.data?.my?.lender ?? null;
		},
	},
	computed: {
		userBalance() {
			return this.userInfo?.userAccount?.balance ?? '';
		},
		lenderName() {
			return this.lender?.name ?? '';
		},
		lenderImageUrl() {
			return this.lender?.image?.url ?? '';
		},
	},
	methods: {
		handleShowNavigation() {
			this.showNavigation = true;
			this.$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
		},
	},
	mounted() {
		trackExperimentVersion(
			this.apollo,
			this.$kvTrackEvent,
			'event-tracking',
			MY_KIVA_EXP_KEY,
			'EXP-MP-623-Sept2024'
		);

		this.$kvTrackEvent('portfolio', 'view', 'new-my-kiva');
	},
};
</script>
