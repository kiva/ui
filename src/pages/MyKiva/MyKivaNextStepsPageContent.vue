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
			class="tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-grid-rows-1"
			:class="{
				'tw-grid-cols-1' : isMobile,
				'tw-grid-flow-row-dense tw-grid-cols-3' : !isMobile
			}"
		>
			<component
				v-if="!hideCompletedGoalCard && shouldShowGoalCard"
				class="tw-shrink-0"
				:is="goalCardComponent"
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

		<section class="tw-grid tw-grid-cols-1 tw-gap-4">
			<!-- Desktop: render individual achievement cards -->
			<template v-if="!isMobile">
				<MyKivaCard
					v-for="slide in achievementSlides"
					:key="slide.badgeKey"
					class="tw-w-full tw-h-full"
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
			<!-- Mobile: use carousel -->
			<JourneyCardCarousel
				v-else
				:key="lifetime-achievements-row"
				class="carousel tw--mt-6"
				user-in-homepage
				in-lending-stats
				controls-top-right
				:goal-progress-loading="goalProgressLoading"
				:goal-progress="goalProgress"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				:lender="lender"
				:loans="loans"
				:slides-number="3"
				:slides="heroSlides"
				:user-goal-enabled="isNextStepsExpEnabled"
				:user-goal-achieved="userGoalAchieved"
				:user-goal="userGoal"
				:goals-v2-enabled="goalsV2Enabled"
				:hide-goal-card="true"
				:post-lending-next-steps-enable="postLendingNextStepsEnable"
				:latest-loan="latestLoan"
				:user-info="userInfo"
				:show-post-lending-next-steps-cards="false"
				:use-universal-order="true"
				@open-goal-modal="showGoalModal = true"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</section>

		<GoalSettingModal
			v-if="isNextStepsExpEnabled && showGoalModal"
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			:goals-v2-enabled="goalsV2Enabled"
			:is-goal-set="isGoalSet"
			:show-goal-selector="true"
			:tiered-achievements="heroTieredAchievements"
			@close-goal-modal="closeGoalModal"
			@set-goal="setGoal"
		/>

		<MyKivaImpactInsightModal
			v-if="showPostLendingNextStepsCards && postLendingNextStepsEnable && showImpactInsightsModal"
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
</template>

<script setup>
import {
	ref,
	inject,
	onMounted,
	computed,
	provide,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { mdiArrowLeft } from '@mdi/js';
import { KvMaterialIcon, KvButton } from '@kiva/kv-components';

import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import GoalCard from '#src/components/MyKiva/GoalCard';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';

import myKivaQuery from '#src/graphql/query/myKiva.graphql';
import lendingStatsQuery from '#src/graphql/query/myLendingStats.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import userAchievementProgressQuery from '#src/graphql/query/userAchievementProgress.graphql';
import { readBoolSetting } from '#src/util/settingsUtils';
import { initializeExperiment } from '#src/util/experiment/experimentUtils';
import {
	CONTENTFUL_CAROUSEL_KEY,
	getRecentTransactionLoans,
	checkPostLendingCardCookie,
	removePostLendingCardCookie,
} from '#src/util/myKivaUtils';
import useBadgeData from '#src/composables/useBadgeData';
import { buildAchievementSlides, isNonBadgeSlide } from '#src/util/achievementUtils';
import {
	getRichTextUiSettingsData,
	getSlideTitle,
	getSlideSubTitle,
	getSlidePrimaryCtaText,
	getSlidePrimaryCtaVariant,
	getSlideSecondaryCtaText,
	isSlideTitleFontSans,
	getSlideTitleColor,
	getSlideBackgroundImg,
} from '#src/util/contentfulUtils';
import useBreakpoints from '#src/composables/useBreakpoints';
import useGoalData, { LAST_YEAR_KEY, isGoalsV2Enabled } from '#src/composables/useGoalData';
import logReadQueryError from '#src/util/logReadQueryError';

const { isMobile /* , isMedium, isLarge */ } = useBreakpoints();
const CURRENT_YEAR = new Date().getFullYear();
const NEXT_STEPS_EXP_KEY = 'mykiva_next_steps';
const THANK_YOU_PAGE_GOALS_ENABLE_KEY = 'thankyou_page_goals_enable';
const POST_LENDING_NEXT_STEPS_KEY = 'post_lending_next_steps_enable';

const apollo = inject('apollo');
const cookieStore = inject('cookieStore');
const $kvTrackEvent = inject('$kvTrackEvent');
const goalDataComposable = useGoalData({ apollo });
provide('goalData', goalDataComposable);
const router = useRouter();
const route = useRoute();

const heroContentfulData = ref([]);
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

const isNextStepsExpEnabled = ref(false);
const goalsEntrypointEnable = ref(false);
const postLendingNextStepsEnable = ref(false);

const showGoalModal = ref(false);
const showImpactInsightsModal = ref(false);
const isGoalSet = ref(false);
const showPostLendingNextStepsCards = ref(false);
const recordedGoalSet = ref(false);
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
	getAllCategoryLoanCounts,
	getContentfulLevelData,
	combineBadgeData,
	isTieredAchievementComplete,
	getActiveTierData,
} = useBadgeData();

const badgesData = computed(() => {
	const badgeContentfulData = (heroContentfulData.value ?? [])
		.map(entry => getContentfulLevelData(entry));
	return combineBadgeData(heroTieredAchievements.value, badgeContentfulData);
});

const achievementSlides = computed(() => buildAchievementSlides({
	badgesData: badgesData.value,
	slides: heroSlides.value,
	isTieredAchievementComplete,
	getActiveTierData,
}));

const goalsV2Enabled = computed(() => isGoalsV2Enabled(goalsEntrypointEnable.value));
const categoriesLoanCount = computed(() => getAllCategoryLoanCounts(heroTieredAchievements.value));

const goToDashboard = position => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard', position);
	router.push('/mykiva');
};

const setGoal = async preferences => {
	const updateLocalState = !goalsV2Enabled.value;
	await storeGoalPreferences(preferences, updateLocalState);
	newGoalPrefs.value = preferences;
	isGoalSet.value = true;
	if (!goalsV2Enabled.value) {
		await loadGoalData({ yearlyProgress: goalsV2Enabled.value });
		showGoalModal.value = false;
	}
};

const closeGoalModal = async () => {
	if (showGoalModal.value) {
		showGoalModal.value = false;
		$kvTrackEvent('portfolio', 'click', 'close-goals');
	}
	if (isGoalSet.value) {
		if (!recordedGoalSet.value) {
			$kvTrackEvent(
				'portfolio',
				'show',
				'goal-set',
				newGoalPrefs.value?.category,
				newGoalPrefs.value?.target
			);
			recordedGoalSet.value = true;
		}
		await loadGoalData({ yearlyProgress: goalsV2Enabled.value });
	}
};

const closeImpactInsightsModal = () => {
	if (showImpactInsightsModal.value) {
		showImpactInsightsModal.value = false;
		$kvTrackEvent('portfolio', 'click', 'next-step-close-education');
	}
};

const handlePrimaryCtaClick = slide => {
	const data = getRichTextUiSettingsData(slide);
	const primaryCtaUrl = data.primaryCtaUrl || '';
	const ctaLabel = `primary-cta-${getSlidePrimaryCtaText(slide)}`;
	$kvTrackEvent('portfolio', 'click', ctaLabel, data.achievementKey);
	router.push(primaryCtaUrl);
};

const handleSecondaryCtaClick = slide => {
	const data = getRichTextUiSettingsData(slide);
	const secondaryCtaUrl = data.secondaryCtaUrl || '';
	const ctaLabel = `secondary-cta-${getSlideSecondaryCtaText(slide)}`;
	$kvTrackEvent('portfolio', 'click', ctaLabel, data.achievementKey);
	router.push(secondaryCtaUrl);
};

// TODO CR: remove Journey Methods to avoid duplicates
const womenLoansLastYear = computed(() => {
	return getCategoryLoansLastYear(heroTieredAchievements.value);
});

const goalCardComponent = computed(() => {
	if (goalsV2Enabled.value) {
		return NextYearGoalCard;
	}
	return GoalCard;
});

// <--- START DUPLICATE CODE --->
const shouldShowGoalCard = computed(() => {
	return isNextStepsExpEnabled.value
	&& (!userGoal.value || !userGoalAchieved.value || (userGoalAchieved.value && goalsV2Enabled.value))
	&& !hideCompletedGoalCard.value;
});
// <--- END DUPLICATE CODE --->

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
				variables: { year: LAST_YEAR_KEY },
				fetchPolicy: 'network-only',
			}),
			apollo.query({
				query: userAchievementProgressQuery,
				variables: { year: CURRENT_YEAR },
				fetchPolicy: 'network-only',
			}),
		]);

		// Populate from myKivaQuery
		const myData = myKivaResult.data;
		userInfo.value = myData.my ?? {};
		lender.value = {
			...(myData.my?.lender ?? {}),
			public: myData.my?.userAccount?.public ?? false,
			inviterName: myData.my?.userAccount?.inviterName ?? null,
		};
		loans.value = myData.my?.loans?.values ?? [];
		totalLoans.value = myData.my?.loans?.totalCount ?? 0;
		transactions.value = myData.my?.transactions?.values ?? [];
		latestLoan.value = myData.my?.latestLoan?.values?.[0]?.loan ? {
			...myData.my.latestLoan.values[0].loan,
			amount: myData.my.latestLoan.values[0]?.amount || null,
			...(myData.my?.latestLoan?.values?.length > 1
				? { otherLoans: myData.my.latestLoan.values.slice(1) }
				: {}),
		} : null;

		// Build regionsData from lendingStatsQuery
		const lendingStatsData = lendingStatsResult.data;
		const countryFacets = lendingStatsData.lend?.countryFacets ?? [];
		const countriesLentTo = lendingStatsData.my?.lendingStats?.countriesLentTo ?? [];
		const regionCounts = new Map();
		const regionCountries = new Map();
		countryFacets.forEach(facet => {
			const region = facet.country?.region;
			const isoCode = facet.country?.isoCode;
			if (region) {
				regionCounts.set(region, (regionCounts.get(region) || 0) + (facet.count || 0));
				if (isoCode) {
					const current = regionCountries.get(region) || [];
					regionCountries.set(region, [...current, isoCode]);
				}
			}
		});
		regionsData.value = [...regionCounts.keys()].map(region => ({
			name: region,
			hasLoans: countriesLentTo.some(item => item?.region === region),
			count: regionCounts.get(region) || 0,
			countries: regionCountries.get(region) || [],
		}));

		// Settings flags
		const goalsSettingKey = `general.${THANK_YOU_PAGE_GOALS_ENABLE_KEY}.value`;
		goalsEntrypointEnable.value = readBoolSetting(myData, goalsSettingKey) ?? false;
		const nextStepsSettingKey = `general.${POST_LENDING_NEXT_STEPS_KEY}.value`;
		postLendingNextStepsEnable.value = readBoolSetting(myData, nextStepsSettingKey) ?? false;

		// Contentful
		heroSlides.value = slidesResult.data.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
		heroContentfulData.value = contentfulChallengeResult.data.contentful?.entries?.items ?? [];

		// Achievements
		heroTieredAchievements.value = lastYearAchievementsResult.data
			.userAchievementProgress?.tieredLendingAchievements ?? [];
		currentYearTieredAchievements.value = currentYearAchievementsResult.data
			.userAchievementProgress?.tieredLendingAchievements ?? [];

		// Experiments
		initializeExperiment(
			cookieStore,
			apollo,
			route,
			NEXT_STEPS_EXP_KEY,
			version => { isNextStepsExpEnabled.value = version === 'b'; },
			$kvTrackEvent,
			'EXP-MP-1984-Sept2025',
		);

		// Post-lending next steps cookie
		if (checkPostLendingCardCookie(cookieStore)) {
			showPostLendingNextStepsCards.value = true;
			removePostLendingCardCookie(cookieStore);
		}

		// Load goal data with fresh progress
		if (isNextStepsExpEnabled.value) {
			const recentTransactionLoans = getRecentTransactionLoans(transactions.value);
			await loadGoalData({
				year: CURRENT_YEAR,
				yearlyProgress: goalsV2Enabled.value,
				freshProgressLoans: recentTransactionLoans,
				tieredAchievements: currentYearTieredAchievements.value,
				transactions: transactions.value,
			});
			await checkCompletedGoal({ category: 'portfolio' });
		}
	} catch (error) {
		logReadQueryError(error, 'MyKivaNextStepsPageContent mounted');
	}
});
</script>

<style lang="postcss" scoped>
.stats-wrapper, .card-container {
	height: auto;

	@screen md {
		height: 336px;
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

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full;
}

.carousel :deep(.kv-carousel__controls) {
	@apply md:tw-hidden;
}

.carousel-spacing :deep(.kv-carousel) {
	@apply tw-pt-0 md:tw-pt-6 lg:tw-pt-0;
}

.next-steps-link {
	@apply tw-flex tw-items-end md:tw-items-center tw-justify-between tw-mb-8 tw-gap-1;
}
</style>
