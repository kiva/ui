<template>
	<div v-if="donateCTAExperimentVersion === 'b'">
		<div class="tw-flex tw-items-center tw-justify-center">
			<icon-sad-cloud class="tw-mr-4 tw-h-12 tw-w-8" />
			<h2 class="tw-inline-block">
				These loans are popular and we've run out.
			</h2>
		</div>
		<div class="donate_cta_block tw-rounded md:tw-flex tw-gap-4 tw-mt-2 tw-pt-3 tw-px-6 tw-pb-6">
			<div class="tw-flex-none tw-mt-2 tw-text-center">
				<img
					class="tw-m-auto"
					style="width: 201px;"
					src="@/assets/images/team_donate2.png"
					alt="team image"
				>
				<span class="tw-mt-1 tw-m-auto tw-inline-block">Carolina, David G, David K</span>
			</div>
			<div>
				<h2>Help our team source more loans</h2>
				<!-- eslint-disable-next-line max-len -->
				<p>Sourcing loans isn’t free for us. Carolina, David, and the rest of the team work hard to screen the loans on our site and work with lending partners to support high quality loans that often include additional services such as insurance and business training for borrowers. We rely on our generous donors to help them continue their work.</p>
				<kv-button
					class="tw-pt-2 tw-block"
					variant="secondary"
					href="/donate/supportus"
					v-kv-track-event="['donation', 'click', 'low-supply-human-centric-cta']"
				>
					Donate to help Carolina and team
				</kv-button>
			</div>
		</div>
	</div>
</template>

<script>
import IconSadCloud from '@/assets/icons/inline/sad-cloud.svg';
import {
	getExperimentSettingAsync,
	trackExperimentVersion
} from '@/util/experiment/experimentUtils';
import experimentAssignmentQuery from '@/graphql/query/experimentAssignment.graphql';

import KvButton from '~/@kiva/kv-components/vue/KvButton';

export default {
	name: 'DonationCTA',
	components: {
		IconSadCloud,
		KvButton
	},
	data() {
		return {
			donateCTAExperimentVersion: null
		};
	},
	inject: ['apollo', 'cookieStore'],
	async created() {
		const donateSupplyCtaExpData = await getExperimentSettingAsync(this.apollo, 'supply_donate_cta');
		// Assign the exp
		await this.apollo.query({
			query: experimentAssignmentQuery,
			variables: { id: 'supply_donate_cta' }
		});
		if (donateSupplyCtaExpData?.enabled) {
			const { version } = trackExperimentVersion(
				this.apollo,
				this.$kvTrackEvent,
				'donation',
				'supply_donate_cta',
				'EXP-ACK-434-nov2022'
			);
			this.donateCTAExperimentVersion = version;
		}
	},
};
</script>

<style lang="scss" scoped>
.donate_cta_block {
	background-color: #F8CD69; //non styleguide color
}
</style>
