<template>
	<div class="container">
		<div class="badge-container tw-flex-col tw-mb-4">
			<h2 class="tw-text-center tw-mb-2">
				{{ badgeData.tierName }}
			</h2>
			<div class="tw-relative tw-z-1 tw-mb-3" :style="{ minWidth: '16rem'}">
				<div
					class="tw-absolute tw-h-full tw-z-docked"
				>
					<MyKivaBadgeStars badge-completed :style="{ minWidth: '16rem'}" class="tw-h-full" />
				</div>

				<img
					:src="badgeImage"
					class="badge tw-z-2"
					:alt="badgeData.tierName"
				>
			</div>
			<h2 class="tw-italic tw-font-medium tw-text-desert-rose-4 tw-mb-2 tw-text-center">
				"{{ funFact }}" <span v-if="funFactSource">*</span> <a
					:href="learnMoreLink"
					@click="trackLearnMore"
					class="tw-underline tw-text-desert-rose-4 hover:tw-text-desert-rose-4"
				> Learn more</a>
			</h2>
			<h4 class="tw-text-secondary">
				{{ earnedDate }}
			</h4>
		</div>
		<KvSocialShareButton
			class="share-button"
			@click="trackSharing"
			variant="primary"
			modal-title="Celebrate your badge!"
			:share-message="shareMessage"
			:share-url="shareUrl"
			:utm-campaign="utmCampaign"
			:utm-content="utmContent"
		>
			<div class="tw-flex tw-gap-1 tw-items-center">
				<KvMaterialIcon :icon="mdiExportVariant" class="tw-w-2.5 tw-h-2.5 tw-text-white" />
				<span class="tw-font-medium">Share</span>
			</div>
		</KvSocialShareButton>
		<p v-if="funFactSource" class="tw-text-small tw-text-center tw-text-secondary tw-mt-1.5">
			*{{ funFactSource }}
		</p>
	</div>
</template>

<script setup>

import KvSocialShareButton from '#src/components/Kv/KvSocialShareButton';
import MyKivaBadgeStars from '#src/components/MyKiva/MyKivaBadgeStars';
import KvMaterialIcon from '#kv-components/KvMaterialIcon';
import useBadgeData from '#src/composables/useBadgeData';

import confetti from 'canvas-confetti';
import {
	defineProps,
	computed,
	toRefs,
	onMounted,
	inject,
} from 'vue';
import { format } from 'date-fns';
import { mdiExportVariant } from '@mdi/js';

const $kvTrackEvent = inject('$kvTrackEvent');

const props = defineProps({
	badge: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	tier: {
		type: Object,
		default: () => ({}),
	},
	isEarnedSection: {
		type: Boolean,
		default: () => false,
	},
});

const {
	badge,
	lender,
	tier,
	isEarnedSection
} = toRefs(props);

const { getTierBadgeDataByLevel } = useBadgeData();

const badgeData = computed(() => getTierBadgeDataByLevel(badge.value, tier.value?.level));

const isPublic = computed(() => lender.value?.public && lender.value?.publicName);

// eslint-disable-next-line max-len
const shareMessage = "It's not everyday you change a life! Thank you, from all of us at Kiva and the millions of lives changed around the world.";

const utmCampaign = computed(() => `social_share_portfolio_badge_${badge.value.id}`);
const utmContent = computed(() => {
	if (lender.value?.public && lender.value?.publicName) return lender.value.publicName;
	return 'anonymous';
});

const badgeImage = computed(() => {
	if (!tier.value) {
		return badge.value.contentfulData?.[0]?.imageUrl ?? '';
	}
	return badgeData.value.contentfulData?.imageUrl ?? '';
});

const badgeLevel = computed(() => {
	return badgeData.value?.achievementData?.level ?? 0;
});

const shareUrl = computed(() => {
	const base = isPublic.value ? `/lender/${lender.value?.publicId}` : '';
	return `${base}?badge_level=${badgeLevel.value}`;
});

const funFact = computed(() => {
	if (!tier.value) {
		return badge.value.contentfulData?.[0]?.shareFact ?? '';
	}
	return badgeData.value.contentfulData?.shareFact ?? '';
});

const funFactSource = computed(() => {
	return badgeData.value.contentfulData?.shareFactFootnote ?? '';
});
const learnMoreLink = computed(() => badgeData.value.contentfulData?.shareFactUrl ?? '');
const earnedDate = computed(() => {
	let earnedAtDate = '';
	if (!tier.value) {
		earnedAtDate = badge.value?.earnedAtDate ?? null;
	} else {
		earnedAtDate = badgeData.value?.achievementData?.completedDate ?? null;
	}
	return `Earned ${
		format(
			new Date(earnedAtDate),
			'MMMM do, yyyy'
		)}`;
});

const trackLearnMore = () => {
	const label = isEarnedSection.value
		? 'already-earned-badge-modal-from-earned-badge-section-learn-more'
		: 'Already earned badge modal - Learn more';

	$kvTrackEvent(
		'portfolio',
		'click',
		label,
		badgeData.value.challengeName,
		badgeLevel.value
	);
};

const trackSharing = () => {
	const label = isEarnedSection.value
		? 'already-earned-badge-modal-from-earned-badge-section-share-badge'
		: 'Already earned badge modal - Share badge';

	$kvTrackEvent(
		'portfolio',
		'click',
		label,
		badgeData.value.challengeName,
		badgeLevel.value
	);
};

onMounted(() => {
	confetti({
		origin: {
			y: 0.2,
		},
		zIndex: 1400, // tw-z-modal
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
});
</script>

<style lang="postcss" scoped>

.container {
	@apply tw-mx-auto tw-bg-white tw-pt-4.5 md:tw-pt-0 tw-px-4.5 tw-pb-4.5 tw-rounded;
}

.badge-container {
	@apply tw-flex tw-flex-col tw-justify-center tw-items-center;
}

.badge {
	@apply tw-mx-auto;

	width: 160px;
	height: 160px;

	@screen md {
		width: 211px;
		height: 211px;
	}
}

.share-button {
	@apply tw-mx-auto;

	max-width: 328px;
}
</style>
