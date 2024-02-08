<template>
	<kv-progress-campaign
		v-if="displayProgress"
		:funded-borrowers="fundedBorrowers"
		:total-borrowers="totalBorrowers"
		:days-left="daysLeft"
	/>
	<kv-loading-placeholder v-else class="tw-w-full tw-h-8" />
</template>

<script>
import KvProgressCampaign from '@/components/Kv/KvProgressCampaign';
import campaignStatsQuery from '@/graphql/query/campaignStats.graphql';
import logReadQueryError from '@/util/logReadQueryError';
import intervalToDuration from 'date-fns/intervalToDuration';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';

export default {
	name: 'IwdProgressCampaign',
	components: {
		KvProgressCampaign,
		KvLoadingPlaceholder,
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			fundedBorrowers: undefined,
			totalBorrowers: undefined,
			daysLeft: undefined,
		};
	},
	computed: {
		displayProgress() {
			return !!(typeof this.fundedBorrowers !== 'undefined'
				&& typeof this.totalBorrowers !== 'undefined'
				&& typeof this.daysLeft !== 'undefined');
		},
	},
	async mounted() {
		try {
			const response = await this.apollo.query({
				query: campaignStatsQuery,
				variables: {
					campaignKey: 'iwd2024',
					filters: { gender: 'female' },
				},
			});
			this.fundedBorrowers = response?.data?.general?.kivaStats?.campaignStats?.currentBorrowerCount;
			this.totalBorrowers = response?.data?.general?.kivaStats?.campaignStats?.targetBorrowerCount;
			const targetEndDate = response?.data?.general?.kivaStats?.campaignStats?.targetEndDate;
			if (targetEndDate) {
				this.daysLeft = intervalToDuration({
					start: new Date(),
					end: new Date(targetEndDate)
				}).days;
			}
		} catch (e) {
			logReadQueryError(e, 'IwdProgressCampaign campaignStatsQuery');
		}
	},
};
</script>
