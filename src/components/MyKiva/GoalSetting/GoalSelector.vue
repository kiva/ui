<template>
	<div class="tw-flex tw-flex-col tw-justify-center tw-gap-0 lg:tw-gap-1.5 tw-items-center">
		<!-- Goal Progress Ring (shown after goal is set) -->
		<GoalProgressRing
			v-if="isGoalSet && !editGoalFromSettings"
			variant="modal"
			:goal-loans="effectiveGoalLoans"
			:goal-progress="goalProgress"
			:goal-progress-percentage="localGoalProgressPercentage"
			:category-name="selectedCategoryName"
			:category-id="selectedCategoryId"
			:go-to-url="goToUrl"
			:is-updating-goal="isUpdatingGoal"
			:is-goal-completed="isGoalCompleted"
			:is-goal-tile-experiment-enabled="isGoalTileExperimentEnabled"
			@edit-goal-from-settings="handleEditGoalFromSettings"
			@button-click="handleSuccessContinue"
		/>
		<!-- Goal Selection Form (shown before goal is set) -->
		<template v-else>
			<img
				v-if="!isGoalTileExperimentEnabled"
				:src="HandsPlant"
				class="lg:tw-mb-1 tw-w-10 lg:tw-w-12.5"
			>
			<KvLoadingPlaceholder
				v-if="isLoadingData"
				class="!tw-w-full !tw-h-10 !tw-rounded tw-mb-1 lg:tw-mb-0"
			/>
			<template
				v-else
			>
				<img
					v-if="isGoalTileExperimentEnabled && !isGoalSet && !isLarge"
					:src="HandsPlant"
					class="lg:tw-mb-1 tw-w-10 lg:tw-w-12.5 tw-mx-auto"
				>
				<h2
					class="tw-text-headline tw-px-4 lg:tw-px-7 tw-text-center"
					style="line-height: 125%;"
					v-html="titleText"
				>
				</h2>
			</template>

			<KvLoadingPlaceholder
				v-if="isLoadingData || loadingCurrentYear"
				class="!tw-w-full !tw-h-4 !tw-rounded"
			/>

			<p
				v-if="showLoanQuestionPrompt"
				class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2 tw-text-center"
			>
				How many loans will you make this year?
			</p>

			<p
				v-if="showGoalValuePropsCopy"
				v-html="subtitleText"
				class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2 tw-text-center"
			>
			</p>

			<div
				class="tw-w-full tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 lg:tw-gap-1.5 tw-my-1"
			>
				<template v-if="loadingCurrentYear || isLoadingData">
					<KvLoadingPlaceholder
						v-for="n in 3"
						:key="n"
						class="tw-flex-1 !tw-rounded number-option-placeholder"
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
						:custom-goal-amount-enable="customGoalAmountEnable"
						@click="updateOptionSelection(index)"
					/>
					<!-- Custom goal amount option -->
					<div
						v-if="customGoalAmountEnable"
						class="tw-border-2 tw-border-gray-200 tw-rounded tw-px-2 tw-py-1 lg:tw-py-2 tw-cursor-pointer
							tw-gap-1"
						:class="{ '!tw-border-eco-green-3 tw-bg-eco-green-1 !tw-py-1.5 lg:tw-py-2': isCustomIndex }"
						@click="updateOptionSelection(CUSTOM_LOAN_NUMBER_INDEX)"
					>
						<div
							class="tw-flex lg:tw-flex-col tw-justify-between
							lg:tw-justify-center tw-items-center tw-gap-1"
						>
							<div class="tw-text-eco-green-3 tw-text-center tw-flex tw-items-center tw-gap-1">
								<span class="tw-text-display lg:tw-text-headline tw--mt-1">
									&#43;
								</span>
								<span class="lg:tw-hidden tw-text-base !tw-font-medium">
									Custom
								</span>
							</div>
							<div class="tw-text-primary tw-font-medium tw-text-label tw-text-center">
								<span class="tw-hidden lg:tw-inline">
									Custom
								</span>
								<div class="tw-flex tw-flex-col tw-items-start tw-gap-0.5">
									<span
										class="tw-font-medium lg:tw-hidden"
										:class="{ 'tw-text-small': isCustomIndex }"
									>
										Set your number
									</span>
									<GoalCustomAmountInput
										v-if="isCustomIndex"
										class="lg:tw-hidden"
										is-mobile
										:valid-custom-amount="validCustomAmount"
										:loan-value="customGoalAmount"
										@validate-custom-amount="validateCustomAmount"
										style="max-width: 136px;"
									/>
								</div>
							</div>
						</div>
						<div
							v-if="validCustomAmount === false"
							class="lg:tw-hidden tw-text-danger-highlight tw-text-small tw-mt-1"
							v-html="customGoalAmountError"
						>
						</div>
					</div>
				</template>
			</div>

			<div
				v-if="customGoalAmountEnable && isCustomIndex && !loadingCurrentYear && !isLoadingData"
				class="tw-hidden lg:tw-flex tw-flex-col tw-bg-eco-green-1 tw-px-2.5 tw-py-1.5 tw-w-full
					tw-rounded-sm"
			>
				<div class="tw-flex tw-justify-between tw-items-center">
					<div class="tw-text-base">
						Customize your number of loans
					</div>
					<GoalCustomAmountInput
						:valid-custom-amount="validCustomAmount"
						:loan-value="customGoalAmount"
						@validate-custom-amount="validateCustomAmount"
						style="max-width: 148px;"
					/>
				</div>
				<div
					v-if="validCustomAmount === false"
					class="tw-text-right tw-text-danger-highlight tw-text-small tw-mt-1"
					v-html="customGoalAmountError"
				></div>
			</div>

			<template
				v-if="isGoalTileExperimentEnabled && !isLarge && !isGoalSet"
			>
				<KvAccordionItem ref="goalTileAccordion" id="goal-tile-accordion-body" class="goal-tile-accordion">
					<template
						#header
					>
						<p class="tw-text-brand-900 !tw-font-semibold" @click="handleOpenGoalTile">
							Why set a goal?
						</p>
					</template>
					<div class="tw-text-justify tw-text-primary tw-text-base">
						<ul class="tw-inline-block">
							<li class="tw-flex tw-items-start tw-gap-1 tw-mb-1">
								<KvMaterialIcon
									class="tw-w-1.5 tw-h-1.5 tw-text-base tw-flex-shrink-0 tw-self-center"
									:icon="mdiCheckBold"
								/>
								<p class="tw-text-left">
									Build a habit of helping others
								</p>
							</li>
							<li class="tw-flex tw-items-start tw-gap-1 tw-mb-1">
								<KvMaterialIcon
									class="tw-w-1.5 tw-h-1.5 tw-text-base tw-flex-shrink-0 tw-self-center"
									:icon="mdiCheckBold"
								/>
								<p class="tw-text-left">
									Track your impact as it grows
								</p>
							</li>
							<li class="tw-flex tw-items-start tw-gap-1 tw-mb-1">
								<KvMaterialIcon
									class="tw-w-1.5 tw-h-1.5 tw-text-base tw-flex-shrink-0 tw-self-center"
									:icon="mdiCheckBold"
								/>
								<p class="tw-text-left">
									Stay consistent with reminders
								</p>
							</li>
							<li class="tw-flex tw-items-start tw-gap-1 tw-mb-1">
								<KvMaterialIcon
									class="tw-w-1.5 tw-h-1.5 tw-text-base tw-flex-shrink-0 tw-self-center"
									:icon="mdiCheckBold"
								/>
								<p class="tw-text-left">
									Edit anytime
								</p>
							</li>
						</ul>
					</div>
				</KvAccordionItem>
			</template>

			<p
				v-if="subtitleText && !showGoalValuePropsCopy"
				v-html="subtitleText"
				class="tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2 tw-text-center"
			>
			</p>

			<div class="buttons tw-flex tw-flex-col tw-w-full tw-gap-1.5">
				<KvButton
					class="tw-w-full tw-mt-1.5"
					@click="handleContinue"
					:disabled="isLoadingData || loadingCurrentYear || (isCustomIndex && validCustomAmount !== true)"
				>
					{{ buttonText }}
				</KvButton>

				<KvButton
					variant="ghost"
					class="edit-goal-button tw-w-full"
					@click="editGoal"
					:disabled="isLoadingData || loadingCurrentYear"
				>
					{{ editGoalCopy }}
					<KvMaterialIcon
						:icon="mdiPencilOutline"
						class="tw-ml-0.5 tw-w-2.5"
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
import { mdiPencilOutline, mdiCheckBold } from '@mdi/js';
import {
	KvButton, KvMaterialIcon, KvLoadingPlaceholder, KvAccordionItem
} from '@kiva/kv-components';

import { ID_WOMENS_EQUALITY, ID_SUPPORT_ALL, ID_US_ECONOMIC_EQUALITY } from '#src/composables/useBadgeData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import LoanNumberSelector from '#src/components/MyKiva/GoalSetting/LoanNumberSelector';
import GoalProgressRing from '#src/components/MyKiva/GoalProgressRing';
import GoalCustomAmountInput from '#src/components/MyKiva/GoalSetting/GoalCustomAmountInput';
import useGoalData, { LAST_YEAR_KEY, GOAL_STATUS } from '#src/composables/useGoalData';
import useBreakpoints from '#src/composables/useBreakpoints';
import goalCopy, { GOAL_SIGNUP_COPY_NO_GOAL_YET } from '#src/util/goalCopy';

const CUSTOM_LOAN_NUMBER_INDEX = 3;

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
	 * Flag to indicate if user is editing an existing goal
	 */
	isUpdatingGoal: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if component is rendered within goal settings page
	 */
	inGoalSettingsPage: {
		type: Boolean,
		default: false,
	},
	/**
	 * Flag to indicate if the goal has been completed
	 */
	isGoalCompleted: {
		type: Boolean,
		default: false,
	},
	/**
	 * Loading state for goal data (used in GoalSelector after loading goal)
	 */
	isLoadingData: {
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
	 * Whether the custom goal amount feature is enabled
	 */
	customGoalAmountEnable: {
		type: Boolean,
		default: true,
	},
	/**
	 * Flag to indicate if the goal value props copy version should be shown
	 */
	showGoalValuePropsCopy: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'set-goal',
	'edit-goal',
	'set-goal-target',
	'close-modal',
	'edit-goal-from-settings',
	'update-goal'
]);

const { isLarge } = useBreakpoints();

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
const editGoalFromSettings = ref(false);
const allowBackToCategorySelection = ref(false);
const isGoalTileOpened = ref(false);
const goalTileAccordion = ref(null);
const customGoalAmount = ref(null);
const validCustomAmount = ref(null);
const customGoalAmountError = ref('');
const goalSignupCopyVariant = computed(() => goalCopy.getGoalSignupCopyVariant());

const loansLastYear = computed(() => {
	if (props.selectedCategoryId === ID_SUPPORT_ALL) {
		return prevSupportAllCount.value;
	}

	return getCategoryLoansLastYear(props.tieredAchievements, props.selectedCategoryId);
});

const showLoanQuestionPrompt = computed(() => {
	return goalSignupCopyVariant.value === GOAL_SIGNUP_COPY_NO_GOAL_YET
		|| (!props.showGoalValuePropsCopy
			&& (loansLastYear.value > 0 || props.selectedCategoryId === ID_WOMENS_EQUALITY));
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

const isCustomIndex = computed(() => selectedIdx.value === CUSTOM_LOAN_NUMBER_INDEX);

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
	const count = await getCategoryLoanCountByYear(props.selectedCategoryId, currentYear);
	fetchedCurrentYearLoans.value = count;
	loadingCurrentYear.value = false;
};

const titleText = computed(() => {
	if (goalSignupCopyVariant.value === GOAL_SIGNUP_COPY_NO_GOAL_YET) {
		return goalCopy.CARD_NO_GOAL_YET_EXPERIMENT;
	}

	// Default title if no lending history and category is ID_WOMENS_EQUALITY
	if (
		!props.showGoalValuePropsCopy
		&& props.selectedCategoryId === ID_WOMENS_EQUALITY
		&& loansLastYear.value === 0
	) {
		return goalCopy.titleNoHistoryWomensDefault();
	}

	if (loansLastYear.value > 0 && !props.showGoalValuePropsCopy) {
		// eslint-disable-next-line max-len
		return goalCopy.titleLastYearForCategory(loansLastYear.value, props.selectedCategoryId, props.selectedCategoryName);
	}

	// Support All is not a specific category, so use generic language
	if (props.selectedCategoryId === ID_SUPPORT_ALL) {
		return goalCopy.TITLE_HOW_MANY_LOANS_GENERIC;
	}
	if (props.selectedCategoryId === ID_US_ECONOMIC_EQUALITY) {
		return goalCopy.TITLE_US_ENTREPRENEURS_HOW_MANY_LOANS;
	}
	return goalCopy.titleCategoryHowManyLoans(props.selectedCategoryName?.toLowerCase());
});

const subtitleText = computed(() => {
	if (loansThisYear.value > 0) {
		return goalCopy.subtitleLoansAlreadyMade(loansThisYear.value, !props.showGoalValuePropsCopy);
	}
	return '';
});

const buttonText = computed(() => {
	if (editGoalFromSettings.value || props.isUpdatingGoal) {
		return goalCopy.BUTTON_UPDATE_GOAL;
	}
	return goalCopy.BUTTON_SET_GOAL;
});

const selectedTarget = computed(() => {
	const selectedOption = goalOptions.value.find(option => option.selected);
	if (isCustomIndex.value && customGoalAmount.value > 0) {
		return Number(customGoalAmount.value);
	}
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

const minCustomAmount = computed(() => {
	return loansThisYear.value > 1 ? loansThisYear.value + 1 : 2;
});

const resetOptionSelection = selectedIndex => {
	isGoalTileOpened.value = false;
	goalTileAccordion.value?.collapse();
	goalOptions.value = goalOptions.value.map((option, index) => ({
		...option,
		selected: index === selectedIndex,
	}));
	validCustomAmount.value = null;
	customGoalAmount.value = null;
};

const updateOptionSelection = selectedIndex => {
	resetOptionSelection(selectedIndex);
	selectedIdx.value = selectedIndex;
	const trackingProperties = ['same-as-last-year', 'a-little-more', 'double', 'custom'];
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		'set-goal-amount',
		trackingProperties[selectedIndex]
	);
	if (!isCustomIndex.value) {
		emit('set-goal-target', goalOptions.value[selectedIndex].loansNumber);
	}
};

const validateCustomAmount = value => {
	customGoalAmount.value = value;
	const amount = Number(value);

	if (loansThisYear.value > 1 && amount < minCustomAmount.value) {
		const loanWord = loansThisYear.value === 1 ? 'loan' : 'loans';
		validCustomAmount.value = false;
		customGoalAmountError.value = goalCopy.customAmountBelowYearProgress(loansThisYear.value, loanWord);
	} else if (!value || Number.isNaN(amount) || amount <= 1) {
		validCustomAmount.value = false;
		customGoalAmountError.value = goalCopy.CUSTOM_AMOUNT_INVALID;
	} else {
		validCustomAmount.value = true;
		customGoalAmountError.value = '';
		emit('set-goal-target', selectedTarget.value);
	}
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

	const label = props.isUpdatingGoal ? 'confirm-edit-goal' : 'set-annual-goal';

	$kvTrackEvent(
		props.trackingCategory,
		'click',
		label,
		props.selectedCategoryId,
		selectedTarget.value
	);

	if (isCustomIndex.value) {
		$kvTrackEvent(
			props.trackingCategory,
			'click',
			'custom-goal-set',
			selectedTarget.value
		);
	}
	if (props.isUpdatingGoal) {
		emit('update-goal', preferences);
	} else {
		emit('set-goal', preferences);
	}

	editGoalFromSettings.value = false;
	allowBackToCategorySelection.value = false;
};

const updateGoalOptions = () => {
	const ytdLoans = loansThisYear.value;
	const lastYearLoans = loansLastYear.value;

	// Use last year loans as the base if user had more loans last year than year-to-date,
	// otherwise use year-to-date as the base
	if (lastYearLoans > ytdLoans && lastYearLoans > 2) {
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
	} else if (ytdLoans) {
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
	} else {
		goalOptions.value = DEFAULT_GOAL_OPTIONS;
	}

	// Keep previous selection
	resetOptionSelection(selectedIdx.value);
	emit('set-goal-target', selectedTarget.value);
};

const handleEditGoalFromSettings = () => {
	editGoalFromSettings.value = true;
	$kvTrackEvent('event-tracking', 'click', 'edit-goal');
	emit('edit-goal-from-settings');
};

const handleOpenGoalTile = () => {
	if (props.isGoalTileExperimentEnabled && props.trackingCategory === 'portfolio' && !isGoalTileOpened.value) {
		$kvTrackEvent(
			'portfolio',
			'click',
			'why-set-a-goal'
		);
		isGoalTileOpened.value = true;
		return;
	}
	isGoalTileOpened.value = false;
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
	if (allowBackToCategorySelection.value || !props.inGoalSettingsPage) {
		return goalCopy.BUTTON_EDIT_GOAL_CATEGORY;
	}

	return goalCopy.BUTTON_EDIT_GOAL;
});

watch(() => props.selectedCategoryId, async newCategory => {
	await loadLoansThisYear();
	updateGoalOptions();
	if (editGoalFromSettings.value) {
		allowBackToCategorySelection.value = true;
	}

	if (newCategory === ID_SUPPORT_ALL) {
		prevSupportAllCount.value = await getSupportAllLoanCountByYear(LAST_YEAR_KEY);
	}

	customGoalAmount.value = '';
	validCustomAmount.value = null;
	customGoalAmountError.value = '';
	updateOptionSelection(1);
});

</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}

.number-option-placeholder {
	@apply !tw-min-h-7.5 !tw-min-w-15.5;

	@screen lg {
		min-height: 82px;
	}
}

:deep(.goal-tile-accordion) {
	@apply tw-w-full !tw-border-b-0;
}

:deep(.goal-tile-accordion button:first-child) {
	@apply !tw-w-auto !tw-pt-3 !tw-pb-2 tw-place-self-center tw-font-medium;
}

:deep(.goal-tile-accordion span svg) {
	@apply !tw-text-brand-900;
}

:deep(.goal-tile-accordion ul li > span svg) {
	@apply !tw-text-primary;
}
</style>
