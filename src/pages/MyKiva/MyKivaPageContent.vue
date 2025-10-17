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
		<MyKivaProfile
			class="tw-mt-4"
			:lender="lender"
			:user-info="userInfo"
			v-if="!userInHomepage"
		/>
		<h3 class="tw-mt-4">
			<u>{{ userInfo?.userAccount?.firstName }}'s</u> impact overview
		</h3>
		<MyKivaStats
			class="tw-mt-2"
			:user-balance="userBalance"
			:lending-stats="lendingStats"
		/>
		<section v-if="myGivingFunds && myGivingFunds.totalCount > 0" class="tw-mt-4">
			<MyGivingFundsCard
				:count="myGivingFunds.totalCount"
			/>
		</section>
		<section v-if="isNextStepsExp" class="tw-mt-4">
			<LendingStats
				:regions-data="lendingStats.regionsData"
				:user-lent-to-all-regions="userLentToAllRegions"
				:hero-slides="heroSlides"
				:loans="loans"
				:lender="lender"
				:hero-contentful-data="heroContentfulData"
				:hero-tiered-achievements="heroTieredAchievements"
				:is-next-steps-exp="isNextStepsExp"
				:total-loans="totalLoans"
				:user-goal="userGoal"
				@store-goals-preferences="storeGoalPreferences"
			/>
		</section>
		<section v-else-if="isHeroEnabled" class="tw-mt-4">
			<h3
				v-if="userInHomepage"
				class="tw-mb-2"
			>
				Looking for your next step?
			</h3>
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
		<section id="mykiva-borrower-carousel" class="tw-my-4">
			<MyKivaBorrowerCarousel
				:basket-items="basketItems"
				:is-adding="isAdding"
				:loans="loans"
				:total-loans="totalLoans"
				@add-to-basket="addToBasket"
				@go-to-link="goToLink"
				@handle-selected-loan="showLoanDetails($event, true)"
				@mouse-enter-status-card="loadBPData"
				show-menu
			/>
			<AsyncMyKivaSection @visible="fetchInitialUpdates">
				<JournalUpdatesCarousel
					v-if="!updatesLoading && visibleUpdates.length"
					:updates="visibleUpdates"
					:lender="lender"
					:total-updates="totalUpdates"
					:updates-loading="updatesLoading"
					@load-more-updates="loadMoreUpdates"
				/>
			</AsyncMyKivaSection>
		</section>
		<section class="tw-my-4">
			<LendingCategorySection
				id="recommended-loans"
				:title="recommendedLoansTitle"
				:loans="recommendedLoans"
				:user-balance="userBalance"
				:enable-ai-loan-pills="enableAiLoanPills"
				@add-to-basket="trackCategory($event, 'recommended')"
				@show-cart-modal="handleCartModal"
				@show-loan-details="showLoanDetails($event)"
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
			v-if="showBPSideSheet"
			:basket-items="basketItems"
			:is-adding="isAdding"
			:kv-track-function="$kvTrackEvent"
			:selected-loan-id="selectedLoan?.id"
			:show-back-button="false"
			:show-go-to-link="true"
			:show-headline-border="true"
			:show-side-sheet="showBPSideSheet"
			:show-next-steps="showNextSteps"
			:width-dimensions="{ default: '100%', xl:'600px', lg: '50%', md:'50%', sm: '100%' }"
			:enable-ai-loan-pills="enableAiLoanPills"
			@add-to-basket="addToBasket"
			@go-to-link="goToLink"
			@close-side-sheet="handleCloseSideSheet"
		/>
		<section v-if="blogCards.length" class="tw-my-4">
			<LatestBlogCarousel :blog-cards="blogCards" />
		</section>
	</MyKivaContainer>
	<section class="tw-mt-4 tw-bg-white tw-py-4">
		<div
			style="max-width: 1200px;"
			class="tw-mx-auto tw-px-2.5 md:tw-px-4 lg:tw-px-8"
		>
			<BailoutChips />
		</div>
	</section>
</template>

<script>
import userUpdatesQuery from '#src/graphql/query/userUpdates.graphql';
import contentfulEntriesQuery from '#src/graphql/query/contentfulEntries.graphql';

import { STATE_JOURNEY, STATE_EARNED } from '#src/composables/useBadgeModal';
import useContentful from '#src/composables/useContentful';

import BadgesSection from '#src/components/MyKiva/BadgesSection';
import BadgeTile from '#src/components/MyKiva/BadgeTile';
import BorrowerSideSheetWrapper from '#src/components/BorrowerProfile/BorrowerSideSheetWrapper';
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';
import MyKivaNavigation from '#src/components/MyKiva/MyKivaNavigation';
import MyKivaHero from '#src/components/MyKiva/MyKivaHero';
import MyKivaProfile from '#src/components/MyKiva/MyKivaProfile';
import MyKivaContainer from '#src/components/MyKiva/MyKivaContainer';
import MyGivingFundsCard from '#src/components/GivingFunds/MyGivingFundsCard';
import AsyncMyKivaSection from '#src/pages/MyKiva/AsyncMyKivaSection';
import MyKivaBorrowerCarousel from '#src/components/MyKiva/BorrowerCarousel';
import JournalUpdatesCarousel from '#src/components/MyKiva/JournalUpdatesCarousel';
import MyKivaStats from '#src/components/MyKiva/MyKivaStats';
import useBadgeData, { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import LatestBlogCarousel from '#src/components/MyKiva/LatestBlogCarousel';
import LendingCategorySection from '#src/components/LoanFinding/LendingCategorySection';
import JourneySideSheet from '#src/components/Badges/JourneySideSheet';
import KvAtbModalContainer from '#src/components/WwwFrame/Header/KvAtbModalContainer';
import LendingStats from '#src/components/MyKiva/LendingStats';
import BailoutChips from '#src/components/MyKiva/BailoutChips';

import borrowerProfileExpMixin from '#src/plugins/borrower-profile-exp-mixin';
import smoothScrollMixin from '#src/plugins/smooth-scroll-mixin';

import { defaultBadges } from '#src/util/achievementUtils';
import { fireHotJarEvent } from '#src/util/hotJarUtils';
import { runRecommendationsQuery } from '#src/util/loanSearch/dataUtils';
import logReadQueryError from '#src/util/logReadQueryError';
import { createUserPreferences, updateUserPreferences } from '#src/util/userPreferenceUtils';
import { getLoansIds, fetchAiLoanPills, addAiPillsToLoans } from '#src/util/aiLoanPIillsUtils';

const IMPACT_THRESHOLD = 25;
const CONTENTFUL_MORE_WAYS_KEY = 'my-kiva-more-ways-carousel';
const blogCategories = [
	'gender-equality',
	'supporting-marginalized-us-entrepreneurs',
	'refugees',
	'climate-change'
];
const repaymentOptions = ['loan_repayment', 'direct_loan_repayment'];

export default {
	name: 'MyKivaPageContent',
	mixins: [borrowerProfileExpMixin, smoothScrollMixin],
	components: {
		AsyncMyKivaSection,
		BadgesSection,
		BadgeTile,
		BorrowerSideSheetWrapper,
		JournalUpdatesCarousel,
		JourneyCardCarousel,
		JourneySideSheet,
		KvAtbModalContainer,
		LatestBlogCarousel,
		LendingCategorySection,
		MyKivaBorrowerCarousel,
		MyKivaContainer,
		MyGivingFundsCard,
		MyKivaHero,
		MyKivaNavigation,
		MyKivaProfile,
		MyKivaStats,
		LendingStats,
		BailoutChips,
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
		isNextStepsExp: {
			type: Boolean,
			default: false,
		},
		userLentToAllRegions: {
			type: Boolean,
			default: false,
		},
		enableAiLoanPills: {
			type: Boolean,
			default: false
		},
		myGivingFunds: {
			type: Object,
			default: null,
		},
	},
	data() {
		const { getMostRecentBlogPost } = useContentful(this.apollo);
		const {
			badgeData,
			fetchAchievementData,
			fetchContentfulData,
			getLoanFindingUrl,
		} = useBadgeData(this.apollo);

		return {
			badgeData,
			blogCards: [],
			blogCategories,
			CONTENTFUL_MORE_WAYS_KEY,
			displayedCount: 3,
			fetchAchievementData,
			fetchContentfulData,
			getLoanFindingUrl,
			getMostRecentBlogPost,
			hideBottomGradient: false,
			isEarnedSectionModal: false,
			isFirstLoad: true,
			loanUpdates: [],
			moreWaysToHelpSlides: [],
			realTotalUpdates: 0,
			recommendedLoans: Array(6).fill({ id: 0 }),
			selectedBadgeData: null,
			selectedJourney: '',
			showBPSideSheet: false,
			showJourneySideSheet: false,
			showNavigation: false,
			state: STATE_JOURNEY,
			transactionsTypes: [],
			updatesLimit: 15,
			updatesLoading: true,
			updatesOffset: 3,
			showNextSteps: false,
		};
	},
	computed: {
		userBalance() {
			return this.userInfo.userAccount?.balance ?? '';
		},
		repaymentsRaw() {
			return this.transactions.filter(trx => repaymentOptions.includes(trx.type));
		},
		repaymentCards() {
			const cards = this.formatRepaymentCards(this.repaymentsRaw);
			return Array.isArray(cards) ? cards : [];
		},
		mergedUpdates() {
			const repayments = Array.isArray(this.repaymentCards) ? this.repaymentCards : [];
			const updates = Array.isArray(this.loanUpdates) ? this.loanUpdates : [];
			const merged = [...repayments, ...updates]
				.sort((a, b) => new Date(b.date) - new Date(a.date));
			return merged;
		},
		totalUpdates() {
			return this.mergedUpdates?.length || 0;
		},

		allBadgesCompleted() {
			const tieredBadges = this.badgeData?.filter(b => defaultBadges.includes(b?.id));
			return tieredBadges?.every(b => !b.achievementData?.tiers?.find(t => !t?.completedDate));
		},
		recommendedLoansTitle() {
			return this.loans.length < 1
				? 'Recommended for you'
				: 'Recommended for you based on your lending history';
		},
		isSelectedJourneyComplete() {
			return this.selectedBadgeData?.achievementData?.tiers?.length === this.selectedBadgeData?.level;
		},
		userInHomepage() {
			return this.$router.currentRoute.value?.path === '/mykiva';
		},
		visibleUpdates() {
			const updates = Array.isArray(this.mergedUpdates) ? this.mergedUpdates.slice(0, this.displayedCount) : [];
			return updates;
		},
		userGoal() {
			const preferences = this.userInfo?.userPreferences?.preferences ?? null;
			const parsedPreferences = preferences ? JSON.parse(preferences) : {};
			const existingGoals = parsedPreferences?.goals || [];
			if (!existingGoals.length) return null;

			let goal = existingGoals[0];
			// eslint-disable-next-line max-len
			let loanTotal = this.heroTieredAchievements.find(ach => ach.id === goal?.category)?.totalProgressToAchievement ?? 0;
			if (!loanTotal && goal?.category === ID_SUPPORT_ALL) {
				loanTotal = this.totalLoans;
			}

			if (goal) {
				const currentProgress = loanTotal - (goal?.loanTotalAtStart || 0);
				const isComplete = currentProgress >= (goal?.target || 0);
				goal = {
					...goal,
					currentProgress,
					isComplete,
				};
			}

			return goal;
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
			const { id, challengeName } = this.selectedBadgeData;

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
			const livesToImpact = Math.floor(this.userBalance / IMPACT_THRESHOLD) + 1;

			if (repayments.length <= 5) {
				return repayments.map((trx, idx) => ({
					id: `repayment-${trx.effectiveTime}-${idx}`,
					isRepayment: true,
					isTransaction: true,
					status: 'repayment',
					date: trx.effectiveTime,
					// eslint-disable-next-line max-len
					body: `Success! ${trx.loan?.name || 'A borrower'} from ${trx.loan?.geocode?.country?.name || 'Unknown country'} repaid you $${trx.amount}! Your new balance is now $${this.userBalance}. Don't let it go unused - `,
					amount: trx.amount,
					loan: trx.loan,
					image: trx.loan?.image?.url || null,
					livesToImpact,
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
				// eslint-disable-next-line max-len
				body: `Success! ${uniqueBorrowers.size} people from ${uniqueCountries.size} countries repaid you $${totalAmount.toFixed(2)}! Your new balance is now $${this.userBalance}. Don't let it go unused - `,
				amount: totalAmount,
				loan: null,
				image: null,
				repaymentImages: firstThreeImages,
				livesToImpact,
			}];
		},
		fetchUserUpdates() {
			const limit = this.updatesLimit;
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
			})
				.then(result => {
					this.transactionsTypes = result.data?.recentCheckouts?.values
						?.filter(t => t?.receipt?.manifest);
					const formattedTransactions = this.getFormattedTransactions();
					const updates = (result.data?.my?.updates?.values ?? []).concat(formattedTransactions);

					this.realTotalUpdates = result.data?.my?.updates?.totalCount ?? 0;

					this.loanUpdates = updates;
				})
				.finally(() => {
					this.updatesLoading = false;
				})
				.catch(e => {
					logReadQueryError(e, 'MyKivaPage updatesQuery');
				});
		},
		async fetchRecommendedLoans() {
			const userId = parseInt(this.userInfo?.id, 10) || null;
			runRecommendationsQuery(this.apollo, {
				userId,
				origin: 'web:my_kiva_page',
				limit: 15
			}).then(async result => {
				let processedLoans = result?.loans ?? [];
				if (this.enableAiLoanPills) {
					const loanIds = getLoansIds(processedLoans);
					const aiLoansPills = await fetchAiLoanPills(this.apollo, loanIds);
					processedLoans = addAiPillsToLoans(processedLoans, aiLoansPills);
				}
				this.recommendedLoans = processedLoans;
			}).catch(e => {
				logReadQueryError(e, 'MyKivaPage fetchRecommendedLoans');
			});
		},
		async fetchInitialUpdates() {
			this.displayedCount = 3;
			this.updatesLimit = 15;
			this.updatesOffset = 0;
			await this.fetchUserUpdates(this.updatesLimit);
		},
		async loadMoreUpdates() {
			this.isFirstLoad = false;
			this.displayedCount += 3;
		},
		updateJourney(journey) {
			this.selectedJourney = journey;
		},
		trackCategory({ success }) {
			if (success) this.$kvTrackEvent('loan-card', 'add-to-basket', 'recommended-my-kiva-page');
		},
		async fetchMoreWaysToHelpData() {
			try {
				const moreWaysResult = await this.apollo.query({
					query: contentfulEntriesQuery,
					variables: {
						contentType: 'carousel',
						contentKey: this.CONTENTFUL_MORE_WAYS_KEY,
					}
				});
				this.moreWaysToHelpSlides = moreWaysResult.data?.contentful?.entries?.items?.[0]?.fields?.slides ?? [];
			} catch (e) {
				logReadQueryError(e, 'MyKivaPage myKiva MoreWaysToHelpQuery');
			}
		},
		async fetchBlogCards() {
			const posts = await Promise.all(
				this.blogCategories.map(cat => this.getMostRecentBlogPost(cat))
			);
			this.blogCards = posts.map((post, idx) => (post ? {
				...post,
				category: post.category,
				categorySlug: this.blogCategories[idx]
			} : null)).filter(Boolean);
		},
		handleCloseSideSheet() {
			this.showBPSideSheet = false;
			this.handleSelectedLoan({ loanId: undefined });
		},
		showLoanDetails(payload, showNextSteps = false) {
			this.handleSelectedLoan({ loanId: payload?.id });
			this.showBPSideSheet = true;
			this.showNextSteps = showNextSteps;
		},
		async storeGoalPreferences(newPreferences) {
			const existingPreferences = this.userInfo?.userPreferences ?? null;
			if (!existingPreferences) {
				await createUserPreferences(
					this.apollo,
					{ goals: [] }
				);
			}
			const parsedPreferences = existingPreferences ? JSON.parse(existingPreferences?.preferences || '{}') : {};
			const existingGoals = parsedPreferences?.goals || [];
			const goalIndex = existingGoals.findIndex(goal => goal.goalName === newPreferences.goalName);
			if (goalIndex !== -1) {
				const goalToUpdate = { ...newPreferences };
				delete goalToUpdate.dateStarted;
				existingGoals[goalIndex] = { ...existingGoals[goalIndex], ...goalToUpdate };
			} else {
				existingGoals.push(newPreferences);
			}
			if (this.userInfo.userPreferences) {
				await updateUserPreferences(
					this.apollo,
					existingPreferences,
					parsedPreferences,
					{ goals: existingGoals }
				);
				this.$showTipMsg('Your goal was saved successfully!', { type: 'success' });
			}
		}
	},
	async mounted() {
		this.$kvTrackEvent('portfolio', 'view', 'New My Kiva');
		fireHotJarEvent('my_kiva_viewed');
		this.fetchBlogCards();
		this.fetchAchievementData(this.apollo);
		this.fetchContentfulData(this.apollo);
		this.fetchRecommendedLoans();
		this.fetchMoreWaysToHelpData();
		this.loadInitialBasketItems();

		const queryLoanId = this.$router.currentRoute?.value?.query?.loanId ?? null;
		const urlHash = this.$router.currentRoute?.value?.hash;

		if (urlHash) {
			const elementToScrollTo = document.querySelector(urlHash);
			const topOfSectionToScrollTo = (elementToScrollTo?.offsetTop ?? 0) - 10 ?? 0;
			this.smoothScrollTo({ yPosition: topOfSectionToScrollTo, millisecondsToAnimate: 750 });
		}

		if (queryLoanId) {
			this.showLoanDetails({ id: Number(queryLoanId) }, true);
		}
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

#recommended-loans :deep(.kv-carousel > div:first-child) {
	@apply !tw-gap-2;
}
</style>
