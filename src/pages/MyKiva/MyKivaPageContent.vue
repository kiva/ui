<template>
	<KvAtbModalContainer :added-loan="addedLoan" />
	<MyKivaNavigation
		:visible="showNavigation"
		:user-info="userInfo"
		:user-balance="userBalance"
		@navigation-closed="showNavigation = false"
	/>
	<MyKivaHero v-if="!userInHomepage" @show-navigation="handleShowNavigation" />
	<MyKivaContainer>
		<h3 class="tw-mt-4">
			<u>{{ userInfo?.userAccount?.firstName }}'s</u> impact overview
		</h3>
		<MyKivaStats
			class="tw-mt-2"
			:user-balance="userBalance"
			:lending-stats="lendingStats"
		/>
		<MyKivaProfile
			class="tw-mt-4"
			:lender="lender"
			:user-info="userInfo"
			:user-in-homepage="userInHomepage"
		/>
		<section v-if="isHeroEnabled" class="tw-mt-2">
			<JourneyCardCarousel
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				:lender="lender"
				:slides-number="3"
				:slides="heroSlides"
				:user-in-homepage="userInHomepage"
				:user-info="userInfo"
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
					show-menu
				/>
				<JournalUpdatesCarousel
					v-if="!updatesLoading && mergedUpdates.length"
					:updates="mergedUpdates"
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
				:is-bp-modal-enabled="isBpModalEnabled"
				@add-to-basket="trackCategory($event, 'recommended')"
				@show-cart-modal="handleCartModal"
				@show-loan-details="showLoanDetails"
				@mouse-enter-loan-card="loadBPData"
			/>
		</section>
		<section class="tw-mb-4">
			<h3>My achievements</h3>
			<BadgesSection
				class="tw-mt-2"
				:badge-data="badgeData"
				:selected-journey="selectedJourney"
				@badge-clicked="handleBadgeSectionClicked"
			/>
			<JourneySideSheet
				v-if="showJourneySideSheet"
				:visible="showJourneySideSheet"
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
				class="tw-mt-2"
				:slides="moreWaysToHelpSlides"
				:lender="lender"
				:user-in-homepage="userInHomepage"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				@update-journey="updateJourney"
			/>
		</section>
		<BorrowerSideSheetWrapper
			v-if="isBpModalEnabled && showBPSideSheet"
			:basket-items="basketItems"
			:is-adding="isAdding"
			:kv-track-function="$kvTrackEvent"
			:selected-loan-id="selectedLoan?.id"
			:show-back-button="false"
			:show-go-to-link="true"
			:show-headline-border="true"
			:show-side-sheet="showBPSideSheet"
			:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
			@add-to-basket="addToBasket"
			@go-to-link="goToLink"
			@close-side-sheet="handleCloseSideSheet"
		/>
	</MyKivaContainer>
</template>

<script>
import { useRouter } from 'vue-router';

import userUpdatesQuery from '#src/graphql/query/userUpdates.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';

import { STATE_JOURNEY, STATE_EARNED } from '#src/composables/useBadgeModal';
import BadgesSection from '#src/components/MyKiva/BadgesSection';
import BadgeTile from '#src/components/MyKiva/BadgeTile';
import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';
import useBadgeData from '#src/composables/useBadgeData';
import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection';
import JourneySideSheet from '#src/components/Badges/JourneySideSheet';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';

import borrowerProfileExpMixin from '#src/plugins/borrower-profile-exp-mixin';

import { defaultBadges } from '#src/util/achievementUtils';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import { runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';
import logReadQueryError from '#src/util/logReadQueryError';

const CONTENTFUL_MORE_WAYS_KEY = 'my-kiva-more-ways-carousel';

export default {
	name: 'MyKivaPageContent',
	mixins: [borrowerProfileExpMixin],
	components: {
		BadgesSection,
		BadgeTile,
		BorrowerSideSheetWrapper,
		JournalUpdatesCarousel,
		JourneyCardCarousel,
		JourneySideSheet,
		KvAtbModalContainer,
		LendingCategorySection,
		MyKivaBorrowerCarousel,
		MyKivaContainer,
		MyKivaHero,
		MyKivaNavigation,
		MyKivaProfile,
		MyKivaStats,
	},
	props: {
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
		transactions: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		const { getBadgeWithVisibleTiers } = useBadgeData();
		const router = useRouter();
		const {
			fetchAchievementData,
			fetchContentfulData,
			badgeData,
			getLoanFindingUrl,
		} = useBadgeData(this.apollo);
		return {
			addedLoan: null,
			badgeData,
			CONTENTFUL_MORE_WAYS_KEY,
			displayedCount: 3,
			fetchAchievementData,
			fetchContentfulData,
			getBadgeWithVisibleTiers,
			getLoanFindingUrl,
			hasShownHiddenRepayments: false,
			hideBottomGradient: false,
			isEarnedSectionModal: false,
			isFirstLoad: true,
			loanUpdates: [],
			moreWaysToHelpSlides: [],
			realTotalUpdates: 0,
			recommendedLoans: Array(6).fill({ id: 0 }),
			router,
			selectedBadgeData: null,
			selectedJourney: '',
			showBPSideSheet: false,
			showJourneySideSheet: false,
			showNavigation: false,
			state: STATE_JOURNEY,
			transactionsTypes: [],
			updatesLimit: 3,
			updatesLoading: true,
			updatesOffset: 3,
		};
	},
	computed: {
		userBalance() {
			return this.userInfo.userAccount?.balance ?? '';
		},
		repaymentsRaw() {
			return this.transactions.filter(trx => trx.type === 'loan_repayment');
		},
		repaymentCards() {
			return this.formatRepaymentCards(this.repaymentsRaw);
		},
		hiddenRepayments() {
			return this.repaymentCards.slice(3);
		},
		mergedUpdates() {
			const repayments = this.repaymentCards;
			const updates = this.loanUpdates;
			if (this.isFirstLoad) {
				return [...repayments, ...updates]
					.sort((a, b) => new Date(b.date) - new Date(a.date))
					.slice(0, this.displayedCount);
			}
			if (!this.hasShownHiddenRepayments && this.hiddenRepayments.length > 0) {
				const hidden = this.hiddenRepayments;
				const updatesToShow = updates.slice(0, 3 - hidden.length);
				return [...hidden, ...updatesToShow]
					.sort((a, b) => new Date(b.date) - new Date(a.date));
			}
			const repaymentsAndUpdates = [...this.repaymentCards, ...this.loanUpdates];
			return repaymentsAndUpdates
				.sort((a, b) => new Date(b.date) - new Date(a.date))
				.slice(0, this.displayedCount);
		},
		totalUpdates() {
			return this.realTotalUpdates + this.repaymentCards.length;
		},
		allBadgesCompleted() {
			const tieredBadges = this.badgeData?.filter(b => defaultBadges.includes(b?.id));
			return tieredBadges?.every(b => !b.achievementData?.tiers?.find(t => !t?.completedDate));
		},
		recommendeLoansTitle() {
			return this.loans.length < 1
				? 'Recommended for you'
				: 'Recommended for you based on your lending history';
		},
		isSelectedJourneyComplete() {
			return this.selectedBadgeData?.achievementData?.tiers?.length === this.selectedBadgeData?.level;
		},
		showSingleArray() {
			return this.loans.length === 1 && this.loanUpdates.length === 1;
		},
		userInHomepage() {
			return this.$router.currentRoute.value?.path === '/mykiva';
		},
	},
	methods: {
		handleShowNavigation() {
			this.showNavigation = true;
			this.$kvTrackEvent('SecondaryNav top level', 'click', 'MyKiva-Settings-icon');
		},
		handleBadgeTileClicked(selectedTier) {
			this.$router.push(this.getLoanFindingUrl(selectedTier.badge.id, this.$router.currentRoute.value));
		},
		handleBadgeSectionClicked(badge) {
			if (!badge.hasStarted) {
				this.$router.push(this.getLoanFindingUrl(badge.id, this.$router.currentRoute.value));
			} else {
				this.state = STATE_JOURNEY;
				this.selectedBadgeData = badge;
				this.isEarnedSectionModal = false;
				this.showJourneySideSheet = true;
			}
		},
		handleComponentClosed() {
			this.selectedJourney = '';
			const queryParams = { ...this.$router.currentRoute?.value?.query };
			if (queryParams.journey) {
				delete queryParams.journey;
				this.$router.push({ ...this.$router.currentRoute.value, query: queryParams });
			}
			this.selectedBadgeData = undefined;
			this.showJourneySideSheet = false;
			this.hideBottomGradient = false;
		},
		handleContinueJourneyClicked() {
			const badgeWithVisibleTiers = this.getBadgeWithVisibleTiers(this.selectedBadgeData);
			const { id, challengeName } = badgeWithVisibleTiers;
			let eventLabel = `${challengeName} Continue Journey Clicked`;
			if (this.allBadgesCompleted) {
				eventLabel = `${challengeName} See all of your impact stats`;
			}
			if (this.isSelectedJourneyComplete) {
				eventLabel = `${challengeName} See all`;
			}
			this.$kvTrackEvent(
				'portfolio',
				'click',
				eventLabel,
				challengeName,
			);
			if (this.allBadgesCompleted) {
				return this.$router.push('/portfolio/lending-stats');
			}
			if (this.isSelectedJourneyComplete) {
				return this.handleComponentClosed();
			}
			this.$router.push(this.getLoanFindingUrl(id, this.$router.currentRoute.value));
		},
		handleBadgeJourneyLevelClicked(payload) {
			const { id, challengeName, tier: clickedTier } = payload;
			this.$kvTrackEvent(
				'portfolio',
				'click',
				this.state === STATE_EARNED
					? 'Already earned badge modal' : 'Earn a badge - within badge journey map modal',
				challengeName,
				clickedTier.level,
			);
			this.$router.push(this.getLoanFindingUrl(id, this.$router.currentRoute.value));
		},
		getFormattedTransactions() {
			return this.transactionsTypes.map(trx => {
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
		},
		formatRepaymentCards(repayments) {
			if (repayments.length === 0) return [];
			if (repayments.length <= 5) {
				return repayments.map((trx, idx) => ({
					id: `repayment-${trx.effectiveTime}-${idx}`,
					isRepayment: true,
					isTransaction: true,
					status: 'repayment',
					date: trx.effectiveTime,
					subject: 'Success!',
					// eslint-disable-next-line max-len
					body: `${trx.loan?.name || 'A borrower'} from ${trx.loan?.geocode?.country?.name || 'Unknown country'} repaid you $${trx.amount}! Your new balance is now $${this.userBalance}. Don't let it go unused - `,
					amount: trx.amount,
					loan: trx.loan,
					image: trx.loan?.image?.url || null,
				}));
			}
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
				body: `${uniqueBorrowers.size} people from ${uniqueCountries.size} countries repaid you $${totalAmount.toFixed(2)}! Your new balance is now $${this.userBalance}. Don't let it go unused - `,
				amount: totalAmount,
				loan: null,
				image: null,
				repaymentImages: firstThreeImages,
			}];
		},
		fetchUserUpdates(limit = this.updatesLimit) {
			const oneMonthBefore = new Date();
			oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
			const timestamp = oneMonthBefore.getTime();
			return this.apollo.query({
				query: userUpdatesQuery,
				variables: {
					limit,
					offset: 0, // Always fetch from the beginning
					trxLimit: limit,
					trxOffset: 0,
					since: timestamp,
				}
			}).then(result => {
				this.transactionsTypes = result.data?.recentCheckouts?.values?.filter(t => t?.receipt?.manifest);
				const formattedTransactions = this.getFormattedTransactions();
				const updates = (result.data?.my?.updates?.values ?? []).concat(formattedTransactions);
				this.realTotalUpdates = result.data?.my?.updates?.totalCount ?? 0;
				// Always replace the array, never concat
				this.loanUpdates = updates;
			}).finally(() => {
				this.updatesLoading = false;
			}).catch(e => {
				logReadQueryError(e, 'MyKivaPage updatesQuery');
			});
		},
		async fetchRecommendedLoans() {
			const userId = parseInt(this.userInfo?.id, 10) || null;
			runRecommendationsQuery(this.apollo, {
				userId,
				origin: 'web:my_kiva_page',
				limit: 15
			}).then(result => {
				this.recommendedLoans = result?.loans ?? [];
			}).catch(e => {
				logReadQueryError(e, 'MyKivaPage fetchRecommendedLoans');
			});
		},
		async fetchInitialUpdates() {
			this.displayedCount = 3;
			this.updatesLimit = this.displayedCount;
			this.updatesOffset = 0;
			await this.fetchUserUpdates(this.updatesLimit);
		},
		async loadMoreUpdates() {
			this.isFirstLoad = false;
			this.displayedCount += 3; // Increase by 3 each time
			this.updatesLimit = this.displayedCount;
			this.updatesOffset = 0; // Always fetch from the beginning
			await this.fetchUserUpdates(this.updatesLimit);
		},
		updateJourney(journey) {
			this.selectedJourney = journey;
		},
		trackCategory({ success }) {
			if (success) this.$kvTrackEvent('loan-card', 'add-to-basket', 'recommended-my-kiva-page');
		},
		handleCartModal(loan) {
			this.addedLoan = loan;
		},
		async fetchMoreWaysToHelpData() {
			try {
				const moreWaysResult = await this.apollo.query({
					query: contentfulEntriesQuery,
					variables: {
						contentType: 'carousel',
						contentKey: CONTENTFUL_MORE_WAYS_KEY,
					}
				});
				this.moreWaysToHelpSlides = moreWaysResult.data?.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKiva MoreWaysToHelpQuery');
			}
		},
		handleCloseSideSheet() {
			this.showBPSideSheet = false;
			this.selectedLoan = undefined;
		},
		showLoanDetails(loan) {
			this.selectedLoan = loan;
			this.showBPSideSheet = true;
		}
	},
	async mounted() {
		this.$kvTrackEvent('portfolio', 'view', 'New My Kiva');
		fireHotJarEvent('my_kiva_viewed');
		await this.fetchInitialUpdates();
		this.fetchAchievementData(this.apollo);
		this.fetchContentfulData(this.apollo);
		this.fetchRecommendedLoans();
		this.fetchMoreWaysToHelpData();
		this.loadInitialBasketItems();
		this.initializeIsBpModalEnabledExp('my-kiva-page-content');
	},
};
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
