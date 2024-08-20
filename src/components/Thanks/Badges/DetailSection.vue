<template>
	<div class="tw-px-2 tw-relative tw-z-2 tw-text-center">
		<div class="tw-flex tw-pt-2 tw-pb-4 tw-justify-center tw-cursor-pointer" @click="backToEarnedBadge">
			<kv-material-icon :icon="mdiChevronLeft" class="tw-w-3 tw-h-3" />
			<p class="tw-text-center tw-w-full">
				YOUR BADGES
			</p>
		</div>
		<!-- TODO: Add Badge Carousel -->
		<p>{{ selectedBadge }}</p>
		<kv-button
			class="tw-w-full"
			to="/portfolio"
			v-kv-track-event="[
				'thanks',
				'click',
				'set-as-goal',
				currentBadgeName
			]"
		>
			Set as goal
		</kv-button>
		<kv-button
			v-if="!isGuest"
			class="tw-w-full no-border"
			to="/portfolio"
			variant="secondary"
			v-kv-track-event="[
				'thanks',
				'click',
				'go-to-my-kiva',
				`Button seen after seeing ${currentBadgeName} badge`
			]"
		>
			Go to my kiva
		</kv-button>
	</div>
</template>

<script>
import { mdiChevronLeft } from '@mdi/js';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '~/@kiva/kv-components/vue/KvButton';

const imageRequire = require.context('@/assets/images/thanks-page/badges', true);

export default {
	name: 'DetailSection',
	props: {
		selectedBadge: {
			type: String,
			default: ''
		},
	},
	components: {
		KvButton,
		KvMaterialIcon,
	},
	data() {
		return {
			imageRequire,
			mdiChevronLeft,
			currentBadge: null,
		};
	},
	computed: {
		randomSortedBadges() {
			const badges = [...this.defaultSortBadges];
			return badges.sort(() => Math.random() - 0.5);
		},
		currentBadgeName() {
			return this.currentBadge?.name ?? '';
		},
	},
	mounted() {
		const badgesNames = this.randomSortedBadges.map(badge => badge.name).join(', ');
		this.$kvTrackEvent(
			'thanks',
			'view',
			'view-all-badges',
			badgesNames
		);
	},
	methods: {
		backToEarnedBadge() {
			this.$kvTrackEvent('thanks', 'click', 'back-to-earned-badge');
			this.$emit('step-back');
		},
	}
};
</script>

<style lang="postcss" scoped>

.no-border >>> span {
	@apply tw-bg-transparent tw-border-0;
}

</style>
