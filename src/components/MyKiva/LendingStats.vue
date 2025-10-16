<template>
	<div class="tw-mb-2">
		<h3 class="tw-text-primary tw-mb-1">
			{{ title }}
		</h3>
		<p class="tw-text-base">
			{{ description }}
		</p>
	</div>
	<div
		ref="loanRegionsElement"
		:class="{ 'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': !userLentToAllRegions }"
	>
		<template v-if="isNextStepsExp && !userLentToAllRegions">
			<GoalCard
				v-if="userGoalAchieved"
				:hero-slides="heroSlides"
				:user-goal="userGoal"
				:loading="goalProgressLoading"
				:goal-progress="goalProgress"
				@open-goal-modal="showGoalModal = true"
			/>
			<div v-else class="card-container tw-shrink-0">
				<JourneyCardCarousel
					class="carousel carousel-single"
					user-in-homepage
					in-lending-stats
					:disable-drag="true"
					:lender="lender"
					:slides-number="1"
					:slides="heroSlides"
					:hero-contentful-data="heroContentfulData"
					:hero-tiered-achievements="heroTieredAchievements"
					:user-goal="userGoal"
				/>
			</div>
		</template>
		<div
			v-if="!userLentToAllRegions"
			class="stats-wrapper tw-bg-white tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-w-full tw-flex tw-flex-col"
		>
			<div>
				<span
					v-if="pillHeader"
					class="
						tw-inline-flex tw-items-center tw-gap-1
						tw-mb-2 tw-rounded
						tw-bg-eco-green-1 tw-px-1.5 tw-py-1"
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
				class="tw-mt-2.5 tw-mb-2 tw-mx-auto tw-border-none tw-bg-eco-green-2 tw-rounded"
				style="width: 219px; height: 1px;"
			>
			<div class="tw-flex tw-flex-col tw-grow tw-min-h-0">
				<div class="tw-w-full tw-pb-1.5" v-html="`Make your first loan in ${formattedPendingRegions}`"></div>
				<div class="tw-w-full tw-flex tw-flex-row tw-gap-2 tw-min-h-0 tw-grow">
					<a
						v-for="(region, idx) in pendingRegions"
						:key="idx"
						class="tw-flex tw-w-1/2 tw-cursor-pointer"
						@click="handleRecommendRegionClick(region)"
					>
						<div
							class="
								tw-flex tw-flex-col tw-w-full
								tw-bg-white tw-rounded tw-shadow hover:tw-shadow-lg
								tw-transition-shadow tw-duration-200"
						>
							<div
								:style="{ backgroundImage: `url(${regionImageSource(region)})` }"
								class="region-image tw-w-full tw-rounded-t tw-bg-center tw-bg-cover tw-min-h-0 tw-grow"
							></div>
							<div
								class="
									tw-flex
									tw-justify-between
									tw-w-full
									tw-p-1
									md:tw-px-2
									tw-items-start
								"
								:title="region?.name"
							>
								<span class="tw-font-medium">Lend in {{ region?.name }}</span>
								<KvMaterialIcon
									class="tw-w-3 tw-h-3 tw-shrink-0"
									:icon="mdiArrowTopRight"
								/>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
		<template v-if="!isNextStepsExp || (!!userGoal && userLentToAllRegions)">
			<div v-if="!userLentToAllRegions" class="card-container tw-shrink-0">
				<MyKivaCard
					class="kiva-card tw-h-full"
					primary-cta-variant="primary"
					title-color="tw-text-action-highlight"
					:bg-image="StatsCardBg"
					card-content-classes="tw-pb-1 tw-px-1"
					:loans="topCategoryLoansForCardCarousel"
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
				class="carousel"
				user-in-homepage
				in-lending-stats
				:lender="lender"
				:slides-number="3"
				:slides="allRegionsLentSlides"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				:user-goal="userGoal"
				@open-goal-modal="showGoalModal = true"
			/>
		</template>
		<GoalSettingModal
			v-if="isNextStepsExp"
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			@close-goal-modal="showGoalModal = false"
			@set-goal="setGoal"
		/>
	</div>
</template>
<script setup>
import {
	computed,
	inject,
	onMounted,
	onUnmounted,
	ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { KvMaterialIcon, KvCheckbox } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';

import useBadgeData from '#src/composables/useBadgeData';
import GlobeSearchIcon from '#src/assets/icons/inline/globe-search.svg';

import Africa from '#src/assets/images/my-kiva/Africa.png';
import Asia from '#src/assets/images/my-kiva/Asia.png';
import CentralAmerica from '#src/assets/images/my-kiva/Central America.png';
import EasternEurope from '#src/assets/images/my-kiva/Eastern Europe.png';
import MiddleEast from '#src/assets/images/my-kiva/Middle East.png';
import NorthAmerica from '#src/assets/images/my-kiva/North America.png';
import Oceania from '#src/assets/images/my-kiva/Oceania.png';
import SouthAmerica from '#src/assets/images/my-kiva/South America.png';

import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import GoalCard from '#src/components/MyKiva/GoalCard';
import useGoalData from '#src/composables/useGoalData';
import GoalSettingModal from './GoalSettingModal';

const { delayUntilVisible } = useDelayUntilVisible();

const router = useRouter();
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	getAllCategoryLoanCounts,
} = useBadgeData();

const emit = defineEmits(['store-goals-preferences']);

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
	isNextStepsExp: {
		type: Boolean,
		default: false,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	userGoal: {
		type: Object,
		default: undefined,
	},
});

const interval = ref(null);
const loanRegionsElement = ref(null);
const showGoalModal = ref(false);

const totalRegions = computed(() => props.regionsData.length);
const loanRegions = computed(() => props.regionsData.filter(region => region.hasLoans).length);
const hasLoans = computed(() => props.loans.length > 0);

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

const {
	runComposable: runGoalComposable,
	loading: goalProgressLoading,
	userGoal,
	userGoalAchieved,
	goalProgress,
} = useGoalData({ loans: props.loans, totalLoanCount: props.totalLoans });

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

const handleRecommendRegionClick = region => {
	$kvTrackEvent(
		'event-tracking',
		'click',
		!props.loans.length ? 'empty-state-region-recommendation' : 'region-recommendation',
		region?.name
	);
	router.push(`/lend/filter?country=${region?.countries.join(',')}`);
};

// Local checked state for fade effect
const checkedArr = ref(props.regionsData.map(() => false));

const categoriesLoanCount = computed(() => getAllCategoryLoanCounts(props.heroTieredAchievements));

const title = computed(() => {
	if (!hasLoans.value) return 'Your impact starts here';
	if (props.isNextStepsExp) return 'Make a difference today';

	return 'Ready to grow your impact?';
});

const description = computed(() => {
	if (!hasLoans.value) return 'Recommended for you';
	if (props.isNextStepsExp) return 'How many more people will you help this year?';

	return 'Next steps for you based on your lending history';
});

const setGoal = preferences => {
	emit('store-goals-preferences', preferences);
	showGoalModal.value = false;
};

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

	$kvTrackEvent(
		'event-tracking',
		'show',
		// eslint-disable-next-line no-nested-ternary
		!props.loans.length
			? 'empty-states-no-regions'
			: (props.userLentToAllRegions ? 'lent-to-all-regions' : 'regions-lent-to')
	);

	if (props.isNextStepsExp) {
		runGoalComposable();
	}
});

onUnmounted(() => {
	if (interval.value) clearInterval(interval.value);
});
</script>

<style lang="postcss" scoped>
.stats-wrapper, .card-container {
	height: auto;

	@screen md {
		height: 362px;
	}
}

.card-container {
	width: 100%;

	@screen md {
		width: 336px;
	}
}

.kiva-card :deep(h2) {
	font-size: 22px !important;
}

.region-image {
	height: 145px;

	@screen md {
		height: 191px;
	}
}

.carousel-single > :deep(section > div > div) {
	@apply !tw-min-w-full;
}

.carousel, .carousel > :deep(section), .carousel > :deep(section > div) {
	@apply tw-h-full;
}
</style>
