<template>
	<div class="tw-flex tw-flex-col md:tw-flex-row tw-text-white tw-items-center">
		<div class="tw-flex">
			<span
				v-if="prefix"
				class="tw-text-small tw-mt-1"
			>
				{{ prefix }}
			</span>
			<p class="tw-text-h1">
				{{ parsedValue(value) }}
			</p>
		</div>
		<p
			v-html="label"
			class="tw-text-base tw-text-center md:tw-text-left md:tw-ml-1 md:tw-mt-1"
			style="line-height: 22px;"
		></p>
	</div>
</template>

<script setup>
import numeral from 'numeral';

defineProps({
	value: {
		type: Number,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	prefix: {
		type: String,
		default: '',
	},
});

const parsedValue = value => numeral(value).format('0,0');
</script>
