<template>
	<div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-2 md:tw-gap-3">
		<KvCardFrame
			v-for="category in categories"
			:key="category.id"
			class="tw-transition-all tw-duration-200 hover:tw-shadow-lg"
			:bg-color-class="selectedCategory === category.id ? 'tw-bg-secondary' : 'tw-bg-white'"
			:border-class="
				selectedCategory === category.id
					? 'tw-border-2 tw-border-action'
					: 'tw-border-2 tw-border-transparent'
			"
			@click="selectCategory(category.id)"
		>
			<div
				class="tw-p-1 md:tw-p-2 tw-flex tw-flex-row tw-items-center tw-cursor-pointer
					md:tw-flex-col md:tw-justify-center"
				:style="cardStylings"
			>
				<img
					class="tw-shrink-0 tw-mr-2 md:tw-mr-0 md:tw-mb-1.5"
					:alt="`${category.name} image`"
					:src="category.customImage"
					:height="isMedium ? 64 : 54"
				>
				<div class="md:tw-text-center">
					<p class="md:tw-mb-0.5 tw-font-medium">
						{{ category.name }}
					</p>
					<p
						v-show="selectedCategory === category.id"
						class="tw-text-small"
					>
						{{ category.description }}
					</p>
				</div>
			</div>
		</KvCardFrame>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useBreakpoints from '#src/composables/useBreakpoints';
import { KvCardFrame } from '@kiva/kv-components';

const MOBILE_WIDTH = '100%';
const MOBILE_HEIGHT = '70px';
const DESKTOP_WIDTH = '198px';
const DESKTOP_HEIGHT = '174px';

const emit = defineEmits(['category-selected']);

const { isMedium } = useBreakpoints();

const props = defineProps({
	categories: {
		type: Array,
		required: true,
	},
	preSelectedCategory: {
		type: String,
		default: '1',
	},
});

const selectedCategory = ref(props.preSelectedCategory);

const cardStylings = computed(() => {
	const minWidth = isMedium.value ? DESKTOP_WIDTH : MOBILE_WIDTH;
	const maxWidth = isMedium.value ? DESKTOP_WIDTH : MOBILE_WIDTH;
	const minHeight = isMedium.value ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

	return {
		minWidth,
		maxWidth,
		minHeight,
	};
});

const selectCategory = categoryId => {
	selectedCategory.value = categoryId;
	emit('category-selected', categoryId);
};
</script>
