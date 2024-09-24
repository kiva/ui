<template>
	<div class="tw-flex tw-gap-x-0.5 tw-overflow-x-auto tw-py-2 tw-px-1 hide-scrollbar">
		<activity-card
			v-for="(activity, index) in aggregatedActivities"
			:key="index"
			:activity="activity"
		/>
	</div>
</template>

<script>
import ActivityCard from '#src/components/Iwd/ActivityCard';
import iwdActionsQuery from '#src/graphql/query/IwdActions.graphql';
import logReadQueryError from '#src/util/logReadQueryError';

export default {
	name: 'ActivityFeed',
	components: {
		ActivityCard,
	},
	inject: ['apollo'],
	data() {
		return {
			activities: [],
		};
	},
	methods: {
		async fetchActivities() {
			try {
				const response = await this.apollo.query({ query: iwdActionsQuery });
				this.activities = response?.data?.lend?.campaignActions?.values ?? [];
			} catch (e) {
				logReadQueryError(e, 'ActivityFeed iwdActionsQuery');
			}
		},
	},
	computed: {
		aggregatedActivities() {
			const data = [];

			this.activities
				// Exclude some expected corporate lending accounts
				// TODO: remove when corporate lending accounts get filtered in campaignActions endpoint
				.filter(a => ![2716811, 6160978, 6160977, 6175667, 6175666].includes(a?.lender?.id))
				// Show one activity item per lender with the amounts summed
				.forEach(activity => {
					const existing = data.find(a => a?.lender?.id === activity?.lender?.id);
					if (existing) {
						const existingAmount = parseFloat(existing?.shareAmount ?? 0);
						const activityAmount = parseFloat(activity?.shareAmount ?? 0);
						existing.shareAmount = existingAmount + activityAmount;
					} else {
						// Shallow copy the read-only object so we can sum the shareAmount
						data.push({ ...activity });
					}
				});

			return data;
		}
	},
	async mounted() {
		await this.fetchActivities();
	},
};
</script>

<style scoped lang="postcss">
.hide-scrollbar {
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
	@apply tw-hidden;
}
</style>
