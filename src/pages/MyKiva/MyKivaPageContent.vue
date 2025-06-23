<template>
	<KvAtbModalContainer
		:added-loan="addedLoan"
	/>
	<MyKivaNavigation
		:visible="showNavigation"
		:user-info="userInfo"
		:user-balance="userBalance"
		@navigation-closed="showNavigation = false"
	/>
	<MyKivaHero
		v-if="!userInHomepage"
		@show-navigation="handleShowNavigation"
	/>
	<MyKivaContainer>
		<h3 class="tw-mt-4">
			<u>{{ userInfo?.userAccount?.firstName }}'s</u> impact overview
		</h3>
		<MyKivaStats
			:user-balance="userBalance"
			:lending-stats="lendingStats"
			class="tw-mt-2"
		/>
		<MyKivaProfile
			:lender="lender"
			:user-info="userInfo"
			:user-in-homepage="userInHomepage"
			class="tw-mt-4"
		/>
		<section v-if="isHeroEnabled" class="tw-mt-2">
			<JourneyCardCarousel
				:slides="heroSlides"
				:lender="lender"
				:user-in-homepage="userInHomepage"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				@update-journey="updateJourney"
			/>
		</section>
		<section v-if="!allBadgesCompleted && !isHeroEnabled">
			<BadgeTile
				:user-info="userInfo"
				:badges-data="badgeData"
				@badge-clicked="handleBadgeTileClicked"
			/>
		</section>
		<section class="tw-my-4">
			<div
				:class="[
					'tw-flex',
					{ 'tw-flex-col': !showSingleArray },
					{ 'tw-flex-col lg:tw-flex-row lg:tw-gap-3': showSingleArray }
				]"
			>
				<MyKivaBorrowerCarousel
					:loans="loans"
					:total-loans="totalLoans"
				/>
				<JournalUpdatesCarousel
					:updates="loanUpdates"
					:lender="lender"
					:total-updates="totalUpdates"
					@load-more-updates="loadMoreUpdates"
				/>
			</div>
		</section>
		<section class="tw-my-4">
			<LendingCategorySection
				id="recommended-loans"
				:title="recommendeLoansTitle"
				:loans="recommendedLoans"
				:user-balance="userBalance"
				@add-to-basket="trackCategory($event, 'recommended')"
				@show-cart-modal="handleCartModal"
			/>
		</section>
		<section class="tw-mb-4">
			<h3>My achievements</h3>
			<BadgesSection
				:badge-data="badgeData"
				:selected-journey="selectedJourney"
				@badge-clicked="handleBadgeSectionClicked"
				class="tw-mt-2"
			/>
			<JourneySideSheet
				v-if="showSideSheet"
				:visible="showSideSheet"
				:selected-badge-data="selectedBadgeData"
				:loans="loans"
				:all-badges-completed="allBadgesCompleted"
				:is-selected-journey-complete="isSelectedJourneyComplete"
				@badge-journey-level-clicked="handleBadgeJourneyLevelClicked"
				@continue-journey-clicked="handleContinueJourneyClicked"
				@sidesheet-closed="handleComponentClosed"
			/>
		</section>
		<section v-if="moreWaysToHelpSlides.length" class="tw-my-4">
			<h3>More ways to help</h3>
			<JourneyCardCarousel
				:slides="moreWaysToHelpSlides"
				:lender="lender"
				:user-in-homepage="userInHomepage"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				@update-journey="updateJourney"
				class="tw-mt-2"
			/>
		</section>
	</MyKivaContainer>
</template>

<script setup>
import { useRouter } from 'vue-router';
import logReadQueryError from '#src/util/logReadQueryError';
import { runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import userUpdatesQuery from '#src/graphql/query/userUpdates.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';
import BadgeTile from '#src/components/MyKiva/BadgeTile';
import useBadgeData from '#src/composables/useBadgeData';
import { STATE_JOURNEY, STATE_EARNED } from '#src/composables/useBadgeModal';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection';
import {
	ref,
	computed,
	inject,
	onMounted,
} from 'vue';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import { defaultBadges } from '#src/util/achievementUtils';
import JourneySideSheet from '#src/components/Badges/JourneySideSheet';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';

const CONTENTFUL_MORE_WAYS_KEY = 'my-kiva-more-ways-carousel';

const { getBadgeWithVisibleTiers } = useBadgeData();

const router = useRouter();
const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const {
	fetchAchievementData,
	fetchContentfulData,
	badgeData,
	getLoanFindingUrl,
} = useBadgeData(apollo);

const props = defineProps({
	isHeroEnabled: {
		type: Boolean,
		default: false,
	},
	userInfo: {
		type: Object,
		default: () => ({}),
	},
	loans: {
		type: Array,
		default: () => ([]),
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	lender: {
		type: Object,
		default: null,
	},
	heroSlides: {
		type: Array,
		default: () => ([]),
	},
	heroContentfulData: {
		type: Array,
		default: () => ([]),
	},
	heroTieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	lendingStats: {
		type: Object,
		default: () => ({}),
	},
});

const isEarnedSectionModal = ref(false);
const loanUpdates = ref([]);
const selectedBadgeData = ref();
const selectedJourney = ref('');
const showNavigation = ref(false);
const showSideSheet = ref(false);
const state = ref(STATE_JOURNEY);
const totalUpdates = ref(0);
const updatesLimit = ref(3);
const updatesOffset = ref(0);
const hideBottomGradient = ref(false);
const recommendedLoans = ref(Array(6).fill({ id: 0 }));
const addedLoan = ref(null);
const moreWaysToHelpSlides = ref([]);

const userBalance = computed(() => props.userInfo.userAccount?.balance ?? '');

const allBadgesCompleted = computed(() => {
	const tieredBadges = badgeData.value?.filter(b => defaultBadges.includes(b?.id));
	return tieredBadges?.every(b => !b.achievementData?.tiers?.find(t => !t?.completedDate));
});

const recommendeLoansTitle = computed(() => {
	return props.loans.length < 1
		? 'Recommended for you'
		: 'Recommended for you based on your lending history';
});

const handleShowNavigation = () => {
	showNavigation.value = true;
	$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
};

const handleBadgeTileClicked = selectedTier => {
	router.push(getLoanFindingUrl(selectedTier.badge.id, router.currentRoute.value));
};

const handleBadgeSectionClicked = badge => {
	if (!badge.hasStarted) {
		router.push(getLoanFindingUrl(badge.id, router.currentRoute.value));
	} else {
		state.value = STATE_JOURNEY;
		selectedBadgeData.value = badge;
		isEarnedSectionModal.value = false;
		showSideSheet.value = true;
	}
};

const isSelectedJourneyComplete = computed(() => {
	return selectedBadgeData.value?.achievementData?.tiers?.length === selectedBadgeData.value?.level;
});

const handleComponentClosed = () => {
	selectedJourney.value = '';
	const queryParams = { ...router.currentRoute?.value?.query };
	if (queryParams.journey) {
		delete queryParams.journey;
		router.push({ ...router.currentRoute.value, query: queryParams });
	}
	selectedBadgeData.value = undefined;
	showSideSheet.value = false;
	hideBottomGradient.value = false;
};

const handleContinueJourneyClicked = () => {
	const badgeWithVisibleTiers = getBadgeWithVisibleTiers(selectedBadgeData.value);
	const { id, challengeName } = badgeWithVisibleTiers;
	let eventLabel = `${challengeName} Continue Journey Clicked`;
	if (allBadgesCompleted.value) {
		eventLabel = `${challengeName} See all of your impact stats`;
	}
	if (isSelectedJourneyComplete.value) {
		eventLabel = `${challengeName} See all`;
	}
	$kvTrackEvent(
		'portfolio',
		'click',
		eventLabel,
		challengeName,
	);

	if (allBadgesCompleted.value) {
		return router.push('/portfolio/lending-stats');
	}
	if (isSelectedJourneyComplete.value) {
		return handleComponentClosed();
	}
	router.push(getLoanFindingUrl(id, router.currentRoute.value));
};

const handleBadgeJourneyLevelClicked = payload => {
	const { id, challengeName, tier: clickedTier } = payload;

	$kvTrackEvent(
		'portfolio',
		'click',
		state.value === STATE_EARNED ? 'Already earned badge modal' : 'Earn a badge - within badge journey map modal',
		challengeName,
		clickedTier.level,
	);

	router.push(getLoanFindingUrl(id, router.currentRoute.value));
};

const fetchUserUpdates = loadMore => {
	apollo.query({
		query: userUpdatesQuery,
		variables: {
			limit: updatesLimit.value,
			offset: updatesOffset.value
		}
	})
		.then(result => {
			totalUpdates.value = result.data?.my?.updates?.totalCount ?? 0;
			const updates = result.data?.my?.updates?.values ?? [];
			if (loadMore) {
				loanUpdates.value = loanUpdates.value.concat(updates);
			} else {
				loanUpdates.value = updates;
			}
		}).catch(e => {
			logReadQueryError(e, 'MyKivaPage updatesQuery');
		});
};

const fetchRecommendedLoans = async () => {
	const userId = parseInt(props.userInfo?.id, 10) || null;

	runRecommendationsQuery(apollo, {
		userId,
		origin: 'web:my_kiva_page',
		limit: 15
	}).then(result => {
		recommendedLoans.value = result?.loans ?? [];
	}).catch(e => {
		logReadQueryError(e, 'MyKivaPage fetchRecommendedLoans');
	});
};

const loadMoreUpdates = () => {
	updatesOffset.value += updatesLimit.value;
	fetchUserUpdates(true);
};

const showSingleArray = computed(() => props.loans.length === 1 && loanUpdates.value.length === 1);

const updateJourney = journey => {
	selectedJourney.value = journey;
};

const userInHomepage = computed(() => {
	return router.currentRoute.value?.path === '/mykiva';
});

const trackCategory = ({ success }) => {
	if (success) $kvTrackEvent('loan-card', 'add-to-basket', 'recommended-my-kiva-page');
};

const handleCartModal = loan => {
	addedLoan.value = loan;
};

const fetchMoreWaysToHelpData = async () => {
	try {
		const moreWaysResult = await apollo.query({
			query: contentfulEntriesQuery,
			variables: {
				contentType: 'carousel',
				contentKey: CONTENTFUL_MORE_WAYS_KEY,
			}
		});

		moreWaysToHelpSlides.value = moreWaysResult.data?.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
	} catch (e) {
		logReadQueryError(e, 'MyKivaPage myKiva MoreWaysToHelpQuery');
	}
};

onMounted(async () => {
	$kvTrackEvent('portfolio', 'view', 'New My Kiva');
	fireHotJarEvent('my_kiva_viewed');
	fetchUserUpdates();
	fetchAchievementData(apollo);
	fetchContentfulData(apollo);
	fetchRecommendedLoans();
	fetchMoreWaysToHelpData();
});
</script>

<style lang="postcss" scoped>
:deep(#recommended-loans #customizedCarousel div:first-child div div div) {
	@apply !tw-rounded;
}

:deep(#recommended-loans #customizedCarousel div:first-child > div > div.loan-card-active-hover a picture) {
	@apply !tw-rounded-t;
}

:deep(#recommended-loans h2) {
	@apply !tw-text-h3 !tw-font-sans;
}

:deep(#recommended-loans > div) {
	@apply !tw-px-0;
}

:deep(#recommended-loans > div > div) {
	@apply !tw-px-0;
}

#recommended-loans :deep(.kv-carousel) {
	@apply !tw-w-full !tw-overflow-visible;
}

#recommended-loans :deep(.kv-carousel__controls) {
	@apply !tw-hidden md:!tw-flex !tw-justify-start !tw-mt-2;
}

#recommended-loans :deep(.kv-carousel__controls) div {
	@apply !tw-invisible !tw-mx-0 !tw-w-2;
}

#recommended-loans :deep(div:first-child) {
	@apply !tw-gap-2;
}
</style>
