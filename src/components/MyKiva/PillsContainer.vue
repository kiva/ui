<template>
	<div class="tw-flex tw-flex-wrap tw-gap-2">
		<KvCartPill
			v-for="(item, index) in visibleChips"
			:key="index"
			:custom-message="item.label"
			class="tw-bg-gray-100 tw-px-3 tw-py-1.5 tw-font-medium tw-cursor-pointer pill"
			@click="emit('pill-clicked', item)"
		/>
		<button
			v-if="showMoreCtaMobile && !showAllChips"
			class="more-cta"
			@click="handleToggleClick"
		>
			More
		</button>

		<button
			v-if="showAllChips"
			class="more-cta"
			@click="handleToggleClick"
		>
			Show less
		</button>
	</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import useIsMobile from '#src/composables/useIsMobile';
import { MOBILE_BREAKPOINT } from '#src/composables/useBadgeModal';
import { KvCartPill } from '@kiva/kv-components';

const MAX_VISIBLE_CHIPS_MOBILE = 6;

const $kvTrackEvent = inject('$kvTrackEvent');

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);

const emit = defineEmits(['pill-clicked']);

const props = defineProps({
	items: {
		type: Array,
		default: () => ([]),
	},
	showMoreCtaMobile: {
		type: Boolean,
		default: false
	},
	trackingSection: {
		type: String,
		default: 'Category'
	}
});

const showAllChips = ref(false);

const showMoreCtaMobile = computed(() => {
	return isMobile.value && props.showMoreCtaMobile;
});

const visibleChips = computed(() => {
	if (showAllChips.value || !showMoreCtaMobile.value) {
		return props.items;
	}
	return props.items.slice(0, MAX_VISIBLE_CHIPS_MOBILE);
});

const handleToggleClick = () => {
	showAllChips.value = !showAllChips.value;

	$kvTrackEvent(
		'Portfolio',
		'click',
		`MyKiva Bailout ${props.trackingSection} Chips Toggled`,
		showAllChips.value ? 'shown' : 'hidden',
	);
};
</script>

<style lang="postcss" scoped>
.pill :deep(p) {
	@apply tw-text-nowrap;
}

.more-cta {
	@apply tw-inline-flex tw-items-center tw-justify-center
		tw-py-1 tw-px-2 tw-flex-shrink-0 tw-text-link;
}
</style>
