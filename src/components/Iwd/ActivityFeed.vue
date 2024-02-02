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
import IwdActionsQuery from '@/graphql/query/IwdActions.graphql';

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
		fetchActivities() {
			// Fetch activities from API
			this.apollo.query({
				query: IwdActionsQuery,
			}).then(({ data }) => {
				this.activities = data?.lend?.campaignActions?.values ?? [];
			});
		},
	},
	mounted() {
		this.fetchActivities();
	},
};
</script>

<style scoped lang="postcss">
.hide-scrollbar::-webkit-scrollbar {
  @apply tw-hidden;
}

.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
