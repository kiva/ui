<template>
	<div>
		<h4>{{ lenderName }}'s Badges</h4>
		<badges-list
			class="tw-my-4"
			:completed-achievements="completedAchievements"
			:total-possible-badges="totalPossibleBadges"
			:is-loading="isLoading"
		/>
	</div>
</template>

<script>
import BadgesList from '@/pages/Portfolio/LendingStats/BadgesList';

export default {
	name: 'LenderBadges',
	components: {
		BadgesList
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => []
		},
		totalPossibleBadges: {
			type: Number,
			default: 0
		},
		lenderInfo: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		isLoading() {
			return this.totalPossibleBadges === 0;
		},
		lenderName() {
			return this.lenderInfo?.name ?? '';
		}
	}
};
</script>
