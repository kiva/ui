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
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='gray' stroke-width='8' stroke-dasharray='23' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e");
}
</style>
