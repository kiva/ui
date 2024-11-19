<template>
	<div class="tw-px-2 tw-relative tw-z-2 tw-text-center">
		<div class="tw-flex tw-pt-2 tw-pb-4 tw-justify-center tw-cursor-pointer" @click="backToEarnedBadge">
			<kv-material-icon :icon="mdiChevronLeft" class="tw-w-3 tw-h-3" />
			<p class="tw-text-center tw-w-full">
				YOUR BADGES
			</p>
		</div>
		<div class="tw-mx-auto" style="max-width: 8rem;">
			<kv-carousel
				:embla-options="{
					loop: false,
					align: 'center',
					startIndex: selectedBadgeIdx,
				}"
				slides-to-scroll="visible"
				:is-dotted="true"
				:in-circle="true"
				class="badge-carousel tw-overflow-visible"
				@change="handleChange"
				ref="badgeCarousel"
			>
				<template v-for="badge in badges" #[`slide${badge.id}`] :key="badge.id">
					<div
						class="tw-flex tw-flex-col slide-container"
						v-kv-track-event="[
							'thanks',
							'click',
							'choose-a-badge',
							badge.name
						]"
					>
						<img
							:src="imageRequire(`${badge.img}.svg`)"
							class="badge tw-mx-auto tw-mb-2"
							alt="Gift icon"
						>
						<h3 v-if="hideBadgeName(badge.id)" class="tw-text-center">
							{{ badge.name }}
						</h3>
					</div>
				</template>
			</kv-carousel>
		</div>
		<div class="tw-px-1 md:tw-px-8 tw-pt-2">
			<h2 class="tw-pb-2">
				{{ selectedName }}
			</h2>
			<p class="tw-pb-2">
				{{ selectedDescription }}
			</p>
			<div class="tw-flex tw-flex-col tw-gap-1 tw-text-left">
				<div :key="goal" v-for="goal in selectedGoals" class="tw-flex tw-gap-1">
					<kv-material-icon
						:icon="mdiCheckCircleOutline"
						class="tw-w-3 tw-h-3 tw-text-gray-300 tw-align-middle"
					/>
					<p>{{ goal }}</p>
				</div>
			</div>
		</div>
		<div class="tw-pt-4">
			<kv-button
				class="tw-w-full tw-pb-2"
				:href="setGoalLink"
				v-kv-track-event="[
					'thanks',
					'click',
					'set-as-goal',
					currentBadgeName,
					currentBadge.count,
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
					`Button seen after seeing ${currentBadgeName} badge`,
					currentBadge.count,
				]"
			>
				Go to my kiva
			</kv-button>
		</div>
	</div>
</template>

<script>
import { mdiChevronLeft, mdiCheckCircleOutline } from '@mdi/js';
import KvMaterialIcon from '#kv-components/KvMaterialIcon';
import KvButton from '#kv-components/KvButton';
import KvCarousel from '#kv-components/KvCarousel';
import { metaGlobReader } from '#src/util/importHelpers';

const imageGlob = import.meta.glob('/src/assets/images/thanks-page/badges/*.*', { eager: true, query: '?url' });
const imageRequire = metaGlobReader(imageGlob, '/src/assets/images/thanks-page/badges/');

export default {
	name: 'DetailSection',
	inject: ['apollo', 'cookieStore'],
	emits: ['back'],
	props: {
		selectedBadgeIdx: {
			type: Number,
			default: 0
		},
		badges: {
			type: Array,
			default: () => ([])
		},
		isGuest: {
			type: Boolean,
			default: false
		},
	},
	components: {
		KvButton,
		KvMaterialIcon,
		KvCarousel,
	},
	data() {
		return {
			imageRequire,
			mdiChevronLeft,
			mdiCheckCircleOutline,
			currentBadgeIndex: 0,
		};
	},
	computed: {
		currentBadgeName() {
			return this.currentBadge?.name ?? '';
		},
		currentBadge() {
			if (this.selectedBadgeIdx && !this.currentBadgeIndex) {
				return this.badges[this.selectedBadgeIdx];
			}

			const index = this.currentBadgeIndex > 1 ? this.currentBadgeIndex - 1 : 0;
			return this.badges[index] ?? null;
		},
		currentBadgeTracking() {
			return this.currentBadge?.tracking ?? '';
		},
		selectedName() {
			return this.currentBadge?.name ?? '';
		},
		selectedDescription() {
			return this.currentBadge?.description ?? '';
		},
		selectedGoals() {
			return this.currentBadge?.goals ?? [];
		},
		setGoalLink() {
			const doneUrl = `/portfolio?goal_saved=${this.currentBadgeName}`;
			if (this.isGuest) {
				return `/ui-login?earnBadge=1&doneUrl=${encodeURIComponent(doneUrl)}`;
			}
			return doneUrl;
		},
	},
	mounted() {
		this.$kvTrackEvent(
			'thanks',
			'view',
			'view-badge-details',
			this.currentBadge.tracking,
			this.currentBadge.count,
		);
	},
	methods: {
		backToEarnedBadge() {
			this.$kvTrackEvent('thanks', 'click', 'back-to-earned-badge');
			this.$emit('back');
		},
		handleChange() {
			const badgeIndex = this.$refs.badgeCarousel.currentIndex + 1;
			this.currentBadgeIndex = badgeIndex;
			this.$kvTrackEvent(
				'thanks',
				'view',
				'view-badge-details',
				this.currentBadgeTracking,
				this.currentBadge.count
			);
		},
		hideBadgeName(badgeId) {
			return badgeId !== this.currentBadge?.id;
		},
	}
};
</script>

<style lang="postcss" scoped>

.slide-container {
	width: 164px;
}

.no-border :deep(span) {
	@apply tw-bg-transparent tw-border-0;
}

.badge {
	width: 164px;
	height: 164px;
}

.badge-carousel :deep(.cirle-slide) {
	flex: 0 0 36%;
	@apply tw-mx-auto tw-flex tw-items-end tw-justify-center;
}

.badge-carousel :deep(.circle-carousel) {
	@apply tw-mx-auto;
}

</style>
