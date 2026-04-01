<template>
	<MyKivaContainer>
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-font-medium tw-mt-3 tw-mb-2 md:tw-my-5"
			@click="goToDashboard('top')"
		>
			<KvMaterialIcon
				:icon="mdiArrowLeft"
				class="md:tw-ml-0.5"
			/>
			Back to dashboard
		</button>

		<h3 class="tw-text-primary tw-mb-2">
			Next steps recommended for you
		</h3>

		<section
			:class="{'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': showRegionExperienceInFirstRow}"
		>
			<template v-if="showRegionExperienceInFirstRow">
				<div class="goal-card-container">
					<JourneyCardCarousel
						class="carousel carousel-single"
						user-in-homepage
						in-lending-stats
						:disable-drag="true"
						:goal-progress-loading="goalProgressLoading"
						:goal-progress="goalProgress"
						:hero-badge-data="heroBadgeData"
						:hero-tiered-achievements="heroTieredAchievements"
						:lender="lender"
						:slides-number="1"
						:slides="heroSlides"
						:user-goal-achieved="userGoalAchieved"
						:user-goal="userGoal"
						:categories-loan-count="categoriesLoanCount"
						:hide-goal-card="hideCompletedGoalCard"
						:user-info="userInfo"
						:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
						use-universal-order
						@open-goal-modal="openGoalModal($event)"
						@open-impact-insight-modal="showImpactInsightsModal = true"
					/>
				</div>
				<MyKivaRegionExperience
					class="tw-flex-1 tw-min-w-0"
					:regions-data="regionsData"
					:loans="loans"
				/>
			</template>
			<JourneyCardCarousel
				v-else
				class="carousel tw--mt-6"
				user-in-homepage
				in-lending-stats
				:goal-progress-loading="goalProgressLoading"
				:goal-progress="goalProgress"
				:hero-badge-data="heroBadgeData"
				:hero-tiered-achievements="heroTieredAchievements"
				:lender="lender"
				:loans="loans"
				:slides-number="3"
				:slides="heroSlides"
				:user-goal-achieved="userGoalAchieved"
				:user-goal="userGoal"
				:hide-goal-card="hideCompletedGoalCard"
				:latest-loan="latestLoan"
				:user-info="userInfo"
				:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
				@open-goal-modal="openGoalModal($event)"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</section>
		<div class="tw-flex tw-flex-col">
			<div :style="{ order: showPostLendingNextStepsCards ? 1 : 2 }">
				<div>
					<h3 class="tw-text-primary tw-mt-2 tw-mb-2">
						Build impact beyond your loan
					</h3>
					<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
						<template v-if="latestLoan !== null && !isMobile">
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
						</template>
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
						<!-- Mobile carousel: post-lending cards + survey -->
						<JourneyCardCarousel
							v-else
							:key="'beyond-loan-row'"
							class="carousel tw--mt-6"
							controls-top-right
							hide-goal-card
							in-lending-stats
							use-universal-order
							user-in-homepage
							:post-lending-next-steps-enable="true"
							:show-post-lending-next-steps-cards="true"
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

					<template v-if="!userLentToAllRegions && !showRegionExperienceInFirstRow">
						<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
							Keep your impact going
						</h3>
						<section class="tw-grid md:tw-grid-cols-3 tw-gap-4">
							<MyKivaRegionExperience
								class="md:tw-col-span-2"
								:regions-data="regionsData"
								:loans="loans"
							/>
						</section>
					</template>
				</div>
			</div>
			<div :style="{ order: showPostLendingNextStepsCards ? 2 : 1 }">
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
			</div>
		</div>
		<GoalSettingModal
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
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
	userLentToAllRegions: {
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
const isUpdatingGoal = ref(false);
const isSharingModalVisible = ref(false);
const acceptedEmailMarketingUpdates = ref(false);
const showPostLendingNextStepsCards = ref(false);

// Computed
const categoriesLoanCount = computed(() => getAllCategoryLoanCounts(props.heroTieredAchievements));

const achievementSlides = computed(() => buildAchievementSlides({
	badgesData: props.heroBadgeData,
	slides: props.heroSlides,
	isTieredAchievementComplete,
	getActiveTierData,
}));

const showRegionExperienceInFirstRow = computed(() => {
	return !showPostLendingNextStepsCards.value && !props.userLentToAllRegions;
});

const { userHasMailUpdatesOptOut } = useOptIn(apollo, cookieStore);

const shouldShowEmailMarketingCard = computed(() => checkShouldShowEmailMarketing({
	showPostLendingNextStepsCards: true,
	latestLoan: props.latestLoan,
	hasMailUpdatesOptOut: userHasMailUpdatesOptOut(),
	loansCount: props.loans.length,
}));

const showLatestLoan = computed(() => checkShowLatestLoan({
	showPostLendingNextStepsCards: true,
	latestLoan: props.latestLoan,
}));

const showSurveyCard = computed(() => checkShowSurveyCard({
	showPostLendingNextStepsCards: true,
	userInfo: props.userInfo,
}));

const nonBadgesSlides = computed(() => filterNonBadgesSlides(props.heroSlides));

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
	if (isUpdatingGoal.value) {
		await updateCurrentGoal(userGoal, preferences);
		$kvTrackEvent('portfolio', 'click', 'confirm-edit-goal');
	} else {
		await storeGoalPreferences(preferences, false);
	}
	newGoalPrefs.value = preferences;
	isGoalSet.value = true;
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
		if (!isUpdatingGoal.value) {
			await loadGoalData();
		}

		// Avoid showing category choice step when closing the modal
		setTimeout(() => {
			isGoalSet.value = false;
		}, 300);
	}
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
			loadGoalData(),
			loadPreferences('network-only'),
		]);
	}
});

onMounted(async () => {
	await checkCompletedGoal({ category: 'portfolio' });
	const postLendingQueryExists = router.currentRoute.value.query.postLending === 'true';
	if (checkPostLendingCardCookie(cookieStore) || postLendingQueryExists) {
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

.goal-card-container {
	flex: 0 0 100%;
	min-width: 0;
	overflow: hidden;

	@screen md {
		/* md: 2 cards/row — (100% - 1 gap) / 2. -10px offsets goal card box-shadow bleed into adjacent space */
		flex: 0 0 calc((100% - 1rem) / 2 - 10px);
		height: 390px;
	}

	@screen lg {
		/* lg: 3 cards/row — (100% - 2 gaps) / 3. -10px offsets goal card box-shadow bleed into adjacent space */
		flex: 0 0 calc((100% - 2rem) / 3 - 10px);
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

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full tw-mt-0;
}

.carousel :deep(.kv-carousel__controls) {
	@apply tw-hidden;
}

.carousel :deep(.kv-carousel) {
	@apply tw-pt-0 tw-overflow-visible;
}

:deep(.kv-carousel > div:first-child) {
	@apply tw-gap-2 lg:tw-gap-4;
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
