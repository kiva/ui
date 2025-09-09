<template>
	<KvLightbox
		class="goal-setting-lightbox"
		:visible="show"
		:title="lightboxTitle"
		@lightbox-closed="closeLightbox"
	>
		<h2 v-html="isMobile ? title : ''" class="tw-mb-3 tw-text-center"></h2>
		<component
			:is="contentComponent"
			:categories="categories"
			:selected-category-id="goalCategory.id"
			@select-category="handleSelectedCategory"
		/>
		<template #controls>
			<div class="tw-text-right">
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
} from 'vue';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import useIsMobile from '#src/composables/useIsMobile';

defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});

const formStep = ref(1);
const categories = [
	{
		id: 1,
		name: 'Women',
		description: 'Open doors for women around the world',
		icon: 'women.svg',
		eventProp: 'women',
	},
	{
		id: 2,
		name: 'Refugees',
		description: 'Transform the future for refugees',
		icon: 'refugees.svg',
		eventProp: 'refugees',
	},
	{
		id: 3,
		name: 'Climate Action',
		description: 'Support the front lines of the climate crisis',
		icon: 'climate-action.svg',
		eventProp: 'climate',
	},
	{
		id: 4,
		name: 'U.S. Entrepreneurs',
		description: 'Support small businesses in the U.S.',
		icon: 'us-entrepreneurs.svg',
		eventProp: 'us-entrepreneur',
	},
	{
		id: 5,
		name: 'Basic Needs',
		description: 'Clean water, healthcare, and sanitation',
		icon: 'basic-needs.svg',
		eventProp: 'basic-needs',
	},
	{
		id: 6,
		name: 'Support All',
		description: 'Every loan makes real change',
		icon: 'support-all.svg',
		eventProp: 'help-everyone',
	}
];

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const $kvTrackEvent = inject('$kvTrackEvent');
const emit = defineEmits(['goal-modal-closed']);
const goalCategory = ref(categories[0]);

const CategoryForm = defineAsyncComponent(() => import('#src/components/MyKiva/GoalSetting/CategoryForm'));

const contentComponent = computed(() => {
	switch (formStep.value) {
		case 1: return CategoryForm;
		case 2: default: return undefined;
	}
});

const handleSelectedCategory = category => {
	$kvTrackEvent('portfolio', 'select', 'choose-goal-category', category.eventProp);
	goalCategory.value = category;
};

const ctaCopy = computed(() => {
	return formStep.value === 1 ? 'Continue' : 'Set my goal';
});

const title = computed(() => {
	return formStep.value === 1
		? 'Choose one of Kiva’s key impact areas'
		: 'You’ve helped 3 women this year. <u>How many more</u> will you support? ';
});

const lightboxTitle = computed(() => {
	return isMobile.value ? '' : title.value;
});

const handleClick = () => {
	if (formStep.value === 1) {
		$kvTrackEvent('portfolio', 'click', 'goal-setting-continue');
	}
};

const closeLightbox = () => {
	emit('goal-modal-closed');
};
</script>

<style lang="postcss" scoped>
  .goal-setting-lightbox :deep(h2) {
    @apply tw-text-h2;
  }
</style>
