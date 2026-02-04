<template>
	<KvLightbox
		class="goal-setting-lightbox"
		title=""
		:visible="show"
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
		<GoalSelector
			v-if="showGoalSelector && goalsV2Enabled"
			v-show="!showCategories"
			style="max-width: 612px;"
			:is-goal-set="isGoalSet"
			:categories-loan-count="categoriesLoanCount"
			tracking-category="portfolio"
			:go-to-url="ctaHref"
			:tiered-achievements="tieredAchievements"
			:is-editing="isEditing"
			:selected-category-id="selectedCategory.badgeId"
			:selected-category-name="selectedCategory.name"
			@set-goal-target="setGoalTarget"
			@set-goal="$emit('set-goal', $event)"
			@edit-goal="editGoalCategory"
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
		<template #controls>
			<div
				v-if="showCategories || isThanksPage"
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
import { KvLightbox, KvButton } from '@kiva/kv-components';
import {
	ref,
	defineProps,
	defineAsyncComponent,
	computed,
	inject,
	watch,
	toRefs,
} from 'vue';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import useIsMobile from '#src/composables/useIsMobile';
import useGoalData from '#src/composables/useGoalData';
import { useRouter } from 'vue-router';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const emit = defineEmits(['close-goal-modal', 'set-goal', 'update-goal-choices']);

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	getCtaHref,
	getCategories,
	goalProgress,
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
	goalsV2Enabled: {
		type: Boolean,
		default: false
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
});

const { numberOfLoans, isGoalSet } = toRefs(props);

const formStep = ref(1);
const showCategories = ref(!props.goalsV2Enabled);
const selectedLoanNumber = ref(0);
const isEditing = ref(props.controlledIsEditing);
// eslint-disable-next-line max-len
const selectedGoalNumber = ref(numberOfLoans.value ? numberOfLoans.value : 5); // Default goals to 5 loans for initial MVP

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

const selectedCategory = ref(props.controlledSelectedCategory || categories[0]);

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 2: return NumberChoice;
		case 1: default: return CategoryForm;
	}
});

const ctaCopy = computed(() => {
	if (isEditing.value) {
		return 'Continue';
	}

	if (props.goalsV2Enabled) {
		return 'Set 2026 goal';
	}
	return formStep.value === 1 ? 'Continue' : 'Set my goal';
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
	} else if (formStep.value === 1 && !props.goalsV2Enabled) {
		formStep.value += 1;
		$kvTrackEvent(
			props.isThanksPage ? 'post-checkout' : 'portfolio',
			'click',
			'goal-setting-continue'
		);
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
	if (newVal) {
		// Load goal data to get current year progress for ctaHref
		await loadGoalData({ yearlyProgress: props.goalsV2Enabled });
		if (showCategories.value) {
			showCategories.value = false;
		}
	}
});
</script>

<style lang="postcss" scoped>
  .goal-setting-lightbox :deep(h2) {
    @apply tw-text-h2;
  }
</style>
