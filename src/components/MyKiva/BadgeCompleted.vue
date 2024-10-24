<template>
	<div class="container">
		<div class="badge-container tw-flex-col tw-mb-4">
			<h2 class="tw-text-center tw-mb-2">
				{{ badgeTitle }}
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
					:alt="badgeTitle"
				>
			</div>
			<h2 class="tw-italic tw-font-medium tw-text-desert-rose-4 tw-mb-2 tw-text-center">
				{{ funFact }}<a
					:href="learnMoreLink"
					v-kv-track-event="[
						'portfolio',
						'click',
						'Already earned badge modal - Learn more',
						badgeCategory,
						badgeLevel
					]"
					class="tw-underline tw-text-desert-rose-4 hover:tw-text-desert-rose-4"
				> Learn more</a>
			</h2>
			<h4 class="tw-text-secondary">
				{{ earnedDate }}
			</h4>
		</div>
		<KvSocialShareButton
			class="share-button"
			v-kv-track-event="[
				'portfolio',
				'click',
				'Already earned badge modal - Share badge',
				badgeCategory,
				badgeLevel
			]"
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
		<p class="tw-text-small tw-text-center tw-text-secondary tw-mt-1.5">
			{{ funFactSource }}
		</p>
	</div>
</template>

<script setup>

import KvSocialShareButton from '#src/components/Kv/KvSocialShareButton';
import MyKivaBadgeStars from '#src/components/MyKiva/MyKivaBadgeStars';
import KvMaterialIcon from '@kiva/kv-components/vue/KvMaterialIcon';

import confetti from 'canvas-confetti';
import {
	defineProps,
	computed,
	toRefs,
	onMounted
} from 'vue';
import { format } from 'date-fns';
import { mdiExportVariant } from '@mdi/js';

const props = defineProps({
	badge: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	lendingAchievement: {
		type: Object,
		default: () => ({}),
	},
});

const { badge, lender, lendingAchievement } = toRefs(props);

const isPublic = computed(() => lender.value?.public && lender.value?.publicName);
const shareUrl = computed(() => (isPublic.value ? `/lender/${lender.value?.publicId}` : 'https://www.kiva.org'));
// eslint-disable-next-line max-len
const shareMessage = "It's not everyday you change a life! Thank you, from all of us at Kiva and the millions of lives changed around the world.";

const utmCampaign = computed(() => `social_share_portfolio_badge_${badge.value.id}`);
const utmContent = computed(() => {
	if (lender.value?.public && lender.value?.publicName) return lender.value.publicName;
	return 'anonymous';
});

const badgeImage = computed(() => {
	return badge.value.fields?.badgeImage?.fields?.file?.url ?? '';
});

const badgeCategory = computed(() => badge.value?.challengeName ?? '');
const tiers = computed(() => lendingAchievement.value?.tiers ?? []);

const sortedTiers = computed(() => {
	const defaultTiers = [...tiers.value];
	return defaultTiers.sort((a, b) => b.target - a.target);
});

const currentTier = computed(() => {
	return sortedTiers.value?.findLast(tier => tier.completedDate) ?? null;
});
const badgeLevel = computed(() => {
	return currentTier.value?.target ?? 0;
});

const badgeTitle = computed(() => {
	return badge.value?.fields?.challengeName ?? '';
});
const funFact = computed(() => {
	return badge.value.fields?.shareFact ?? '';
});
const funFactSource = computed(() => {
	return badge.value.fields?.shareFactFootnote ?? '';
});
const learnMoreLink = computed(() => badge.value.shareFactUrl ?? '');
const earnedDate = computed(() => `Earned ${format(new Date(currentTier.value.completedDate), 'MMMM do, yyyy')}`);

onMounted(() => {
	confetti({
		origin: {
			y: 0.2
		},
		particleCount: 150,
		spread: 200,
		colors: ['#6AC395', '#223829', '#95D4B3'],
		disableForReducedMotion: true,
	});
});
</script>

<style lang="postcss" scoped>

.container {
	@apply tw-mx-auto tw-bg-white tw-p-4.5 tw-rounded;
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
