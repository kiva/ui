<template>
	<section v-if="completedAchievements.length > 0">
		<h4>{{ badgesTitle }}</h4>
		<badges-list
			class="tw-my-4"
			:completed-achievements="completedAchievements"
			:total-possible-badges="totalPossibleBadges"
			:is-loading="isLoading"
		/>
	</section>
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
			default: () => ([])
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
		},
		badgesTitle() {
			return this.lenderInfo?.name
				? `${this.lenderInfo.name}'s badges`
				: 'Badges';
		}
	}
};
</script>
