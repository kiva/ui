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
				tracking-category="event-tracking"
				@set-goal-target="setTarget($event)"
				@set-goal="setGoal($event)"
				@edit-goal="editGoalCategory"
			/>
			<div
				v-show="showCategories"
			>
				<h2
					v-html="title"
					class="tw-mb-3 tw-text-left lg:tw-text-center"
				></h2>
				<CategoryForm
					:key="categoryFormKey"
					:categories="categories"
					:pre-selected-category="selectedCategory.id"
					@category-selected="handleCategorySelected"
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
						Set 2026 goal
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
	computed
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronLeft } from '@mdi/js';
import { KvLoadingPlaceholder, KvMaterialIcon, KvButton } from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import CategoryForm from '#src/components/MyKiva/GoalSetting/CategoryForm';
import useGoalData from '#src/composables/useGoalData';

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

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

const selectedCategory = ref(categories[0]);

const title = computed(() => {
	return `Make <span class="tw-text-eco-green-3">${loanTarget.value} loans</span> to...`;
});

const editGoalCategory = () => {
	// Force CategoryForm to re-render so it reverts to the default selected category
	categoryFormKey.value += 1;
	showCategories.value = true;
	window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};

const setTarget = target => {
	loanTarget.value = target;
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	// Use goalProgress to calculate remaining loans needed based on current year progress
	ctaHref.value = getCtaHref(
		loanTarget.value,
		selectedCategory.value?.badgeId,
		router,
		goalProgress.value
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
