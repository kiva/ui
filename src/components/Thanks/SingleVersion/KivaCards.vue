<template>
	<div
		class="tw-rounded md:tw-rounded-lg tw-bg-white tw-shadow-lg tw-px-3 md:tw-px-8 tw-py-4 tw-flex tw-flex-col
			tw-text-center tw-gap-3"
	>
		<h2>Thank you!</h2>
		<h3 class="tw-text-center tw-font-book">
			{{ message }}
		</h3>
		<KvButton @click="handleClick">
			{{ buttonText }}
		</KvButton>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { KvButton } from '@kiva/kv-components';

const emit = defineEmits(['view-pdf-clicked']);

const props = defineProps({
	printableKivaCards: {
		type: Array,
		default: () => ([]),
	},
});

const message = computed(() => {
	return props.printableKivaCards.length > 1
		? 'Your Kiva Cards are ready to be printed!'
		: 'Your Kiva Card is ready to be printed!';
});

const buttonText = computed(() => {
	return props.printableKivaCards.length > 1
		? 'View PDFs'
		: 'View PDF';
});

const handleClick = () => {
	emit('view-pdf-clicked');
};
</script>
