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
				v-for="(badge, idx) in badges"
				:key="badge.id"
				class="badge-card"
				v-kv-track-event="[
					'thanks',
					'click',
					'choose-a-badge',
					badge.name
				]"
				@click="() => selectBadge(idx)"
			>
				<img
					:src="images(`${badge.img}.svg`)"
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
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';
import KvButton from '@kiva/kv-components/vue/KvButton';
import { metaGlobReader } from '#src/util/importHelpers';

const imageRequire = import.meta.glob('/src/assets/images/thanks-page/badges/*.*', { eager: true, query: '?url' });
const images = metaGlobReader(imageRequire, '/src/assets/images/thanks-page/badges/');

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
		badges: {
			type: Array,
			default: () => ([])
		}
	},
	components: {
		KvButton,
		KvMaterialIcon,
	},
	data() {
		return {
			images,
			mdiChevronLeft,
		};
	},
	mounted() {
		const badgesNames = this.badges.map(badge => badge.name).join(', ');
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
			this.$emit('back');
		},
		selectBadge(idx) {
			this.$emit('select-badge', idx);
		}
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

.no-border :deep(span) {
	@apply tw-bg-transparent tw-border-0;
}

</style>
