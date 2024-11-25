<template>
	<section data-testid="lend-stat-badges" class="stats-section">
		<h2 class="tw-flex tw-gap-2 tw-mb-4">
			<span>My Badges</span>
			<span
				v-if="!isLoading"
				class="tw-text-base tw-bg-brand tw-text-white tw-py-0.5 tw-px-1 tw-self-center"
			>
				{{ badgesObtained }}
			</span>
			<kv-loading-placeholder
				v-else
				class="tw-py-0.5 tw-px-1 tw-self-center"
				:style="{width: '3rem', height: '2rem'}"
			/>
		</h2>
		<badges-list
			:completed-achievements="completedAchievements"
			:is-loading="isLoading"
		/>
	</section>
</template>

<script>
import BadgesList from '#src/pages/Portfolio/LendingStats/BadgesList';
import KvLoadingPlaceholder from '#kv-components/KvLoadingPlaceholder';

export default {
	name: 'BadgesSection',
	inject: ['apollo'],
	data() {
		return {
			challengeDataContentful: [],
		};
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => []
		},
		/* total number of possible badges */
		totalPossibleBadges: {
			type: Number,
			default: 0
		},
	},
	components: {
		KvLoadingPlaceholder,
		BadgesList,
	},
	computed: {
		badgesObtained() {
			return this.completedAchievements.length ?? 0;
		},
		isLoading() {
			return this.totalPossibleBadges === 0;
		},
	},
};
</script>
