<template>
	<div
		:class="[
			'next-steps-link',
			{
				'tw-mb-2': !showLendingNextStepsCards,
				'tw-mb-8': !(showPostLendingNextStepsCards && goalProgressLoading)
					&& !showRegionExperience && !showLendingNextStepsCards
			}]"
	>
		<h2 class="tw-text-primary md:tw-mb-1">
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
	<div
		ref="loanRegionsElement"
		:class="{ 'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': showRegionExperience }"
	>
		<template v-if="showLendingNextStepsCards && !goalProgressLoading">
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
				:regions-data="regionsData"
				:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
				@open-goal-modal="openGoalModal($event)"
				@open-impact-insight-modal="showImpactInsightsModal = true"
			/>
		</template>
		<template v-else-if="showRegionExperience && !showLendingNextStepsCards">
			<div
				class="goal-card-container"
				:class="{ 'tw-order-last': goalsRowEnabled }"
			>
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
					:user-goal-achieved="userGoalAchieved"
					:user-goal="userGoal"
					:categories-loan-count="categoriesLoanCount"
					:hide-goal-card="hideCompletedGoalCard"
					:user-info="userInfo"
					:show-post-lending-next-steps-cards="showPostLendingNextStepsCards"
					:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
					@open-goal-modal="openGoalModal($event)"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</div>
			<div
				class="stats-wrapper tw-bg-white tw-rounded
				tw-shadow tw-p-1 md:tw-p-2 tw-flex-1 tw-min-w-0 tw-flex tw-flex-col"
			>
				<div>
					<span
						v-if="pillHeader"
						class="
						tw-inline-flex tw-items-center tw-gap-1
						tw-mb-2 tw-rounded
						tw-bg-eco-green-1 tw-px-1.5 tw-py-1"
						title="Your lending reach"
					>
						<GlobeSearchIcon class="tw-w-2.5 tw-h-2.5 tw-text-brand-550 tw-align-middle" />
						<span class="tw-text-primary tw-text-label tw-align-middle">
							{{ pillHeader }}
						</span>
					</span>
					<div v-if="loanRegions" class="tw-flex tw-flex-col md:tw-flex-row tw-gap-y-2 md:tw-gap-x-6">
						<ul
							class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-y-1 tw-gap-x-0.5
							tw-w-full"
						>
							<li
								v-for="(region, idx) in regionsData"
								:key="region.name"
								class="tw-flex tw-items-center tw-min-w-0 tw-overflow-hidden tw-w-full"
							>
								<kv-checkbox
									:id="`continent-checkbox-${idx}`"
									:model-value="checkedArr[idx]"
									class="tw-mr-0.5"
									:readonly="true"
									:disabled="true"
									variant="round"
									:blur-on-disabled="false"
								/>
								<div class="tw-flex-1 tw-min-w-0 tw-overflow-hidden">
									<span
										class="tw-text-title tw-text-primary
										tw-block tw-whitespace-nowrap tw-truncate tw-min-w-0 tw-w-full tw-align-bottom"

										:title="region.name"
									>
										{{ region.name }}
									</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<hr
					v-if="loanRegions"
					class="tw-mt-2.5 tw-mb-2 tw-mx-auto tw-border-none tw-bg-eco-green-2 tw-rounded"
					style="width: 219px; height: 1px;"
				>
				<div class="tw-flex tw-flex-col tw-grow tw-min-h-0">
					<div
						class="tw-w-full tw-pb-1.5"
						v-html="`Make your first loan in ${formattedPendingRegions}`"
					></div>
					<div class="tw-w-full tw-flex tw-flex-row tw-gap-2 tw-min-h-0 tw-grow">
						<a
							v-for="(region, idx) in pendingRegions"
							:key="idx"
							class="tw-flex tw-w-1/2 tw-cursor-pointer"
							@click="handleRecommendRegionClick(region)"
						>
							<div
								class="
								tw-flex tw-flex-col tw-w-full
								tw-bg-white tw-rounded tw-shadow hover:tw-shadow-lg
								tw-transition-shadow tw-duration-200"
							>
								<div
									:style="{ backgroundImage: `url(${regionImageSource(region)})` }"
									class="
										region-image
										tw-w-full
										tw-rounded-t
										tw-bg-center
										tw-bg-cover
										tw-min-h-0
										tw-grow
									"
								></div>
								<div
									class="
									tw-flex
									tw-justify-between
									tw-w-full
									tw-p-1
									md:tw-px-2
									tw-items-start
								"
									:title="region?.name"
								>
									<span class="tw-text-button-link">Lend in {{ region?.name }}</span>
									<KvMaterialIcon
										class="tw-w-3 tw-h-3 tw-shrink-0"
										:icon="mdiArrowTopRight"
									/>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</template>
		<div
			v-else-if="goalProgressLoading"
			class="tw-flex tw-gap-2 lg:tw-gap-4 tw-w-full tw-overflow-hidden"
			:class="{
				'tw--mt-6': !showPostLendingNextStepsCards
					&& !showLendingNextStepsCards,
				'tw-mt-1.5': showLendingNextStepsCards
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
			:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
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
			:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
			:show-goal-value-props-copy="false"
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
import { KvMaterialIcon, KvCheckbox, KvLoadingPlaceholder } from '@kiva/kv-components';
import { mdiArrowTopRight, mdiArrowRight } from '@mdi/js';

import useBadgeData from '#src/composables/useBadgeData';

import GlobeSearchIcon from '#src/assets/icons/inline/globe-search.svg';

import Africa from '#src/assets/images/my-kiva/Africa.png';
import Asia from '#src/assets/images/my-kiva/Asia.png';
import CentralAmerica from '#src/assets/images/my-kiva/Central America.png';
import EasternEurope from '#src/assets/images/my-kiva/Eastern Europe.png';
import MiddleEast from '#src/assets/images/my-kiva/Middle East.png';
import NorthAmerica from '#src/assets/images/my-kiva/North America.png';
import Oceania from '#src/assets/images/my-kiva/Oceania.png';
import SouthAmerica from '#src/assets/images/my-kiva/South America.png';

import useDelayUntilVisible from '#src/composables/useDelayUntilVisible';
import JourneyCardCarousel from '#src/components/MyKiva/JourneyCardCarousel';

import logReadQueryError from '#src/util/logReadQueryError';
import { checkPostLendingCardCookie, removePostLendingCardCookie, MY_KIVA_CARD_HEIGHT } from '#src/util/myKivaUtils';
import MyKivaImpactInsightModal from '#src/components/MyKiva/ImpactInsight/MyKivaImpactInsightModal';
import GoalSettingModal from './GoalSettingModal';

export default {
	name: 'LendingStats',
	components: {
		GlobeSearchIcon,
		JourneyCardCarousel,
		GoalSettingModal,
		MyKivaImpactInsightModal,
		KvCheckbox,
		KvLoadingPlaceholder,
		KvMaterialIcon,
	},
	inject: ['apollo', 'cookieStore'],
	emits: ['add-to-basket'],
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
		isGoalTileExperimentEnabled: {
			type: Boolean,
			default: false
		},
		lendingNextStepsVariant: {
			type: String,
			default: null,
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
			mdiArrowTopRight,
			interval: null,
			disconnectRegionWatcher: null,
			showGoalModal: false,
			showImpactInsightsModal: false,
			checkedArr: this.regionsData.map(() => false),
			isGoalSet: false,
			newGoalPrefs: null,
			showPostLendingNextStepsCards: false,
			isUpdatingGoal: false,
			MY_KIVA_CARD_HEIGHT,
		};
	},
	computed: {
		// Exclude the user's most recent loans (schema default limit) from the recommended-loan fetch.
		recentLoanIds() {
			return (this.loans ?? []).map(loan => loan?.id).filter(Boolean);
		},
		showRegionExperience() {
			return !this.showPostLendingNextStepsCards && !this.userLentToAllRegions;
		},
		totalRegions() {
			return this.regionsData.length;
		},
		loanRegions() {
			return this.regionsData.filter(region => region.hasLoans).length;
		},
		pillHeader() {
			if (this.totalRegions === 0) return '';
			if (this.loanRegions === 0) return 'Make a global impact';
			return `${this.loanRegions}/${this.totalRegions} Regions supported`;
		},
		pendingRegions() {
			return this.regionsData.filter(region => !region.hasLoans)
				.sort((a, b) => b.count - a.count)
				.slice(0, 2);
		},
		formattedPendingRegions() {
			const regions = this.pendingRegions;
			if (!regions || regions.length === 0) return '';
			const formattedNames = regions.map(region => `<span class="tw-text-action">
				${region.name === 'Middle East' ? 'the Middle East' : region.name}
				</span>`);
			if (formattedNames.length === 1) return formattedNames[0];
			if (formattedNames.length === 2) return `${formattedNames[0]} and ${formattedNames[1]}`;
			return `${formattedNames.slice(0, -1).join(', ')}, and ${formattedNames[formattedNames.length - 1]}`;
		},
		categoriesLoanCount() {
			const { getAllCategoryLoanCounts } = useBadgeData();
			return getAllCategoryLoanCounts(this.heroTieredAchievements);
		},
		showLendingNextStepsCards() {
			return this.lendingNextStepsVariant === 'b' && !this.showPostLendingNextStepsCards;
		},
	},
	setup(props) {
		const goalData = inject('goalData');

		// When the featured-goal-slot experiment is on, the in-carousel goal tile is
		// suppressed in favor of the slot rendered above LendingStats.
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
	async mounted() {
		if (this.showRegionExperience) {
			// Check region boxes when component comes into view
			const { delayUntilVisible, disconnect } = useDelayUntilVisible();
			delayUntilVisible(() => {
				setTimeout(() => {
					let currentIdx = 0;
					this.interval = setInterval(() => {
						currentIdx = this.regionsData.findIndex(
							(region, i) => region.hasLoans && !this.checkedArr[i] && i >= currentIdx
						);
						if (currentIdx !== -1) {
							this.checkedArr[currentIdx] = true;
							currentIdx += 1;
						} else {
							clearInterval(this.interval);
						}
					}, 200);
				}, 800);
			}, [this.$refs.loanRegionsElement]);
			this.disconnectRegionWatcher = disconnect;
		}

		// Show post-lending next steps cards in My Kiva
		if (checkPostLendingCardCookie(this.cookieStore)) {
			this.showPostLendingNextStepsCards = true;
			removePostLendingCardCookie(this.cookieStore);
		}
	},
	beforeUnmount() {
		if (this.interval) clearInterval(this.interval);
		if (this.disconnectRegionWatcher) this.disconnectRegionWatcher();
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
		regionImageSource(region) {
			const regionImages = {
				Africa,
				Asia,
				'Central America': CentralAmerica,
				'Eastern Europe': EasternEurope,
				'Middle East': MiddleEast,
				'North America': NorthAmerica,
				Oceania,
				'South America': SouthAmerica,
			};
			return regionImages[region?.name] || '';
		},
		handleRecommendRegionClick(region) {
			this.$kvTrackEvent(
				'event-tracking',
				'click',
				!this.loans.length ? 'empty-state-region-recommendation' : 'region-recommendation',
				region?.name
			);
			window.location.href = `/lend/filter?country=${region.countries.join(',')}`;
		},
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
			this.newGoalPrefs = preferences;
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
.stats-wrapper {
	height: auto;

	@screen md {
		height: v-bind('`${MY_KIVA_CARD_HEIGHT}px`');
	}
}

.goal-card-container {
	width: 100%;

	@screen md {
		flex: 0 0 336px;
		height: v-bind('`${MY_KIVA_CARD_HEIGHT}px`');
	}

	@screen lg {
		flex: 0 0 336px;
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

.carousel-single > :deep(section > div > div) {
	@apply !tw-min-w-full;
}

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full;
}

.carousel :deep(.kv-carousel__controls) {
	@apply lg:tw-hidden;
}

.carousel:not(.carousel-single, .carousel-lending-next-steps) :deep(.kv-carousel) {
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
