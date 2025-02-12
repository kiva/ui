<template>
	<div
		v-if="showBadgeModule"
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			tw-gap-2 print:tw-hidden tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<BgRays v-show="!isLoading" />
		<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<!-- Borrower images -->
			<BorrowerAvatarsContainer v-if="showAvatars" :loans="avatars" />
			<h2 style="line-height: 1.25;">
				{{ title }}
			</h2>
			<BadgeContainer :show-shine="true">
				<img
					v-if="badgeImageUrl"
					:src="badgeImageUrl"
					alt="Badge"
					style="height: 250px; width: 250px;"
				>
			</BadgeContainer>
			<h3 v-if="showSimplifiedTitle">
				Take the next step on your impact journey.
			</h3>
			<h2
				v-if="funFact"
				class="tw-text-h3 tw-italic tw-text-desert-rose-4 tw-text-center"
			>
				{{ funFact }} <span v-if="funFactSource">*</span>
			</h2>
			<KvButton class="continue-button tw-w-full tw-my-0.5" @click="emit('continue-clicked')">
				Continue
				<KvMaterialIcon :icon="mdiArrowRight" class="tw-ml-0.5" />
			</KvButton>
			<p v-if="funFactSource" class="tw-text-small tw-text-center tw-text-secondary">
				*{{ funFactSource }}
			</p>
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
} from 'vue';
import { mdiArrowRight } from '@mdi/js';
import useBadgeData, { ID_EQUITY } from '#src/composables/useBadgeData';
import {
	KvMaterialIcon, KvButton, KvLoadingPlaceholder
} from '@kiva/kv-components';
import BadgeContainer from '#src/components/MyKiva/BadgeContainer';
import BorrowerAvatarsContainer from '#src/components/Thanks/BorrowerAvatarsContainer';
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
	onlyKivaCards: {
		type: Boolean,
		default: false,
	},
	onlyDonations: {
		type: Boolean,
		default: false,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	loanCommentModuleShown: {
		type: Boolean,
		default: false,
	},
	kivaCardsModuleShown: {
		type: Boolean,
		default: false,
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

const badgeDataAchieved = ref();

const isLoading = computed(() => !badgeDataAchieved.value);

const showEqualityBadge = computed(() => props.isGuest || props.onlyKivaCards || props.onlyDonations);

const showBadgeModule = computed(() => showEqualityBadge.value || !!props.badgeAchievedIds.length);

const showSimplifiedTitle = computed(() => props.isOptedIn && !props.kivaCardsModuleShown);

const title = computed(() => (showSimplifiedTitle.value ? 'Thank you!' : 'Take the next step on your impact journey.'));

const displayedBadgeData = computed(() => {
	if (badgeDataAchieved.value?.length) {
		if (showEqualityBadge.value) {
			return badgeDataAchieved.value[0];
		}
		const displayedBadge = getHighestPriorityDisplayBadge(badgeDataAchieved.value);
		return getLastCompletedBadgeLevelData(displayedBadge);
	}
	return {};
});

const badgeImageUrl = computed(() => displayedBadgeData.value.contentfulData?.imageUrl ?? '');

const avatars = computed(() => props.loans.slice(0, 3));

const showAvatars = computed(() => props.isOptedIn && avatars.value.length && !props.loanCommentModuleShown);

const funFact = computed(() => displayedBadgeData.value.contentfulData?.shareFact ?? '');

const funFactSource = computed(() => {
	return displayedBadgeData.value.contentfulData?.shareFactFootnote ?? '';
});

onMounted(async () => {
	// Load combined badge data, since badgesAchieved prop only contains the badge IDs
	fetchContentfulData(apollo);

	if (!showEqualityBadge.value) {
		// Achievement data isn't needed when showing the equity badge
		await fetchAchievementData(apollo);
	}
});

watch(() => badgeContentfulData.value, () => {
	// Guests don't have access to achievement data, so we only show the equity badge
	if (showEqualityBadge.value && badgeContentfulData.value?.length) {
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
	if (!showEqualityBadge.value && badgeData.value.length) {
		badgeDataAchieved.value = badgeData.value.filter(b => props.badgeAchievedIds.includes(b.id));
	}
}, { immediate: true });
</script>

<style lang="postcss" scoped>
.continue-button :deep(span) {
	@apply tw-flex;
}
</style>
