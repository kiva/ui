<template>
	<MyKivaContainer class="page-container">
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-font-medium tw-mt-3 tw-mb-2 md:tw-my-5"
			@click="goToDashboard('top')"
		>
			<KvMaterialIcon
				:icon="mdiArrowLeft"
				class="tw-ml-0.5"
			/>
			Back to dashboard
		</button>

		<h3 class="tw-text-primary tw-mb-2">
			Next steps recommended for you
		</h3>

		<section
			v-if="shouldShowGoalCard || shouldShowEmailMarketingCard || showLatestLoan"
			class="tw-grid tw-grid-cols-1 tw-gap-4"
		>
			<JourneyCardCarousel
				:key="'post-lending-row'"
				class="carousel tw--mt-6"
				controls-top-right
				in-lending-stats
				use-universal-order
				user-in-homepage
				user-goal-enabled
				goals-v2-enabled
				hide-non-badges-cards
				slides-number="3"
				:goal-progress-loading="goalProgressLoading"
				:goal-progress="goalProgress"
				:hero-badge-data="null"
				:hero-tiered-achievements="null"
				:lender="lender"
				:loans="loans"
				:slides="[]"
				:user-goal-achieved="userGoalAchieved"
				:user-goal="userGoal"
				:post-lending-next-steps-enable="postLendingNextStepsEnable"
				:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
				:latest-loan="latestLoan"
				:user-info="null"
				:enable-slide-limit="true"
				:show-non-badges-slides="false"
				@open-goal-modal="openGoalModal($event)"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</section>
		<section
			v-else
			class="region-section md:tw-flex-row"
			:class="{
				'tw-grid-cols-1 tw-grid-rows-2' : isMobile,
				'tw-grid tw-grid-flow-row-dense tw-gap-4 tw-grid-rows-1' : !isMobile
			}"
		>
			<NextYearGoalCard
				v-if="shouldShowGoalCard"
				class="tw-shrink-0"
				:style="{ maxHeight: !userHasGoal && isMobile ? '340px' : undefined }"
				:goal-progress="goalProgress"
				:hero-slides="heroSlides"
				:loading="goalProgressLoading"
				:user-goal="userGoal"
				:prev-year-loans="womenLoansLastYear"
				:hide-goal-card="hideCompletedGoalCard"
				@open-goal-modal="showGoalModal = true"
			/>
			<MyKivaRegionExperience
				:regions-data="regionsData"
				:loans="loans"
				:loading="goalProgressLoading"
			/>
		</section>

		<div
			v-if="showPostLendingNextStepsCards && postLendingNextStepsEnable"
		>
			<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
				Build impact beyond your loan
			</h3>

			<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
				<template v-if="!isMobile">
					<MyKivaSurveyCard
						v-if="showSurveyCard"
					/>
					<MyKivaCard
						v-for="slide in nonBadgesSlides"
						:key="slide.badgeKey"
						class="card-container tw-w-full tw-h-full"
						:bg-image="getSlideBackgroundImg(slide, isNonBadgeSlide(slide), false)"
						:is-bg-top-aligned="isNonBadgeSlide(slide)"
						:has-gradient="!isNonBadgeSlide(slide)"
						:title="getSlideTitle(slide)"
						:subtitle="getSlideSubTitle(slide, isNonBadgeSlide(slide))"
						:is-black-subtitle="isNonBadgeSlide(slide)"
						:secondary-cta-text="getSlideSecondaryCtaText(slide)"
						:primary-cta-text="getSlidePrimaryCtaText(slide)"
						:primary-cta-variant="getSlidePrimaryCtaVariant(slide)"
						:is-full-width-primary-cta="isNonBadgeSlide(slide)"
						:is-title-font-sans="isSlideTitleFontSans(slide)"
						:title-color="getSlideTitleColor(slide, isNonBadgeSlide(slide))"
						@primary-cta-clicked="handlePrimaryCtaClick(slide)"
						@secondary-cta-clicked="handleSecondaryCtaClick(slide)"
					/>
				</template>
				<JourneyCardCarousel
					v-else
					:key="'beyond-loan-row'"
					class="carousel tw--mt-6"
					controls-top-right
					hide-goal-card
					in-lending-stats
					use-universal-order
					user-in-homepage
					:post-lending-next-steps-enable="false"
					:show-post-lending-next-steps-cards="false"
					:hero-badge-data="null"
					:hero-tiered-achievements="heroTieredAchievements"
					:lender="lender"
					:loans="loans"
					:slides="heroSlides"
					:latest-loan="null"
					:user-info="userInfo"
					:enable-slide-limit="false"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</section>

			<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
				Keep your impact going
			</h3>
			<section>
				<MyKivaRegionExperience
					:regions-data="regionsData"
					:loans="loans"
				/>
			</section>
		</div>

		<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
			Continue with your lifetime achievements
		</h3>

		<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
			<template v-if="!isMobile">
				<MyKivaCard
					v-for="slide in achievementSlides"
					:key="slide.badgeKey"
					class="card-container tw-w-full tw-h-full"
					:bg-image="getSlideBackgroundImg(slide, isNonBadgeSlide(slide), false)"
					:is-bg-top-aligned="isNonBadgeSlide(slide)"
					:has-gradient="!isNonBadgeSlide(slide)"
					:title="getSlideTitle(slide)"
					:subtitle="getSlideSubTitle(slide, isNonBadgeSlide(slide))"
					:is-black-subtitle="isNonBadgeSlide(slide)"
					:secondary-cta-text="getSlideSecondaryCtaText(slide)"
					:primary-cta-text="getSlidePrimaryCtaText(slide)"
					:primary-cta-variant="getSlidePrimaryCtaVariant(slide)"
					:is-full-width-primary-cta="isNonBadgeSlide(slide)"
					:is-title-font-sans="isSlideTitleFontSans(slide)"
					:title-color="getSlideTitleColor(slide, isNonBadgeSlide(slide))"
					@primary-cta-clicked="handlePrimaryCtaClick(slide)"
					@secondary-cta-clicked="handleSecondaryCtaClick(slide)"
				/>
			</template>
			<JourneyCardCarousel
				v-else
				:key="'lifetime-achievements-row'"
				class="carousel tw--mt-6"
				user-in-homepage
				in-lending-stats
				controls-top-right
				goals-v2-enabled
				hide-non-badges-cards
				hide-goal-card
				use-universal-order
				user-goal-enabled
				:goal-progress-loading="goalProgressLoading"
				:goal-progress="goalProgress"
				:hero-badge-data="heroBadgeData"
				:hero-tiered-achievements="heroTieredAchievements"
				:lender="lender"
				:loans="loans"
				:slides="heroSlides"
				:user-goal-achieved="userGoalAchieved"
				:user-goal="userGoal"
				:post-lending-next-steps-enable="false"
				:latest-loan="latestLoan"
				:user-info="userInfo"
				:show-post-lending-next-steps-cards="false"
				:enable-slide-limit="false"
				:show-non-badges-slides="false"
				@open-goal-modal="openGoalModal($event)"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</section>

		<div
			v-if="(!showPostLendingNextStepsCards || !postLendingNextStepsEnable)"
		>
			<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
				Build impact beyond your loan
			</h3>

			<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
				<template v-if="!isMobile">
					<MyKivaEmailUpdatesTransition
						v-if="shouldShowEmailMarketingCard || acceptedEmailMarketingUpdates"
						:accepted="acceptedEmailMarketingUpdates"
						:loans="loans"
						:latest-loan="latestLoan"
						@accept-email-updates="acceptedEmailMarketingUpdates = true"
					/>
					<MyKivaLatestLoanCard
						v-if="showLatestLoan"
						:loan="latestLoan"
						@open-impact-insight-modal="showImpactInsightsModal = true"
					/>
					<MyKivaSurveyCard
						v-if="showSurveyCard"
					/>
					<MyKivaCard
						v-for="slide in nonBadgesSlides"
						:key="slide.badgeKey"
						class="card-container tw-w-full tw-h-full"
						:bg-image="getSlideBackgroundImg(slide, isNonBadgeSlide(slide), false)"
						:is-bg-top-aligned="isNonBadgeSlide(slide)"
						:has-gradient="!isNonBadgeSlide(slide)"
						:title="getSlideTitle(slide)"
						:subtitle="getSlideSubTitle(slide, isNonBadgeSlide(slide))"
						:is-black-subtitle="isNonBadgeSlide(slide)"
						:secondary-cta-text="getSlideSecondaryCtaText(slide)"
						:primary-cta-text="getSlidePrimaryCtaText(slide)"
						:primary-cta-variant="getSlidePrimaryCtaVariant(slide)"
						:is-full-width-primary-cta="isNonBadgeSlide(slide)"
						:is-title-font-sans="isSlideTitleFontSans(slide)"
						:title-color="getSlideTitleColor(slide, isNonBadgeSlide(slide))"
						@primary-cta-clicked="handlePrimaryCtaClick(slide)"
						@secondary-cta-clicked="handleSecondaryCtaClick(slide)"
					/>
				</template>
				<JourneyCardCarousel
					v-else
					:key="'beyond-loan-row'"
					class="carousel tw--mt-6"
					controls-top-right
					hide-goal-card
					in-lending-stats
					use-universal-order
					user-in-homepage
					:post-lending-next-steps-enable="postLendingNextStepsEnable"
					:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
					:hero-badge-data="null"
					:hero-tiered-achievements="heroTieredAchievements"
					:lender="lender"
					:loans="loans"
					:slides="heroSlides"
					:latest-loan="latestLoan"
					:user-info="userInfo"
					:enable-slide-limit="false"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</section>
		</div>

		<GoalSettingModal
			v-if="showGoalModal"
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			:goals-v2-enabled="true"
			:is-goal-set="isGoalSet"
			:show-goal-selector="true"
			:tiered-achievements="heroTieredAchievements"
			:is-updating-goal="isUpdatingGoal"
			@close-goal-modal="closeGoalModal"
			@set-goal="setGoal"
		/>

		<MyKivaImpactInsightModal
			v-if="showImpactInsightsModal"
			:show="showImpactInsightsModal"
			:latest-loan="latestLoan"
			@close="closeImpactInsightsModal"
		/>

		<MyKivaSharingModal
			:lender="lender"
			:is-visible="isSharingModalVisible"
			@close-modal="isSharingModalVisible = false"
		/>

		<div class="tw-w-full tw-text-center tw-my-5 tw-p-0">
			<KvButton
				class="tw-items-center tw-gap-1 tw-w-x"
				variant="secondary"
				@click="goToDashboard('bottom')"
			>
				<span>Back to dashboard</span>
			</KvButton>
		</div>
	</MyKivaContainer>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
	watch
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiArrowLeft } from '@mdi/js';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';

import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import MyKivaEmailUpdatesTransition from '#src/components/MyKiva/MyKivaEmailUpdatesTransition';
import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard';
import MyKivaSurveyCard from '#src/components/MyKiva/MyKivaSurveyCard';
import MyKivaSharingModal from '#src/components/MyKiva/MyKivaSharingModal';

import useBadgeData from '#src/composables/useBadgeData';
import { isNonBadgeSlide } from '#src/util/achievementUtils';
import {
	getSlideTitle,
	getSlideSubTitle,
	getSlidePrimaryCtaText,
	getSlidePrimaryCtaVariant,
	getSlideSecondaryCtaText,
	isSlideTitleFontSans,
	getSlideTitleColor,
	getSlideBackgroundImg
} from '#src/util/myKiva/myKivaContentfulUtils';
import {
	buildAchievementSlides,
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	handlePrimaryCtaClick as handlePrimaryCtaClickUtil,
	handleSecondaryCtaClick as handleSecondaryCtaClickUtil,
} from '#src/util/myKiva/myKivaJourneyCardUtils';
import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';
import useBreakpoints from '#src/composables/useBreakpoints';
import useOptIn from '#src/composables/useOptIn';

defineOptions({ name: 'MyKivaNextStepsContent' });

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: null,
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	heroSlides: {
		type: Array,
		default: () => ([]),
	},
	heroBadgeData: {
		type: Array,
		default: () => ([]),
	},
	heroTieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	regionsData: {
		type: Array,
		default: () => [],
	},
	goalsV2Enabled: {
		type: Boolean,
		default: false,
	},
	postLendingNextStepsEnable: {
		type: Boolean,
		default: false,
	},
	latestLoan: {
		type: Object,
		default: null,
	},
	goalRefreshKey: {
		type: Number,
		default: 0,
	},
	goalEditingEnable: {
		type: Boolean,
		default: false,
	},
});

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const $kvTrackEvent = inject('$kvTrackEvent');
const goalData = inject('goalData');
const router = useRouter();
const { isMobile } = useBreakpoints();

// Goal data from parent-provided composable
const {
	checkCompletedGoal,
	getCategoryLoansLastYear,
	goalProgress,
	hideGoalCard: hideCompletedGoalCard,
	loading: goalProgressLoading,
	loadGoalData,
	loadPreferences,
	storeGoalPreferences,
	updateCurrentGoal,
	userGoal,
	userGoalAchieved,
} = goalData;

const {
	isTieredAchievementComplete,
	getActiveTierData,
	getAllCategoryLoanCounts,
} = useBadgeData();

// Local modal/UI state
const showGoalModal = ref(false);
const showImpactInsightsModal = ref(false);
const isGoalSet = ref(false);
const newGoalPrefs = ref(null);
const recordedGoalSet = ref(false);
const isUpdatingGoal = ref(false);
const isSharingModalVisible = ref(false);
const acceptedEmailMarketingUpdates = ref(false);
const showPostLendingNextStepsCards = ref(false);
const userHasGoal = computed(() => !!userGoal.value && Object.keys(userGoal.value).length > 0);

// Computed
const categoriesLoanCount = computed(() => getAllCategoryLoanCounts(props.heroTieredAchievements));

const achievementSlides = computed(() => buildAchievementSlides({
	badgesData: props.heroBadgeData,
	slides: props.heroSlides,
	isTieredAchievementComplete,
	getActiveTierData,
}));

const { userHasMailUpdatesOptOut } = useOptIn(apollo, cookieStore);

const shouldShowEmailMarketingCard = computed(() => checkShouldShowEmailMarketing({
	showPostLendingNextStepsCards: true,
	postLendingNextStepsEnable: true,
	latestLoan: props.latestLoan,
	hasMailUpdatesOptOut: userHasMailUpdatesOptOut(),
	loansCount: props.loans.length,
}));

const showLatestLoan = computed(() => checkShowLatestLoan({
	showPostLendingNextStepsCards: true,
	postLendingNextStepsEnable: true,
	latestLoan: props.latestLoan,
}));

const showSurveyCard = computed(() => checkShowSurveyCard({
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	postLendingNextStepsEnable: props.postLendingNextStepsEnable,
	userInfo: props.userInfo,
}));

const nonBadgesSlides = computed(() => filterNonBadgesSlides(props.heroSlides));

const womenLoansLastYear = computed(() => getCategoryLoansLastYear(props.heroTieredAchievements));

const shouldShowGoalCard = computed(() => {
	return (!userGoal.value || !userGoalAchieved.value) && !hideCompletedGoalCard.value;
});

// Navigation
const goToDashboard = position => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard', position);
	router.push('/mykiva');
};

// CTA handlers
const handlePrimaryCtaClick = slide => handlePrimaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate: router.push,
	modalHandlers: {
		openSharingModal: () => { isSharingModalVisible.value = true; },
	},
});

const handleSecondaryCtaClick = slide => handleSecondaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate: router.push,
});

// Goal modal methods
const openGoalModal = event => {
	isUpdatingGoal.value = event?.updating || false;
	showGoalModal.value = true;
	if (isUpdatingGoal.value) {
		$kvTrackEvent('portfolio', 'view', 'edit-goal-modal');
	}
};

const setGoal = async preferences => {
	const updateLocalState = !props.goalsV2Enabled;
	if (isUpdatingGoal.value) {
		await updateCurrentGoal(userGoal, preferences);
		$kvTrackEvent('portfolio', 'click', 'confirm-edit-goal');
	} else {
		await storeGoalPreferences(preferences, updateLocalState);
	}
	newGoalPrefs.value = preferences;
	isGoalSet.value = true;
	if (!props.goalsV2Enabled) {
		await loadGoalData({ yearlyProgress: props.goalsV2Enabled });
		showGoalModal.value = false;
	}
};

const closeGoalModal = async () => {
	if (isUpdatingGoal.value && !isGoalSet.value) {
		$kvTrackEvent('portfolio', 'click', 'cancel-goal-edit');
	}

	if (showGoalModal.value) {
		showGoalModal.value = false;
		$kvTrackEvent('portfolio', 'click', 'close-goals');
	}

	if (isGoalSet.value) {
		if (!recordedGoalSet.value) {
			$kvTrackEvent('portfolio', 'show', 'goal-set', newGoalPrefs.value?.category, newGoalPrefs.value?.target);
			recordedGoalSet.value = true;
		}
		if (!isUpdatingGoal.value) {
			await loadGoalData({ yearlyProgress: props.goalsV2Enabled });
		}
	}
	isGoalSet.value = false;
};

const closeImpactInsightsModal = () => {
	if (showImpactInsightsModal.value) {
		showImpactInsightsModal.value = false;
		$kvTrackEvent('portfolio', 'click', 'next-step-close-education');
	}
};

// Watch goalRefreshKey from parent
watch(() => props.goalRefreshKey, async (newVal, oldVal) => {
	if (newVal !== oldVal && newVal > 0) {
		await Promise.all([
			loadGoalData({ yearlyProgress: props.goalsV2Enabled }),
			loadPreferences('network-only'),
		]);
	}
});

onMounted(async () => {
	await checkCompletedGoal({ category: 'portfolio' });
	console.error('HP > heckPostLendingCardCookie(cookieStore)', checkPostLendingCardCookie(cookieStore));
	// Check post-lending cookie
	if (checkPostLendingCardCookie(cookieStore)) {
		showPostLendingNextStepsCards.value = true;
		removePostLendingCardCookie(cookieStore);
	}
});
</script>

<style lang="postcss" scoped>
.loading-card {
	@apply tw-w-full tw-relative tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-flex tw-flex-col
		tw-overflow-hidden tw-bg-white;
}

.stats-wrapper, .card-container {
	height: auto;

	@screen md {
		height: 399px;
	}
}

.card-container {
	width: 100%;

	@apply md:tw-w-auto;
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

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full tw-mt-0;
}

.carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden;
}

.carousel :deep(.kv-carousel) {
	@apply tw-pt-0;
}

.region-section {
	.card-container:first-child {
		@apply tw-mb-2 md:tw-mb-0;
	}

	@screen md {
		grid-template-columns: minmax(321px, 1fr) 2fr;
	}
}

.badges-section {
	@media (width >= 768px) {
		grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
	}

	@media (width >= 1024px) {
		grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
	}
}
</style>
