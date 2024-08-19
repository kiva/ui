<template>
	<div class="tw-px-2 tw-relative tw-z-2 tw-text-center">
		<div class="tw-flex tw-pt-2 tw-pb-4 tw-justify-center tw-cursor-pointer" @click="backToEarnedBadge">
			<kv-material-icon :icon="mdiChevronLeft" class="tw-w-3 tw-h-3" />
			<p class="tw-text-center tw-w-full">
				YOUR BADGES
			</p>
		</div>
		<h2 class="tw-pb-2">
			Collect new badges with every loan
		</h2>
		<p class="tw-text-secondary tw-pb-2">
			Tap to learn how:
		</p>
		<div
			class="
				tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2 md:tw-gap-4
				tw-justify-center tw-max-w-fit tw-mx-auto tw-pb-4
			"
		>
			<div
				v-for="badge in randomSortedBadges"
				:key="badge.id"
				class="badge-card"
				v-kv-track-event="[
					'thanks',
					'click',
					'choose-a-badge',
					badge.name
				]"
			>
				<img
					:src="imageRequire(`./${badge.img}.svg`)"
					class="tw-w-10 tw-h-10 tw-mx-auto"
					alt="Gift icon"
				>
				<p>{{ badge.name }}</p>
			</div>
		</div>
		<kv-button
			v-if="!isGuest"
			class="tw-w-full no-border"
			to="/portfolio"
			variant="secondary"
			v-kv-track-event="[
				'thanks',
				'click',
				'go-to-my-kiva',
				'Button seen after badge badge options shown'
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
	name: 'DiscoverSection',
	props: {
		isGuest: {
			type: Boolean,
			default: false
		},
		selectedLoanRegion: {
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
			defaultSortBadges: [
				{
					id: 1,
					name: this.selectedLoanRegion,
					img: 'region'
				},
				{
					id: 2,
					name: 'Climate',
					img: 'climate'
				},
				{
					id: 3,
					name: 'Women',
					img: 'women'
				},
				{
					id: 4,
					name: 'U.S. Entrepreneurs',
					img: 'entrepreneurs'
				},
				{
					id: 5,
					name: 'Refugees',
					img: 'refugees'
				},
				{
					id: 6,
					name: 'Most Vulnerable',
					img: 'most-vulnerable'
				}
			],
		};
	},
	computed: {
		randomSortedBadges() {
			const badges = [...this.defaultSortBadges];
			return badges.sort(() => Math.random() - 0.5);
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
			this.$emit('back-to-earned-badge');
		},
	}
};
</script>

<style lang="postcss" scoped>

.badge-card {
	width: 156px;
	height: 148px;
	box-shadow: 0 4px 12px 0 #00000014;
	@apply tw-cursor-pointer tw-border tw-flex tw-flex-col tw-rounded tw-gap-2 tw-border-none tw-justify-center;
}

.no-border >>> span {
	@apply tw-bg-transparent tw-border-0;
}

</style>
