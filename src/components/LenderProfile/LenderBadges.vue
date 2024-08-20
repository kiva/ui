<template>
	<async-lender-section @visible="() => isLoading = false">
		<section v-if="completedAchievements.length > 0">
			<h4
				v-if="!isLoading"
				class="data-hj-suppress"
			>
				{{ badgesTitle }}
			</h4>
			<kv-loading-placeholder
				v-else
				style="height: 30px; width: 250px;"
			/>
			<badges-list
				class="tw-my-4"
				:completed-achievements="completedAchievements"
				:total-possible-badges="totalPossibleBadges"
				:is-loading="isLoading"
			/>
		</section>
	</async-lender-section>
</template>

<script>
import BadgesList from '@/pages/Portfolio/LendingStats/BadgesList';
import KvLoadingPlaceholder from '~/@kiva/kv-components/vue/KvLoadingPlaceholder';
import AsyncLenderSection from './AsyncLenderSection';

export default {
	name: 'LenderBadges',
	components: {
		BadgesList,
		KvLoadingPlaceholder,
		AsyncLenderSection,
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
		},
	},
	data() {
		return {
			isLoading: true
		};
	},
	computed: {
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
