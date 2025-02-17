<template>
	<div
		v-if="showBadgeModule"
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			tw-gap-2 print:tw-hidden tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="isLoading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<!-- Borrower images -->
			<BorrowerAvatarsContainer v-if="showAvatars" :loans="avatars" />
			<h2 v-html="moduleTitle" style="line-height: 1.25;"></h2>
			<div class="tw-relative">
				<BgRays v-show="!isLoading" style="top: -50px;" />
				<BadgeContainer :show-shine="true">
					<img
						v-if="badgeImageUrl"
						:src="badgeImageUrl"
						alt="Badge"
						style="height: 250px; width: 250px;"
					>
				</BadgeContainer>
			</div>
			<h3>{{ badgeLevelName }}</h3>
			<p
				v-if="funFact"
				class="tw-text-base tw-text-primary tw-text-center"
			>
				{{ funFact }}<span v-if="funFactSource">*</span>
			</p>
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
	onlyKivaCardsAndDonations: {
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
	}
});

const apollo = inject('apollo');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeContentfulData,
	badgeData,
	getHighestPriorityDisplayBadge,
	getLastCompletedBadgeLevelData,
	getTierBadgeDataByLevel,
} = useBadgeData();

const badgeDataAchieved = ref();

const isLoading = computed(() => !badgeDataAchieved.value);

const showEqualityBadge = computed(() => props.isGuest || props.onlyKivaCardsAndDonations);

const showBadgeModule = computed(() => showEqualityBadge.value || !!props.badgeAchievedIds.length);

const moduleTitle = computed(() => {
	let title = '';
	if (props.isOptedIn && !props.kivaCardsModuleShown) {
		title += 'Thank you!<br />';
	}

	if (!badgeDataAchieved.value?.length) {
		title += 'Take the next step on your impact journey.';
	} else {
		title += badgeDataAchieved.value?.length === 1
			? 'You reached a milestone'
			: `You reached ${badgeDataAchieved.value?.length} milestones`;
		title += props.isOptedIn && !props.kivaCardsModuleShown ? '.' : '!';
	}

	return title;
});

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

const badgeLevelName = computed(() => {
	const levelData = getTierBadgeDataByLevel(displayedBadgeData.value, displayedBadgeData.value.level);
	return levelData.tierName;
});

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
