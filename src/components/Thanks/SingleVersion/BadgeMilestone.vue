<template>
	<div
		v-if="showBadgeModule"
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			tw-gap-2 print:tw-hidden tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<BgRays v-show="!isLoading && showAnimations" />
		<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<h2 style="line-height: 1.25;">
				{{ title }}
			</h2>
			<BadgeContainer :show-shine="showAnimations">
				<img
					v-if="badgeImageUrl"
					:src="badgeImageUrl"
					alt="Badge"
					style="height: 250px; width: 250px;"
				>
			</BadgeContainer>
			<h3 v-if="isOptedIn">
				Take the next step on your impact journey.
			</h3>
			<KvButton class="continue-button tw-w-full tw-my-0.5" @click="emit('continue-clicked')">
				Continue
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
		</template>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	computed,
	watch,
	onMounted,
	onBeforeUnmount,
} from 'vue';
import _throttle from 'lodash/throttle';
import { mdiArrowRight } from '@mdi/js';
import useBadgeData, { ID_EQUITY } from '#src/composables/useBadgeData';
import { KvMaterialIcon, KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import BgRays from '#src/components/Thanks/BgRays';

const emit = defineEmits(['continue-clicked']);

const props = defineProps({
	isGuest: {
		type: Boolean,
		default: true,
	},
	isOptedIn: {
		type: Boolean,
		default: false,
	},
	badgeAchievedIds: {
		type: Array,
		default: () => ([]),
	},
});

const apollo = inject('apollo');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeContentfulData,
	badgeData,
	getHighestPriorityDisplayBadge,
	getLastCompletedBadgeLevelData,
} = useBadgeData();

const hasScrolled = ref(false);
const badgeDataAchieved = ref();

const isLoading = computed(() => !badgeDataAchieved.value);

const showBadgeModule = computed(() => props.isGuest || !!props.badgeAchievedIds.length);

const showAnimations = computed(() => hasScrolled.value);

const title = computed(() => (props.isOptedIn ? 'Thank you!' : 'Take the next step on your impact journey.'));

const displayedBadgeData = computed(() => {
	if (badgeDataAchieved.value?.length) {
		if (props.isGuest) {
			return badgeDataAchieved.value[0];
		}
		const displayedBadge = getHighestPriorityDisplayBadge(badgeDataAchieved.value);
		return getLastCompletedBadgeLevelData(displayedBadge);
	}
	return {};
});

const badgeImageUrl = computed(() => displayedBadgeData.value.contentfulData?.imageUrl ?? '');

const handleScroll = () => {
	if (!hasScrolled.value) {
		hasScrolled.value = true;
	}
};

const SCROLL_EVENT = 'scroll';
const throttledScroll = _throttle(handleScroll, 200);

onMounted(async () => {
	// Load combined badge data, since badgesAchieved prop only contains the badge IDs
	fetchContentfulData(apollo);

	if (!props.isGuest) {
		// Achievement data can't be loaded for guests
		await fetchAchievementData(apollo);
	}

	window.addEventListener(SCROLL_EVENT, throttledScroll);
});

onBeforeUnmount(() => window.removeEventListener(SCROLL_EVENT, throttledScroll));

watch(() => badgeContentfulData.value, () => {
	// Guests don't have access to achievement data, so we only show the equity badge
	if (props.isGuest && badgeContentfulData.value?.length) {
		const equityBadge = badgeContentfulData.value.find(b => b.id === ID_EQUITY);
		if (equityBadge) {
			badgeDataAchieved.value = [
				{
					levelName: equityBadge.challengeName,
					contentfulData: { ...equityBadge },
				},
			];
		}
	}
});

watch(() => badgeData.value, () => {
	if (!props.isGuest && badgeData.value.length) {
		badgeDataAchieved.value = badgeData.value.filter(b => props.badgeAchievedIds.includes(b.id));
	}
}, { immediate: true });
</script>

<style lang="postcss" scoped>
.continue-button :deep(span) {
	@apply tw-flex;
}
</style>
