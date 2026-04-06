<template>
	<KvLightbox
		class="goal-setting-lightbox"
		title=""
		:visible="show"
		:prevent-close="showGoalTile"
		@lightbox-closed="closeLightbox"
	>
		<template #header>
			<h2
				v-if="!isMobile && (showCategories || isThanksPage)"
				class="tw-mb-3 tw-text-left md:tw-text-center"
			>
				Choose an impact area
			</h2>
		</template>
		<h2
			v-if="isMobile && (showCategories || isThanksPage)"
			class="tw-mb-3 tw-text-left md:tw-text-center"
		>
			Choose an impact area
		</h2>
		<section
			:class="{ 'tw-flex tw-flex-col md:tw-flex-row tw-gap-4': showGoalTile }"
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
								Set your annual goal
							</p>
							<ul>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Build a habit of helping others
									</p>
								</li>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Track your impact as it grows
									</p>
								</li>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Stay consistent with reminders
									</p>
								</li>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Edit anytime
									</p>
								</li>
							</ul>
						</div>
					</template>
					<template v-else>
						<kv-material-icon
							class="tw-w-3 tw-h-3 tw-text-brand tw-mx-auto"
							:icon="mdiCheckCircle"
						/>
						<div class="tw-text-center tw-text-brand-50 tw-text-base">
							<p class="tw-mb-2">
								A year of impact
							</p>
							<ul>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Reminders will help you stay on track.
									</p>
								</li>
								<li>
									<p>
										<KvMaterialIcon
											class="tw-w-1 tw-h-1 tw-text-base"
											:icon="mdiCheckBold"
										/>
										Edit your goal anytime.
									</p>
								</li>
							</ul>
						</div>
					</template>
				</div>
			</div>
			<div
				:class="{ 'tw-flex-1 tw-min-w-0': showGoalTile }"
			>
				<button
					v-if="showGoalTile"
					class="
						tw-grid tw-content-center tw-justify-center
						tw-ml-auto
						tw-w-6 tw-h-6 tw--m-2
						hover:tw-text-action-highlight
					"
				>
					<!-- TODO: add trigger for close icon -->
					<kv-material-icon
						class="tw-w-3 tw-h-3"
						:icon="mdiClose"
					/>
					<span class="tw-sr-only">Close</span>
				</button>
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
					:is-loading-data="isLoadingData"
					:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
					@set-goal-target="setGoalTarget"
					@set-goal="$emit('set-goal', $event)"
					@update-goal="$emit('set-goal', $event)"
					@edit-goal="editGoalCategory"
					@close-modal="closeLightbox"
				/>
				<component
					v-show="showCategories || isThanksPage"
					:is="contentComponent"
					:categories="categories"
					:pre-selected-category="selectedCategory.id"
					:selected-category="selectedCategory"
					:selected-goal-number="selectedGoalNumber"
					@category-selected="handleCategorySelected"
					@number-changed="handleNumberChanged"
				/>
				<div
					v-if="showGoalTile && (showCategories || isThanksPage)"
					class="tw-flex tw-justify-end tw-gap-2"
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
			v-if="!showGoalTile && (showCategories || isThanksPage)"
			#controls
		>
			<div
				class="tw-flex tw-justify-end tw-gap-2"
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
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import { mdiCheckBold, mdiCheckCircle, mdiClose } from '@mdi/js';

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const emit = defineEmits(['close-goal-modal', 'set-goal', 'update-goal-choices']);

const { isMobile, isLarge } = useBreakpoints();
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getCtaHref,
	getCategories,
	goalProgress,
	goalProgressPercentage,
	userGoal,
	loadGoalData,
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
});

const { numberOfLoans, isGoalSet, show } = toRefs(props);

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
	}
};

const resetForm = () => {
	formStep.value = 1;
	// Reset selected category to default (women's equality)
	selectedCategory.value = { ...categories[0] };
	showCategories.value = false;
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
	if (newVal) {
		isLoadingData.value = true;
		await loadGoalData();
		const { target, category: goalCategory } = userGoal.value;
		const storedCategory = categories.find(c => c.badgeId === goalCategory);
		if (storedCategory && target) {
			selectedCategory.value = storedCategory;
			selectedGoalNumber.value = target;
		}
		isLoadingData.value = false;
	}
});
</script>

<style lang="postcss">
.goal-setting-lightbox :deep(h2) {
	@apply tw-text-h2;
}

/* Style for components when Goal Tile experiment is enabled */
.goal-tile-container {
	flex: 0 0 100%;
	min-width: 0;
	overflow: hidden;

	@screen md {
		flex: 0 0 calc((100% - 1rem) / 2 - 10px);
		height: 390px;
	}

	@screen lg {
		flex: 0 0 calc((100% - 2rem) / 3 - 10px);
	}

	ul {
		@apply tw-text-justify;

		li > p {
			font-weight: 611;

			@apply tw-text-small tw-mb-2;

			span {
				@apply tw-mr-1;
			}
		}
	}

	div:first-child {
		max-width: 228px;
	}
}

/* TODO: In progress syncing modal body buttons with new styles for goal tile version */
.goal-selector-container, .goal-modal-container {
	button {
		@apply lg:tw-self-center;

		@screen lg {
			max-width: 314px;
		}
	}
}
</style>
