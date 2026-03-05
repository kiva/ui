<template>
	<WwwPage
		page-title="My Kiva Next Steps"
		main-class="tw-bg-secondary tw-overflow-hidden tw-relative"
	>
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
				class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-grid-rows-1"
				:class="{
					'tw-grid-cols-1' : isMobile,
					'tw-grid-flow-row-dense tw-grid-cols-3' : !isMobile
				}"
			>
				<NextYearGoalCard
					v-if="!hideCompletedGoalCard && shouldShowGoalCard"
					class="tw-shrink-0"
					:goal-progress="goalProgress"
					:hero-slides="heroSlides"
					:loading="goalProgressLoading"
					:user-goal="userGoal"
					:prev-year-loans="womenLoansLastYear"
					:hide-goal-card="hideGoalCard"
					@open-goal-modal="showGoalModal = true"
				/>
				<MyKivaRegionExperience
					class="tw-col-span-2"
					:regions-data="regionsData"
					:loans="loans"
				/>
			</section>

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
					:key="lifetime-achievements-row"
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
					@open-goal-modal="showGoalModal = true"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</section>

			<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
				Build impact beyond your loan
			</h3>

			<section class="badges-section tw-grid tw-grid-cols-1 tw-gap-4">
				<template v-if="!isMobile">
					<template v-if="shouldShowEmailMarketingCard">
						<transition
							name="fade"
							mode="out-in"
							key="transition"
							enter-active-class="tw-transition-all tw-duration-500"
							enter-from-class="tw-opacity-0"
							enter-to-class="tw-opacity-full"
							leave-active-class="tw-transition-all tw-duration-500"
							leave-from-class="tw-opacity-full"
							leave-to-class="tw-opacity-0"
						>
							<MyKivaEmailUpdatesCard
								v-if="!acceptedEmailMarketingUpdates"
								key="acceptEmails"
								:loans="loans"
								:latest-loan="latestLoan"
								@accept-email-updates="acceptedEmailMarketingUpdates = true"
							/>
							<ThankYouCard
								v-else
								key:="tkYouCard"
							>
								<template #header>
									<span
										class="tw-inline-flex tw-items-center tw-gap-1
									tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
									>
										<KvMaterialIcon
											class="tw-w-2 tw-h-2 tw-shrink-0"
											:icon="mdiEmailOutline"
										/>
										<span
											class="tw-text-primary tw-font-medium tw-align-middle"
											style="font-size: 0.875rem;"
										>
											Email updates
										</span>
									</span>
								</template>
								<template #content>
									<span>We’ll keep you updated. Change your <a
										href="/settings/email"
										target="_blank"
										v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
									>email preferences</a> at any time.</span>
								</template>
							</ThankYouCard>
						</transition>
					</template>
					<MyKivaLatestLoanCard
						v-if="showLatestLoan"
						:loan="latestLoan"
						@open-impact-insight-modal="showImpactInsightsModal = true"
					/>
					<MyKivaSurveyCard
						v-if="showSurveyCard && (!shouldShowGoalCard || !shouldShowEmailMarketingCard)"
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
					:key="lifetime-achievements-row"
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

			<GoalSettingModal
				v-if="showGoalModal"
				:show="showGoalModal"
				:total-loans="totalLoans"
				:categories-loan-count="categoriesLoanCount"
				:goals-v2-enabled="true"
				:is-goal-set="isGoalSet"
				:show-goal-selector="true"
				:tiered-achievements="heroTieredAchievements"
				@close-goal-modal="closeGoalModal"
				@set-goal="setGoal"
			/>

			<MyKivaImpactInsightModal
				v-if="showImpactInsightsModal"
				:show="showImpactInsightsModal"
				:latest-loan="latestLoan"
				@close="closeImpactInsightsModal"
			/>

			<div
				class="tw-w-full tw-text-center tw-my-5 tw-p-0"
			>
				<KvButton
					class="tw-items-center tw-gap-1 tw-w-x"
					variant="secondary"
					@click="goToDashboard('bottom')"
				>
					<span>Back to dashboard</span>
				</KvButton>
			</div>
		</MyKivaContainer>
	</WwwPage>
</template>

<script setup>
import {
	ref,
	inject,
	onMounted,
	computed,
	provide,
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiArrowLeft } from '@mdi/js';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';

import WwwPage from '#src/components/WwwFrame/WwwPage';
import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import MyKivaEmailUpdatesCard from '#src/components/MyKiva/MyKivaEmailUpdatesCard';
import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard';

import MyKivaSurveyCard from '#src/components/MyKiva/MyKivaSurveyCard';

import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import {
	CONTENTFUL_CAROUSEL_KEY,
} from '#src/util/myKivaUtils';
import useBadgeData, {
	FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
} from '#src/composables/useBadgeData';
import { buildAchievementSlides, isNonBadgeSlide } from '#src/util/achievementUtils';
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
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	handlePrimaryCtaClick as handlePrimaryCtaClickUtil,
	handleSecondaryCtaClick as handleSecondaryCtaClickUtil,
} from '#src/util/myKiva/myKivaJourneyCardUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import useBreakpoints from '#src/composables/useBreakpoints';
import useGoalData, { LAST_YEAR_KEY } from '#src/composables/useGoalData';
import useOptIn from '#src/composables/useOptIn';
import {
	buildLatestLoanData,
	buildLenderData,
	buildHeroBadgeData,
	buildCategoriesLoanCount,
	buildRegionsData,
	buildContentfulData,
	buildAchievementsWithFreshProgress,
	checkAndClearPostLendingCookie,
	createModalsHandlers,
} from '#src/composables/useMyKivaJourneyData';

const { isMobile } = useBreakpoints();
const CURRENT_YEAR = new Date().getFullYear();
const POST_LENDING_NEXT_STEPS_KEY = 'post_lending_next_steps_enable';

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const $kvTrackEvent = inject('$kvTrackEvent');
const goalDataComposable = useGoalData({ apollo });
provide('goalData', goalDataComposable);
const router = useRouter();

const heroBadgeContentfulData = ref([]);
const recentTransactionLoans = ref([]);
const heroSlides = ref([]);
const heroTieredAchievements = ref([]);
const currentYearTieredAchievements = ref([]);
const lender = ref(null);
const loans = ref([]);
const regionsData = ref([]);
const totalLoans = ref(0);
const userInfo = ref({});
const latestLoan = ref(null);
const transactions = ref([]);

const postLendingNextStepsEnable = ref(false);

const showGoalModal = ref(false);
const showImpactInsightsModal = ref(false);
const isGoalSet = ref(false);
const showPostLendingNextStepsCards = ref(false);
const newGoalPrefs = ref(null);

const {
	checkCompletedGoal,
	getCategoryLoansLastYear,
	goalProgress,
	hideGoalCard: hideCompletedGoalCard,
	loading: goalProgressLoading,
	loadGoalData,
	storeGoalPreferences,
	userGoal,
	userGoalAchieved,
} = goalDataComposable;

const {
	isTieredAchievementComplete,
	getActiveTierData,
} = useBadgeData();

const heroBadgeData = computed(() => buildHeroBadgeData(
	heroTieredAchievements.value,
	heroBadgeContentfulData.value
));

const categoriesLoanCount = computed(() => buildCategoriesLoanCount(heroTieredAchievements.value));

const goToDashboard = position => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard', position);
	router.push('/mykiva');
};

// Goal modal handlers using centralized factory
const goalModalHandlers = createModalsHandlers({
	trackEvent: $kvTrackEvent,
	storeGoalPreferences,
	loadGoalData,
	trackingCategory: 'portfolio',
	goalsV2Enabled: true,
});

const setGoal = async preferences => {
	await goalModalHandlers.setGoal(preferences, {
		isGoalSet,
		newGoalPrefs,
		showGoalModal,
	});
};

const closeGoalModal = async () => {
	await goalModalHandlers.closeGoalModal({
		showGoalModal,
		isGoalSet,
		newGoalPrefs,
	});
};

const closeImpactInsightsModal = () => {
	goalModalHandlers.closeImpactInsightsModal({
		showImpactInsightsModal,
	});
};

const handlePrimaryCtaClick = slide => handlePrimaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate: router.push,
});

const handleSecondaryCtaClick = slide => handleSecondaryCtaClickUtil({
	slide,
	trackEvent: $kvTrackEvent,
	navigate: router.push,
});

const acceptedEmailMarketingUpdates = ref(false);

const achievementSlides = computed(() => buildAchievementSlides({
	badgesData: heroBadgeData.value,
	slides: heroSlides.value,
	isTieredAchievementComplete,
	getActiveTierData,
}));

const { userHasMailUpdatesOptOut } = useOptIn(apollo, cookieStore);

const shouldShowEmailMarketingCard = computed(() => checkShouldShowEmailMarketing({
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	postLendingNextStepsEnable: postLendingNextStepsEnable.value,
	latestLoan: latestLoan.value,
	hasMailUpdatesOptOut: userHasMailUpdatesOptOut(),
	loansCount: loans.value.length,
}));

const showLatestLoan = computed(() => checkShowLatestLoan({
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	postLendingNextStepsEnable: postLendingNextStepsEnable.value,
	latestLoan: latestLoan.value,
}));

const showSurveyCard = computed(() => checkShowSurveyCard({
	showPostLendingNextStepsCards: showPostLendingNextStepsCards.value,
	postLendingNextStepsEnable: postLendingNextStepsEnable.value,
	userInfo: userInfo.value,
}));

const nonBadgesSlides = computed(() => filterNonBadgesSlides(heroSlides.value));

const womenLoansLastYear = computed(() => {
	return getCategoryLoansLastYear(heroTieredAchievements.value);
});

const shouldShowGoalCard = computed(() => {
	return (!userGoal.value || !userGoalAchieved.value) && !hideCompletedGoalCard.value;
});

onMounted(async () => {
	try {
		const [
			myKivaResult,
			lendingStatsResult,
			slidesResult,
			contentfulChallengeResult,
			lastYearAchievementsResult,
			currentYearAchievementsResult,
		] = await Promise.all([
			apollo.query({ query: myKivaQuery }),
			apollo.query({ query: lendingStatsQuery }),
			apollo.query({
				query: contentfulEntriesQuery,
				variables: { contentType: 'carousel', contentKey: CONTENTFUL_CAROUSEL_KEY },
			}),
			apollo.query({
				query: contentfulEntriesQuery,
				variables: { contentType: 'challenge', limit: 200 },
			}),
			apollo.query({
				query: userAchievementProgressQuery,
				variables: {
					year: LAST_YEAR_KEY,
					loanPurchasesLimit: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
				},
				fetchPolicy: 'network-only',
			}),
			apollo.query({
				query: userAchievementProgressQuery,
				variables: {
					year: CURRENT_YEAR,
					loanPurchasesLimit: FRESH_PROGRESS_LOAN_PURCHASE_LIMIT,
				},
				fetchPolicy: 'network-only',
			}),
		]);

		// Populate from myKivaQuery
		const myData = myKivaResult.data;
		userInfo.value = myData.my ?? {};
		lender.value = buildLenderData(myData.my);
		loans.value = myData.my?.loans?.values ?? [];
		totalLoans.value = myData.my?.loans?.totalCount ?? 0;
		transactions.value = myData.my?.transactions?.values ?? [];
		latestLoan.value = buildLatestLoanData(myData.my);

		// Build regionsData from lendingStatsQuery
		const { regionsData: builtRegionsData } = buildRegionsData(lendingStatsResult.data);
		regionsData.value = builtRegionsData;

		// Settings flags
		const nextStepsSettingKey = `general.${POST_LENDING_NEXT_STEPS_KEY}.value`;
		postLendingNextStepsEnable.value = readBoolSetting(myData, nextStepsSettingKey) ?? false;

		// Contentful
		const contentfulData = buildContentfulData(slidesResult.data, contentfulChallengeResult.data);
		heroSlides.value = contentfulData.heroSlides;
		heroBadgeContentfulData.value = contentfulData.heroBadgeContentfulData;

		// Achievements
		const achievementsData = buildAchievementsWithFreshProgress(
			lastYearAchievementsResult.data,
			currentYearAchievementsResult.data,
			transactions.value
		);
		heroTieredAchievements.value = achievementsData.heroTieredAchievements;
		currentYearTieredAchievements.value = achievementsData.currentYearTieredAchievements;
		recentTransactionLoans.value = achievementsData.recentTransactionLoans;

		// Post-lending next steps cookie
		showPostLendingNextStepsCards.value = checkAndClearPostLendingCookie(cookieStore);
		await loadGoalData({
			year: CURRENT_YEAR,
			yearlyProgress: true,
			freshProgressLoans: recentTransactionLoans.value,
			tieredAchievements: currentYearTieredAchievements.value,
			transactions: transactions.value,
		});
		await checkCompletedGoal({ category: 'portfolio' });
	} catch (error) {
		logReadQueryError(error, 'MyKivaNextStepsPageContent mounted');
	}
});
</script>

<style lang="postcss" scoped>
.stats-wrapper, .card-container {
	height: auto;

	@screen md {
		height: 399px;
	}
}

.card-container {
	width: 100%;

	@screen md {
		width: auto;
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
	@apply tw-pt-0;
}

.next-steps-link {
	@apply tw-flex tw-items-end md:tw-items-center tw-justify-between tw-mb-8 tw-gap-1;
}

/* achievements section */

.badges-section {
	@media (width >= 768px) {
		grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
	}

	@media (width >= 1024px) {
		grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
	}
}
</style>
