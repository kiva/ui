<template>
	<div class="tw-flex tw-flex-col tw-justify-center tw-gap-0 lg:tw-gap-1.5 tw-items-center">
		<!-- Goal Progress Ring (shown after goal is set) -->
		<GoalProgressRing
			v-if="isGoalSet && !editGoalFromEmail"
			variant="modal"
			:goal-loans="effectiveGoalLoans"
			:goal-progress="loansThisYear"
			:goal-progress-percentage="localGoalProgressPercentage"
			:category-name="selectedCategoryName"
			:category-id="selectedCategoryId"
			:go-to-url="goToUrl"
			:goal-editing-enable="goalEditingEnable"
			@edit-goal-from-email="handleEditGoalFromEmail"
			@button-click="handleSuccessContinue"
		/>
		<!-- Goal Selection Form (shown before goal is set) -->
		<template v-else>
			<img
				:src="HandsPlant"
				class="lg:tw-mb-1 tw-w-10 lg:tw-w-12.5"
			>

			<h2
				class="tw-px-4 lg:tw-px-7 tw-text-center"
				style="line-height: 125%;"
				v-html="titleText"
			>
			</h2>

			<div
				class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2 tw-text-center"
			>
				{{ subtitleText }}
			</div>

			<div
				class="tw-w-full tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 lg:tw-gap-1.5 tw-my-1"
			>
				<template v-if="loadingCurrentYear">
					<KvLoadingPlaceholder
						v-for="n in 3"
						:key="n"
						class="tw-flex-1 !tw-rounded"
						style="min-height: 82px;"
					/>
				</template>
				<template v-else>
					<LoanNumberSelector
						v-for="(option, index) in goalOptions"
						:key="index"
						:loans-number="option.loansNumber"
						:option-text="option.optionText"
						:selected="option.selected"
						:highlighted-text="option.highlightedText"
						@click="updateOptionSelection(index)"
					/>
				</template>
			</div>

			<div class="buttons tw-flex tw-flex-col tw-w-full tw-gap-1.5">
				<KvButton
					class="tw-w-full tw-mt-1.5"
					@click="handleContinue"
				>
					{{ buttonText }}
				</KvButton>

				<KvButton
					variant="ghost"
					class="edit-goal-button tw-w-full"
					@click="editGoal"
				>
					{{ editGoalCopy }}
					<KvMaterialIcon
						:icon="mdiPencilOutline"
						class="tw-ml-0.5"
					/>
				</KvButton>
			</div>
		</template>
	</div>
</template>

<script setup>
import {
	computed,
	inject,
	onMounted,
	ref,
	watch,
} from 'vue';
import { ID_WOMENS_EQUALITY, ID_SUPPORT_ALL, ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import LoanNumberSelector from '#src/components/MyKiva/GoalSetting/LoanNumberSelector';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';
import { KvButton, KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';
import { mdiPencilOutline } from '@mdi/js';
import useGoalData, { SAME_AS_LAST_YEAR_LIMIT, LAST_YEAR_KEY, GOAL_STATUS } from '#src/composables/useGoalData';

const $kvTrackEvent = inject('$kvTrackEvent');

const { getCategoryLoansLastYear, getCategoryLoanCountByYear, getSupportAllLoanCountByYear } = useGoalData();

const props = defineProps({
	/**
	 * Whether the goal has been set on parent component
	 */
	isGoalSet: {
		type: Boolean,
		default: false,
	},
	/**
	 * Categories loan count
	 */
	categoriesLoanCount: {
		type: Object,
		default: () => ({}),
	},
	/**
	 * Tracking category for analytics
	 */
	trackingCategory: {
		type: String,
		default: 'post-checkout',
	},
	/**
     * URL to go to after setting goal
     */
	goToUrl: {
		type: String,
		default: '/mykiva',
	},
	/**
	 * Tiered achievements data (last year)
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Goal Category ID
	 */
	selectedCategoryId: {
		type: String,
		default: ID_WOMENS_EQUALITY,
	},
	/**
	 * Goal Category Name
	 */
	selectedCategoryName: {
		type: String,
		default: 'Women',
	},
	/**
	 * Target number of loans for the goal
	 */
	goalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Current progress (number of loans made toward goal)
	 */
	goalProgress: {
		type: Number,
		default: 0,
	},
	/**
	 * Progress percentage (0-100)
	 */
	goalProgressPercentage: {
		type: Number,
		default: 0,
	},
	/**
	 * Enable edit goal button (only shows when user has a goal set)
	 */
	goalEditingEnable: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if user is editing an existing goal
	 */
	isUpdatingGoal: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'set-goal',
	'edit-goal',
	'set-goal-target',
	'close-modal',
	'edit-goal-from-email',
	'update-goal-target'
]);

const DEFAULT_GOAL_OPTIONS = [
	{
		loansNumber: 3,
		optionText: 'Start strong',
		selected: false
	},
	{
		loansNumber: 4,
		highlightedText: 'Recommended',
		optionText: 'Extra mile',
		selected: false,
	},
	{
		loansNumber: 5,
		optionText: 'Trailblazing!',
		selected: false
	},
];

const goalOptions = ref(DEFAULT_GOAL_OPTIONS);

const loadingCurrentYear = ref(false);
const fetchedCurrentYearLoans = ref(null);
const prevSupportAllCount = ref(0);
const selectedIdx = ref(1);
const editGoalFromEmail = ref(false);

const loansLastYear = computed(() => {
	if (props.selectedCategoryId === ID_SUPPORT_ALL) {
		return prevSupportAllCount.value;
	}

	return getCategoryLoansLastYear(props.tieredAchievements, props.selectedCategoryId);
});

// Use progressForCurrentYear from tieredAchievements if available (set on Thanks page),
// otherwise use fetched current year data (for MyKiva goal-setting page and modal)
const loansThisYear = computed(() => {
	const categoryAchievement = props.tieredAchievements?.find(
		entry => entry.id === props.selectedCategoryId
	);
	// If progressForCurrentYear is explicitly set (Thanks page), use it
	if (typeof categoryAchievement?.progressForCurrentYear === 'number') {
		return categoryAchievement.progressForCurrentYear;
	}
	// Otherwise use fetched data (MyKiva goal-setting page and modal)
	return fetchedCurrentYearLoans.value ?? 0;
});

/**
 * Fetch current year loan count when not provided via props.
 * This is needed for the MyKiva goal-setting page and modal where progressForCurrentYear
 * is not set (only last year data comes from tieredAchievements).
 */
const loadLoansThisYear = async () => {
	// Check if progressForCurrentYear is already provided via props
	const categoryAchievement = props.tieredAchievements?.find(
		entry => entry.id === props.selectedCategoryId
	);
	if (typeof categoryAchievement?.progressForCurrentYear === 'number') {
		// Already have current year data from props (Thanks page), no need to fetch
		return;
	}

	loadingCurrentYear.value = true;
	const currentYear = new Date().getFullYear();
	const count = await getCategoryLoanCountByYear(props.selectedCategoryId, currentYear, 'network-only');
	fetchedCurrentYearLoans.value = count;
	loadingCurrentYear.value = false;
};

const titleText = computed(() => {
	// Default title if no lending history and category is ID_WOMENS_EQUALITY
	if (props.selectedCategoryId === ID_WOMENS_EQUALITY && loansLastYear.value === 0) {
		return 'Lenders like you help <br><span class="tw-text-eco-green-3">3 women</span> a year';
	}

	// Support All is not a specific category, so use generic language
	if (props.selectedCategoryId === ID_SUPPORT_ALL) {
		return 'How many loans will you make this year?';
	}
	if (props.selectedCategoryId === ID_US_ECONOMIC_EQUALITY) {
		return 'How many loans to <span class="tw-text-eco-green-3">U.S. entrepreneurs</span> will you make this year?';
	}
	// eslint-disable-next-line max-len
	return `How many loans to <span class="tw-text-eco-green-3">${props.selectedCategoryName?.toLowerCase()}</span> will you make this year?`;
});

const subtitleText = computed(() => {
	if (loansThisYear.value > 0) {
		return `You've already made ${loansThisYear.value} that will count`;
	}
	return '';
});

const yearToDate = new Date().getFullYear();

const buttonText = computed(() => {
	if (editGoalFromEmail.value) {
		return `Update ${yearToDate} goal`;
	}
	return `Set ${yearToDate} goal`;
});

const selectedTarget = computed(() => {
	const selectedOption = goalOptions.value.find(option => option.selected);
	return selectedOption?.loansNumber ?? DEFAULT_GOAL_OPTIONS[1].loansNumber;
});

// Use goalLoans prop if available, otherwise fall back to selectedTarget
const effectiveGoalLoans = computed(() => {
	return props.goalLoans > 0 ? props.goalLoans : selectedTarget.value;
});

// Calculate progress percentage based on loansThisYear and effective goal
const localGoalProgressPercentage = computed(() => {
	if (!effectiveGoalLoans.value || effectiveGoalLoans.value === 0) return 0;
	return Math.min(Math.round((loansThisYear.value / effectiveGoalLoans.value) * 100), 100);
});

const resetOptionSelection = selectedIndex => {
	goalOptions.value = goalOptions.value.map((option, index) => ({
		...option,
		selected: index === selectedIndex,
	}));
};

const updateOptionSelection = selectedIndex => {
	resetOptionSelection(selectedIndex);
	selectedIdx.value = selectedIndex;
	const trackingProperties = ['same-as-last-year', 'a-little-more', 'double'];
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		'set-goal-amount',
		trackingProperties[selectedIndex]
	);
	emit('set-goal-target', goalOptions.value[selectedIndex].loansNumber);
};

const editGoal = () => {
	emit('edit-goal');
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		'edit-goal-category'
	);
};

const handleSuccessContinue = () => {
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		props.goToUrl === '/mykiva' ? 'go-to-mykiva' : 'continue-towards-goal'
	);
	window.location.href = props.goToUrl;
};

const handleContinue = () => {
	const currentYear = new Date().getFullYear();
	const goalName = `goal-${props.selectedCategoryId}-${currentYear}`;
	const target = selectedTarget.value;
	const dateStarted = new Date().toISOString();
	const loanTotalAtStart = props.categoriesLoanCount?.[props.selectedCategoryId] || 0;
	const preferences = {
		goalName,
		category: props.selectedCategoryId,
		target,
		dateStarted,
		status: GOAL_STATUS.IN_PROGRESS,
		loanTotalAtStart,
	};
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		'set-annual-goal',
		props.selectedCategoryId,
		selectedTarget.value
	);

	if (props.isUpdatingGoal) {
		emit('update-goal-target', preferences);
	} else {
		emit('set-goal', preferences);
	}

	editGoalFromEmail.value = false;
};

const updateGoalOptions = () => {
	const ytdLoans = loansThisYear.value;
	const lastYearLoans = loansLastYear.value;

	// Only show personalized options if user has lending history
	if (ytdLoans >= SAME_AS_LAST_YEAR_LIMIT) {
		const suggestion1 = ytdLoans + 3;
		// Ensure each suggestion is at least 1 more than the previous
		const suggestion2 = Math.max(Math.ceil(suggestion1 * 1.25), suggestion1 + 1);
		const suggestion3 = Math.max(suggestion1 * 2, suggestion2 + 1);

		goalOptions.value = [
			{
				loansNumber: suggestion1,
				optionText: 'A few more',
				selected: false
			},
			{
				loansNumber: suggestion2,
				optionText: 'Grow a little',
				selected: false,
				highlightedText: 'More Impact'
			},
			{
				loansNumber: suggestion3,
				optionText: 'Aim higher',
				selected: false
			},
		];
	} else if (lastYearLoans > SAME_AS_LAST_YEAR_LIMIT) {
		const suggestion1 = lastYearLoans;
		// Ensure each suggestion is at least 1 more than the previous
		const suggestion2 = Math.max(Math.ceil(suggestion1 * 1.25), suggestion1 + 1);
		const suggestion3 = Math.max(suggestion1 * 2, suggestion2 + 1);

		goalOptions.value = [
			{
				loansNumber: suggestion1,
				optionText: `Same as ${LAST_YEAR_KEY}`,
				selected: false
			},
			{
				loansNumber: suggestion2,
				optionText: 'Grow a little',
				selected: false,
				highlightedText: 'More Impact'
			},
			{
				loansNumber: suggestion3,
				optionText: 'Double my impact!',
				selected: false
			},
		];
	} else {
		goalOptions.value = DEFAULT_GOAL_OPTIONS;
	}

	// Keep previous selection
	resetOptionSelection(selectedIdx.value);
	emit('set-goal-target', selectedTarget.value);
};

const handleEditGoalFromEmail = () => {
	editGoalFromEmail.value = true;
	$kvTrackEvent('event-tracking', 'click', 'edit-goal');
	emit('edit-goal-from-email');
};

onMounted(async () => {
	await loadLoansThisYear();
	updateGoalOptions();

	if (props.trackingCategory === 'post-checkout') {
		$kvTrackEvent(
			'post-checkout',
			'view',
			'set-annual-goal'
		);
	}
});

const editGoalCopy = computed(() => {
	if (editGoalFromEmail.value) {
		return 'Customize your goal';
	}
	return 'Edit goal';
});

watch(() => props.selectedCategoryId, async newCategory => {
	await loadLoansThisYear();
	updateGoalOptions();

	if (newCategory === ID_SUPPORT_ALL) {
		prevSupportAllCount.value = await getSupportAllLoanCountByYear(LAST_YEAR_KEY);
	}
});

</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
