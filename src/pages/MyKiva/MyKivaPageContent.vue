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
				:user-info="userInfo"
				:user-in-homepage="userInHomepage"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				:slides-number="3"
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
					v-if="visibleUpdates.length"
					:updates="visibleUpdates"
					:lender="lender"
					:total-updates="totalUpdates"
					@load-more-updates="loadMoreUpdates"
					:has-more="hasMoreUpdates"
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
import userRepaymentTransactionsQuery from '#src/graphql/query/userRepaymentTransactions.graphql';

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

const UPDATES_BATCH_SIZE = 4;

const isEarnedSectionModal = ref(false);
const repaymentCards = ref([]);
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
const transactions = ref([]);
const moreWaysToHelpSlides = ref([]);
const updatesShown = ref(UPDATES_BATCH_SIZE);

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

const getFormattedTransactions = () => {
	return transactions.value.map(trx => {
		const manifest = trx?.receipt?.manifest ?? null;
		const total = manifest?.totals?.itemTotal || 0;
		const newBalance = manifest?.totals?.kivaCreditRemaining;

		const loans = manifest?.items?.values?.filter(i => i?.basketItemType === 'loan_reservation');
		const kivaCards = manifest?.items?.values?.filter(i => i?.basketItemType === 'kiva_card');
		const donations = manifest?.items?.values?.filter(i => i?.basketItemType === 'donation');

		const formatItem = (count, singular) => {
			if (!count) return null;
			const plural = `${singular}s`;
			return `${count} ${count === 1 ? singular : plural}`;
		};

		const items = [
			formatItem(loans?.length, 'loan'),
			formatItem(kivaCards?.length, 'Kiva card'),
			formatItem(donations?.length, 'donation')
		].filter(Boolean);

		let cartItems = '';
		if (items.length === 1) {
			cartItems = `${items[0]}`;
		} else if (items.length === 2) {
			cartItems = items.join(' and ');
		} else if (items.length > 2) {
			cartItems = `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
		}

		return {
			id: Number(manifest?.id) ?? null,
			receipt: trx?.receipt?.manifest ?? null,
			isTransaction: true,
			date: manifest?.transactionTime,
			// eslint-disable-next-line max-len
			subject: `Your transaction was successfully completed! You contributed a total of $${total} and your new balance is $${newBalance}. This included ${cartItems}.`
		};
	});
};

const formatRepaymentCards = repayments => {
	if (repayments.length === 0) return [];

	// 1-5 repayments: show each as a separate card
	if (repayments.length <= 5) {
		return repayments.map((trx, idx) => ({
			id: `repayment-${trx.effectiveTime}-${idx}`,
			isRepayment: true,
			isTransaction: true,
			status: 'repayment',
			date: trx.effectiveTime,
			subject: 'Success!',
			// eslint-disable-next-line max-len
			body: `${trx.loan?.name || 'A borrower'} from ${trx.loan?.geocode?.country?.name || 'Unknown country'} repaid you $${trx.amount}! Your new balance is now $${userBalance.value}. Don't let it go unused - `,
			amount: trx.amount,
			loan: trx.loan,
			image: trx.loan?.image?.url || null,
		}));
	}

	// 6 or more repayments: show a single summary card with the first 3 images
	const totalAmount = repayments.reduce((sum, trx) => sum + Number(trx.amount), 0);
	const uniqueBorrowers = new Set(repayments.map(trx => trx.loan?.name).filter(Boolean));
	const uniqueCountries = new Set(repayments.map(trx => trx.loan?.geocode?.country?.name).filter(Boolean));
	const firstThreeImages = repayments.slice(0, 3).map(trx => ({
		hash: trx.loan?.image?.hash,
		alt: trx.loan?.name || 'Borrower',
		defaultImage: { width: 80, faceZoom: 50 },
		images: [
			{ width: 80, faceZoom: 50, viewSize: 1024 },
			{ width: 72, faceZoom: 50, viewSize: 734 },
			{ width: 64, faceZoom: 50 }
		]
	}));

	return [{
		id: `repayment-summary-${repayments[0]?.effectiveTime || Date.now()}`,
		isRepayment: true,
		isTransaction: true,
		status: 'repayment-summary',
		date: repayments[0]?.effectiveTime || new Date().toISOString(),
		title: `${uniqueBorrowers.size} Borrowers`,
		subject: 'Success!',
		// eslint-disable-next-line max-len
		body: `${uniqueBorrowers.size} people from ${uniqueCountries.size} countries repaid you $${totalAmount.toFixed(2)}! Your new balance is now $${userBalance.value}. Don't let it go unused - relend it now.`,
		amount: totalAmount,
		loan: null,
		image: null,
		repaymentImages: firstThreeImages,
	}];
};

const fetchUserUpdates = loadMore => {
	const oneMonthBefore = new Date();
	oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
	const timestamp = oneMonthBefore.getTime();

	apollo.query({
		query: userUpdatesQuery,
		variables: {
			limit: updatesLimit.value,
			offset: updatesOffset.value,
			trxLimit: updatesLimit.value,
			trxOffset: updatesOffset.value,
			since: timestamp,
		}
	})
		.then(result => {
			transactions.value = result.data?.recentCheckouts?.values?.filter(t => t?.receipt?.manifest);
			totalUpdates.value = transactions.value.length + (result.data?.my?.updates?.totalCount ?? 0);

			const formattedTransactions = getFormattedTransactions();
			const updates = (result.data?.my?.updates?.values ?? []).concat(formattedTransactions);

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
	updatesShown.value += UPDATES_BATCH_SIZE;
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

// Add this function to fetch all repayment transactions for the last month
const fetchRepaymentTransactions = async () => {
	const now = new Date();
	const oneMonthBefore = new Date();
	oneMonthBefore.setMonth(now.getMonth() - 1);

	const result = await apollo.query({
		query: userRepaymentTransactionsQuery,
		variables: {
			limit: 100,
			offset: 0,
		},
	});

	const repayments = result.data?.my?.transactions?.values ?? [];

	// Only keep repayments from the last month and of type "loan_repayment"
	const recentRepayments = repayments.filter(trx => {
		const trxDate = new Date(trx.effectiveTime);
		const isRepayment = trx.type === 'loan_repayment';
		const inLastMonth = trxDate >= oneMonthBefore && trxDate <= now;
		return isRepayment && inLastMonth;
	});

	return recentRepayments;
};

const mergedUpdates = computed(() => {
	// repaymentCards and loanUpdates are both arrays of formatted objects
	const all = [...repaymentCards.value, ...loanUpdates.value];
	// Sort by date descending (most recent first)
	return all.sort((a, b) => new Date(b.date) - new Date(a.date));
});

const visibleUpdates = computed(() => mergedUpdates.value.slice(0, updatesShown.value).map(update => ({
	...update,
})));

const hasMoreUpdates = computed(() => mergedUpdates.value.length > updatesShown.value);

onMounted(async () => {
	$kvTrackEvent('portfolio', 'view', 'New My Kiva');
	fireHotJarEvent('my_kiva_viewed');
	fetchUserUpdates();

	const repayments = await fetchRepaymentTransactions();
	// TEMP: Only use the first 5 repayments to test the 1-5 logic
	const repaymentsForTest = repayments; // .slice(0, 5);
	repaymentCards.value = formatRepaymentCards(repaymentsForTest);

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
