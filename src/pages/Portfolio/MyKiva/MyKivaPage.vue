<template>
	<www-page main-class="tw-bg-secondary">
		<kv-page-container>
			<!-- My Kiva Page Content -->
		</kv-page-container>
	</www-page>
</template>

<script>
import { trackExperimentVersion } from '@/util/experiment/experimentUtils';
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

const MY_KIVA_EXP_KEY = 'my_kiva_page';

export default {
	name: 'MyKivaPage',
	inject: ['apollo', 'cookieStore'],
	components: {
		WwwPage,
		KvPageContainer,
	},
	mounted() {
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
