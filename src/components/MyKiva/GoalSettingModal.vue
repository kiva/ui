<template>
	<KvLightbox
		class="goal-setting-lightbox"
		:class="{
			'goal-tile-modal': showGoalTile && !showRecommendLoanAfterGoalView,
			'goal-tile-modal-expanded': showGoalTile && showCategories && !showRecommendLoanAfterGoalView,
			'goal-tile-modal-recommend-loan': showRecommendLoanAfterGoalView,
		}"
		title=""
		:visible="show"
		@lightbox-closed="closeLightbox"
	>
		<template
			v-if="showRecommendLoanAfterGoalView"
			#header
		>
			<RecommendLoanForGoalHeader
				class="!tw-p-0 !tw-pb-2"
				:title="recommendLoanHeaderTitle"
				:details="recommendLoanHeaderDetails"
				:loaded-set-data="loadedSetData"
			/>
		</template>
		<template
			v-else-if="!showGoalTile"
			#header
		>
			<h2
				v-if="!isMobile && (showCategories || isThanksPage)"
				class="tw-mb-3 tw-text-left md:tw-text-center"
			>
				Choose an impact area
			</h2>
		</template>
		<h2
			v-if="!showRecommendLoanAfterGoalView && isMobile && (showCategories || isThanksPage)"
			class="tw-mb-3 tw-text-left md:tw-text-center"
		>
			Choose an impact area
		</h2>
		<section
			v-if="showRecommendLoanAfterGoalView"
		>
			<RecommendLoanForGoalContent
				ref="recommendLoanForGoalContentRef"
				v-bind="recommendLoanCardProps"
				:is-adding="isAdding"
			/>
		</section>
		<section
			v-else
			:class="{ 'tw-flex tw-flex-col md:tw-flex-row tw-gap-0': showGoalTile }"
		>
			<div
				v-if="showGoalTile"
				class="goal-tile-container tw-flex tw-h-full tw-bg-eco-green-4 tw-justify-center"
			>
				<div
					class="tw-self-center tw-text-center"
				>
					<template
						v-if="!isGoalSet"
					>
						<img
							:src="HandsPlant"
							class="lg:tw-mb-1 tw-w-10 lg:tw-w-12.5 tw-mx-auto"
						>
						<div class="tw-text-center tw-text-brand-50 tw-text-base">
							<p class="tw-mb-2">
								<strong>Set your annual goal</strong>
							</p>
							<ul class="tw-inline-block">
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Build a habit of helping others
									</p>
								</li>
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Track your impact as it grows
									</p>
								</li>
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Stay consistent with reminders
									</p>
								</li>
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Edit anytime
									</p>
								</li>
							</ul>
						</div>
					</template>
					<template v-else>
						<kv-material-icon
							class="tw-w-3.5 tw-h-3.5 tw-text-brand tw-mx-auto tw-mb-3"
							:icon="mdiCheckCircle"
						/>
						<div class="tw-text-center tw-text-brand-50 tw-text-base">
							<p class="tw-mb-2">
								<strong>A year of impact</strong>
							</p>
							<ul class="tw-inline-block">
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Reminders will help you stay on track.
									</p>
								</li>
								<li class="tw-flex tw-items-start tw-gap-1 tw-mb-2">
									<KvMaterialIcon
										class="tw-w-1 tw-h-1 tw-text-base tw-flex-shrink-0 tw-mt-0.5"
										:icon="mdiCheckBold"
									/>
									<p class="tw-text-left">
										Edit your goal anytime.
									</p>
								</li>
							</ul>
						</div>
					</template>
				</div>
			</div>
			<div
				:class="{ 'tw-flex-1 tw-min-w-0 goal-selector-wrapper': showGoalTile }"
			>
				<!-- second close button for goal tile variant -->
				<button
					v-if="showGoalTile"
					class="
						tw-grid tw-content-center tw-justify-center
						tw-ml-auto
						tw-w-6 tw-h-6 tw--m-2
						hover:tw-text-action-highlight
					"
					:class="{
						'tw-mb-1': isLoadingData
					}"
					@click="closeLightbox"
				>
					<kv-material-icon
						class="tw-w-3 tw-h-3"
						:icon="mdiClose"
					/>
					<span class="tw-sr-only">Close</span>
				</button>
				<!-- second title for goal tile variant -->
				<h2
					v-if="showGoalTile && showCategories"
					class="tw-mb-3 tw-text-left md:tw-text-center"
				>
					Choose an impact area
				</h2>
				<GoalSelector
					v-if="showGoalSelector"
					v-show="!showCategories"
					style="max-width: 612px;"
					class="goal-selector-container"
					:is-goal-set="loadedSetData"
					:categories-loan-count="categoriesLoanCount"
					tracking-category="portfolio"
					:go-to-url="ctaHref"
					:tiered-achievements="tieredAchievements"
					:is-editing="isEditing"
					:selected-category-id="selectedCategory.badgeId"
					:selected-category-name="selectedCategory.name"
					:goal-loans="selectedGoalNumber"
					:goal-progress="goalProgress"
					:goal-progress-percentage="goalProgressPercentage"
					:is-updating-goal="isUpdatingGoal"
					:is-loading-data="isLoadingData || isLoadingRecommendedLoan"
					:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
					show-goal-value-props-copy
					@set-goal-target="setGoalTarget"
					@set-goal="onGoalSelectorSetGoal"
					@update-goal="onGoalSelectorUpdateGoal"
					@edit-goal="editGoalCategory"
					@close-modal="closeLightbox"
				/>
				<component
					v-show="showCategories || isThanksPage"
					:class="{
						'goal-tile-categories-container': showGoalTile
					}"
					:is="contentComponent"
					:categories="categories"
					:pre-selected-category="selectedCategory.id"
					:selected-category="selectedCategory"
					:selected-goal-number="selectedGoalNumber"
					:is-goal-tile-experiment-enabled="showGoalTile"
					@category-selected="handleCategorySelected"
					@number-changed="handleNumberChanged"
				/>
				<!-- second continue button for goal tile variant -->
				<div
					v-if="showGoalTile && !showRecommendLoanAfterGoalView && (showCategories || isThanksPage)"
					class="tw-flex tw-justify-end tw-gap-2 goal-tile-categories-controls"
				>
					<KvButton
						v-if="formStep === 2"
						variant="secondary"
						@click="clickBack"
					>
						Back
					</KvButton>
					<KvButton @click="handleClick">
						{{ ctaCopy }}
					</KvButton>
				</div>
			</div>
		</section>
		<template
			v-if="showRecommendLoanAfterGoalView"
			#controls
		>
			<RecommendLoanForGoalFooter
				class="tw-mx-auto tw-w-full"
				:is-adding="isAdding"
				:is-in-basket="recommendLoanIsInBasket"
				@primary-cta-click="addToBasket"
				@checkout-click="handleCheckoutClick"
				@secondary-cta-click="handleExploreMoreLoans"
			/>
		</template>
		<template
			v-else-if="!showGoalTile && (showCategories || isThanksPage)"
			#controls
		>
			<div
				class="tw-flex tw-justify-end tw-gap-2"
				:class="{
					'goal-modal-controls': isGoalTileExperimentEnabled
				}"
			>
				<KvButton
					v-if="formStep === 2"
					variant="secondary"
					@click="clickBack"
				>
					Back
				</KvButton>
				<KvButton @click="handleClick">
					{{ ctaCopy }}
				</KvButton>
			</div>
		</template>
	</KvLightbox>
</template>

<script setup>
import {
	KvLightbox, KvButton, KvMaterialIcon
} from '@kiva/kv-components';
import {
	ref,
	defineProps,
	defineAsyncComponent,
	computed,
	inject,
	watch,
	toRefs,
} from 'vue';
import { useRouter } from 'vue-router';

import useBreakpoints from '#src/composables/useBreakpoints';
import useGoalData from '#src/composables/useGoalData';
import useGoalSettingRecommendedLoan, {
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO,
} from '#src/composables/useGoalSettingRecommendedLoan';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import RecommendLoanForGoalContent from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContent';
import RecommendLoanForGoalFooter from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalFooter';
import RecommendLoanForGoalHeader from '#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalHeader';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import { mdiCheckBold, mdiCheckCircle, mdiClose } from '@mdi/js';

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const emit = defineEmits([
	'close-goal-modal',
	'set-goal',
	'update-goal-choices',
	'add-to-basket',
]);

const { isMobile, isLarge } = useBreakpoints();
const $kvTrackEvent = inject('$kvTrackEvent');
const appConfig = inject('$appConfig', {});
const apollo = inject('apollo');
const router = useRouter();

const {
	getCtaHref,
	getCategories,
	goalProgress,
	goalProgressPercentage,
	userGoal,
	loadGoalData,
	getRecommendedLoans,
} = useGoalData();

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	totalLoans: {
		type: Number,
		default: 0,
	},
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
	numberOfLoans: {
		type: Number,
		default: 0,
	},
	isThanksPage: {
		type: Boolean,
		default: false,
	},
	showGoalSelector: {
		type: Boolean,
		default: false,
	},
	isGoalSet: {
		type: Boolean,
		default: false,
	},
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Controlled is editing flag from parent
	 */
	controlledIsEditing: {
		type: Boolean,
		default: false,
	},
	/**
	 * Controlled selected category from parent
	 */
	controlledSelectedCategory: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Flag to enable goal editing features
	 */
	isUpdatingGoal: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if the goal tile experiment is enabled
	 */
	isGoalTileExperimentEnabled: {
		type: Boolean,
		default: false,
	},
	/**
	 * When true, after setting a goal (handleClick save path), swap modal content for recommended loan UI.
	 */
	goalRecommendedLoanEnable: {
		type: Boolean,
		default: false,
	},
	/**
	 * Title for the recommended loan header
	 */
	recommendLoanHeaderTitle: {
		type: String,
		default: 'Goal set!',
	},
	/**
	 * Flag to indicate if the recommended loan is being added to the basket
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
	/**
	 * Array of basket items to check if the recommended loan is already in the basket
	 */
	basketItems: {
		type: Array,
		default: () => ([]),
	},
});

const {
	numberOfLoans, isGoalSet, show, goalRecommendedLoanEnable, basketItems,
} = toRefs(props);

const formStep = ref(1);
const showCategories = ref(false);
const selectedLoanNumber = ref(0);
const isEditing = ref(props.controlledIsEditing);
// eslint-disable-next-line max-len
const selectedGoalNumber = ref(numberOfLoans.value ? numberOfLoans.value : 5); // Default goals to 5 loans for initial MVP
const isLoadingData = ref(true);
const loadedSetData = ref(false);

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

// Check if controlledSelectedCategory has actual data (not just empty object)
const hasControlledCategory = props.controlledSelectedCategory
	&& Object.keys(props.controlledSelectedCategory).length > 0;
const selectedCategory = ref(hasControlledCategory ? props.controlledSelectedCategory : categories[0]);

const {
	showRecommendLoanAfterGoalView: showRecommendLoanTrigger,
	hasRecommendedLoans,
	isLoadingRecommendedLoan,
	recommendLoanHeaderDetails,
	recommendLoanCardProps,
	recommendLoanIsInBasket,
	resetRecommendedLoanState,
	enterRecommendedLoanStepAfterGoalSave,
	onGoalSelectorSetGoal,
	onGoalSelectorUpdateGoal,
	handleExploreMoreLoans,
	onAddToBasketError,
	trackAddToBasketClick,
	trackCheckoutClick,
} = useGoalSettingRecommendedLoan({
	emit,
	goalRecommendedLoanEnable,
	basketItems,
	selectedGoalNumber,
	selectedCategory,
	show,
	goalProgress,
	getRecommendedLoans,
	getCtaHref,
	userGoal,
	kvTrackEvent: $kvTrackEvent,
	entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_PORTFOLIO,
	appConfig,
	apollo,
});

// Render the recommended-loan UI only when the trigger fired AND the fetch
// returned at least one loan; otherwise fall back to the goal-selector flow.
const showRecommendLoanAfterGoalView = computed(() => (
	showRecommendLoanTrigger.value && hasRecommendedLoans.value
));

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 2: return NumberChoice;
		case 1: default: return CategoryForm;
	}
});

const yearToDate = new Date().getFullYear();

const ctaCopy = computed(() => {
	if (isEditing.value) {
		return 'Continue';
	}

	return `Set ${yearToDate} goal`;
});

const ctaHref = computed(() => {
	// Use goalProgress which tracks current year progress
	return getCtaHref(
		selectedGoalNumber.value,
		selectedCategory.value?.badgeId,
		router,
		goalProgress.value
	);
});

const showGoalTile = computed(() => {
	return props.isGoalTileExperimentEnabled && isLarge.value;
});

const recommendLoanForGoalContentRef = ref(null);

const addToBasket = () => {
	const lendAmount = recommendLoanForGoalContentRef.value?.getSelectedAmount();
	const { loanId } = recommendLoanCardProps.value;
	trackAddToBasketClick(loanId, lendAmount);
	emit('add-to-basket', { loanId, lendAmount, onError: onAddToBasketError });
};

const handleCheckoutClick = () => {
	trackCheckoutClick();
};

const handleCategorySelected = categoryId => {
	const categoryIdx = categoryId - 1;
	selectedCategory.value = categories[categoryIdx];

	// Only track when modal is open and user wants to choose a different category, not on pageload
	if ((props.show && showCategories.value) || props.isThanksPage) {
		$kvTrackEvent(
			props.isThanksPage ? 'post-checkout' : 'portfolio',
			'click',
			'choose-goal-category',
			categories[categoryIdx]?.eventProp
		);
	}
};

const handleNumberChanged = number => {
	selectedGoalNumber.value = number;
};

const clickBack = () => {
	// eslint-disable-next-line no-nested-ternary
	selectedGoalNumber.value = numberOfLoans.value ? numberOfLoans.value
		: selectedLoanNumber.value ? selectedLoanNumber.value : 5;

	if (formStep.value === 1 && props.showGoalSelector) {
		showCategories.value = false;
	} else {
		formStep.value -= 1;
	}
	$kvTrackEvent(
		props.isThanksPage ? 'post-checkout' : 'portfolio',
		'click',
		'goals-back'
	);
	$kvTrackEvent(
		props.isThanksPage ? 'post-checkout' : 'portfolio',
		'show',
		'view-goal-categories'
	);
};

const handleClick = () => {
	if (isEditing.value) {
		isEditing.value = false;
		showCategories.value = false;
		formStep.value = 1;
		emit('update-goal-choices', selectedCategory.value);
	} else {
		const categorySelected = selectedCategory.value?.badgeId;
		$kvTrackEvent(
			props.isThanksPage ? 'post-checkout' : 'portfolio',
			'click',
			props.isThanksPage ? 'set-annual-goal' : 'set-goal-amount',
			categorySelected,
			selectedGoalNumber.value
		);

		const currentYear = new Date().getFullYear();
		const goalName = `goal-${categorySelected}-${currentYear}`;
		const target = selectedGoalNumber.value;
		const dateStarted = new Date().toISOString();
		const status = 'in-progress';
		emit('set-goal', {
			goalName,
			category: categorySelected,
			target,
			dateStarted,
			status,
		});
		enterRecommendedLoanStepAfterGoalSave();
	}
};

const resetForm = () => {
	formStep.value = 1;
	// Reset selected category to default (women's equality)
	selectedCategory.value = { ...categories[0] };
	showCategories.value = false;
	resetRecommendedLoanState();
};

const closeLightbox = () => {
	emit('close-goal-modal');
	// Avoid showing category choice step when closing the modal
	setTimeout(() => {
		resetForm();
	}, 300);
};

const editGoalCategory = () => {
	showCategories.value = true;
	isEditing.value = true;
	$kvTrackEvent(
		props.isThanksPage ? 'post-checkout' : 'portfolio',
		'show',
		'view-goal-categories'
	);
};

const setGoalTarget = target => {
	selectedLoanNumber.value = target;
	selectedGoalNumber.value = target;
};

watch(numberOfLoans, newVal => {
	if (newVal) {
		selectedGoalNumber.value = newVal;
	}
});

watch(isGoalSet, async newVal => {
	loadedSetData.value = false;
	if (newVal) {
		// Load goal data for ctaHref
		await loadGoalData({ fetchPolicy: 'network-only' });
		if (showCategories.value) {
			showCategories.value = false;
		}
		loadedSetData.value = true;
	}
});

watch(show, async newVal => {
	if (!newVal) {
		return;
	}
	isLoadingData.value = true;
	await loadGoalData();
	const { target, category: goalCategory } = userGoal.value;
	const storedCategory = categories.find(c => c.badgeId === goalCategory);
	if (storedCategory && target) {
		selectedCategory.value = storedCategory;
		selectedGoalNumber.value = target;
	}
	isLoadingData.value = false;
});
</script>

<style lang="postcss" scoped>
.goal-setting-lightbox :deep(h2) {
	@apply tw-text-h2;
}

/* Style for components when Goal Tile experiment is enabled */
:deep(.goal-modal-controls) {
	@apply tw-mx-auto tw-my-0;

	button {
		width: 314px;
	}
}

.goal-tile-modal :deep {
	[data-test=kv-lightbox] {
		@apply lg:!tw-bg-eco-green-4;
	}

	div:has(#kvLightboxBody) {
		@apply lg:!tw-overflow-hidden;
	}

	div:has(+ #kvLightboxBody) {
		@apply lg:!tw-hidden;
	}

	#kvLightboxBody {
		@apply lg:!tw-px-0 lg:!tw-pb-0;
	}

	.goal-selector-wrapper {
		@apply lg:tw-p-4 lg:tw-bg-primary;
	}

	.goal-tile-container {
		flex: 0 0 100%;

		@apply tw-min-w-0 lg:tw-h-auto lg:tw-rounded-l;

		@screen md {
			flex: 0 0 calc((100% - 1rem) / 2 - 10px);
		}

		@screen lg {
			flex: 0 0 276px;
		}

		ul {
			@apply tw-text-justify;

			li > p {
				@apply tw-text-small tw-font-medium;

				span {
					@apply tw-mr-1;
				}
			}
		}

		div:first-child {
			max-width: 228px;
		}
	}

	.goal-selector-container, .goal-modal-container {
		button {
			@apply lg:tw-self-center;

			@screen lg {
				max-width: 314px;
			}
		}
	}

	.goal-tile-categories-controls {
		@apply lg:tw-mt-5;

		button {
			@apply tw-mx-auto tw-my-0;

			@screen lg {
				width: 314px;
			}
		}
	}
}

.goal-tile-modal.goal-tile-modal-expanded :deep {
	/* Override KvLightbox inline max-width to accommodate the category form with the new tile/left-sidebar */
	[data-test=kv-lightbox] {
		@apply lg:!tw-w-full;

		@screen lg {
			max-width: 70rem !important;
		}
	}
}

.goal-setting-lightbox.goal-tile-modal-recommend-loan :deep {
	[data-test=kv-lightbox] > div:first-child,
	[data-testid=kv-lightbox] > div:first-child {
		@apply tw-bg-gray-50 !tw-rounded tw-relative tw-p-3 tw-pb-0.5;

		@screen md {
			width: 684px;
		}

		button {
			right: 2rem;

			@apply tw-absolute;
		}
	}

	/* Lightbox footer */
	[data-test=kv-lightbox] > div:nth-child(3),
	[data-testid=kv-lightbox] > div:nth-child(3) {
		@apply tw-px-2 tw-pt-1 tw-pb-2;
	}

	#kvLightboxBody {
		@apply !tw-pb-0;
	}
}
</style>
