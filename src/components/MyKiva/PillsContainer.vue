<template>
	<div class="tw-flex tw-flex-wrap tw-gap-2">
		<KvCartPill
			v-for="(item, index) in items"
			:key="index"
			:custom-message="item.label"
			class="tw-bg-gray-100 tw-px-3 tw-py-1.5 tw-font-medium tw-cursor-pointer pill"
			@click="emit('pill-clicked', item)"
		/>
	</div>
</template>

<script setup>
import { KvCartPill } from '@kiva/kv-components';

const emit = defineEmits(['pill-clicked']);

defineProps({
	items: {
		type: Array,
		default: () => ([]),
	},
});
</script>

<style lang="postcss" scoped>
.pill :deep(p) {
	@apply tw-text-nowrap;
}
</style>
