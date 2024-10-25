<template>
	<div>
		<div
			class="tw-pt-1 tw-pb-1.5 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-left tw-gap-3"
		>
			<BadgeContainer :status="BADGE_IN_PROGRESS" :shape="getBadgeShape()" class="tw-z-1">
				<img
					:src="badgeImage"
					alt="Badge"
					style="max-height: 133px;"
					@load="isBadgeImageLoaded = true"
				>
			</BadgeContainer>
			<div>
				<h3>{{ badgeName }}</h3>
				<p>{{ subHead }}</p>
			</div>
		</div>
		<KvCarousel
			ref="kvCarouselRef"
			:key="carouselKey"
			class="kv-carousel tw-w-full md:tw-block tw-hidden"
			:embla-options="{
				loop: false,
				startIndex,
			}"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:slide-max-width="singleSlideWidth"
			@interact-carousel="onInteractCarousel"
		>
			<template
				v-for="(loanId, index) in augmentedLoanIds"
				:key="`badge-in-progress-carousel-${index}-${loanId}`" #[`slide${index}`]
			>
				<KvClassicLoanCardContainer
					:loan-id="loanId"
					:show-tags="true"
					:use-full-width="true"
					:show-view-loan="true"
					class="tw-h-full"
				/>
			</template>
			<template v-if="showViewMoreCard" #[`${viewAllLoansSlideIndex}`]>
				<div :key="`load-more-card`" class="tw-flex tw-justify-center tw-items-center tw-h-full">
					<KvButton
						class="tw-mx-1 tw-mb-3 tw-whitespace-nowrap"
						variant="secondary"
						@click="onLoadMore"
					>
						Load more
					</KvButton>
				</div>
			</template>
		</KvCarousel>
		<div
			class="md:tw-hidden tw-grid
      tw-justify-items-center tw-gap-3 md:tw-gap-y-4 md:tw-py-1.5"
		>
			<template
				v-for="(loanId, index) in augmentedLoanIds"
				:key="`badge-in-progress-carousel-${index}-${loanId}`"
			>
				<KvClassicLoanCardContainer
					:loan-id="loanId"
					:show-tags="true"
					:show-view-loan="true"
					class="tw-h-full"
				/>
			</template>
		</div>
		<div class="tw-mt-4 tw-flex tw-flex-col md:tw-hidden tw-justify-center tw-w-auto tw-mx-auto">
			<KvButton
				class="tw-mx-1 tw-mb-3 tw-whitespace-nowrap"
				variant="secondary"
				@click="onLoadMore"
			>
				Load more
			</KvButton>
		</div>
	</div>
</template>

<script setup>

import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import KvCarousel from '@kiva/kv-components/vue/KvCarousel';
import KvButton from '@kiva/kv-components/vue/KvButton';
import {
	computed, watch, ref, inject
} from 'vue';
import useBadgeModal, {
	MOBILE_BREAKPOINT,
	BADGE_IN_PROGRESS,
} from '#src/composables/useBadgeModal';
import { useRouter } from 'vue-router';
import useIsMobile from '#src/composables/useIsMobile';
import BadgeContainer from './BadgeContainer';

const props = defineProps({
	/**
	 * {
	 *   id: '',
	 *   fields: {
	 *     challengeName: '',
	 *     shareFact: '',
	 *     badgeImage: {
	 *       fields: {
	 *         file: {
	 *           url: '',
	 *         },
	 *       },
	 *     },
	 *   },
	 *   totalProgressToAchievement,
	 *   tiers: [
	 *     {
	 *       target: 2,
	 *       completedDate: null,
	 *     },
	 *   ],
	 * }
	 */
	badge: {
		type: Object,
		default: () => ({}),
	},
	isLoading: {
		type: Boolean,
		default: false
	},
	loanIds: {
		type: Array,
		default: () => ([])
	},
	loanLimit: {
		type: Number,
		default: 1
	},
	showViewMoreCard: {
		type: Boolean,
		default: false
	}
});

const isLoading = computed(() => props.isLoading ?? false);
const loanIds = computed(() => props.loanIds ?? []);
const loanLimit = computed(() => props.loanLimit ?? 1);
const loanDisplayCount = ref(3);
const loadMoreClicked = ref(false);
const kvCarouselRef = ref(null);
const $kvTrackEvent = inject('$kvTrackEvent');
const carouselKey = ref('badge-in-progress-carousel');
const startIndex = ref(0);
const {
	getBadgeShape,
	getPrefilteredUrl,
} = useBadgeModal(props.badge);
const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const router = useRouter();
const forceRerender = () => {
	carouselKey.value += 1;
	startIndex.value = 1;
};

watch(loanIds, async ids => {
	if (!isLoading.value) {
		const defaultInitialCount = 3;
		const loansCount = ids.length;
		loanDisplayCount.value = loansCount > defaultInitialCount ? defaultInitialCount : loansCount;
		loadMoreClicked.value = loansCount === loanDisplayCount.value;
		kvCarouselRef.value?.reInitVisible();
	}
}, { immediate: true });

const augmentedLoanIds = computed(() => {
	if (isLoading.value) {
		return [...Array(6).fill(0)];
	}
	return [...loanIds.value].splice(0, loanDisplayCount.value);
});

const viewAllLoansSlideIndex = computed(() => {
	const slideIndex = augmentedLoanIds?.value?.length ?? 0;
	return `slide${slideIndex + 1}`;
});

const singleSlideWidth = computed(() => {
	const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
	// Handle tiny screens
	if (viewportWidth < 414) {
		return `${viewportWidth - 80}px`;
	}
	if (viewportWidth >= 414 && viewportWidth < 768) return '278px';
	if (viewportWidth >= 768 && viewportWidth < 1024) return '328px';
	return '328px';
});

const onInteractCarousel = interaction => {
	$kvTrackEvent('carousel', 'click-carousel-horizontal-scroll', interaction);
};

const badgeName = computed(() => props.badge?.fields?.challengeName ?? '');
const badgeImage = computed(() => props.badge?.fields?.badgeImage?.fields?.file?.url ?? '');
const badgeLevel = computed(() => props.badge?.fields?.level ?? '');
const totalProgress = computed(() => props.badge?.totalProgressToAchievement ?? 0);
const tiers = computed(() => props.badge?.tiers ?? []);

const sortedTiers = computed(() => {
	const defaultTiers = [...tiers.value];
	return defaultTiers.sort((a, b) => a.target - b.target);
});

const currentTier = computed(() => {
	return sortedTiers.value?.find(tier => !tier?.completedDate) ?? null;
});

const target = computed(() => {
	return currentTier.value?.target ?? 0;
});

const subHead = computed(() => `${totalProgress.value} of ${target.value} loans completed`);

const onLoadMore = () => {
	let initialLabelString = 'Scroll to';
	if (isMobile.value) {
		initialLabelString = 'Load';
	}
	if (!loadMoreClicked.value) {
		$kvTrackEvent('portfolio', 'click', `${initialLabelString} more loans`, badgeName.value, badgeLevel.value);

		loanDisplayCount.value = loanLimit.value;
		loadMoreClicked.value = true;
		return forceRerender();
	}

	$kvTrackEvent(
		'portfolio',
		'click',
		`${initialLabelString} more loans on loan finding page`,
		badgeName.value,
		badgeLevel.value
	);

	router.push(`lend/filter?${getPrefilteredUrl()}`);
};

</script>

<style lang="postcss" scoped>

.kv-carousel >>> div[aria-label*=screen]  {
  @apply tw-invisible;
}

.badge-container {
    width: 175px;

    @screen md {
        width: 220px;
    }
}
</style>
