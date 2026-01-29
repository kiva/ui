<template>
	<div class="tw-flex tw-flex-col tw-justify-center tw-gap-0 lg:tw-gap-1.5 tw-items-center">
		<img
			:src="HandsPlant"
			v-if="!isGoalSet"
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
			v-if="isGoalSet" class="tw-flex tw-justify-center tw-items-center"
		>
			<img
				:src="HandsPlant"
				style="max-width: 200px;"
				class="lg:tw-mb-1 tw-w-full tw-h-full"
				alt="gif"
			>
		</div>

		<div
			v-else
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
				v-if="!isGoalSet"
				variant="ghost"
				class="edit-goal-button tw-w-full"
				@click="editGoal"
			>
				Edit goal category
				<KvMaterialIcon
					:icon="mdiPencilOutline"
					class="tw-ml-0.5"
				/>
			</KvButton>
		</div>
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
import { ID_WOMENS_EQUALITY, ID_SUPPORT_ALL } from '#src/composables/useBadgeData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import LoanNumberSelector from '#src/components/MyKiva/GoalSetting/LoanNumberSelector';
import { KvButton, KvMaterialIcon, KvLoadingPlaceholder } from '@kiva/kv-components';
import { mdiPencilOutline } from '@mdi/js';
import useGoalData, { SAME_AS_LAST_YEAR_LIMIT, LAST_YEAR_KEY } from '#src/composables/useGoalData';
import logFormatter from '#src/util/logFormatter';

const $kvTrackEvent = inject('$kvTrackEvent');

const { getCategoryLoansLastYear, getCategoryLoanCountByYear, getLoanStatsByYear } = useGoalData();

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
	}
});

const emit = defineEmits(['set-goal', 'edit-goal', 'set-goal-target']);

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
		selected: true,
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
	if (props.isGoalSet) {
		return 'Success! Your goal is set!';
	}
	if (loansLastYear.value === 1) {
		// eslint-disable-next-line max-len
		return `Last year, you helped <span class="tw-text-eco-green-3">${loansLastYear.value} woman</span> shape her future!`;
	}
	if (loansLastYear.value > SAME_AS_LAST_YEAR_LIMIT) {
		// eslint-disable-next-line max-len
		return `Last year, you helped <span class="tw-text-eco-green-3">${loansLastYear.value} women</span> shape their futures!`;
	}

	return 'Lenders like you help <br><span class="tw-text-eco-green-3">3 women</span> a year';
});

const subtitleText = computed(() => {
	let extraText = '';
	if (loansThisYear.value > 0) {
		extraText = `You've already made ${loansThisYear.value}.`;
	}
	return props.isGoalSet
		? ''
		: `How many loans will you make this year? ${extraText}`;
});

const buttonText = computed(() => {
	if (!props.isGoalSet) {
		return 'Set 2026 goal';
	}

	if (props.goToUrl !== '/mykiva') {
		return 'Start my goal';
	}

	return 'Track my progress';
});

const selectedTarget = computed(() => {
	const selectedOption = goalOptions.value.find(option => option.selected);
	return selectedOption.loansNumber;
});

const updateOptionSelection = selectedIndex => {
	goalOptions.value = goalOptions.value.map((option, index) => ({
		...option,
		selected: index === selectedIndex,
	}));
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

const handleContinue = () => {
	if (props.isGoalSet) {
		window.location.href = props.goToUrl;
		$kvTrackEvent(
			props.trackingCategory,
			'click',
			props.goToUrl === '/mykiva' ? 'go-to-mykiva' : 'continue-towards-goal'
		);
	} else {
		const currentYear = new Date().getFullYear();
		const goalName = `goal-${props.selectedCategoryId}-${currentYear}`;
		const target = selectedTarget.value;
		const dateStarted = new Date().toISOString();
		const status = 'in-progress';
		const loanTotalAtStart = props.categoriesLoanCount?.[props.selectedCategoryId] || 0;
		const preferences = {
			goalName,
			category: props.selectedCategoryId,
			target,
			dateStarted,
			status,
			loanTotalAtStart,
		};
		emit('set-goal', preferences);
		$kvTrackEvent(
			props.trackingCategory,
			'click',
			'set-annual-goal',
			props.selectedCategoryId,
			selectedTarget.value
		);
	}
};

const updateGoalOptions = () => {
	const ytdLoans = loansThisYear.value;
	const lastYearLoans = loansLastYear.value;

	// Determine base amount and labels based on whether YTD exceeds last year
	// Goal suggestions must always be higher than YTD to prevent auto-completion
	const useYtdAsBase = ytdLoans >= lastYearLoans;
	const base = useYtdAsBase ? ytdLoans : lastYearLoans;

	// Only show personalized options if user has lending history
	if (base > SAME_AS_LAST_YEAR_LIMIT) {
		const suggestion1 = useYtdAsBase ? base + 1 : base;
		// Ensure each suggestion is at least 1 more than the previous
		const suggestion2 = Math.max(Math.ceil(base * 1.5), suggestion1 + 1);
		const suggestion3 = Math.max(base * 2, suggestion2 + 1);

		goalOptions.value = [
			{
				loansNumber: suggestion1,
				optionText: useYtdAsBase ? 'One more' : 'Same as last year',
				selected: false
			},
			{
				loansNumber: suggestion2,
				optionText: 'Grow a little',
				selected: true,
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
	emit('set-goal-target', selectedTarget.value);
};

const prevSupportAllLoanCount = async () => {
	try {
		const stats = await getLoanStatsByYear(LAST_YEAR_KEY, 'network-only');
		prevSupportAllCount.value = stats?.count || 0;
	} catch (error) {
		logFormatter(error, 'Failed to load previous support-all loan count');
		return null;
	}
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

watch(() => props.selectedCategoryId, async newCategory => {
	await loadLoansThisYear();
	updateGoalOptions();

	if (newCategory === ID_SUPPORT_ALL) {
		await prevSupportAllLoanCount();
	}
});

watch(() => props.isGoalSet, newVal => {
	// Re-run gif animation when goal is set
	if (newVal) {
		const imgElement = document.querySelector('img[alt="gif"]');
		if (imgElement) {
			const { src } = imgElement;
			imgElement.src = '';
			setTimeout(() => {
				imgElement.src = src;
			}, 50);
		}
	}
});
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
