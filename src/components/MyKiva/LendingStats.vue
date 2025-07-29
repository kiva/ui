<template>
	<div class="tw-mb-3.5">
		<h3 class="tw-text-primary tw-mb-1">
			Ready to grow your impact?
		</h3>
		<p class="tw-text-base">
			Next steps for you based on your lending history
		</p>
	</div>
	<div
		ref="loanRegionsElement"
		class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-4"
		:class="{'tw-flex-wrap xl:tw-flex-nowrap': userLentToAllRegions}"
	>
		<div v-if="!userLentToAllRegions" class="tw-bg-white tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-w-full">
			<div class="tw-mb-4">
				<span
					v-if="pillHeader"
					class="tw-inline-flex tw-items-center tw-gap-1.5 tw-mb-2 md:tw-mb-3 tw-rounded tw-bg-eco-green-1
				tw-px-3 tw-py-1 tw-leading-tight"
					title="Your lending reach"
				>
					<GlobeSearchIcon class="tw-w-2.5 tw-h-2.5 tw-text-brand-550 tw-align-middle" />
					<span class="tw-text-primary tw-font-medium tw-text-h5">
						{{ pillHeader }}
					</span>
				</span>
				<div v-if="loanRegions" class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
					<ul
						class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-2 tw-gap-x-2
							tw-w-full"
					>
						<li
							v-for="(region, idx) in props.regions"
							:key="region.name"
							class="tw-flex tw-items-center tw-min-w-0 tw-overflow-hidden tw-w-full"
						>
							<RoundCheckbox
								:id="`continent-checkbox-${idx}`"
								:checked="checkedArr[idx]"
								class="tw-mr-0.5"
								:readonly="true"
								:disabled="true"
							/>
							<div class="tw-flex-1 tw-min-w-0 tw-overflow-hidden">
								<span
									class="tw-font-medium md:tw-text-lg tw-text-primary
									tw-block tw-whitespace-nowrap tw-truncate tw-min-w-0 tw-w-full"
									style="line-height: 1.25;"
									:title="region.name"
								>
									{{ region.name }}
								</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<hr
				v-if="loanRegions"
				class="tw-my-4 tw-mx-auto tw-border-none tw-bg-eco-green-2 tw-rounded"
				style="width: 219px; height: 1px;"
			>
			<div>
			<!-- Second major section content goes here -->
			</div>
		</div>
		<JourneyCardCarousel
			v-else
			:lender="lender"
			:slides-number="3"
			:slides="allRegionsLentSlides"
			:hero-contentful-data="heroContentfulData"
			:hero-tiered-achievements="heroTieredAchievements"
		/>
	</div>
</template>

<script setup>
import {
	computed, ref, onUnmounted, onMounted,
	defineExpose, inject,
} from 'vue';
import { useRouter } from 'vue-router';
import useBadgeData, { CATEGORY_TARGETS } from '#src/composables/useBadgeData';
import RoundCheckbox from '#src/components/MyKiva/RoundCheckbox';
import GlobeSearchIcon from '#src/assets/icons/inline/globe-search.svg';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import NoLoansImg from '#src/assets/images/my-kiva/no-loans-image.jpg';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';

const { delayUntilVisible } = useDelayUntilVisible();

const router = useRouter();
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	getTopCategoryByLoans,
	getLoanFindingUrl,
} = useBadgeData();

const props = defineProps({
	/**
	 * Array of regions with loan status
	 */
	regions: {
		type: Array,
		default: () => []
	},
	/**
	 * Array of loans
	 */
	loans: {
		type: Array,
		default: () => ([]),
	},
	userLentToAllRegions: {
		type: Boolean,
		default: false,
	},
	heroSlides: {
		type: Array,
		default: () => [],
	},
	lender: {
		type: Object,
		default: () => ({}),
	},
	heroContentfulData: {
		type: Object,
		default: () => ({}),
	},
	heroTieredAchievements: {
		type: Object,
		default: () => ({}),
	},
});

const interval = ref(null);
const loanRegionsElement = ref(null);
const topCategory = ref(null);
const topCategoryLoans = ref([]);
const topCategoryTarget = ref('');
const topCategoryUrl = ref('');

const totalRegions = computed(() => props.regions.length);
const loanRegions = computed(() => props.regions.filter(region => region.hasLoans).length);

const pillHeader = computed(() => {
	if (totalRegions.value === 0) {
		return '';
	}
	if (loanRegions.value === 0) {
		return 'Make a global impact';
	}
	return `${loanRegions.value}/${totalRegions.value} Regions supported`;
});

// Local checked state for fade effect
const checkedArr = ref(props.regions.map(() => false));

const topCategoryImages = computed(() => {
	if (topCategoryLoans.value.length) {
		return topCategoryLoans.value.map(loan => loan.cardImage.url).slice(0, 3);
	}
	return [NoLoansImg];
});

const cardTitle = computed(() => {
	if (topCategory.value) {
		let targetText = '';
		if (topCategoryImages.value.length > 1) {
			targetText = topCategoryTarget.value === 'woman' ? 'women' : `${topCategoryTarget.value}s`;
		} else {
			targetText = topCategoryTarget.value;
		}
		return `You've funded ${topCategoryImages.value.length} ${targetText}!`;
	}
	return 'Give women an equal opportunity to succeed.';
});

const cardCtaText = computed(() => {
	if (topCategory.value) {
		return `Support another ${topCategoryTarget.value}`;
	}
	return 'Fund a Woman';
});

const cardTagText = computed(() => {
	if (topCategory.value) {
		let categoryText = '';
		switch (topCategory.value) {
			case 'us-economic-equality':
				categoryText = 'Kiva US';
				break;
			case 'climate-action':
				categoryText = 'Climate';
				break;
			case 'refugee-equality':
				categoryText = 'Refugees';
				break;
			case 'basic-needs':
				categoryText = 'Basic Needs';
				break;
			default:
				categoryText = 'Women';
		}
		return `Your top category: ${categoryText}`;
	}
	return 'Recommended: Loans to Women';
});

const showTagIcon = computed(() => !!topCategory.value);

const goToTopCategory = () => {
	$kvTrackEvent(
		'event-tracking',
		'click',
		'top-category-recommendation',
		topCategory.value ? topCategory.value : ' empty-state'
	);

	const route = topCategory.value ? topCategoryUrl.value : '/lend-by-category/women';
	router.push(route);
};

const allRegionsLentSlides = computed(() => {
	return [...props.heroSlides,
		{
			title: cardTitle.value,
			ctaText: cardCtaText.value,
			images: topCategoryImages.value,
			tagText: cardTagText.value,
			showTagIcon: showTagIcon.value,
			primaryCta: goToTopCategory,
			isCustomCard: true,
		}];
});

onMounted(() => {
	delayUntilVisible(() => {
		setTimeout(() => {
			let currentIdx = 0;
			interval.value = setInterval(() => {
				// eslint-disable-next-line max-len
				currentIdx = props.regions.findIndex((region, i) => region.hasLoans && !checkedArr.value[i] && i >= currentIdx);
				if (currentIdx !== -1) {
					checkedArr.value[currentIdx] = true;
					currentIdx += 1;
				} else {
					clearInterval(interval.value);
				}
			}, 200);
		}, 800);
	}, [loanRegionsElement.value]);

	topCategory.value = getTopCategoryByLoans(props.loans)?.category ?? null;
	topCategoryLoans.value = getTopCategoryByLoans(props.loans)?.loans ?? [];
	topCategoryTarget.value = CATEGORY_TARGETS[topCategory.value] || '';
	topCategoryUrl.value = getLoanFindingUrl(topCategory.value, router.currentRoute.value);
});

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});

defineExpose({ loanRegionsElement });
</script>
