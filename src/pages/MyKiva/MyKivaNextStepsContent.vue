<template>
	<MyKivaContainer>
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-text-button-link tw-mt-3 tw-mb-2 md:tw-my-5"
			@click="goToDashboard('top')"
		>
			<KvMaterialIcon
				:icon="mdiArrowLeft"
				class="md:tw-ml-0.5"
			/>
			Back to dashboard
		</button>
		<MyKivaFeaturedSlot
			v-if="goalsRowEnabled && shouldRenderFeaturedSlot"
			class="tw-mb-2"
			:key="`featured-slot-${goalRefreshKey}`"
			:user-first-name="userInfo?.userAccount?.firstName"
			@set-goal-click="openGoalModal"
			@edit-click="openGoalModal({ updating: true })"
		/>
		<template v-if="!hideRecommendedForYouSection">
			<h1 class="tw-text-primary tw-mb-2 !tw-text-subheadline">
				Next steps recommended for you
			</h1>

			<section
				:class="{
					'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': showRegionExperienceInFirstRow
				}"
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
							:hide-goal-card="hideGoalCardInNextSteps"
							:user-info="userInfo"
							:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
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
				<div
					v-else-if="goalProgressLoading"
					class="tw-flex tw-gap-2 lg:tw-gap-4 tw-w-full tw-overflow-hidden"
				>
					<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0" />
					<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0 tw-hidden md:tw-block" />
					<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0 tw-hidden lg:tw-block" />
				</div>
				<JourneyCardCarousel
					v-else-if="topRowHasContent"
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
					:slides="achievementOnlySlides"
					:pre-built-achievement-slides="sortedAchievementSlides"
					:user-goal-achieved="userGoalAchieved"
					:user-goal="userGoal"
					:hide-goal-card="hideGoalCardInNextSteps"
					:latest-loan="latestLoan"
					:user-info="userInfo"
					:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
					@open-goal-modal="openGoalModal($event)"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</section>
		</template>
		<div class="tw-flex tw-flex-col">
			<div :style="{ order: showPostLendingNextStepsCards ? 1 : 2 }">
				<div>
					<template v-if="showBuildImpactSection">
						<h2 class="tw-text-primary tw-mt-2 tw-mb-2 !tw-text-subheadline">
							Build impact beyond your loan
						</h2>
						<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
							<template v-if="latestLoan !== null && !isMobile">
								<MyKivaEmailUpdatesTransition
									v-if="showEmailInBuildSection"
									:accepted="acceptedEmailMarketingUpdates"
									:loans="loans"
									:latest-loan="latestLoan"
									@accept-email-updates="acceptedEmailMarketingUpdates = true"
								/>
								<MyKivaLatestLoanCard
									v-if="showLatestLoanInBuildSection"
									:loan="latestLoan"
									@open-impact-insight-modal="showImpactInsightsModal = true"
								/>
							</template>
							<template v-if="!isMobile">
								<MyKivaSurveyCard
									v-if="showSurveyInBuildSection"
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
								user-in-homepage
								:post-lending-next-steps-enable="true"
								:show-post-lending-next-steps-cards="!showPostLendingNextStepsCards"
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
					</template>

					<template v-if="!showRegionExperienceInFirstRow">
						<h2 class="tw-text-primary tw-mt-4 tw-mb-2 !tw-text-subheadline">
							Keep your impact going
						</h2>
						<section class="tw-grid md:tw-grid-cols-3 tw-gap-4">
							<!--
								Shown whenever the region card is not already in row 1 (post-lending
								lenders and superlenders): the Almost Funded next step sits at its natural
								single-column width alongside the 2-tile lending stats card, which spans
								the remaining two of the three columns.
							-->
							<AlmostFundedNextStep />
							<MyKivaRegionExperience
								class="md:tw-col-span-2"
								:regions-data="regionsData"
								:loans="loans"
							/>
						</section>
					</template>
				</div>
			</div>
			<div
				v-if="goalProgressLoading || bottomRowAchievementSlides.length > 0"
				:style="{ order: showPostLendingNextStepsCards ? 2 : 1 }"
			>
				<h2 class="tw-text-primary tw-mt-4 tw-mb-2 !tw-text-subheadline">
					Continue with your lifetime achievements
				</h2>

				<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
					<template v-if="goalProgressLoading">
						<KvLoadingPlaceholder class="placeholder-card !tw-rounded" />
						<KvLoadingPlaceholder class="placeholder-card !tw-rounded tw-hidden md:tw-block" />
						<KvLoadingPlaceholder class="placeholder-card !tw-rounded tw-hidden lg:tw-block" />
					</template>
					<template v-else-if="!isMobile">
						<MyKivaCard
							v-for="slide in bottomRowAchievementSlides"
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
						user-goal-enabled
						:goal-progress-loading="goalProgressLoading"
						:goal-progress="goalProgress"
						:hero-badge-data="heroBadgeData"
						:hero-tiered-achievements="heroTieredAchievements"
						:lender="lender"
						:loans="loans"
						:slides="bottomRowHeroSlides"
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
import { parseISO, differenceInDays } from 'date-fns';
import { mdiArrowLeft } from '@mdi/js';
import { KvMaterialIcon, KvButton, KvLoadingPlaceholder } from '@kiva/kv-components';

import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import MyKivaFeaturedSlot from '#src/components/MyKiva/MyKivaFeaturedSlot';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import AlmostFundedNextStep from '#src/components/MyKiva/AlmostFundedNextStep';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import MyKivaEmailUpdatesTransition from '#src/components/MyKiva/MyKivaEmailUpdatesTransition';
import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard';
import MyKivaSurveyCard from '#src/components/MyKiva/MyKivaSurveyCard';
import MyKivaSharingModal from '#src/components/MyKiva/MyKivaSharingModal';

import useBadgeData, { getJourneysByLoan } from '#src/composables/useBadgeData';
import { isNonBadgeSlide } from '#src/util/achievementUtils';
import {
	getRichTextUiSettingsData,
	getSlideTitle,
	getSlideSubTitle,
	getSlidePrimaryCtaText,
	getSlidePrimaryCtaVariant,
	getSlideSecondaryCtaText,
	getSlideTitleColor,
	getSlideBackgroundImg
} from '#src/util/myKiva/myKivaContentfulUtils';
import {
	buildAchievementSlides,
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	getTopRowAchievementKeys,
	getTopRowPriorityCards,
	handlePrimaryCtaClick as handlePrimaryCtaClickUtil,
	handleSecondaryCtaClick as handleSecondaryCtaClickUtil,
	PRIORITY_CARD_EMAIL,
	PRIORITY_CARD_LATEST_LOAN,
	PRIORITY_CARD_SURVEY,
} from '#src/util/myKiva/myKivaJourneyCardUtils';
import {
	checkPostLendingCardCookie, removePostLendingCardCookie, TRANSACTION_LOANS_KEY, MY_KIVA_CARD_HEIGHT
} from '#src/util/myKivaUtils';
import useBreakpoints from '#src/composables/useBreakpoints';

defineOptions({ name: 'MyKivaNextStepsContent' });

const TRANSACTION_DAYS_LIMIT = 30;

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
	userLentToAllRegions: {
		type: Boolean,
		default: false,
	},
	goalRecommendedLoanEnable: {
		type: Boolean,
		default: false,
	},
	isAdding: {
		type: Boolean,
		default: false,
	},
	basketItems: {
		type: Array,
		default: () => ([]),
	},
	goalsRowEnabled: {
		type: Boolean,
		default: false,
	},
	shouldRenderFeaturedSlot: {
		type: Boolean,
		default: true,
	},
});

const cookieStore = inject('cookieStore');
const $kvTrackEvent = inject('$kvTrackEvent');
const goalData = inject('goalData');
const router = useRouter();
const { isMobile } = useBreakpoints();
const postLendingQueryExists = router.currentRoute.value.query.postLending === 'true';
const hasPostLendingCookie = checkPostLendingCardCookie(cookieStore);
const shouldShowPostLendingNextStepsCards = hasPostLendingCookie || postLendingQueryExists;

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
	allAchievementsCompleted
} = useBadgeData();

// Local modal/UI state
const showGoalModal = ref(false);
const showImpactInsightsModal = ref(false);
const isGoalSet = ref(false);
const isUpdatingGoal = ref(false);
const isSharingModalVisible = ref(false);
const acceptedEmailMarketingUpdates = ref(false);
const showPostLendingNextStepsCards = ref(shouldShowPostLendingNextStepsCards);

// Computed
const categoriesLoanCount = computed(() => getAllCategoryLoanCounts(props.heroTieredAchievements));

const achievementSlides = computed(() => buildAchievementSlides({
	badgesData: props.heroBadgeData,
	slides: props.heroSlides,
	isTieredAchievementComplete,
	getActiveTierData,
	userGoalCategory: userGoal.value?.category,
}));

// Single source of truth for achievement ordering in the top row carousel.
// Passed to the carousel via preBuiltAchievementSlides so the carousel does not
// independently recompute ordering. Also used to derive topRowAchievementKeys
// for filtering the bottom "Continue with your lifetime achievements" section.
const sortedAchievementSlides = computed(() => {
	const slides = buildAchievementSlides({
		badgesData: props.heroBadgeData,
		slides: props.heroSlides,
		isTieredAchievementComplete,
		getActiveTierData,
		includeMilestoneDiff: true,
		sortByMilestoneDiff: true,
		userGoalCategory: userGoal.value?.category,
	});

	const transactionLoans = props.userInfo?.transactions?.values?.filter(t => {
		const diffInDays = differenceInDays(new Date(), parseISO(t.createTime));
		return t.type === TRANSACTION_LOANS_KEY && diffInDays <= TRANSACTION_DAYS_LIMIT;
	});

	if (transactionLoans?.length) {
		const loanJourneys = getJourneysByLoan(transactionLoans[0]?.loan ?? {});
		if (loanJourneys.length) {
			slides.sort((a, b) => loanJourneys.indexOf(b.badgeKey) - loanJourneys.indexOf(a.badgeKey));
		}
	}

	return slides;
});

// Only badge slides — passed to the top row carousel so non-badge (contentful) slides
// are not pulled into its slots. Non-badge slides belong only in "Build impact" below.
const achievementOnlySlides = computed(() => {
	return (props.heroSlides || []).filter(slide => !isNonBadgeSlide(slide));
});

const showRegionExperienceInFirstRow = computed(() => {
	return !showPostLendingNextStepsCards.value && !props.userLentToAllRegions;
});

const hideRecommendedForYouSection = computed(() => {
	return userGoalAchieved.value
		&& !showRegionExperienceInFirstRow.value
		&& allAchievementsCompleted(props.heroTieredAchievements);
});

const hideGoalCardInNextSteps = computed(
	() => hideCompletedGoalCard.value || userGoalAchieved.value || props.goalsRowEnabled,
);

// Hide the top row carousel when there is nothing to show (no active goal card,
// no incomplete achievements, and no post-lending cards). Applies to the fully-completed superlender case.
const topRowHasContent = computed(() => {
	return !hideGoalCardInNextSteps.value
		|| achievementSlides.value.length > 0
		|| showPostLendingNextStepsCards.value;
});

const userOptedIn = computed(() => props.userInfo?.communicationSettings?.lenderNews
	&& props.userInfo?.communicationSettings?.loanUpdates);

const shouldShowEmailMarketingCard = computed(() => checkShouldShowEmailMarketing({
	showPostLendingNextStepsCards: true,
	latestLoan: props.latestLoan,
	hasMailUpdatesOptOut: !userOptedIn.value,
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

// Track which post-lending priority cards appear in the top row carousel (slides-number=3)
// so we can exclude them from the "Build impact beyond your loan" section below.
const topRowPriorityCards = computed(() => getTopRowPriorityCards({
	showRegionExperienceInFirstRow: showRegionExperienceInFirstRow.value,
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	hideCompletedGoalCard: hideGoalCardInNextSteps.value,
	shouldShowEmailMarketingCard: shouldShowEmailMarketingCard.value,
	showLatestLoan: showLatestLoan.value,
	showSurveyCard: showSurveyCard.value,
}));

// When superlender (userLentToAllRegions), the top row carousel shows 3 slides.
// Compute which achievement badge keys appear there so we can exclude them from the bottom row.
// Slot count is derived from topRowPriorityCards so post-lending priority cards (goal, email,
// latest loan) are correctly accounted for before achievement slots are assigned.
const topRowAchievementKeys = computed(() => getTopRowAchievementKeys({
	showRegionExperienceInFirstRow: showRegionExperienceInFirstRow.value,
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	hideCompletedGoalCard: hideGoalCardInNextSteps.value,
	topRowPriorityCards: topRowPriorityCards.value,
	sortedAchievementSlides: sortedAchievementSlides.value,
}));

const bottomRowAchievementSlides = computed(() => {
	return achievementSlides.value.filter(s => !topRowAchievementKeys.value.has(s.badgeKey));
});

// Filtered heroSlides for mobile bottom-row carousel — excludes slides already shown in the top row
const bottomRowHeroSlides = computed(() => {
	return (props.heroSlides || []).filter(slide => {
		const key = getRichTextUiSettingsData(slide)?.achievementKey;
		return !topRowAchievementKeys.value.has(key);
	});
});

const showEmailInBuildSection = computed(
	() => (shouldShowEmailMarketingCard.value || acceptedEmailMarketingUpdates.value)
		&& !topRowPriorityCards.value.has(PRIORITY_CARD_EMAIL)
);
const showLatestLoanInBuildSection = computed(
	() => showLatestLoan.value && !topRowPriorityCards.value.has(PRIORITY_CARD_LATEST_LOAN)
);
const showSurveyInBuildSection = computed(
	() => showSurveyCard.value && !topRowPriorityCards.value.has(PRIORITY_CARD_SURVEY)
);

// Aggregates the same per-card conditions already used to render each card below, so the
// "Build impact beyond your loan" header never renders with an empty grid underneath,
// whether that's because no card is eligible or because Contentful returned no slides.
const showBuildImpactSection = computed(() => {
	if (nonBadgesSlides.value.length > 0) return true;

	if (isMobile.value && !showPostLendingNextStepsCards.value) {
		return shouldShowEmailMarketingCard.value || showLatestLoan.value || showSurveyCard.value;
	}

	const showLoanDependentCard = props.latestLoan !== null
		&& (showEmailInBuildSection.value || showLatestLoanInBuildSection.value);

	return showLoanDependentCard || showSurveyInBuildSection.value;
});

// Navigation
const goToDashboard = position => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard', position);
	router.push('/mykiva');
};

const navigate = url => {
	if (url) window.location.href = url;
};

// CTA handlers
const handlePrimaryCtaClick = slide => handlePrimaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate,
	modalHandlers: {
		openSharingModal: () => { isSharingModalVisible.value = true; },
	},
});

const handleSecondaryCtaClick = slide => handleSecondaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate,
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
		await updateCurrentGoal(userGoal.value, preferences);
		$kvTrackEvent('portfolio', 'click', 'confirm-edit-goal');
	} else {
		await storeGoalPreferences(preferences, false);
	}
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
	await checkCompletedGoal({ category: 'portfolio', persistHideGoalCard: true });
	if (shouldShowPostLendingNextStepsCards) {
		removePostLendingCardCookie(cookieStore);
	}
});
</script>

<style lang="postcss" scoped>
.placeholder-card {
	min-height: 340px;
	flex: 0 0 100%;

	@screen md {
		flex: 0 0 calc((100% - 8px) / 2);
	}

	@screen lg {
		flex: 0 0 calc((100% - 32px) / 3);
	}
}

.goal-card-container {
	--goal-card-width: 336px;

	width: 100%;
	min-width: 0;
	overflow: hidden;

	@screen md {
		flex: 0 0 var(--goal-card-width);
		height: v-bind('`${MY_KIVA_CARD_HEIGHT}px`');
	}

	@screen lg {
		flex: 0 0 var(--goal-card-width);
	}
}

.kiva-card :deep(h2) {
	font-size: 22px !important;
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

.badges-section {
	@media (width >= 768px) {
		grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
	}

	@media (width >= 1024px) {
		grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
	}
}
</style>
