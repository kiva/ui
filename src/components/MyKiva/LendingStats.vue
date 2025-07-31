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
		:class="{'tw-flex tw-flex-col lg:tw-flex-row tw-gap-4': !userLentToAllRegions}"
	>
		<div v-if="!userLentToAllRegions" class="tw-bg-white tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-w-full">
			<div class="tw-mb-4">
				<span
					v-if="pillHeader"
					class="
						tw-inline-flex tw-items-center tw-gap-1.5
						tw-mb-2 md:tw-mb-3 tw-rounded
						tw-bg-eco-green-1 tw-px-3 tw-py-1"
					title="Your lending reach"
				>
					<GlobeSearchIcon class="tw-w-2.5 tw-h-2.5 tw-text-brand-550 tw-align-middle" />
					<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
						{{ pillHeader }}
					</span>
				</span>
				<div v-if="loanRegions" class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
					<ul
						class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-1 tw-gap-x-0.5
							tw-w-full"
					>
						<li
							v-for="(region, idx) in props.regionsData"
							:key="region.name"
							class="tw-flex tw-items-center tw-min-w-0 tw-overflow-hidden tw-w-full"
						>
							<kv-checkbox
								:id="`continent-checkbox-${idx}`"
								:model-value="checkedArr[idx]"
								class="tw-mr-0.5"
								:readonly="true"
								:disabled="true"
								variant="round"
								:blur-on-disabled="false"
							/>
							<div class="tw-flex-1 tw-min-w-0 tw-overflow-hidden">
								<span
									class="tw-font-medium md:tw-text-lg tw-text-primary
									tw-block tw-whitespace-nowrap tw-truncate tw-min-w-0 tw-w-full tw-align-bottom"

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
				<div class="tw-w-full" v-html="`Make your first loan in ${formattedPendingRegions}`"></div>
				<div class="tw-w-full tw-flex tw-flex-row tw-gap-2 tw-mt-2">
					<a
						v-for="(region, idx) in pendingRegions"
						:key="idx"
						class="tw-flex tw-mb-2 tw-w-1/2 tw-cursor-pointer"
						@click="handleRecommendRegionClick(region)"
					>
						<div
							class="
								tw-flex tw-flex-col tw-w-full
								tw-bg-white tw-rounded tw-shadow hover:tw-shadow-lg
								tw-transition-shadow tw-duration-200"
						>
							<img
								:src="regionImageSource(region)"
								:alt="`Map of ${region?.name}`"
								class="tw-w-full tw-h-16 tw-rounded-t tw-object-cover"
							>
							<div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-p-2">
								<span class="tw-justify-start tw-font-medium">Lend in {{ region?.name }}</span>
								<KvMaterialIcon
									class="tw-justify-end tw-w-3 tw-h-3"
									:icon="mdiArrowTopRight"
								/>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<div v-if="!userLentToAllRegions" class="card-container">
			<MyKivaCard
				class="kiva-card"
				primary-cta-variant="primary"
				title-color="tw-text-action-highlight"
				:images="topCategoryImages"
				:is-full-width-primary-cta="true"
				:is-title-font-sans="true"
				:primary-cta-text="cardCtaText"
				:show-cta-icon="true"
				:show-tag-icon="showTagIcon"
				:tag-text="cardTagText"
				:title="cardTitle"
				@primary-cta-clicked="goToTopCategory"
			/>
		</div>
		<JourneyCardCarousel
			v-else
			user-in-homepage
			in-lending-stats
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
import { KvMaterialIcon, KvCheckbox } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';

import useBadgeData, { CATEGORY_TARGETS } from '#src/composables/useBadgeData';
import GlobeSearchIcon from '#src/assets/icons/inline/globe-search.svg';
import NoLoansImg from '#src/assets/images/my-kiva/no-loans-image.jpg';

import Africa from '#src/assets/images/my-kiva/Africa.png';
import Asia from '#src/assets/images/my-kiva/Asia.png';
import CentralAmerica from '#src/assets/images/my-kiva/Central America.png';
import EasternEurope from '#src/assets/images/my-kiva/Eastern Europe.png';
import MiddleEast from '#src/assets/images/my-kiva/Middle East.png';
import NorthAmerica from '#src/assets/images/my-kiva/North America.png';
import Oceania from '#src/assets/images/my-kiva/Oceania.png';
import SouthAmerica from '#src/assets/images/my-kiva/South America.png';

import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
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
	regionsData: {
		type: Array,
		default: () => [],
		required: true,
	},
	/**
	 * Array of loans
	 */
	loans: {
		type: Array,
		default: () => ([]),
		required: true,
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

const totalRegions = computed(() => props.regionsData.length);
const loanRegions = computed(() => props.regionsData.filter(region => region.hasLoans).length);
const showTagIcon = computed(() => !!topCategory.value);

const regionImages = {
	Africa,
	Asia,
	'Central America': CentralAmerica,
	'Eastern Europe': EasternEurope,
	'Middle East': MiddleEast,
	'North America': NorthAmerica,
	Oceania,
	'South America': SouthAmerica,
};

const regionImageSource = region => (regionImages[region?.name] || '');

const pillHeader = computed(() => {
	if (totalRegions.value === 0) return '';
	if (loanRegions.value === 0) return 'Make a global impact';
	return `${loanRegions.value}/${totalRegions.value} Regions supported`;
});

const pendingRegions = computed(() => {
	return props.regionsData.filter(region => !region.hasLoans).sort((a, b) => b.count - a.count).slice(0, 2);
});

const formattedPendingRegions = computed(() => {
	const regions = pendingRegions.value;
	if (!regions || regions.length === 0) return '';
	const formattedNames = regions.map(region => `<span class="tw-font-medium">
		${region.name === 'Middle East' ? 'the Middle East' : region.name}
		</span>`);
	if (formattedNames.length === 1) return formattedNames[0];
	if (formattedNames.length === 2) return `${formattedNames[0]} and ${formattedNames[1]}`;
	return `${formattedNames.slice(0, -1).join(', ')}, and ${formattedNames[formattedNames.length - 1]}`;
});

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

const handleRecommendRegionClick = region => {
	$kvTrackEvent('event-tracking', 'click', 'region-recommendation', region?.name);
	router.push(`/lend-category-beta?country=${region?.countries.join(',')}`);
};

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

// Local checked state for fade effect
const checkedArr = ref(props.regionsData.map(() => false));
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
				currentIdx = props.regionsData.findIndex((region, i) => region.hasLoans && !checkedArr.value[i] && i >= currentIdx);
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
	if (interval.value) clearInterval(interval.value);
});

defineExpose({ loanRegionsElement });
</script>

<style lang="postcss" scoped>
.card-container {
	max-width: 100%;

	@screen md {
		max-width: 336px;
	}
}

.kiva-card :deep(h2) {
	font-size: 22px !important;
}
</style>
