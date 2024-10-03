<template>
	<div
		:class="{'in-progress tw-relative': inProgress}"
		:title="title"
	>
		<slot></slot>
	</div>
</template>

<script setup>

import {
	toRefs,
	defineProps,
	computed
} from 'vue';

const props = defineProps({
	name: {
		type: String,
		default: ''
	},
	status: {
		type: String, // 'in-progress', 'completed'
		default: 'completed'
	}
});

const { name, status } = toRefs(props);

const inProgress = status.value === 'in-progress';
const title = computed(() => {
	return `${status.value === 'in-progress' ? 'In Progress' : 'Completed'} badge: ${name.value}`;
});

</script>

<style lang="postcss" scoped>
.in-progress {
  @apply tw-grayscale tw-rounded-full tw-w-fit tw-bg-secondary;
  background-image: url('/src/assets/inline-svgs/my-kiva/dash.svg');
}
</style>
