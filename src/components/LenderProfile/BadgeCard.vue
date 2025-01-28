<template>
	<div
		class="tw-flex tw-flex-col tw-items-center"
		style="max-width: 160px;"
	>
		<div>
			<div
				class="tw-relative hover:tw--translate-y-0.5 tw-ease-in-out tw-duration-300"
				style="width: 120px; height: 170px;"
			>
				<div
					v-if="badge.level > 3"
					:class="[
						'badge-card',
						{ 'last-badge-card': !mouseOver, 'last-badge-card-hover': mouseOver }
					]"
				></div>
				<div
					v-if="badge.level > 2"
					:class="[
						'badge-card',
						{ 'third-badge-card': !mouseOver, 'third-badge-card-hover': mouseOver }
					]"
				></div>
				<div
					v-if="badge.level > 1"
					:class="[
						'badge-card',
						{ 'second-badge-card': !mouseOver, 'second-badge-card-hover': mouseOver }
					]"
				></div>
				<div
					class="badge-card tw-py-3.5 tw-px-1 tw-rotate-0 tw-cursor-pointer"
					@mouseover="mouseOver = true"
					@mouseleave="mouseOver = false"
					@click="$emit('click', badge)"
				>
					<img
						:src="getBadgeImgUrl(badge)"
						class="tw-mx-auto tw-h-13"
					>
				</div>
			</div>
		</div>
		<div class="tw-font-medium tw-text-center tw-pt-3.5">
			{{ getBadgeTitle(badge) }}
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useBadgeData from '#src/composables/useBadgeData';

const { getTierBadgeDataByLevel } = useBadgeData();

defineProps({
	badge: {
		type: Object,
		default: () => ({})
	},
});

defineEmits(['click']);

const mouseOver = ref(false);

const getBadgeTitle = badge => {
	const levelData = getTierBadgeDataByLevel(badge, badge.level);
	return levelData.tierName;
};

const getBadgeImgUrl = badge => {
	if (badge.level === 0) {
		return badge?.contentfulData?.[0]?.imageUrl ?? '';
	}
	const badgeData = badge?.contentfulData?.find(data => data.level === badge.level);
	return badgeData?.imageUrl ?? '';
};
</script>

<style lang="postcss" scoped>
.badge-card {
    @apply tw-bg-white tw-rounded tw-drop-shadow-lg tw-origin-bottom-right tw-absolute tw-ease-in-out tw-duration-300;
    height: 160px;
    width: 120px;
}

.second-badge-card {
    transform: rotate(-5deg);
}

.third-badge-card, .second-badge-card-hover {
    transform: rotate(-10deg);
}

.last-badge-card, .third-badge-card-hover {
    transform: rotate(-15deg);
}

.last-badge-card-hover {
    transform: rotate(-20deg);
}
</style>
