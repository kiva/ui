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
					style="height: 134px;"
				></div>
				<div
					v-if="badge.level > 2"
					:class="[
						'badge-card',
						{ 'third-badge-card': !mouseOver, 'third-badge-card-hover': mouseOver }
					]"
					style="height: 142px;"
				></div>
				<div
					v-if="badge.level > 1"
					:class="[
						'badge-card',
						{ 'second-badge-card': !mouseOver, 'second-badge-card-hover': mouseOver }
					]"
					style="height: 150px;"
				></div>
				<div
					class="badge-card tw-py-3.5 tw-px-1 tw-rotate-0 tw-cursor-pointer"
					style="height: 160px;"
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
		<p v-html="getBadgeTitle(badge)" class="tw-text-center tw-pt-1"></p>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import useBadgeData from '#src/composables/useBadgeData';

const { getLevelCaption } = useBadgeData();

defineProps({
	badge: {
		type: Object,
		default: () => ({})
	},
});

defineEmits(['click']);

const mouseOver = ref(false);

const getBadgeTitle = badge => {
	const tiers = badge.achievementData.tiers.length;
	const levelCaption = getLevelCaption(badge);

	// eslint-disable-next-line max-len
	return `<span class="tw-font-medium">${badge.challengeName}</span> <br /> ${badge.level > 0 ? `${levelCaption} of <span class="tw-lowercase">${getLevelCaption({ level: tiers })}</span>` : ''}`;
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
    @apply tw-bg-white tw-rounded tw-drop-shadow-lg tw-origin-bottom-left tw-absolute tw-ease-in-out tw-duration-300
	tw-bottom-0;

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
