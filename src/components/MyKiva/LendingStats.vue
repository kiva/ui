<template>
	<div
		class="tw-mb-2"
		:class="{'next-steps-link': isNextStepsExperimentEnabled}"
	>
		<h3 class="tw-text-primary md:tw-mb-1">
			Next steps recommended for you
		</h3>
		<div
			v-if="isNextStepsExperimentEnabled"
			class="tw-flex md:tw-gap-1 tw-cursor-pointer tw-w-16 md:tw-w-fit tw-justify-end"
			@click="$router.push('/mykiva/next-steps')"
		>
			<p class="tw-text-eco-green-3 tw-font-medium tw-cursor-pointer">
				View all
			</p>
			<KvMaterialIcon
				class="tw-w-3 tw-h-3 tw-text-eco-green-3 tw-align-middle"
				:icon="mdiArrowRight"
			/>
		</div>
	</div>
	<div
		:class="{ 'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': showRegionExperience }"
	>
		<template v-if="showRegionExperience">
			<div class="card-container tw-shrink-0">
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
					:user-goal-enabled="isNextStepsExpEnabled"
					:user-goal-achieved="userGoalAchieved"
					:user-goal="userGoal"
					:goals-v2-enabled="goalsV2Enabled"
					:categories-loan-count="categoriesLoanCount"
					:hide-goal-card="hideCompletedGoalCard"
					:post-lending-next-steps-enable="postLendingNextStepsEnable"
					:user-info="userInfo"
					:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
					:goal-editing-enable="goalEditingEnable"
					:use-universal-order="useUniversalOrder"
					@open-goal-modal="showGoalModal = true"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</div>
			<MyKivaRegionExperience
				:regions-data="regionsData"
				:loans="loans"
			/>
		</template>
		<JourneyCardCarousel
			v-else
			class="carousel tw--mt-6"
			:class="{'carousel-spacing': isNextStepsExperimentEnabled}"
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
			:user-goal-enabled="isNextStepsExpEnabled"
			:user-goal-achieved="userGoalAchieved"
			:user-goal="userGoal"
			:goals-v2-enabled="goalsV2Enabled"
			:hide-goal-card="hideCompletedGoalCard"
			:post-lending-next-steps-enable="postLendingNextStepsEnable"
			:latest-loan="latestLoan"
			:user-info="userInfo"
			:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
			:goal-editing-enable="goalEditingEnable"
			:use-universal-order="useUniversalOrder"
			@open-goal-modal="showGoalModal = true"
			@open-impact-insight-modal="showImpactInsightsModal = true"
		/>
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
	</div>
</template>

<script>
import { inject } from 'vue';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';

import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';

import useBadgeData from '#src/composables/useBadgeData';
import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';

export default {
	name: 'LendingStats',
	components: {
		JourneyCardCarousel,
		GoalSettingModal,
		MyKivaImpactInsightModal,
		MyKivaRegionExperience,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	props: {
		regionsData: {
			type: Array,
			default: () => [],
			required: true,
		},
		loans: {
			type: Array,
			default: () => ([]),
			required: true,
		},
		userLentToAllRegions: {
			type: Boolean,
			default: false,
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
		isNextStepsExpEnabled: {
			type: Boolean,
			default: false
		},
		goalsV2Enabled: {
			type: Boolean,
			default: false
		},
		postLendingNextStepsEnable: {
			type: Boolean,
			default: false
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
		nextStepsExperimentVariant: {
			type: String,
			default: 'a',
			validator: value => ['a', 'b'].includes(value)
		},
		goalEditingEnable: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			mdiArrowRight,
			showGoalModal: false,
			showImpactInsightsModal: false,
			isGoalSet: false,
			recordedGoalSet: false,
			newGoalPrefs: null,
			showPostLendingNextStepsCards: false,
		};
	},
	computed: {
		useUniversalOrder() {
			return this.nextStepsExperimentVariant === 'b';
		},
		showRegionExperience() {
			return this.isNextStepsExpEnabled && !this.postLendingNextStepsEnable && !this.userLentToAllRegions;
		},
		categoriesLoanCount() {
			const { getAllCategoryLoanCounts } = useBadgeData();
			return getAllCategoryLoanCounts(this.heroTieredAchievements);
		},
		isNextStepsExperimentEnabled() {
			return this.nextStepsExperimentVariant === 'b';
		},
	},
	setup() {
		const goalData = inject('goalData');

		return {
			checkCompletedGoal: goalData.checkCompletedGoal,
			hideCompletedGoalCard: goalData.hideGoalCard,
			goalProgress: goalData.goalProgress,
			goalProgressLoading: goalData.loading,
			loadGoalData: goalData.loadGoalData,
			loadPreferences: goalData.loadPreferences,
			storeGoalPreferences: goalData.storeGoalPreferences,
			userGoal: goalData.userGoal,
			userGoalAchieved: goalData.userGoalAchieved,
		};
	},
	async mounted() {
		if (this.isNextStepsExpEnabled) {
			await this.checkCompletedGoal({ category: 'portfolio' });
		}

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
					this.loadGoalData({ yearlyProgress: this.goalsV2Enabled }),
					this.loadPreferences('network-only'),
				]);
			}
		}
	},
	methods: {
		async setGoal(preferences) {
			// For goalsV2, pass false to not update local state yet
			// This delays the UI update until the modal is closed
			const updateLocalState = !this.goalsV2Enabled;
			await this.storeGoalPreferences(preferences, updateLocalState);
			this.newGoalPrefs = preferences;
			this.isGoalSet = true;
			if (!this.goalsV2Enabled) {
				// For legacy goals, close modal and refresh immediately
				await this.loadGoalData({ yearlyProgress: this.goalsV2Enabled });
				this.showGoalModal = false;
			}
		},
		async closeGoalModal() {
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
				if (!this.recordedGoalSet) {
					// eslint-disable-next-line max-len
					this.$kvTrackEvent('portfolio', 'show', 'goal-set', this.newGoalPrefs?.category, this.newGoalPrefs?.target);
					this.recordedGoalSet = true;
				}
				// Refresh goal data to update the main card with the ring
				await this.loadGoalData({ yearlyProgress: this.goalsV2Enabled });
			}
		},
		closeImpactInsightsModal() {
			if (this.showImpactInsightsModal) {
				this.showImpactInsightsModal = false;
				this.$kvTrackEvent('portfolio', 'click', 'next-step-close-education');
			}
		},
	},
};
</script>

<style lang="postcss" scoped>
.card-container {
	width: 100%;

	@screen md {
		width: 390px;
	}
}

.kiva-card :deep(h2) {
	font-size: 22px !important;
}

.carousel-single > :deep(section > div > div) {
	@apply !tw-min-w-full;
}

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full;
}

.carousel :deep(.kv-carousel__controls) {
	@apply lg:tw-hidden;
}

.carousel-spacing :deep(.kv-carousel) {
	@apply tw-pt-0 md:tw-pt-6 lg:tw-pt-0;
}

.next-steps-link {
	@apply tw-flex tw-items-end md:tw-items-center tw-justify-between tw-mb-8 tw-gap-1;
}
</style>
