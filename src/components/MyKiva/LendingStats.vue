<template>
	<div
		:class="[
			'next-steps-link',
			{
				'tw-mb-2': !showAlmostFundedCard,
				'tw-mb-8': !(showPostLendingNextStepsCards && goalProgressLoading)
					&& !showAlmostFundedCard
			}]"
	>
		<h2 class="tw-text-primary md:tw-mb-1 !tw-text-subheadline">
			Next steps recommended for you
		</h2>
		<div
			class="tw-flex md:tw-gap-1 tw-cursor-pointer tw-w-16 md:tw-w-fit tw-justify-end"
			@click="handleViewAllClick"
		>
			<p class="tw-text-eco-green-3 tw-text-button-link tw-cursor-pointer">
				View all
			</p>
			<KvMaterialIcon
				class="tw-w-3 tw-h-3 tw-text-eco-green-3 tw-align-middle"
				:icon="mdiArrowRight"
			/>
		</div>
	</div>
	<div>
		<template v-if="showAlmostFundedCard && !goalProgressLoading">
			<JourneyCardCarousel
				class="carousel carousel-lending-next-steps tw-w-full"
				user-in-homepage
				in-lending-stats
				controls-top-right
				:goal-progress-loading="goalProgressLoading"
				:goal-progress="goalProgress"
				:hero-badge-data="heroBadgeData"
				:hero-tiered-achievements="heroTieredAchievements"
				:lender="lender"
				:slides-number="3"
				:slides="heroSlides"
				:user-goal-achieved="userGoalAchieved"
				:user-goal="userGoal"
				:categories-loan-count="categoriesLoanCount"
				:hide-goal-card="hideCompletedGoalCard"
				:user-info="userInfo"
				:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
				:show-lending-next-steps-cards="true"
				@open-goal-modal="openGoalModal($event)"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</template>
		<div
			v-else-if="goalProgressLoading"
			class="tw-flex tw-gap-2 lg:tw-gap-4 tw-w-full tw-overflow-hidden"
			:class="{
				'tw--mt-6': !showPostLendingNextStepsCards
					&& !showAlmostFundedCard,
				'tw-mt-1.5': showAlmostFundedCard
			}"
		>
			<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0" />
			<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0 tw-hidden md:tw-block" />
			<KvLoadingPlaceholder class="placeholder-card !tw-rounded !tw-shrink-0 tw-hidden lg:tw-block" />
		</div>
		<JourneyCardCarousel
			v-else
			class="carousel carousel-spacing tw--mt-6"
			user-in-homepage
			in-lending-stats
			controls-top-right
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
		<GoalSettingModal
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			:is-goal-set="isGoalSet"
			:show-goal-selector="true"
			:tiered-achievements="heroTieredAchievements"
			:is-updating-goal="isUpdatingGoal"
			:goal-recommended-loan-enable="goalRecommendedLoanEnable"
			:excluded-loan-ids="recentLoanIds"
			:basket-items="basketItems"
			:is-adding="isAdding"
			@close-goal-modal="closeGoalModal"
			@set-goal="setGoal"
			@add-to-basket="$emit('add-to-basket', $event)"
		/>
		<MyKivaImpactInsightModal
			v-if="showPostLendingNextStepsCards && showImpactInsightsModal"
			:show="showImpactInsightsModal"
			:latest-loan="latestLoan"
			@close="closeImpactInsightsModal"
		/>
	</div>
</template>

<script>
import { computed, inject } from 'vue';
import { KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';

import useBadgeData from '#src/composables/useBadgeData';

import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';

import logReadQueryError from '#src/util/logReadQueryError';
import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import GoalSettingModal from './GoalSettingModal';

export default {
	name: 'LendingStats',
	components: {
		JourneyCardCarousel,
		GoalSettingModal,
		MyKivaImpactInsightModal,
		KvLoadingPlaceholder,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['add-to-basket'],
	props: {
		loans: {
			type: Array,
			default: () => ([]),
			required: true,
		},
		heroSlides: {
			type: Array,
			default: () => [],
		},
		lender: {
			type: Object,
			default: () => ({}),
		},
		heroBadgeData: {
			type: Array,
			default: () => ([]),
		},
		heroTieredAchievements: {
			type: Array,
			default: () => ([]),
		},
		totalLoans: {
			type: Number,
			default: 0,
		},
		latestLoan: {
			type: Object,
			default: null
		},
		goalRefreshKey: {
			type: Number,
			default: 0
		},
		userInfo: {
			type: Object,
			default: () => ({}),
		},
		goalRecommendedLoanEnable: {
			type: Boolean,
			default: false
		},
		isAdding: {
			type: Boolean,
			default: false
		},
		basketItems: {
			type: Array,
			default: () => ([]),
		},
		goalsRowEnabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			mdiArrowRight,
			showGoalModal: false,
			showImpactInsightsModal: false,
			isGoalSet: false,
			showPostLendingNextStepsCards: false,
			isUpdatingGoal: false,
		};
	},
	computed: {
		// Exclude the user's most recent loans (schema default limit) from the recommended-loan fetch.
		recentLoanIds() {
			return (this.loans ?? []).map(loan => loan?.id).filter(Boolean);
		},
		// True when the Almost Funded carousel is shown — for all non-post-lending lenders, including superlenders.
		showAlmostFundedCard() {
			return !this.showPostLendingNextStepsCards;
		},
		categoriesLoanCount() {
			const { getAllCategoryLoanCounts } = useBadgeData();
			return getAllCategoryLoanCounts(this.heroTieredAchievements);
		},
	},
	setup(props) {
		const goalData = inject('goalData');

		// Hide the in-carousel goal tile when a goal card is already shown elsewhere on the page.
		const hideCompletedGoalCard = computed(
			() => props.goalsRowEnabled || Boolean(goalData.hideGoalCard?.value)
		);

		return {
			hideCompletedGoalCard,
			goalProgress: goalData.goalProgress,
			goalProgressLoading: goalData.loading,
			loadGoalData: goalData.loadGoalData,
			loadPreferences: goalData.loadPreferences,
			storeGoalPreferences: goalData.storeGoalPreferences,
			userGoal: goalData.userGoal,
			userGoalAchieved: goalData.userGoalAchieved,
			updateCurrentGoal: goalData.updateCurrentGoal,
		};
	},
	mounted() {
		// Show post-lending next steps cards in My Kiva
		if (checkPostLendingCardCookie(this.cookieStore)) {
			this.showPostLendingNextStepsCards = true;
			removePostLendingCardCookie(this.cookieStore);
		}
	},
	watch: {
		async goalRefreshKey(newVal, oldVal) {
			if (newVal !== oldVal && newVal > 0) {
				await Promise.all([
					this.loadGoalData(),
					this.loadPreferences('network-only'),
				]);
			}
		}
	},
	methods: {
		async setGoal(preferences) {
			if (this.isUpdatingGoal) {
				await this.updateCurrentGoal(this.userGoal, preferences);
			} else {
				try {
					await this.storeGoalPreferences(preferences);
				} catch (error) {
					this.$showTipMsg('There was a problem setting up your goal', 'error');
					logReadQueryError(error, 'MyKivaPage setting up goal');
					return;
				}
			}
			this.isGoalSet = true;
		},
		async closeGoalModal() {
			if (this.isUpdatingGoal && !this.isGoalSet) {
				this.$kvTrackEvent(
					'portfolio',
					'click',
					'cancel-goal-edit',
				);
			}

			if (this.showGoalModal) {
				this.showGoalModal = false;
				this.$kvTrackEvent(
					'portfolio',
					'click',
					'close-goals'
				);
			}
			// Only refresh goal data when modal closes AND goal was set
			// This ensures the main card transitions to ring only after modal is closed
			if (this.isGoalSet) {
				if (!this.isUpdatingGoal) {
					// Refresh goal data to update the main card with the ring
					await this.loadGoalData();
				}

				// Avoid showing category choice step when closing the modal
				setTimeout(() => {
					this.isGoalSet = false;
				}, 300);
			}
		},
		closeImpactInsightsModal() {
			if (this.showImpactInsightsModal) {
				this.showImpactInsightsModal = false;
				this.$kvTrackEvent('portfolio', 'click', 'next-step-close-education');
			}
		},
		openGoalModal(event) {
			this.isUpdatingGoal = event?.updating || false;
			this.showGoalModal = true;
			if (this.isUpdatingGoal) {
				this.$kvTrackEvent('portfolio', 'view', 'edit-goal-modal');
			}
		},
		handleViewAllClick() {
			this.$kvTrackEvent('portfolio', 'click', 'view-all-next-steps');
			this.$router.push(`/mykiva/next-steps${this.showPostLendingNextStepsCards ? '?postLending=true' : ''}`);
		},
	},
};
</script>

<style lang="postcss" scoped>
.kiva-card :deep(h2) {
	font-size: 22px !important;
}

.placeholder-card {
	min-height: 340px;
	flex: 0 0 100%;

	@screen md {
		flex: 0 0 calc((100% - 16px) / 2);
	}

	@screen lg {
		flex: 0 0 calc((100% - 64px) / 3);
	}
}

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full;
}

.carousel :deep(.kv-carousel__controls) {
	@apply lg:tw-hidden;
}

.carousel:not(.carousel-lending-next-steps) :deep(.kv-carousel) {
	@apply tw-pt-0 md:tw-pt-6 lg:tw-pt-0;
}

.carousel-lending-next-steps :deep(.kv-carousel) {
	@apply tw-pt-2 md:tw-pt-6 lg:tw-pt-1.5;
}

.carousel-spacing :deep(.kv-carousel) {
	@apply tw-pt-0 md:tw-pt-6 lg:tw-pt-0;
}

.next-steps-link {
	@apply tw-flex tw-items-end md:tw-items-center tw-justify-between tw-gap-1;
}
</style>
