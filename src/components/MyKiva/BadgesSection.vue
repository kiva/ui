<template>
	<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center tw-gap-2.5">
		<div
			v-for="(badge, index) in visibleBadges"
			:key="index"
			class="badge-container tw-flex tw-flex-col tw-justify-between tw-p-1.5 tw-rounded tw-cursor-pointer"
			:class="{
				'tw-bg-white': badge.hasStarted,
				'tw-border-4 tw-border-tertiary tw-border-dashed': !badge.hasStarted
			}"
			v-kv-track-event="[
				'portfolio',
				'click',
				'Badge journey map',
				badge.challengeName,
				badge.level
			]"
			@click="() => $emit('badge-clicked', badge)"
		>
			<span class="tw-text-base !tw-font-medium tw-text-center tw-mb-1">
				{{ badge.challengeName }}
			</span>
			<BadgeContainer
				:status="getBadgeStatus(badge)"
				:shape="getBadgeShape(badge.id)"
				class="tw-self-start tw-mx-auto"
				style="height: 133px;"
			>
				<img
					:src="getActiveTierData(badge).imageUrl"
					:alt="badge.challengeName"
					class="tw-h-full tw-mx-auto"
				>
			</BadgeContainer>
			<div class="tw-flex tw-flex-col tw-gap-0.5 tw-font-medium tw-grow">
				<span
					v-if="badge.hasStarted"
					class="tw-mx-auto"
				>
					{{ levelCaption(badge) }}
				</span>
				<button
					class="tw-text-action hover:tw-underline tw-mt-auto"
				>
					{{ badge.hasStarted ? 'Continue' : 'Start this journey' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';
import { indexIn } from '#src/util/comparators';
import useBadgeData from '#src/composables/useBadgeData';
import { getBadgeShape, BADGE_COMPLETED, BADGE_IN_PROGRESS } from '#src/composables/useBadgeModal';
import BadgeContainer from './BadgeContainer';

defineEmits(['badge-clicked']);

const props = defineProps({
	badgeData: {
		type: Array,
		default: () => ([])
	},
});

const { getActiveTierData, getBadgeWithVisibleTiers } = useBadgeData();

const visibleBadges = computed(() => {
	return props.badgeData
		.filter(b => defaultBadges.includes(b.id))
		.sort(indexIn(defaultBadges, 'id'));
});

const levelCaption = badge => {
	return `Level ${getActiveTierData(badge).level}/${getBadgeWithVisibleTiers(badge).achievementData.tiers.length}`;
};

const getBadgeStatus = badge => {
	const activeTier = getActiveTierData(badge);
	if (activeTier?.level === badge?.achievementData?.tiers?.length) {
		return BADGE_COMPLETED;
	}
	return BADGE_IN_PROGRESS;
};
</script>

<style lang="postcss" scoped>
.badge-container {
    width: 157px;

	@media (width >= 410px) {
		width: 175px;
	}

    @screen md {
        width: 220px;
    }
}
</style>
