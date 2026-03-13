<template>
	<MyKivaContainer class="page-container">
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
			v-if="isPostLendingTopVisible"
			class="tw-grid tw-grid-cols-1 tw-gap-4"
		>
			<MyKivaCardGrid
				:items="postLendingTopItems"
				carousel-only
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

			<MyKivaCardGrid
				:items="postLendingBeyondLoanItems"
				grid-cols-class="md:tw-grid-cols-2 lg:tw-grid-cols-3"
			/>

			<div
				v-if="isPostLendingTopVisible"
			>
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
		</div>

		<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
			Continue with your lifetime achievements
		</h3>

		<MyKivaCardGrid
			:items="achievementCardItems"
			grid-cols-class="md:tw-grid-cols-2 lg:tw-grid-cols-3"
		/>

		<div
			v-if="(!showPostLendingNextStepsCards || !postLendingNextStepsEnable)"
		>
			<h3 class="tw-text-primary tw-mt-4 tw-mb-2">
				Build impact beyond your loan
			</h3>

			<MyKivaCardGrid
				:items="beyondLoanCardItems"
				grid-cols-class="md:tw-grid-cols-2 lg:tw-grid-cols-3"
			/>
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
import MyKivaCardGrid from '#src/components/MyKiva/MyKivaCardGrid';

import useBadgeData from '#src/composables/useBadgeData';
import { isNonBadgeSlide } from '#src/util/achievementUtils';
import {
	buildAchievementSlides,
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	handlePrimaryCtaClick as handlePrimaryCtaClickUtil,
	handleSecondaryCtaClick as handleSecondaryCtaClickUtil,
} from '#src/util/myKiva/myKivaJourneyCardUtils';
import {
	getSlideTitle,
	getSlideSubTitle,
	getSlidePrimaryCtaText,
	getSlidePrimaryCtaVariant,
	getSlideSecondaryCtaText,
	isSlideTitleFontSans,
	getSlideTitleColor,
	getSlideBackgroundImg,
} from '#src/util/myKiva/myKivaContentfulUtils';
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

// Build card item for MyKivaCardGrid from a contentful slide
const buildSlideCardItem = slide => {
	const isNonBadge = isNonBadgeSlide(slide);
	return {
		key: slide.badgeKey,
		component: MyKivaCard,
		props: {
			class: 'card-container tw-w-full tw-h-full',
			bgImage: getSlideBackgroundImg(slide, isNonBadge, false),
			isBgTopAligned: isNonBadge,
			hasGradient: !isNonBadge,
			title: getSlideTitle(slide),
			subtitle: getSlideSubTitle(slide, isNonBadge),
			isBlackSubtitle: isNonBadge,
			secondaryCtaText: getSlideSecondaryCtaText(slide),
			primaryCtaText: getSlidePrimaryCtaText(slide),
			primaryCtaVariant: getSlidePrimaryCtaVariant(slide),
			isFullWidthPrimaryCta: isNonBadge,
			isTitleFontSans: isSlideTitleFontSans(slide),
			titleColor: getSlideTitleColor(slide, isNonBadge),
		},
		events: {
			'primary-cta-clicked': () => handlePrimaryCtaClick(slide),
			'secondary-cta-clicked': () => handleSecondaryCtaClick(slide),
		},
	};
};

// Card items for post-lending top row (GoalCard + EmailMarketing + LatestLoan)
const postLendingTopItems = computed(() => {
	const items = [];

	if (shouldShowGoalCard.value) {
		items.push({
			key: 'goal-card',
			component: NextYearGoalCard,
			props: {
				goalProgress: goalProgress.value,
				heroSlides: props.heroSlides,
				loading: goalProgressLoading.value,
				userGoal: userGoal.value,
				prevYearLoans: womenLoansLastYear.value,
				hideGoalCard: hideCompletedGoalCard.value,
			},
			events: {
				'open-goal-modal': () => openGoalModal(),
			},
		});
	}

	if (shouldShowEmailMarketingCard.value || acceptedEmailMarketingUpdates.value) {
		items.push({
			key: 'email-updates',
			component: MyKivaEmailUpdatesTransition,
			props: {
				accepted: acceptedEmailMarketingUpdates.value,
				loans: props.loans,
				latestLoan: props.latestLoan,
			},
			events: {
				'accept-email-updates': () => { acceptedEmailMarketingUpdates.value = true; },
			},
		});
	}

	if (showLatestLoan.value) {
		items.push({
			key: 'latest-loan',
			component: MyKivaLatestLoanCard,
			props: { loan: props.latestLoan },
			events: {
				'open-impact-insight-modal': () => { showImpactInsightsModal.value = true; },
			},
		});
	}

	return items;
});

// Card items for post-lending "Build impact beyond your loan" (SurveyCard + nonBadgesSlides)
const postLendingBeyondLoanItems = computed(() => {
	const items = [];

	if (showSurveyCard.value) {
		items.push({
			key: 'survey',
			component: MyKivaSurveyCard,
		});
	}

	nonBadgesSlides.value.forEach(slide => {
		items.push(buildSlideCardItem(slide));
	});

	return items;
});

// Card items for "Continue with your lifetime achievements"
const achievementCardItems = computed(() => achievementSlides.value.map(buildSlideCardItem));

// Whether the post-lending top row is visible (GoalCard, EmailMarketing, LatestLoan)
const isPostLendingTopVisible = computed(
	() => shouldShowEmailMarketingCard.value || showLatestLoan.value,
);

// Card items for non-post-lending "Build impact beyond your loan"
const beyondLoanCardItems = computed(() => {
	const items = [];

	if (!isPostLendingTopVisible.value
		&& (shouldShowEmailMarketingCard.value || acceptedEmailMarketingUpdates.value)) {
		items.push({
			key: 'email-updates',
			component: MyKivaEmailUpdatesTransition,
			props: {
				accepted: acceptedEmailMarketingUpdates.value,
				loans: props.loans,
				latestLoan: props.latestLoan,
			},
			events: {
				'accept-email-updates': () => { acceptedEmailMarketingUpdates.value = true; },
			},
		});
	}

	if (!isPostLendingTopVisible.value && showLatestLoan.value) {
		items.push({
			key: 'latest-loan',
			component: MyKivaLatestLoanCard,
			props: { loan: props.latestLoan },
			events: {
				'open-impact-insight-modal': () => { showImpactInsightsModal.value = true; },
			},
		});
	}

	if (showSurveyCard.value) {
		items.push({
			key: 'survey',
			component: MyKivaSurveyCard,
		});
	}

	nonBadgesSlides.value.forEach(slide => {
		items.push(buildSlideCardItem(slide));
	});

	return items;
});

// Navigation
const goToDashboard = position => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard', position);
	router.push('/mykiva');
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

:deep(.card-container) {
	width: 100%;
	height: auto;

	@screen md {
		height: 399px;
	}

	@apply md:tw-w-auto;
}

:deep(.kiva-card) h2 {
	font-size: 22px !important;
}

.region-image {
	height: 145px;

	@screen md {
		height: 191px;
	}
}

.region-section {
	.card-container:first-child {
		@apply tw-mb-2 md:tw-mb-0;
	}

	@screen md {
		grid-template-columns: minmax(321px, 1fr) 2fr;
	}
}
</style>
