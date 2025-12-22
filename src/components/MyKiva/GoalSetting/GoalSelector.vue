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

		<p v-if="!isGoalSet" class="tw-text-base lg:tw-text-subhead tw-my-1.5 lg:tw-mb-1 lg:tw-mt-2 tw-text-center">
			How many loans will you make this year?
		</p>

		<div v-if="isGoalSet" class="tw-flex tw-justify-center tw-items-center" style="width: 575px; height: 180px;">
			<img
				:src="HandsPlant"
				class="lg:tw-mb-1 tw-w-10 lg:tw-w-14"
				alt="gif"
			>
		</div>

		<div
			v-else
			class="tw-w-full tw-flex tw-flex-col lg:tw-flex-row tw-gap-1 lg:tw-gap-1.5 tw-my-1"
		>
			<LoanNumberSelector
				v-for="(option, index) in goalOptions"
				:key="index"
				:loans-number="option.loansNumber"
				:option-text="option.optionText"
				:selected="option.selected"
				:highlighted-text="option.highlightedText"
				@click="updateOptionSelection(index)"
			/>
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
	ref,
	inject,
	onMounted,
} from 'vue';
import { ID_WOMENS_EQUALITY } from '#src/composables/useBadgeData';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.gif';
import LoanNumberSelector from '#src/components/MyKiva/GoalSetting/LoanNumberSelector';
import { KvButton, KvMaterialIcon } from '@kiva/kv-components';
import { mdiPencilOutline } from '@mdi/js';
import useGoalData, { SAME_AS_LAST_YEAR_LIMIT } from '#src/composables/useGoalData';

const $kvTrackEvent = inject('$kvTrackEvent');

const { getCategoryLoansLastYear } = useGoalData();

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
	 * Tiered achievements data
	 */
	tieredAchievements: {
		type: Array,
		default: () => ([]),
	},
});

const emit = defineEmits(['set-goal', 'edit-goal', 'set-goal-target']);

const goalOptions = ref([
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
]);

const womenLoansLastYear = computed(() => {
	return getCategoryLoansLastYear(props.tieredAchievements);
});

const titleText = computed(() => {
	if (props.isGoalSet) {
		return 'Success! Your goal is set!';
	}
	if (womenLoansLastYear.value === 1) {
		// eslint-disable-next-line max-len
		return `Last year, you helped <span class="tw-text-eco-green-3">${womenLoansLastYear.value} woman</span> shape her future!`;
	}
	if (womenLoansLastYear.value > SAME_AS_LAST_YEAR_LIMIT) {
		// eslint-disable-next-line max-len
		return `Last year, you helped <span class="tw-text-eco-green-3">${womenLoansLastYear.value} women</span> shape their futures!`;
	}

	return 'Lenders like you help <br><span class="tw-text-eco-green-3">3 women</span> a year';
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
		const goalName = `goal-${ID_WOMENS_EQUALITY}-${currentYear}`;
		const target = selectedTarget.value;
		const dateStarted = new Date().toISOString();
		const status = 'in-progress';
		const loanTotalAtStart = props.categoriesLoanCount?.[ID_WOMENS_EQUALITY] || 0;
		const preferences = {
			goalName,
			category: ID_WOMENS_EQUALITY,
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
			ID_WOMENS_EQUALITY,
			selectedTarget.value
		);
	}
};

onMounted(() => {
	if (womenLoansLastYear.value > SAME_AS_LAST_YEAR_LIMIT) {
		const growALittleOption = Math.ceil(womenLoansLastYear.value * 1.25);
		goalOptions.value = [
			{
				loansNumber: womenLoansLastYear.value,
				optionText: 'Same as 2025',
				selected: false
			},
			{
				loansNumber: growALittleOption,
				optionText: 'Grow a little',
				selected: true,
				highlightedText: 'More Impact'
			},
			{
				loansNumber: womenLoansLastYear.value * 2,
				optionText: 'Double my impact!',
				selected: false
			},
		];
	}
	$kvTrackEvent(
		props.trackingCategory,
		'view',
		'set-annual-goal'
	);
	emit('set-goal-target', selectedTarget.value);
});
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
