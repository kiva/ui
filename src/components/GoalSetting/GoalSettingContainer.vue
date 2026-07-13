<template>
	<div class="tw-min-h-screen lg:tw-min-h-full md:tw-mt-5 tw-mt-2">
		<div
			class="tw-flex tw-items-center tw-justify-between tw-mb-4"
			:class="{'!tw-justify-end': userIsEditingGoal}"
		>
			<button
				v-if="!userIsEditingGoal"
				class="tw-flex tw-gap-1 tw-items-center tw-font-medium"
				@click="goToDashboard"
			>
				<KvMaterialIcon
					:icon="mdiChevronLeft"
					class="tw-ml-0.5"
				/>
				{{ backToCopy }}
			</button>
			<KvUtilityMenu
				v-if="!isGoalCompleted && isGoalSet "
				menu-position="right-aligned"
				button-size="small"
				menu-border-class="tw-border tw-border-tertiary tw-rounded-md"
				class="tw-top-0"
			>
				<ul class="tw-m-0 tw-p-0">
					<li
						v-for="action in menuActions"
						:key="action.label"
						class="tw-list-none"
					>
						<button
							@click.prevent="onSelect(action)"
							class="tw-w-full tw-px-2 tw-py-2 tw-rounded-md hover:tw-bg-secondary tw-font-medium"
						>
							{{ action.label }}
						</button>
					</li>
				</ul>
			</KvUtilityMenu>
		</div>

		<KvLoadingPlaceholder
			v-if="loading || emailLoading || isLoadingRecommendedLoan"
			class="!tw-rounded tw-mx-auto"
			style="max-width: 644px; min-height: 495px;"
		/>
		<template v-else>
			<RecommendLoanForGoalContainer
				v-if="showRecommendLoanAfterGoalView && hasRecommendedLoans"
				ref="recommendLoanForGoalRef"
				class="tw-mx-auto recommended-loan-container"
				style="max-width: 700px;"
				header-title="Goal set!"
				:header-details="recommendLoanHeaderDetails"
				:content-card-props="recommendLoanCardProps"
				:is-adding="isAdding"
				:is-in-basket="recommendLoanIsInBasket"
				:loaded-set-data="loadedSetData"
				@primary-cta-click="addToBasket"
				@checkout-click="handleCheckoutClick"
				@secondary-cta-click="handleExploreMoreLoans"
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
					:goal-loans="goalTarget"
					tracking-category="event-tracking"
					:is-updating-goal="userIsEditingGoal"
					:fetched-current-year-loans="fetchedCurrentYearLoans"
					:loading-current-year="loadingCurrentYear"
					:goal-progress="goalProgress"
					:is-goal-completed="isGoalCompleted"
					use-direct-question-title
					@set-goal-target="setTarget($event)"
					@set-goal="setGoal($event)"
					@update-goal="updateGoal($event)"
					@edit-goal="editGoalCategory"
					@edit-goal-from-settings="userIsEditingGoal = true"
				/>
				<div
					v-show="showCategories"
				>
					<h2
						class="tw-text-headline tw-mb-3 tw-text-left lg:tw-text-center"
					>
						Choose an impact area
					</h2>
					<component
						v-show="showCategories"
						:key="categoryFormKey"
						:is="contentComponent"
						:categories="categories"
						:pre-selected-category="selectedCategory.id"
						:selected-category="selectedCategory"
						:selected-goal-number="goalSelectorLoanTarget"
						@category-selected="handleCategorySelected"
					/>
					<div
						class="buttons tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-flex tw-flex-col
							tw-justify-center tw-w-full lg:tw-w-auto tw-z-sticky lg:tw-z-auto tw-gap-1.5
							tw-mt-4 tw-bg-primary tw-p-2.5 lg:tw-p-0"
					>
						<KvButton
							class="tw-flex-none tw-mx-auto tw-w-full lg:tw-w-auto"
							style="min-width: 324px;"
							:disabled="isSubmitting"
							@click="handleClick"
						>
							{{ ctaCopy }}
						</KvButton>
					</div>
				</div>
			</div>
		</template>

		<!-- Goal Actions modal -->
		<KvLightbox
			:visible="isDeleteGoalModalVisible"
			:title="`Delete your ${GOALS_CURRENT_YEAR} impact goal?`"
			@lightbox-closed="handleKeepGoal"
		>
			<!-- eslint-disable-next-line max-len -->
			This will remove your goal and its progress from your dashboard. This action <br> can’t be undone, but you can create a new goal anytime.
			<template #controls>
				<KvButton variant="secondary" @click="handleKeepGoal">
					Keep Goal
				</KvButton>
				<KvButton
					variant="primary"
					@click="handleDeleteGoal"
					:state="isDeleting ? 'loading' : ''"
				>
					Delete goal
				</KvButton>
			</template>
		</KvLightbox>
	</div>
</template>

<script setup>
import {
	ref,
	toRef,
	inject,
	onMounted,
	computed,
	defineAsyncComponent,
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiChevronLeft } from '@mdi/js';
import {
	KvLoadingPlaceholder,
	KvMaterialIcon,
	KvButton,
	KvLightbox,
	KvUtilityMenu
} from '@kiva/kv-components';
import GoalSelector from '#src/components/MyKiva/GoalSetting/GoalSelector';
import RecommendLoanForGoalContainer from
	'#src/components/LoanCards/RecommendLoanForGoal/RecommendLoanForGoalContainer';
import useGoalData, { GOAL_STATUS, GOALS_CURRENT_YEAR } from '#src/composables/useGoalData';
import useGoalSettingRecommendedLoan, {
	GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE,
} from '#src/composables/useGoalSettingRecommendedLoan';
import { buildEmailFlowGoalData } from '#src/util/goalEmailFlow';
import logFormatter from '#src/util/logFormatter';
import {
	ID_SUPPORT_ALL,
	ID_WOMENS_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
} from '#src/composables/useBadgeData';
import useTipMessage from '#src/composables/useTipMessage';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const $appConfig = inject('$appConfig', {});
const router = useRouter();

const { $showTipMsg } = useTipMessage(apollo);

const {
	userGoal,
	loadGoalData,
	storeGoalPreferences,
	loading,
	getCategories,
	getCtaHref,
	goalProgress,
	getLoanStatsByYear,
	userPreferences,
	removeGoalFromPreferences,
	updateCurrentGoal,
	userGoalAchieved,
	getRecommendedLoans,
} = useGoalData({ apollo });

const props = defineProps({
	/**
	 * Target value passed via ?target= query param from an email link.
	 * When present, the component auto-creates a goal and shows
	 * a confirmation state instead of the normal form flow.
	 */
	emailTarget: {
		type: String,
		default: null,
	},
	/**
	 * Category passed via ?category= query param from an email link.
	 * Must be one of the valid badge IDs; falls back to support-all if absent or invalid.
	 */
	emailCategory: {
		type: String,
		default: null,
	},
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
	/**
	 * Is goal recommended loan enabled
	 */
	goalRecommendedLoanEnable: {
		type: Boolean,
		default: false,
	},
	/**
	 * Array of basket items for recommended loan exclusion and in-basket checks
	 */
	basketItems: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * True while add-to-basket mutation is in flight (provided by parent mixin)
	 */
	isAdding: {
		type: Boolean,
		default: false,
	},
	/**
	 * Loan ids to exclude from the recommended-loan fetch (e.g. the user's most recent loans).
	 */
	excludedLoanIds: {
		type: Array,
		default: () => ([]),
	},
});

const emit = defineEmits(['add-to-basket']);

const isGoalSet = ref(false);
// Variable used to create/update the goal target based on user selection
const goalSelectorLoanTarget = ref(0);
const showCategories = ref(false);
const ctaHref = ref('');
const categoryFormKey = ref(0);
const isEditing = ref(false);
const formStep = ref(1);
const isSubmitting = ref(false);
const isDeleteGoalModalVisible = ref(false);
const userIsEditingGoal = ref(false);
const isDeleting = ref(false);
const fetchedCurrentYearLoans = ref(0);
// This loading state is specifically for goal options
const loadingCurrentYear = ref(false);
const recommendLoanForGoalRef = ref(null);

// Email flow — set during creation so the loading placeholder renders on the first tick
const emailLoading = ref(props.emailTarget != null);

const VALID_EMAIL_CATEGORIES = new Set([
	ID_SUPPORT_ALL,
	ID_WOMENS_EQUALITY,
	ID_CLIMATE_ACTION,
	ID_REFUGEE_EQUALITY,
	ID_BASIC_NEEDS,
	ID_US_ECONOMIC_EQUALITY,
]);

function validateEmailTarget(param) {
	if (param == null || Array.isArray(param)) return null;
	const n = Number(param);
	if (!Number.isInteger(n) || n <= 0) return null;
	return n;
}

const validEmailTarget = computed(() => validateEmailTarget(props.emailTarget));
const validEmailCategory = computed(() => {
	if (props.emailCategory && VALID_EMAIL_CATEGORIES.has(props.emailCategory)) {
		return props.emailCategory;
	}
	return ID_SUPPORT_ALL;
});

const isEmailFlow = computed(() => props.emailTarget != null);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));
const NumberChoice = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/NumberChoice'));

const menuActions = [
	{ label: 'Delete goal', value: 'delete-goal' },
];

const onSelect = async action => {
	isDeleteGoalModalVisible.value = true;
	$kvTrackEvent('event-tracking', 'click', action.value);
};

const handleDeleteGoal = async () => {
	isDeleting.value = true;
	$kvTrackEvent('event-tracking', 'click', 'confirm-delete-goal');
	await removeGoalFromPreferences(userGoal.value);
	router.push('/mykiva');
};

const handleKeepGoal = () => {
	if (isDeleteGoalModalVisible.value) {
		isDeleteGoalModalVisible.value = false;
		$kvTrackEvent('event-tracking', 'click', 'cancel-delete-goal');
	}
};

const categories = getCategories(props.categoriesLoanCount, props.totalLoans);

const selectedCategory = ref(categories[0]);

// This container doesn't have the same multi-step flow as the modal,
// so we can always show the recommended loan section when enabled.
// A reactive ref (not a bare boolean) so the composable can watch it.
const showPage = ref(true);
const loadedSetData = ref(false);
const {
	showRecommendLoanAfterGoalView,
	hasRecommendedLoans,
	isLoadingRecommendedLoan,
	recommendLoanHeaderDetails,
	recommendedLoan,
	recommendLoanCardProps,
	recommendLoanIsInBasket,
	enterRecommendedLoanStepAfterGoalSave,
	handleExploreMoreLoans,
	trackAddToBasketClick,
	trackCheckoutClick,
} = useGoalSettingRecommendedLoan({
	emit: () => {},
	goalRecommendedLoanEnable: toRef(props, 'goalRecommendedLoanEnable'),
	basketItems: toRef(props, 'basketItems'),
	selectedGoalNumber: goalSelectorLoanTarget,
	selectedCategory,
	show: showPage,
	goalProgress,
	getRecommendedLoans,
	getCtaHref,
	userGoal,
	kvTrackEvent: $kvTrackEvent,
	entrypoint: GOAL_RECOMMENDED_LOAN_ENTRYPOINT_GOALS_PAGE,
	additionalExcludedLoanIds: toRef(props, 'excludedLoanIds'),
	appConfig: $appConfig,
	apollo,
});

const addToBasket = () => {
	const { loanId } = recommendLoanCardProps.value;
	if (!loanId) return;
	const lendAmount = recommendLoanForGoalRef.value?.getSelectedAmount();
	trackAddToBasketClick(loanId, lendAmount);
	// Delegate to the parent, which owns the add-to-basket flow. Pass the raw recommended
	// loan (not the card's blanked copy) so the parent can skip re-fetching it.
	emit('add-to-basket', { loanId, lendAmount, loan: recommendedLoan.value });
};

const handleCheckoutClick = () => {
	trackCheckoutClick();
};

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
	goalSelectorLoanTarget.value = target;
};

const recalculateGoalInformation = async () => {
	// For ID_SUPPORT_ALL, load yearly loan count to calculate correct progress
	let currentProgress = goalProgress.value;
	if (selectedCategory.value?.badgeId === ID_SUPPORT_ALL) {
		const stats = await getLoanStatsByYear(new Date().getFullYear(), 'network-only');
		currentProgress = stats?.count || 0;
	}
	// Use goalProgress to calculate remaining loans needed based on current year progress
	ctaHref.value = getCtaHref(
		goalSelectorLoanTarget.value,
		selectedCategory.value?.badgeId,
		router,
		currentProgress
	);
	isGoalSet.value = true;
	showCategories.value = false;
	userIsEditingGoal.value = false;
};

const updateGoal = async preferences => {
	await updateCurrentGoal(userGoal.value, preferences);
	await recalculateGoalInformation();
	enterRecommendedLoanStepAfterGoalSave();
	loadedSetData.value = true;
};

const setGoal = async preferences => {
	loading.value = true;
	isSubmitting.value = true;
	try {
		await storeGoalPreferences(preferences);
		await recalculateGoalInformation();
		enterRecommendedLoanStepAfterGoalSave();
		loadedSetData.value = true;
	} catch (e) {
		logFormatter('GoalSettingContainer: failed to setting up this goal', 'error', { error: e });
		$showTipMsg('There was a problem setting up this goal', 'error');
	} finally {
		loading.value = false;
		isSubmitting.value = false;
	}
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
	if (isSubmitting.value) return;
	const categorySelected = selectedCategory.value?.badgeId;

	const currentYear = new Date().getFullYear();
	const goalName = `goal-${categorySelected}-${currentYear}`;
	const target = goalSelectorLoanTarget.value;
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
		goalSelectorLoanTarget.value
	);
};

const goToDashboard = () => {
	$kvTrackEvent('event-tracking', 'click', 'back-to-dashboard');
	router.push('/mykiva');
};

const yearToDate = new Date().getFullYear();

const ctaCopy = computed(() => {
	if (isEditing.value) {
		return 'Continue';
	}
	return `Set ${yearToDate} goal`;
});

const parseGoals = () => JSON.parse(userPreferences.value?.preferences || '{}').goals || [];

function applyGoalState() {
	if (!userGoal.value?.target) return;
	const { target, category: goalCategory } = userGoal.value;
	goalSelectorLoanTarget.value = target;
	const storedCategory = categories.find(c => c.badgeId === goalCategory);
	if (storedCategory) {
		selectedCategory.value = storedCategory;
	}
	// Use goalProgress which tracks current year progress
	ctaHref.value = getCtaHref(target, goalCategory, router, goalProgress.value);
	isGoalSet.value = true;
}

async function handleEmailFlow() {
	const category = validEmailCategory.value;

	const { existingGoal, newGoalPrefs } = buildEmailFlowGoalData({
		allGoals: parseGoals(),
		category,
		validEmailTarget: validEmailTarget.value,
	});

	if (newGoalPrefs) {
		try {
			await storeGoalPreferences(newGoalPrefs);

			$kvTrackEvent(
				'event-tracking',
				'click',
				'set-annual-goal',
				category,
				validEmailTarget.value
			);
			enterRecommendedLoanStepAfterGoalSave();
		} catch (e) {
			logFormatter('GoalSettingContainer: failed to store email goal', 'error', { error: e });
			$showTipMsg('There was a problem setting up this goal', 'error');
		}
	}

	if (existingGoal ?? newGoalPrefs) {
		await loadGoalData();
	} else {
		logFormatter('GoalSettingContainer: no goal found for email flow', 'error', { category });
	}

	applyGoalState();

	emailLoading.value = false;
	$kvTrackEvent('event-tracking', 'view', 'goals-page-email');
}

const goalTarget = computed(() => {
	return userGoal.value?.target || 0;
});

const isGoalCompleted = computed(() => {
	return userGoal.value?.status === GOAL_STATUS.COMPLETED || userGoalAchieved.value;
});

const backToCopy = computed(() => {
	if (props.emailTarget) {
		return 'To dashboard';
	}

	return 'Back to dashboard';
});

onMounted(async () => {
	await loadGoalData();

	if (isEmailFlow.value) {
		await handleEmailFlow();
		return;
	}

	applyGoalState();
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

.recommended-loan-container :deep(.recommended-loan-footer) {
	@apply tw-fixed lg:tw-static tw-bottom-0 tw-left-0 tw-w-full
		lg:tw-w-auto tw-z-sticky lg:tw-z-auto
		tw-bg-white tw-p-2.5 lg:tw-p-0;
}

.recommended-loan-container :deep(.recommended-loan-footer .goal-footer-button) {
	@apply tw-max-w-full;

	@screen lg {
		max-width: 330px;
	}
}
</style>
