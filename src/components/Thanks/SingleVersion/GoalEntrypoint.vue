<template>
	<div
		v-if="isEmptyGoal"
		class="
			tw-rounded md:tw-rounded-xl tw-bg-white
			tw-shadow-lg tw-p-2.5 tw-py-2.5 md:tw-px-2.5 md:tw-py-4
			tw-flex tw-flex-col tw-gap-0 lg:tw-gap-1 print:tw-hidden
			tw-items-center tw-text-center tw-overflow-hidden tw-relative"
	>
		<KvLoadingPlaceholder v-if="loading" class="!tw-h-9 !tw-rounded" />
		<template v-else>
			<HandsPlant
				v-if="!isThanksPage"
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
				v-if="isThanksPage"
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
			>
				{{ buttonText }}
			</KvButton>

			<KvButton
				v-if="!isThanksPage"
				variant="ghost"
				class="edit-goal-button tw-w-full"
			>
				Edit goal category
				<KvMaterialIcon
					:icon="mdiPencilOutline"
					class="tw-ml-0.5"
				/>
			</KvButton>
		</template>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { mdiPencilOutline } from '@mdi/js';
import {
	KvMaterialIcon,
	KvButton,
	KvLoadingPlaceholder,
} from '@kiva/kv-components';
import HandsPlant from '#src/assets/images/thanks-page/hands-plant.svg';
import ThumbUp from '#src/assets/images/thanks-page/thumbs-up.svg';
import GoalSelector from '#src/components/Thanks/SingleVersion/GoalSelector';

const props = defineProps({
	/**
	 * Whether the component is in a loading state
	 */
	loading: {
		type: Boolean,
		default: false,
	},
	/**
	 * The current goal data
	 */
	currentGoal: {
		type: Object,
		default: null,
	},
});

const isThanksPage = ref(false);

const goalOptions = ref([
	{ loansNumber: 3, optionText: 'Start strong', selected: false },
	{
		loansNumber: 4, highlightedText: 'Recommended', optionText: 'Extra mile', selected: true,
	},
	{ loansNumber: 5, optionText: 'Trailblazing!', selected: false },
]);

const isEmptyGoal = computed(() => Object.keys(props.currentGoal || {}).length === 0);

const titleText = computed(() => {
	return isThanksPage.value
		? 'Thank you!'
		: 'Lenders like you help <br><span class="tw-text-eco-green-3">3 women</span> a year';
});

const subtitleText = computed(() => {
	return isThanksPage.value
		? 'Your 2026 commitment means more lives transformed!'
		: 'How many loans will you make this year?';
});

const buttonText = computed(() => (isThanksPage.value ? 'Track my progress' : 'Set 2026 goal'));

const updateOptionSelection = selectedIndex => {
	goalOptions.value = goalOptions.value.map((option, index) => ({
		...option,
		selected: index === selectedIndex,
	}));
};
</script>

<style lang="postcss" scoped>
.edit-goal-button :deep(span) {
	@apply tw-flex;
}
</style>
