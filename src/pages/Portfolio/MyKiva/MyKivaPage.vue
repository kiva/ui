<template>
	<www-page main-class="tw-bg-secondary">
		<MyKivaHero />
		<MyKivaProfile :lender="lender" />
	</www-page>
</template>

<script>
import { trackExperimentVersion } from '#src/util/experiment/experimentUtils';
import WwwPage from '#src/components/WwwFrame/WwwPage';
import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		MyKivaHero,
		MyKivaProfile
	},
	data() {
		return {
			lender: null,
		};
	},
	apollo: {
		query: myKivaQuery,
		preFetch: true,
		result(result) {
			this.lender = result.data?.my?.lender ?? null;
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

		this.$kvTrackEvent('portofolio', 'view', 'new-my-kiva');
	},
};
</script>
