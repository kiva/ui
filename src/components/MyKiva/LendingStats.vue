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
					@open-goal-modal="openGoalModal($event)"
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
			@open-goal-modal="openGoalModal($event)"
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
			:is-updating-goal="isUpdatingGoal"
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
import { inject, ref } from 'vue';
import { KvMaterialIcon } from '@kiva/kv-components';
import { mdiArrowRight } from '@mdi/js';

import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';
import MyKivaRegionExperience from '#src/components/MyKiva/MyKivaRegionExperience';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';

import {
	buildCategoriesLoanCount,
	checkAndClearPostLendingCookie,
	createModalsHandlers,
} from '#src/composables/useMyKivaJourneyData';

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
			return buildCategoriesLoanCount(this.heroTieredAchievements);
		},
		isNextStepsExperimentEnabled() {
			return this.nextStepsExperimentVariant === 'b';
		},
	},
	setup(props) {
		const goalData = inject('goalData');
		const $kvTrackEvent = inject('$kvTrackEvent');

		const showGoalModal = ref(false);
		const showImpactInsightsModal = ref(false);
		const isGoalSet = ref(false);
		const newGoalPrefs = ref(null);
		const recordedGoalSet = ref(false);
		const isUpdatingGoal = ref(false);

		const goalModalHandlers = createModalsHandlers({
			trackEvent: $kvTrackEvent,
			storeGoalPreferences: goalData.storeGoalPreferences,
			loadGoalData: goalData.loadGoalData,
			trackingCategory: 'portfolio',
			goalsV2Enabled: props.goalsV2Enabled,
			updateCurrentGoal: goalData.updateCurrentGoal,
		});

		// Store refs for passing to modal handlers
		const modalRefs = {
			showGoalModal,
			showImpactInsightsModal,
			isGoalSet,
			newGoalPrefs,
			recordedGoalSet,
			isUpdatingGoal,
		};

		return {
			checkCompletedGoal: goalData.checkCompletedGoal,
			hideCompletedGoalCard: goalData.hideGoalCard,
			goalProgress: goalData.goalProgress,
			goalProgressLoading: goalData.loading,
			loadGoalData: goalData.loadGoalData,
			loadPreferences: goalData.loadPreferences,
			storeGoalPreferences: goalData.storeGoalPreferences,
			updateCurrentGoal: goalData.updateCurrentGoal,
			userGoal: goalData.userGoal,
			userGoalAchieved: goalData.userGoalAchieved,
			showGoalModal,
			showImpactInsightsModal,
			isGoalSet,
			newGoalPrefs,
			recordedGoalSet,
			isUpdatingGoal,
			goalModalHandlers,
			modalRefs,
		};
	},
	async mounted() {
		if (this.isNextStepsExpEnabled) {
			await this.checkCompletedGoal({ category: 'portfolio' });
		}

		this.showPostLendingNextStepsCards = checkAndClearPostLendingCookie(this.cookieStore);
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
			await this.goalModalHandlers.setGoal(preferences, this.modalRefs);
		},
		async closeGoalModal() {
			await this.goalModalHandlers.closeGoalModal(this.modalRefs);
		},
		closeImpactInsightsModal() {
			this.goalModalHandlers.closeImpactInsightsModal(this.modalRefs);
		},
		openGoalModal(event) {
			this.goalModalHandlers.openGoalModal(event, this.modalRefs);
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
