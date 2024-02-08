<template>
	<div class="tw-flex tw-gap-x-0.5 tw-overflow-x-auto tw-py-2 tw-px-1 hide-scrollbar">
		<activity-card
			v-for="(activity, index) in activities"
			:key="index"
			:activity="activity"
		/>
	</div>
</template>

<script>
import ActivityCard from '@/components/Iwd/ActivityCard';
import iwdActionsQuery from '@/graphql/query/IwdActions.graphql';
import logReadQueryError from '@/util/logReadQueryError';

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
