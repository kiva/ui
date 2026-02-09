<template>
	<div class="tw-mb-2">
		<h3 class="tw-text-primary tw-mb-1">
			Next steps recommended for you
		</h3>
	</div>
	<div
		ref="loanRegionsElement"
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
					:hero-contentful-data="heroContentfulData"
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
					@open-goal-modal="showGoalModal = true"
					@open-impact-insight-modal="showImpactInsightsModal = true"
				/>
			</div>
			<div class="stats-wrapper tw-bg-white tw-rounded tw-shadow tw-p-1 md:tw-p-2 tw-w-full tw-flex tw-flex-col">
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
						<span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
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
										class="tw-font-medium md:tw-text-lg tw-text-primary
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
									<span class="tw-font-medium">Lend in {{ region?.name }}</span>
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
		<JourneyCardCarousel
			v-else
			class="carousel tw--mt-6"
			user-in-homepage
			in-lending-stats
			controls-top-right
			:goal-progress-loading="goalProgressLoading"
			:goal-progress="goalProgress"
			:hero-contentful-data="heroContentfulData"
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
import { KvMaterialIcon, KvCheckbox } from '@kiva/kv-components';
import { mdiArrowTopRight } from '@mdi/js';

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
import JourneyCardCarousel from '#src/components/Contentful/JourneyCardCarousel';

import { checkPostLendingCardCookie, removePostLendingCardCookie } from '#src/util/myKivaUtils';
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
		heroContentfulData: {
			type: Object,
			default: () => ({}),
		},
		heroTieredAchievements: {
			type: Object,
			default: () => ({}),
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
	},
	data() {
		return {
			mdiArrowTopRight,
			interval: null,
			disconnectRegionWatcher: null,
			showGoalModal: false,
			showImpactInsightsModal: false,
			checkedArr: this.regionsData.map(() => false),
			isGoalSet: false,
			recordedGoalSet: false,
			newGoalPrefs: null,
			showPostLendingNextStepsCards: false,
		};
	},
	computed: {
		showRegionExperience() {
			return this.isNextStepsExpEnabled && !this.postLendingNextStepsEnable && !this.userLentToAllRegions;
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
			const formattedNames = regions.map(region => `<span class="tw-font-medium">
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
					this.loadGoalData({ yearlyProgress: this.goalsV2Enabled }),
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
			this.$router.push(`/lend/filter?country=${region?.countries.join(',')}`);
		},
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
.stats-wrapper, .card-container {
	height: auto;

	@screen md {
		height: 382px;
	}
}

.card-container {
	width: 100%;

	@screen md {
		width: 382px;
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

.carousel-single > :deep(section > div > div) {
	@apply !tw-min-w-full;
}

.carousel, .carousel > :deep(section), .carousel > :deep(section > div:first-of-type) {
	@apply tw-h-full;
}

.carousel :deep(.kv-carousel__controls) {
	@apply lg:tw-hidden;
}
</style>
