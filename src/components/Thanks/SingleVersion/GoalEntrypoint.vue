<template>
	<div
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white
			tw-shadow-lg tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4
			tw-flex tw-flex-col tw-gap-0 lg:tw-gap-1 print:tw-hidden
			tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<HandsPlant
				v-if="!isGoalSetOnThanksPage"
				class="lg:tw-mb-1 tw-w-10 lg:tw-w-auto"
			/>

			<h2
				class="tw-px-4 lg:tw-px-7"
				style="line-height: 125%;"
				v-html="titleText"
			>
			</h2>

			<div class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2">
				{{ subtitleText }}
			</div>

			<ThumbUp
				v-if="isGoalSetOnThanksPage"
				class="tw-w-16 tw-h-16 lg:tw-w-auto lg:tw-h-auto"
			/>

			<div
				v-else
				class="tw-w-full tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 lg:tw-gap-2 tw-my-1"
			>
				<GoalSelector
					v-for="(option, index) in goalOptions"
					:key="index"
					:loans-number="option.loansNumber"
					:option-text="option.optionText"
					:selected="option.selected"
					:highlighted-text="option.highlightedText"
					@click="updateOptionSelection(index)"
				/>
			</div>

			<KvButton
				class="tw-w-full tw-mt-1.5"
				@click="handleContinue"
			>
				{{ buttonText }}
			</KvButton>

			<KvButton
				v-if="!isGoalSetOnThanksPage"
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
		</template>
		<GoalSettingModal
			:show="showGoalModal"
			:total-loans="totalLoans"
			:categories-loan-count="categoriesLoanCount"
			:number-of-loans="selectedTarget"
			:is-thanks-page="true"
			@close-goal-modal="showGoalModal = false"
			@set-goal="setGoal"
		/>
	</div>
</template>

<script setup>
import {
	computed,
	ref,
	inject,
	onMounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { mdiPencilOutline } from '@mdi/js';
import {
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';
import useBadgeData, { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.svg';
import ThumbUp from '#src/assets/images/thanks-page/thumbs-up.svg';
import GoalSelector from '#src/components/Thanks/SingleVersion/GoalSelector';
import GoalSettingModal from '#src/components/MyKiva/GoalSettingModal';
import useGoalData from '#src/composables/useGoalData';

const SAME_AS_LAST_YEAR_LIMIT = 1;

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');
const router = useRouter();

const {
	storeGoalPreferences,
} = useGoalData({ apollo });

const props = defineProps({
	/**
	 * Whether the component is in a loading state
	 */
	loading: {
		type: Boolean,
		default: false,
	},
	/**
	 * total number of loans made by the user
	 */
	totalLoans: {
		type: Number,
		default: 0,
	},
	/**
	 * Tiered achievements data
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
	/**
	 * Tracking category for analytics
	 */
	trackingCategory: {
		type: String,
		default: 'post-checkout',
	},
});

const isGoalSetOnThanksPage = ref(false);
const showGoalModal = ref(false);

const goalOptions = ref([
	{ loansNumber: 3, optionText: 'Start strong', selected: false },
	{
		loansNumber: 4, highlightedText: 'Recommended', optionText: 'Extra mile', selected: true,
	},
	{ loansNumber: 5, optionText: 'Trailblazing!', selected: false },
]);

const categoriesLoanCount = computed(() => {
	const { getAllCategoryLoanCounts } = useBadgeData();
	return getAllCategoryLoanCounts(props.tieredAchievements);
});

const womenLoansLastYear = computed(() => {
	// TODO: Update to get actual last year data when available
	return categoriesLoanCount?.value?.[ID_WOMENS_EQUALITY] || 0;
});

const titleText = computed(() => {
	// eslint-disable-next-line no-nested-ternary
	return isGoalSetOnThanksPage.value
		? 'Thank you!'
		: womenLoansLastYear.value > SAME_AS_LAST_YEAR_LIMIT
			// eslint-disable-next-line max-len
			? `Last year, you helped <span class="tw-text-eco-green-3">${womenLoansLastYear.value} women</span> shape their futures!`
			: 'Lenders like you help <br><span class="tw-text-eco-green-3">3 women</span> a year';
});

const subtitleText = computed(() => {
	return isGoalSetOnThanksPage.value
		? 'Your 2026 commitment means more lives transformed!'
		: 'How many loans will you make this year?';
});

const buttonText = computed(() => (isGoalSetOnThanksPage.value ? 'Track my progress' : 'Set 2026 goal'));

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
};

const editGoal = () => {
	showGoalModal.value = true;
	$kvTrackEvent(
		props.trackingCategory,
		'click',
		'edit-goal-category'
	);
};

const setGoal = async preferences => {
	await storeGoalPreferences(preferences);
	isGoalSetOnThanksPage.value = true;
	showGoalModal.value = false;
};

const handleContinue = () => {
	if (isGoalSetOnThanksPage.value) {
		router.push('/mykiva');
		$kvTrackEvent(
			props.trackingCategory,
			'click',
			'go-to-mykiva'
		);
	} else {
		const currentYear = new Date().getFullYear();
		const goalName = `goal-${ID_WOMENS_EQUALITY}-${currentYear}`;
		const target = selectedTarget.value;
		const dateStarted = new Date().toISOString();
		const status = 'in-progress';
		const loanTotalAtStart = categoriesLoanCount?.value?.[ID_WOMENS_EQUALITY] || 0;
		const preferences = {
			goalName,
			category: ID_WOMENS_EQUALITY,
			target,
			dateStarted,
			status,
			loanTotalAtStart,
		};

		setGoal(preferences);

		$kvTrackEvent(
			props.trackingCategory,
			'click',
			'set-annual-goal',
			ID_WOMENS_EQUALITY,
			selectedTarget.value
		);
	}
};

onMounted(() => {
	if (womenLoansLastYear.value > SAME_AS_LAST_YEAR_LIMIT) {
		const growALittleOption = Math.ceil(womenLoansLastYear.value * 1.25);
		goalOptions.value = [
			{ loansNumber: womenLoansLastYear.value, optionText: 'Same as 2025', selected: false },
			{
				// eslint-disable-next-line max-len
				loansNumber: growALittleOption, optionText: 'Grow a little', selected: true, highlightedText: 'More Impact'
			},
			{ loansNumber: womenLoansLastYear.value * 2, optionText: 'Double my impact!', selected: false },
		];
	}

	$kvTrackEvent(
		props.trackingCategory,
		'view',
		'set-annual-goal'
	);
});
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
