<template>
	<div>
		<div
			class="tw-pt-1 tw-pb-1.5 tw-flex tw-flex-col md:tw-flex-row tw-items-center tw-justify-left tw-gap-3"
		>
			<BadgeContainer
				:status="BADGE_IN_PROGRESS"
				:shape="getBadgeShape(badge.id)"
				class="tw-z-1 !tw-cursor-default"
			>
				<img
					:src="tierBadgeData.contentfulData.imageUrl"
					alt="Badge"
					style="height: 133px; width: 133px;"
				>
			</BadgeContainer>
			<div>
				<h3>{{ tierBadgeData.tierName }}</h3>
				<p>{{ subHeader }}</p>
			</div>
		</div>
		<KvCarousel
			:key="`${badge.id}-carousel-${isLoading}-${loanDisplayCount}`"
			class="kv-carousel tw-w-full md:tw-block tw-hidden tw-px-1"
			:embla-options="{ loop: false, startIndex: carouselIndex }"
			:multiple-slides-visible="true"
			slides-to-scroll="visible"
			:slide-max-width="singleSlideWidth"
			@change="onInteractCarousel"
		>
			<template
				v-for="(loanId, index) in augmentedLoanIds"
				:key="`carousel-${index}-${loanId}`"
				#[`slide${index}`]
			>
				<KvClassicLoanCardContainer
					:loan-id="loanId"
					:show-tags="true"
					:use-full-width="true"
					class="tw-h-full"
				/>
			</template>
			<template v-if="!isLoading" #view-more>
				<div class="tw-flex tw-justify-center tw-items-center tw-h-full">
					<KvButton
						class="tw-mx-1 tw-mb-3"
						variant="secondary"
						@click="onLoadMore"
					>
						{{ loadMoreCopy }}
					</KvButton>
				</div>
			</template>
		</KvCarousel>
		<div
			class="md:tw-hidden tw-grid tw-justify-items-center tw-gap-3 md:tw-gap-y-4 md:tw-py-1.5"
		>
			<template
				v-for="(loanId, index) in augmentedLoanIds"
				:key="`grid-${index}-${loanId}`"
			>
				<KvClassicLoanCardContainer
					:loan-id="loanId"
					:show-tags="true"
					class="tw-h-full tw-w-full"
				/>
			</template>
		</div>
		<div class="tw-mt-4 tw-flex tw-flex-col md:tw-hidden tw-justify-center tw-w-auto tw-mx-auto">
			<KvButton
				class="tw-mx-1 tw-mb-3"
				variant="secondary"
				@click="onLoadMore"
			>
				{{ loadMoreCopy }}
			</KvButton>
		</div>
	</div>
</template>

<script setup>
import KvClassicLoanCardContainer from '#src/components/LoanCards/KvClassicLoanCardContainer';
import KvCarousel from '#kv-components/KvCarousel';
import KvButton from '#kv-components/KvButton';
import {
	computed,
	watch,
	ref,
	inject,
} from 'vue';
import { BADGE_IN_PROGRESS, getBadgeShape } from '#src/composables/useBadgeModal';
import useBadgeData from '#src/composables/useBadgeData';
import { useRouter } from 'vue-router';
import BadgeContainer from './BadgeContainer';

const props = defineProps({
	badge: {
		type: Object,
		default: () => ({}),
	},
	tier: {
		type: Object,
		default: () => ({}),
	},
});

const apollo = inject('apollo');
const router = useRouter();
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	fetchLoanIdData,
	badgeLoanIdData,
	getFilteredUrl,
	getTierBadgeDataByLevel
} = useBadgeData();

const isLoading = ref(true);
const loanIds = ref();
const loadMoreClicked = ref(false);
const carouselIndex = ref(0);

const loanDisplayCount = computed(() => (loadMoreClicked.value ? 6 : 3));
const tierBadgeData = computed(() => getTierBadgeDataByLevel(props.badge, props.tier.level));
const subHeader = computed(() => {
	const progress = props.badge.achievementData.totalProgressToAchievement;
	const { target } = tierBadgeData.value.achievementData;
	return `${progress} of ${target} loans completed`;
});
const augmentedLoanIds = computed(() => {
	if (isLoading.value) {
		return [...Array(3).fill(0)];
	}
	return [...loanIds.value].splice(0, loanDisplayCount.value);
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
const loadMoreCopy = computed(() => (loadMoreClicked.value
	? `View all loans in ${props.badge.challengeName}`
	: 'Load more loans'));

const onInteractCarousel = () => {
	$kvTrackEvent(
		'portfolio',
		'click',
		'Scroll to more loans',
		props.badge.challengeName,
		props.tier.level,
	);
};

const onLoadMore = () => {
	if (!loadMoreClicked.value) {
		$kvTrackEvent(
			'portfolio',
			'click',
			'Load more loans',
			props.badge.challengeName,
			props.tier.level,
		);

		loadMoreClicked.value = true;
		carouselIndex.value = 1;
	} else {
		$kvTrackEvent(
			'portfolio',
			'click',
			'Load more loans on loan finding page',
			props.badge.challengeName,
			props.tier.level,
		);

		router.push(`lend/filter?${getFilteredUrl(props.badge)}`);
	}
};

watch(() => props.badge, () => {
	carouselIndex.value = 0;
	isLoading.value = true;
	loanIds.value = [];
	loadMoreClicked.value = false;
	fetchLoanIdData(apollo, props.badge);
}, { immediate: true });

watch(() => badgeLoanIdData.value, () => {
	loanIds.value = badgeLoanIdData.value;
	isLoading.value = false;
});
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
