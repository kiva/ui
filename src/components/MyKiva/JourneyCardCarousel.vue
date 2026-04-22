<template>
	<div class="journey-card-carousel">
		<KvCarousel
			:key="`${dynamicOrderedSlides.length}-${shouldDisableDrag}`"
			:embla-options="emblaOptions"
			:controls-top-right="controlsTopRight"
			:slide-max-width="singleSlideWidth"
			:multiple-slides-visible="true"
			class="tw-w-full"
			@change="handleChange"
		>
			<template
				v-for="(slide, index) in dynamicOrderedSlides"
				#[`slide${index}`]
				:key="index"
			>
				<NextYearGoalCard
					v-if="showGoalCard(index)"
					:goal-progress="goalProgress"
					:loading="goalProgressLoading"
					:user-goal="userGoal"
					:prev-year-loans="womenLoansLastYear"
					:hide-goal-card="hideGoalCard"
					:goal-editing-enable="goalEditingEnable"
					:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
					@open-goal-modal="$emit('open-goal-modal', $event)"
				/>
				<MyKivaSurveyCard
					v-else-if="slide?.isSurveyCard"
				/>
				<MyKivaEmailUpdatesTransition
					v-else-if="isEmailUpdatesSlide(slide)"
					:accepted="acceptedEmailMarketingUpdates"
					:loans="loans"
					:latest-loan="latestLoan"
					@accept-email-updates="acceptedEmailMarketingUpdates = true"
				/>
				<MyKivaLatestLoanCard
					v-else-if="slide?.isLatestLoan"
					:loan="latestLoan"
					@open-impact-insight-modal="$emit('open-impact-insight-modal')"
				/>
				<AlmostFundedNextStep
					v-else-if="slide?.isAlmostFunded"
					class="tw-h-full"
				/>
				<CountryCollectingNextStep
					v-else-if="slide?.isCountryCollecting"
					class="tw-h-full"
					:regions-data="regionsData"
				/>
				<MyKivaCard
					v-else-if="isCustomCard(slide)"
					class="kiva-card"
					:title="slide.title"
					:show-cta-icon="true"
					:primary-cta-text="slide.ctaText"
					primary-cta-variant="primary"
					:is-full-width-primary-cta="true"
					:is-title-font-sans="true"
					title-color="tw-text-action-highlight"
					:loans="slide.loans"
					:tag-text="slide.tagText"
					:show-tag-icon="slide.showTagIcon"
					@primary-cta-clicked="slide.primaryCta"
				/>
				<MyKivaCard
					v-else
					class="tw-w-full tw-h-full"
					:bg-image="getSlideBackgroundImg(slide, isNonBadgeSlide(slide), isMobile)"
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
					@primary-cta-clicked="onPrimaryCtaClick(slide)"
					@secondary-cta-clicked="onSecondaryCtaClick(slide)"
				/>
			</template>
		</KvCarousel>
		<MyKivaSharingModal
			:lender="lender"
			:is-visible="isSharingModalVisible"
			@close-modal="isSharingModalVisible = false"
		/>
	</div>
</template>

<script setup>
import { parseISO, differenceInDays } from 'date-fns';
import {
	computed,
	ref,
	inject,
} from 'vue';
import { useRouter } from 'vue-router';
import useBreakpoints from '#src/composables/useBreakpoints';
import { isNonBadgeSlide } from '#src/util/achievementUtils';
import { TRANSACTION_LOANS_KEY } from '#src/util/myKivaUtils';
import useBadgeData, { getJourneysByLoan } from '#src/composables/useBadgeData';
import { KvCarousel } from '@kiva/kv-components';
import MyKivaSharingModal from '#src/components/MyKiva/MyKivaSharingModal';
import MyKivaCard from '#src/components/MyKiva/MyKivaCard';
import NextYearGoalCard from '#src/components/MyKiva/NextYearGoalCard';
import useGoalData from '#src/composables/useGoalData';
import MyKivaEmailUpdatesTransition from '#src/components/MyKiva/MyKivaEmailUpdatesTransition';
import MyKivaLatestLoanCard from '#src/components/MyKiva/MyKivaLatestLoanCard';
import MyKivaSurveyCard from '#src/components/MyKiva/MyKivaSurveyCard';
import AlmostFundedNextStep from '#src/components/MyKiva/AlmostFundedNextStep';
import CountryCollectingNextStep from '#src/components/MyKiva/CountryCollectingNextStep';
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
import {
	buildAchievementSlides,
	checkShouldShowEmailMarketing,
	checkShowLatestLoan,
	checkShowSurveyCard,
	filterNonBadgesSlides,
	handlePrimaryCtaClick,
	handleSecondaryCtaClick,
} from '#src/util/myKiva/myKivaJourneyCardUtils';

const TRANSACTION_DAYS_LIMIT = 30;

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getActiveTierData,
	isTieredAchievementComplete,
} = useBadgeData(apollo);

const { getCategoryLoansLastYear } = useGoalData();

const emit = defineEmits(['update-journey', 'open-goal-modal', 'open-impact-insight-modal']);

const props = defineProps({
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	lender: {
		type: Object,
		default: () => ({})
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	slides: {
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
	slidesNumber: {
		type: Number,
		default: 0,
	},
	heroSlides: {
		type: Array,
		default: () => ([]),
	},
	inLendingStats: {
		type: Boolean,
		default: false,
	},
	userGoal: {
		type: Object,
		default: () => ({}),
	},
	userGoalAchieved: {
		type: Boolean,
		default: false,
	},
	disableDrag: {
		type: Boolean,
		default: false,
	},
	goalProgress: {
		type: Number,
		default: 0,
	},
	goalProgressLoading: {
		type: Boolean,
		default: true,
	},
	controlsTopRight: {
		type: Boolean,
		default: false,
	},
	hideGoalCard: {
		type: Boolean,
		default: false
	},
	latestLoan: {
		type: Object,
		default: null
	},
	showPostLendingNextStepsCards: {
		type: Boolean,
		default: false
	},
	goalEditingEnable: {
		type: Boolean,
		default: false
	},
	enableSlideLimit: {
		type: Boolean,
		default: true
	},
	showNonBadgesSlides: {
		type: Boolean,
		default: true
	},
	showSurveySlide: {
		type: Boolean,
		default: true
	},
	isGoalTileExperimentEnabled: {
		type: Boolean,
		default: false
	},
	showLendingNextStepsCards: {
		type: Boolean,
		default: false
	},
	regionsData: {
		type: Array,
		default: () => [],
	},
	preBuiltAchievementSlides: {
		type: Array,
		default: null,
	},
});

const { isMobile, isMedium, isLarge } = useBreakpoints();
const currentIndex = ref(0);
const isSharingModalVisible = ref(false);
const acceptedEmailMarketingUpdates = ref(false);

const userOptedIn = computed(() => props.userInfo?.communicationSettings?.lenderNews
	&& props.userInfo?.communicationSettings?.loanUpdates);

const shouldShowEmailMarketingCard = computed(
	() => props.inLendingStats && checkShouldShowEmailMarketing({
		showPostLendingNextStepsCards: props.showPostLendingNextStepsCards,
		latestLoan: props.latestLoan,
		hasMailUpdatesOptOut: !userOptedIn.value,
		loansCount: props.loans.length,
	})
);
const isEmailUpdatesSlide = slide => slide?.isEmailUpdates === true;

const showLatestLoan = computed(() => checkShowLatestLoan({
	showPostLendingNextStepsCards: props.showPostLendingNextStepsCards,
	latestLoan: props.latestLoan,
}));

const showSurveyCard = computed(() => props.showSurveySlide && checkShowSurveyCard({
	showPostLendingNextStepsCards: props.showPostLendingNextStepsCards,
	userInfo: props.userInfo,
}));

const nonBadgesSlides = computed(() => filterNonBadgesSlides(props.slides));

const shouldShowGoalCard = computed(() => {
	if (!props.inLendingStats) return false;

	return (!props.userGoal || !props.userGoalAchieved || props.userGoalAchieved) && !props.hideGoalCard;
});

const dynamicOrderedSlides = computed(() => {
	let sortedSlides;

	if (props.preBuiltAchievementSlides) {
		sortedSlides = [...props.preBuiltAchievementSlides];
	} else {
		sortedSlides = buildAchievementSlides({
			badgesData: props.heroBadgeData,
			slides: props.slides,
			getActiveTierData,
			isTieredAchievementComplete,
			includeMilestoneDiff: true,
			sortByMilestoneDiff: true,
			userGoalCategory: props.userGoal?.category,
		});

		const transactionLoans = props.userInfo?.transactions?.values?.filter(t => {
			const diffInDays = differenceInDays(new Date(), parseISO(t.createTime));
			return t.type === TRANSACTION_LOANS_KEY && diffInDays <= TRANSACTION_DAYS_LIMIT;
		});

		if (transactionLoans?.length) {
			const loanJourneys = getJourneysByLoan(transactionLoans[0]?.loan ?? {});
			if (loanJourneys.length) {
				sortedSlides.sort((a, b) => loanJourneys.indexOf(b.badgeKey) - loanJourneys.indexOf(a.badgeKey)); // eslint-disable-line max-len
			}
		}
	}

	if (props.showNonBadgesSlides && nonBadgesSlides.value.length > 0) {
		sortedSlides = [
			...sortedSlides,
			...nonBadgesSlides.value,
		];
	}

	const firstTwoAchievementCards = sortedSlides.slice(0, 2);
	const remainingSlides = sortedSlides.slice(2);

	// Build the priority card slots for post-lending experience
	const priorityCards = [];

	// Goal card (set or in-progress goal)
	if (shouldShowGoalCard.value) {
		priorityCards.push({}); // Empty object placeholder for goal card component
	}

	priorityCards.push(...firstTwoAchievementCards);

	// Almost funded and country collecting cards for lending next steps
	if (props.showLendingNextStepsCards) {
		priorityCards.push({ isAlmostFunded: true });
		if (props.regionsData.some(r => !r.hasLoans)) {
			priorityCards.push({ isCountryCollecting: true });
		}
	}

	// Email marketing card if user isn't opted in, otherwise Latest Loan card
	if (shouldShowEmailMarketingCard.value) {
		priorityCards.push({ isEmailUpdates: true });
	} else if (showLatestLoan.value) {
		priorityCards.push({ isLatestLoan: true });
	}

	// Latest Loan card (if email marketing card is also shown)
	if (shouldShowEmailMarketingCard.value && showLatestLoan.value) {
		priorityCards.push({ isLatestLoan: true });
	}

	// Survey card: shown if no goal card (goal completed) OR user is opted into email marketing
	if (showSurveyCard.value && (!shouldShowGoalCard.value || !shouldShowEmailMarketingCard.value)) {
		priorityCards.push({ isSurveyCard: true });
	}

	sortedSlides = [...priorityCards, ...remainingSlides];

	if (props.slidesNumber) {
		sortedSlides = sortedSlides.slice(0, props.slidesNumber);
	}

	return sortedSlides;
});

const onPrimaryCtaClick = slide => {
	handlePrimaryCtaClick({
		slide,
		trackEvent: $kvTrackEvent,
		navigate: url => router.push(url),
		modalHandlers: {
			openSharingModal: () => { isSharingModalVisible.value = true; },
		},
	});
};

const onSecondaryCtaClick = slide => {
	handleSecondaryCtaClick({
		slide,
		trackEvent: $kvTrackEvent,
		navigate: url => router.push(url),
		modalHandlers: {
			updateJourney: achievementKey => emit('update-journey', achievementKey),
		},
	});
};

const allSlidesVisible = computed(() => {
	const count = dynamicOrderedSlides.value.length;
	if (isLarge.value) return count <= 3;
	if (isMedium.value) return count <= 1;
	return false;
});

const shouldDisableDrag = computed(() => props.disableDrag || allSlidesVisible.value);

const emblaOptions = computed(() => ({
	loop: false,
	align: 'start',
	...(shouldDisableDrag.value && { watchDrag: false }),
}));

// CSS var keeps the slide width correct during SSR/hydration before useBreakpoints resolves.
const singleSlideWidth = 'var(--journey-slide-max-width)';

const handleChange = interaction => {
	const direction = currentIndex.value > interaction.value ? 'prev' : 'next';
	currentIndex.value = interaction.value;

	$kvTrackEvent(
		'portfolio',
		'click',
		`${direction}-step-carousel`,
	);
};

const isCustomCard = slide => !!slide?.isCustomCard;

const showGoalCard = idx => {
	if (!props.inLendingStats) return false;

	return idx === 0 && shouldShowGoalCard.value;
};

const womenLoansLastYear = computed(() => {
	return getCategoryLoansLastYear(props.heroTieredAchievements);
});
</script>

<style lang="postcss" scoped>
.journey-card-carousel {
	--journey-slide-max-width: 90%;

	@screen md {
		--journey-slide-max-width: 336px;
	}

	@screen lg {
		--journey-slide-max-width: calc((100% - 64px) / 3);
	}
}

.kiva-card :deep(h2) {
	font-size: 22px !important;
}
</style>
