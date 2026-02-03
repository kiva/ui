<template>
	<div class="tw-min-h-screen lg:tw-min-h-full md:tw-mt-5 tw-mt-2">
		<button
			class="tw-flex tw-gap-1 tw-items-center tw-font-medium tw-mb-4"
			@click="goToDashboard"
		>
			<KvMaterialIcon
				:icon="mdiChevronLeft"
				class="tw-ml-0.5"
			/>
			To dashboard
		</button>
		<KvLoadingPlaceholder
			v-if="loading"
			class="!tw-rounded tw-mx-auto"
			style="max-width: 644px; min-height: 495px;"
		/>
		<div
			v-else
			class="tw-mx-auto"
			style="max-width: 644px;"
		>
			<GoalSelector
				class="goal-selector"
				v-show="!showCategories"
				:is-goal-set="isGoalSet"
				:categories-loan-count="categoriesLoanCount"
				:tiered-achievements="tieredAchievements"
				:go-to-url="ctaHref"
				:is-editing="isEditing"
				:selected-category-id="selectedCategory.badgeId"
				:selected-category-name="selectedCategory.name"
				tracking-category="event-tracking"
				@set-goal-target="setTarget($event)"
				@set-goal="setGoal($event)"
				@edit-goal="editGoalCategory"
			/>
			<div
				v-show="showCategories"
			>
				<h2
					class="tw-mb-3 tw-text-left lg:tw-text-center"
				>
					Choose an impact area
				</h2>
				<component
					v-show="showCategories"
					:is="contentComponent"
					:categories="categories"
					:pre-selected-category="selectedCategory.id"
					:selected-category="selectedCategory"
					:selected-goal-number="selectedGoalNumber"
					@category-selected="handleCategorySelected"
					@number-changed="handleNumberChanged"
				/>
				<div
					class="buttons tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-flex tw-flex-col tw-justify-center
						tw-w-full lg:tw-w-auto tw-z-sticky lg:tw-z-auto tw-gap-1.5 tw-mt-4 tw-bg-primary
						tw-p-2.5 lg:tw-p-0"
				>
					<KvButton
						class="tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto"
						style="min-width: 324px;"
						@click="handleClick"
					>
						{{ ctaCopy }}
					</KvButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	inject,
	onMounted,
	computed,
	defineAsyncComponent
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronLeft } from '@mdi/js';
import { KvLoadingPlaceholder, KvMaterialIcon, KvButton } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import useGoalData from '#src/composables/useGoalData';
import { ID_SUPPORT_ALL } from '#src/composables/useBadgeData';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	userGoal,
	loadGoalData,
	storeGoalPreferences,
	loading,
	getCategories,
	getCtaHref,
	goalProgress,
	getLoanStatsByYear,
} = useGoalData({ apollo });

const props = defineProps({
	/**
	 * Total number of loans across all categories
	 */
	totalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Object with loan counts per category
	 */
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Tiered achievements data
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
});

const isGoalSet = ref(false);
const loanTarget = ref(0);
const showCategories = ref(false);
const ctaHref = ref('');
const categoryFormKey = ref(0);
const isEditing = ref(false);
const formStep = ref(1);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

const selectedCategory = ref(categories[0]);

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 2: return NumberChoice;
		case 1: default: return CategoryForm;
	}
});

const editGoalCategory = () => {
	// Force CategoryForm to re-render so it reverts to the default selected category
	categoryFormKey.value += 1;
	showCategories.value = true;
	isEditing.value = true;
	window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};

const setTarget = target => {
	loanTarget.value = target;
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	// For ID_SUPPORT_ALL, load yearly loan count to calculate correct progress
	let currentProgress = goalProgress.value;
	if (selectedCategory.value?.badgeId === ID_SUPPORT_ALL) {
		const stats = await getLoanStatsByYear(new Date().getFullYear(), 'network-only');
		currentProgress = stats?.count || 0;
	}
	// Use goalProgress to calculate remaining loans needed based on current year progress
	ctaHref.value = getCtaHref(
		loanTarget.value,
		selectedCategory.value?.badgeId,
		router,
		currentProgress
	);
	isGoalSet.value = true;
	showCategories.value = false;
};

const handleCategorySelected = categoryId => {
	const categoryIdx = categoryId - 1;
	selectedCategory.value = categories[categoryIdx];
	if (showCategories.value) {
		$kvTrackEvent(
			'event-tracking',
			'click',
			'choose-goal-category',
			selectedCategory.value?.eventProp
		);
	}
};

const handleClick = () => {
	if (isEditing.value) {
		isEditing.value = false;
		showCategories.value = false;
		formStep.value = 1;

		return;
	}
	const categorySelected = selectedCategory.value?.badgeId;

	const currentYear = new Date().getFullYear();
	const goalName = `goal-${categorySelected}-${currentYear}`;
	const target = loanTarget.value;
	const dateStarted = new Date().toISOString();
	const status = 'in-progress';

	const preferences = {
		goalName,
		category: categorySelected,
		target,
		dateStarted,
		status,
	};

	setGoal(preferences);

	$kvTrackEvent(
		'event-tracking',
		'click',
		'set-annual-goal',
		categorySelected,
		loanTarget.value
	);
};

const goToDashboard = () => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard');
	router.push('/mykiva');
};

const handleNumberChanged = number => {
	console.log(number);
};

const ctaCopy = computed(() => {
	if (isEditing.value) {
		return 'Continue';
	}

	if (props.goalsV2Enabled) {
		return 'Set 2026 goal';
	}
	return formStep.value === 1 ? 'Continue' : 'Set my goal';
});

onMounted(async () => {
	await loadGoalData({ yearlyProgress: true });
	const isEmptyGoal = Object.keys(userGoal.value || {}).length === 0;
	if (!isEmptyGoal) {
		const { target, category } = userGoal.value;
		// Use goalProgress which tracks current year progress
		ctaHref.value = getCtaHref(target, category, router, goalProgress.value);
		isGoalSet.value = true;
	}
	$kvTrackEvent('event-tracking', 'view', 'goals-page');
});
</script>

<style lang="postcss" scoped>
.buttons {
    box-shadow: 0 0 12px 0 rgb(0 0 0 / 8%);
    @screen lg {
        box-shadow: none;
    }
}

.goal-selector :deep(.buttons) {
    @apply tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-z-sticky lg:tw-z-auto tw-bg-primary tw-p-2.5 lg:tw-p-0;

    box-shadow: 0 0 12px 0 rgb(0 0 0 / 8%);
    @screen lg {
        box-shadow: none;
    }
}

.goal-selector :deep(button) {
    @apply tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto;

	min-width: 324px;
}
</style>
