<template>
	<!-- Loading Template -->
	<div class="tw-flex tw-pl-2" v-if="isLoading">
		<kv-loading-placeholder
			class="tw-h-10 tw-w-12 tw-flex-none tw-mx-auto tw-mr-2"
			:style="{width: '6rem', height: '5rem'}"
		/>
		<div class="tw-w-full">
			<kv-loading-placeholder
				class="tw-mb-2"
				:style="{width: '6.5rem', height: '1.5rem'}"
			/>
			<kv-loading-placeholder
				:style="{width: '3.5rem', height: '1rem'}"
			/>
		</div>
	</div>
	<!-- Badges Template -->
	<div
		v-else
		class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center lg:tw-justify-start tw-gap-5 md:tw-gap-4
			lg:tw-gap-6 tw-pl-2 lg:tw-pl-5"
	>
		<p v-if="completedAchievements.length === 0">
			You haven't earned any badges yet.
		</p>
		<BadgeCard
			v-for="badge in showedBadges"
			:key="badge.id"
			:badge="badge"
			@click="handleBadgeClicked"
			style="width: 140px;"
		/>
		<JourneySideSheet
			v-if="showSideSheet"
			:visible="showSideSheet"
			:loans="loans"
			:selected-badge-data="selectedBadgeData"
			@sidesheet-closed="handleSideSheetClosed"
		/>
		<BadgeModal
			v-if="showBadgeModal"
			:show="showBadgeModal"
			:badge="selectedBadgeData"
			:state="state"
			:tier="tier"
			:is-earned-section="true"
			@badge-modal-closed="handleBadgeModalClosed"
		/>
	</div>
</template>

<script>
import { KvLoadingPlaceholder } from '@kiva/kv-components';
import { defaultBadges } from '#src/util/achievementUtils';
import { STATE_EARNED } from '#src/composables/useBadgeModal';
import BadgeCard from '#src/components/LenderProfile/BadgeCard';
import BadgeModal from '#src/components/MyKiva/BadgeModal';
import JourneySideSheet from '#src/components/Badges/JourneySideSheet';

export default {
	name: 'BadgesList',
	inject: ['apollo'],
	components: {
		KvLoadingPlaceholder,
		BadgeCard,
		BadgeModal,
		JourneySideSheet,
	},
	props: {
		completedAchievements: {
			type: Array,
			default: () => ([])
		},
		isLoading: {
			type: Boolean,
			default: false
		},
		loans: {
			type: Array,
			default: () => ([])
		},
	},
	data() {
		return {
			showBadgeModal: false,
			selectedBadgeData: null,
			state: STATE_EARNED,
			tier: null,
			showSideSheet: false,
		};
	},
	computed: {
		sortedTieredBadges() {
			const tieredBadges = [];
			defaultBadges.forEach(element => {
				const filteredBadges = this.completedAchievements
					.filter(badge => badge.id === element)
					.sort((a, b) => b.level - a.level);

				if (filteredBadges.length > 0) {
					tieredBadges.push(filteredBadges[0]);
				}
			});
			return tieredBadges;
		},
		sortedEventBadges() {
			return this.completedAchievements
				.filter(b => b.achievementData?.tiers?.length === 0)
				.sort((a, b) => new Date(a.earnedAtDate) - new Date(b.earnedAtDate));
		},
		showedBadges() {
			return [
				...this.sortedTieredBadges,
				...this.sortedEventBadges
			];
		},
	},
	methods: {
		handleBadgeClicked(badge) {
			const selectedTier = badge.achievementData?.tiers?.find(tierEl => tierEl.level === badge.level) ?? null;
			this.tier = selectedTier;
			this.selectedBadgeData = badge;
			if (this.tier) {
				this.showSideSheet = true;
			} else {
				this.showBadgeModal = true;
			}
		},
		handleBadgeModalClosed() {
			this.selectedBadgeData = undefined;
			this.showBadgeModal = false;
		},
		handleSideSheetClosed() {
			this.showSideSheet = false;
			this.selectedBadgeData = undefined;
			this.tier = null;
		},
	},
};
</script>
