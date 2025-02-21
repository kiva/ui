<template>
	<section
		v-if="completedBadges.length"
		class="tw-py-2"
	>
		<div class="tw-my-3">
			<h3
				class="tw-text-center tw-mb-2"
			>
				My achievements
			</h3>
			<!-- eslint-disable-next-line max-len -->
			<div class="tw-w-full tw-inline-flex tw-flex-wrap tw-justify-center lg:tw-justify-start tw-gap-6 md:tw-gap-10 md:tw-px-2 tw-mt-2">
				<BadgeCard
					v-for="badge in showedBadges"
					:key="badge.id"
					:badge="badge"
					@click="clickBadge"
				/>
			</div>
		</div>
	</section>
</template>

<script setup>
import {
	computed,
	toRefs,
	inject,
} from 'vue';
import { defaultBadges } from '#src/util/achievementUtils';
import BadgeCard from '#src/components/LenderProfile/BadgeCard';

const $kvTrackEvent = inject('$kvTrackEvent');

const emit = defineEmits(['badge-clicked']);

const props = defineProps({
	completedBadges: {
		type: Array,
		default: () => ([])
	},
});

const { completedBadges } = toRefs(props);

const sortedTieredBadges = computed(() => {
	const tieredBadges = [];
	defaultBadges.forEach(element => {
		const filteredBadges = completedBadges.value
			.filter(badge => badge.id === element)
			.sort((a, b) => b.level - a.level);

		if (filteredBadges.length > 0) {
			tieredBadges.push(filteredBadges[0]);
		}
	});
	return tieredBadges;
});

const sortedEventBadges = computed(() => {
	return completedBadges.value
		.filter(b => b.achievementData?.tiers?.length === 0)
		.sort((a, b) => new Date(a.earnedAtDate) - new Date(b.earnedAtDate));
});

const showedBadges = computed(() => {
	return [
		...sortedTieredBadges.value,
		...sortedEventBadges.value
	];
});

const clickBadge = badge => {
	$kvTrackEvent(
		'portfolio',
		'click',
		'already-earned-badge-modal-from-earned-badge-section',
		badge.challengeName,
		badge.level,
	);
	emit('badge-clicked', badge);
};
</script>
